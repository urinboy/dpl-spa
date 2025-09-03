import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import OpenStreetMapUtils from '../utils/OpenStreetMapUtils';
import LocationAPIService from '../services/LocationAPIService';
import LocationStorageService from '../services/LocationStorageService';
import { OnboardingStorage } from '../utils/OnboardingStorage';

const LocationContext = createContext();

// API Keys - Environment variables dan olish
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const YANDEX_API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Development rejimida test kalitlari
const isDevelopment = import.meta.env.MODE === 'development';

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    isLoading: false,
    error: null,
    position: null,
    address: null,
    city: null,
    region: null,
    country: null,
    isDetected: false,
    method: null, // 'gps', 'ip', 'manual'
    timestamp: null
  });

  const [showLocationModal, setShowLocationModal] = useState(false);

  // Saqlangan joylashuvni yuklash
  useEffect(() => {
    const savedLocation = localStorage.getItem('user_location');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        // 24 soat ichida saqlangan ma'lumot bo'lsa, ishlatish
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        if (parsedLocation.timestamp > oneDayAgo) {
          setLocation(parsedLocation);
          return;
        }
      } catch (error) {
        console.error('Saqlangan joylashuv ma\'lumotini yuklashda xatolik:', error);
      }
    }
    
    // Agar saqlangan ma'lumot bo'lmasa va onboarding tugagan bo'lsa, modal ko'rsatish
    const isOnboardingCompleted = OnboardingStorage.isCompleted();
    if (isOnboardingCompleted) {
      setTimeout(() => {
        setShowLocationModal(true);
      }, 2000); // 2 soniyadan keyin so'rash
    }
  }, []);

  // Joylashuvni localStorage va API ga saqlash
  const saveLocationToStorage = async (locationData) => {
    try {
      // 1. LocalStorage ga saqlash
      const saved = LocationStorageService.saveUserLocation(locationData);
      
      if (saved) {
        console.log('✅ Location saved to localStorage');
        
        // Detection time ni yangilash
        LocationStorageService.saveLastDetectionTime(locationData.method);
      }

      // 2. API ga jo'natish (background da)
      try {
        const response = await LocationAPIService.saveUserLocation(locationData);
        console.log('📡 Location saved to API:', response.success);
        
        // Analytics jo'natish
        LocationAPIService.sendLocationAnalytics({
          action: 'location_saved',
          method: locationData.method,
          city: locationData.city,
          success: true
        });
      } catch (error) {
        console.warn('⚠️ Failed to save to API:', error.message);
        
        // API error analytics
        LocationAPIService.sendLocationAnalytics({
          action: 'location_save_failed',
          method: locationData.method,
          error: error.message,
          success: false
        });
      }
    } catch (error) {
      console.error('❌ Failed to save location:', error);
    }
  };

  // API orqali ma'lumotlar bazasiga saqlash
  const saveLocationToDatabase = async (locationData) => {
    try {
      // Bu yerda backend API endpoint ga so'rov jo'natamiz
      await axios.post(`${API_BASE_URL}/user-location`, {
        ...locationData,
        userId: localStorage.getItem('user_id') || generateUserId(),
        sessionId: generateSessionId(),
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Ma\'lumotlar bazasiga saqlashda xatolik:', error);
      // Production da user ga xatolik ko'rsatmaslik
      if (isDevelopment) {
        console.warn('Development rejimida API xatoligi ignore qilindi');
      }
    }
  };

  // Foydalanuvchi ID yaratish
  const generateUserId = () => {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('user_id', userId);
    }
    return userId;
  };

  // Session ID yaratish
  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // GPS orqali joylashuvni aniqlash
  const detectLocationByGPS = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Brauzeringiz geolocation ni qo\'llab-quvvatlamaydi'));
        return;
      }

      setLocation(prev => ({ ...prev, isLoading: true, error: null }));

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Google Maps Geocoding API orqali manzilni olish
            const address = await getAddressFromCoordinates(latitude, longitude);
            
            const locationData = {
              isLoading: false,
              error: null,
              position: { latitude, longitude },
              address: address.formatted_address,
              city: address.city,
              region: address.region,
              country: address.country,
              isDetected: true,
              method: 'gps',
              accuracy: position.coords.accuracy
            };

            setLocation(locationData);
            saveLocationToStorage(locationData);
            saveLocationToDatabase(locationData);
            setShowLocationModal(false);
            resolve(locationData);
          } catch (error) {
            const errorMsg = 'Manzilni aniqlashda xatolik yuz berdi';
            setLocation(prev => ({ 
              ...prev, 
              isLoading: false, 
              error: errorMsg 
            }));
            reject(new Error(errorMsg));
          }
        },
        (error) => {
          let errorMessage = 'Joylashuvni aniqlashda xatolik';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Joylashuv ruxsati berilmagan';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Joylashuv ma\'lumotlari mavjud emas';
              break;
            case error.TIMEOUT:
              errorMessage = 'Joylashuvni aniqlash vaqti tugadi';
              break;
          }

          setLocation(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: errorMessage 
          }));
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minut
        }
      );
    });
  };

  // IP orqali joylashuvni aniqlash
  const detectLocationByIP = async () => {
    try {
      setLocation(prev => ({ ...prev, isLoading: true, error: null }));

      // Bir nechta IP geolocation service larni ishlatish
      let locationData = null;
      
      // 1. ipapi.co (bepul 1000/kun)
      try {
        const response = await axios.get('https://ipapi.co/json/');
        const { data } = response;
        
        if (!data.error && data.latitude && data.longitude) {
          locationData = {
            isLoading: false,
            error: null,
            position: { 
              latitude: parseFloat(data.latitude), 
              longitude: parseFloat(data.longitude) 
            },
            address: `${data.city}, ${data.region}, ${data.country_name}`,
            city: data.city,
            region: data.region,
            country: data.country_name,
            isDetected: true,
            method: 'ip',
            isp: data.org,
            timezone: data.timezone
          };
        }
      } catch (error) {
        console.warn('ipapi.co ishlamadi:', error.message);
      }

      // 2. Agar ipapi.co ishlamasa, ipgeolocation.io ishlatish
      if (!locationData) {
        try {
          const response = await axios.get('https://api.ipgeolocation.io/ipgeo?apiKey=free');
          const { data } = response;
          
          if (data.latitude && data.longitude) {
            locationData = {
              isLoading: false,
              error: null,
              position: { 
                latitude: parseFloat(data.latitude), 
                longitude: parseFloat(data.longitude) 
              },
              address: `${data.city}, ${data.state_prov}, ${data.country_name}`,
              city: data.city,
              region: data.state_prov,
              country: data.country_name,
              isDetected: true,
              method: 'ip',
              isp: data.isp,
              timezone: data.time_zone.name
            };
          }
        } catch (error) {
          console.warn('ipgeolocation.io ishlamadi:', error.message);
        }
      }

      // 3. Agar ikkala service ham ishlamasa
      if (!locationData) {
        throw new Error('Hech qaysi IP geolocation service ishlamadi');
      }

      setLocation(locationData);
      saveLocationToStorage(locationData);
      saveLocationToDatabase(locationData);
      setShowLocationModal(false);

      return locationData;
    } catch (error) {
      const errorMsg = 'IP orqali joylashuvni aniqlashda xatolik';
      setLocation(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMsg 
      }));
      throw new Error(errorMsg);
    }
  };

  // Koordinatalar orqali manzil olish - Multi-provider approach
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      // 1. OpenStreetMap (bepul va cheklovlar yo'q)
      try {
        console.log('Trying OpenStreetMap...');
        const osmResult = await OpenStreetMapUtils.reverseGeocode(lat, lng, 'uz');
        
        if (osmResult && osmResult.city) {
          console.log('✅ OpenStreetMap success:', osmResult.formatted_address);
          return {
            formatted_address: osmResult.formatted_address,
            city: osmResult.city,
            region: osmResult.state || osmResult.county || 'Noma\'lum viloyat',
            country: osmResult.country || 'Uzbekistan',
            source: 'OpenStreetMap',
            provider: 'OSM'
          };
        }
      } catch (error) {
        console.warn('OpenStreetMap failed:', error.message);
      }

      // 2. Google Maps API (agar mavjud bo'lsa)
      if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'undefined') {
        try {
          console.log('Trying Google Maps...');
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}&language=uz`
          );

          if (response.data.status === 'OK' && response.data.results.length > 0) {
            const result = response.data.results[0];
            const addressComponents = result.address_components;
            
            console.log('✅ Google Maps success:', result.formatted_address);
            return {
              formatted_address: result.formatted_address,
              city: getAddressComponent(addressComponents, 'locality') || 
                    getAddressComponent(addressComponents, 'administrative_area_level_2'),
              region: getAddressComponent(addressComponents, 'administrative_area_level_1'),
              country: getAddressComponent(addressComponents, 'country'),
              source: 'Google Maps',
              provider: 'Google'
            };
          }
        } catch (error) {
          console.warn('Google Maps failed:', error.message);
        }
      }
      
      // 3. Yandex API (fallback)
      return await getAddressFromYandex(lat, lng);
    } catch (error) {
      console.warn('All geocoding providers failed:', error.message);
      // Default fallback
      return {
        formatted_address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        city: 'Noma\'lum shahar',
        region: 'Noma\'lum viloyat',
        country: 'Uzbekistan',
        source: 'Coordinates',
        provider: 'Fallback'
      };
    }
  };

  // Yandex API orqali manzil olish (API key siz ham ishlaydi)
  const getAddressFromYandex = async (lat, lng) => {
    try {
      // Yandex API parametrlari - Real API key ni ishlatish
      const apiKey = YANDEX_API_KEY && YANDEX_API_KEY !== 'undefined' && YANDEX_API_KEY !== 'demo-key-for-testing' 
        ? `&apikey=${YANDEX_API_KEY}` 
        : '';
      
      const url = `https://geocode-maps.yandex.ru/1.x/?format=json&geocode=${lng},${lat}&results=1&lang=uz${apiKey}`;
      
      if (isDevelopment) {
        console.log('Yandex API so\'rovi:', url.replace(YANDEX_API_KEY || '', '***'));
      }
      
      const response = await axios.get(url);
      const geoObjects = response.data.response.GeoObjectCollection.featureMember;
      
      if (geoObjects && geoObjects.length > 0) {
        const geoObject = geoObjects[0].GeoObject;
        const address = geoObject.metaDataProperty.GeocoderMetaData.text;
        
        if (isDevelopment) {
          console.log('Yandex API muvaffaqiyatli:', address);
        }
        
        return {
          formatted_address: address,
          city: extractCityFromYandex(geoObject) || extractCityFromAddress(address),
          region: extractRegionFromYandex(geoObject) || extractRegionFromAddress(address),
          country: extractCountryFromYandex(geoObject) || 'O\'zbekiston'
        };
      } else {
        throw new Error('Yandex API dan javob olmadi');
      }
    } catch (error) {
      console.warn('Yandex API xatolik:', error.message);
      
      // Backup: Oddiy address parsing yoki closest city
      return await getFallbackAddress(lat, lng);
    }
  };

  // Yandex API dan shahar nomini ajratish
  const extractCityFromYandex = (geoObject) => {
    try {
      const components = geoObject.metaDataProperty.GeocoderMetaData.AddressDetails;
      return components?.Country?.AdministrativeArea?.SubAdministrativeArea?.Locality?.LocalityName ||
             components?.Country?.AdministrativeArea?.Locality?.LocalityName ||
             null;
    } catch {
      return null;
    }
  };

  // Yandex API dan viloyat nomini ajratish
  const extractRegionFromYandex = (geoObject) => {
    try {
      const components = geoObject.metaDataProperty.GeocoderMetaData.AddressDetails;
      return components?.Country?.AdministrativeArea?.AdministrativeAreaName || null;
    } catch {
      return null;
    }
  };

  // Yandex API dan mamlakat nomini ajratish
  const extractCountryFromYandex = (geoObject) => {
    try {
      const components = geoObject.metaDataProperty.GeocoderMetaData.AddressDetails;
      return components?.Country?.CountryName || null;
    } catch {
      return null;
    }
  };

  // Address string dan shahar ajratish
  const extractCityFromAddress = (address) => {
    const parts = address.split(', ');
    // O'zbek formati: Viloyat, Shahar, Ko'cha...
    // yoki Mamlakat, Viloyat, Shahar
    if (parts.length >= 2) {
      // Oxirgi qism mamlakat bo'lsa
      if (parts[parts.length - 1].includes('O\'zbekiston') || parts[parts.length - 1].includes('Узбекистан')) {
        return parts[parts.length - 2]; // Shahar
      } else {
        return parts[parts.length - 1]; // Shahar
      }
    }
    return parts[0] || 'Noma\'lum';
  };

  // Address string dan viloyat ajratish  
  const extractRegionFromAddress = (address) => {
    const parts = address.split(', ');
    if (parts.length >= 3) {
      // Agar oxirgi qism mamlakat bo'lsa
      if (parts[parts.length - 1].includes('O\'zbekiston') || parts[parts.length - 1].includes('Узбекистан')) {
        return parts[parts.length - 3]; // Viloyat
      } else if (parts.length >= 2) {
        return parts[parts.length - 2]; // Viloyat
      }
    }
    return parts[0] || 'Noma\'lum';
  };

  // Fallback address function
  const getFallbackAddress = async (lat, lng) => {
    // Koordinatalar asosida taxminiy joylashuvni aniqlash
    const uzbekistanRegions = [
      { name: 'Toshkent', bounds: { minLat: 40.8, maxLat: 41.8, minLng: 69.0, maxLng: 69.8 } },
      { name: 'Samarqand', bounds: { minLat: 39.0, maxLat: 40.0, minLng: 66.5, maxLng: 67.5 } },
      { name: 'Buxoro', bounds: { minLat: 39.0, maxLat: 40.5, minLng: 63.5, maxLng: 65.0 } },
      { name: 'Andijon', bounds: { minLat: 40.0, maxLat: 41.0, minLng: 71.5, maxLng: 73.0 } },
      { name: 'Farg\'ona', bounds: { minLat: 40.0, maxLat: 41.0, minLng: 71.0, maxLng: 72.5 } },
      { name: 'Namangan', bounds: { minLat: 40.5, maxLat: 41.5, minLng: 71.0, maxLng: 72.0 } }
    ];

    const region = uzbekistanRegions.find(r => 
      lat >= r.bounds.minLat && lat <= r.bounds.maxLat &&
      lng >= r.bounds.minLng && lng <= r.bounds.maxLng
    );

    return {
      formatted_address: region ? `${region.name}, O'zbekiston` : `${lat}, ${lng}`,
      city: region?.name || 'Noma\'lum',
      region: region?.name ? `${region.name} viloyati` : 'Noma\'lum',
      country: 'O\'zbekiston'
    };
  };

  // Google Maps address component olish
  const getAddressComponent = (components, type) => {
    const component = components.find(comp => comp.types.includes(type));
    return component ? component.long_name : null;
  };

  // Qo'lda shahar tanlash
  const selectCityManually = (cityData) => {
    const locationData = {
      isLoading: false,
      error: null,
      position: cityData.coordinates || null,
      address: cityData.fullAddress,
      city: cityData.name,
      region: cityData.region,
      country: cityData.country || 'O\'zbekiston',
      isDetected: true,
      method: 'manual'
    };

    setLocation(locationData);
    saveLocationToStorage(locationData);
    saveLocationToDatabase(locationData);
    setShowLocationModal(false);
  };

  // Joylashuvni qayta aniqlash
  const refreshLocation = async () => {
    try {
      await detectLocationByGPS();
    } catch (error) {
      // Agar GPS ishlamasa, IP orqali urinish
      try {
        await detectLocationByIP();
      } catch (ipError) {
        console.error('Joylashuvni qayta aniqlashda xatolik:', error, ipError);
      }
    }
  };

  // Joylashuvni o'chirish
  const clearLocation = () => {
    localStorage.removeItem('user_location');
    setLocation({
      isLoading: false,
      error: null,
      position: null,
      address: null,
      city: null,
      region: null,
      country: null,
      isDetected: false,
      method: null,
      timestamp: null
    });
    setShowLocationModal(true);
  };

  const value = {
    location,
    showLocationModal,
    setShowLocationModal,
    detectLocationByGPS,
    detectLocationByIP,
    selectCityManually,
    refreshLocation,
    clearLocation,
    isLocationDetected: location.isDetected
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation hook LocationProvider ichida ishlatilishi kerak');
  }
  return context;
};

export { LocationContext };
export default LocationContext;
