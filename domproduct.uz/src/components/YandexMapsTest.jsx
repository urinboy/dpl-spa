import React, { useState } from 'react';
import axios from 'axios';

// Yandex Maps bilan ishlash uchun yordamchi funksiyalar
export const YandexMapsUtils = {
  
  // API Key
  getApiKey: () => import.meta.env.VITE_YANDEX_MAPS_API_KEY,
  
  // Shahar nomi bo'yicha koordinatalar olish
  geocodeCity: async (cityName) => {
    try {
      const apiKey = YandexMapsUtils.getApiKey();
      const keyParam = apiKey && apiKey !== 'undefined' ? `&apikey=${apiKey}` : '';
      
      const response = await axios.get(
        `https://geocode-maps.yandex.ru/1.x/?format=json&geocode=${encodeURIComponent(cityName)}&results=1&lang=uz${keyParam}`
      );
      
      const geoObjects = response.data.response.GeoObjectCollection.featureMember;
      if (geoObjects && geoObjects.length > 0) {
        const coords = geoObjects[0].GeoObject.Point.pos.split(' ');
        return {
          latitude: parseFloat(coords[1]),
          longitude: parseFloat(coords[0])
        };
      }
      return null;
    } catch (error) {
      console.error('Yandex geocoding xatolik:', error);
      return null;
    }
  },

  // Koordinatalar bo'yicha to'liq manzil olish
  reverseGeocode: async (lat, lng) => {
    try {
      const apiKey = YandexMapsUtils.getApiKey();
      const keyParam = apiKey && apiKey !== 'undefined' ? `&apikey=${apiKey}` : '';
      
      const response = await axios.get(
        `https://geocode-maps.yandex.ru/1.x/?format=json&geocode=${lng},${lat}&results=1&lang=uz${keyParam}`
      );
      
      const geoObjects = response.data.response.GeoObjectCollection.featureMember;
      if (geoObjects && geoObjects.length > 0) {
        const geoObject = geoObjects[0].GeoObject;
        return {
          formatted_address: geoObject.metaDataProperty.GeocoderMetaData.text,
          components: geoObject.metaDataProperty.GeocoderMetaData.AddressDetails,
          coordinates: {
            latitude: lat,
            longitude: lng
          }
        };
      }
      return null;
    } catch (error) {
      console.error('Yandex reverse geocoding xatolik:', error);
      return null;
    }
  },

  // Yaqin atrofdagi shaharlarni topish
  findNearbyPlaces: async (lat, lng, query = 'магазин') => {
    try {
      const apiKey = YandexMapsUtils.getApiKey();
      if (!apiKey || apiKey === 'undefined') {
        console.warn('Yandex API key mavjud emas, nearby places ishlamaydi');
        return [];
      }
      
      const response = await axios.get(
        `https://search-maps.yandex.ru/v1/?text=${encodeURIComponent(query)}&ll=${lng},${lat}&spn=0.01,0.01&type=biz&lang=uz_UZ&apikey=${apiKey}`
      );
      
      return response.data.features || [];
    } catch (error) {
      console.error('Yandex nearby search xatolik:', error);
      return [];
    }
  },

  // Masofa hisolash (Haversine formula)
  calculateDistance: (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Yer radiusi (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // km da masofa
  },

  // O'zbekiston shaharlari ro'yxati bilan koordinatalarni solishtiirish
  findClosestUzbekCity: (lat, lng) => {
    const uzbekCities = [
      { name: 'Toshkent', lat: 41.2995, lng: 69.2401, region: 'Toshkent sh.' },
      { name: 'Samarqand', lat: 39.6270, lng: 66.9750, region: 'Samarqand vil.' },
      { name: 'Buxoro', lat: 39.7747, lng: 64.4286, region: 'Buxoro vil.' },
      { name: 'Andijon', lat: 40.7821, lng: 72.3442, region: 'Andijon vil.' },
      { name: 'Farg\'ona', lat: 40.3842, lng: 71.7843, region: 'Farg\'ona vil.' },
      { name: 'Namangan', lat: 41.0015, lng: 71.6724, region: 'Namangan vil.' },
      { name: 'Qarshi', lat: 38.8606, lng: 65.7890, region: 'Qashqadaryo vil.' },
      { name: 'Nukus', lat: 42.4531, lng: 59.6103, region: 'Qoraqalpog\'iston' },
      { name: 'Urganch', lat: 41.5500, lng: 60.6333, region: 'Xorazm vil.' },
      { name: 'Guliston', lat: 40.4897, lng: 68.7844, region: 'Sirdaryo vil.' },
      { name: 'Termiz', lat: 37.2242, lng: 67.2783, region: 'Surxondaryo vil.' },
      { name: 'Jizzax', lat: 40.1158, lng: 67.8420, region: 'Jizzax vil.' },
      { name: 'Navoiy', lat: 40.0844, lng: 65.3792, region: 'Navoiy vil.' }
    ];

    let closest = uzbekCities[0];
    let minDistance = YandexMapsUtils.calculateDistance(lat, lng, closest.lat, closest.lng);

    uzbekCities.forEach(city => {
      const distance = YandexMapsUtils.calculateDistance(lat, lng, city.lat, city.lng);
      if (distance < minDistance) {
        minDistance = distance;
        closest = city;
      }
    });

    return {
      ...closest,
      distance: Math.round(minDistance * 100) / 100 // 2 o'nlik bilan
    };
  }
};

// Yandex Maps Test Component
const YandexMapsTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('Toshkent');

  const testGeocodingCity = async () => {
    setIsLoading(true);
    try {
      const result = await YandexMapsUtils.geocodeCity(searchQuery);
      setTestResults(prev => ({
        ...prev,
        geocoding: { success: true, data: result }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        geocoding: { success: false, error: error.message }
      }));
    }
    setIsLoading(false);
  };

  const testReverseGeocoding = async () => {
    setIsLoading(true);
    try {
      // Toshkent koordinatalari
      const result = await YandexMapsUtils.reverseGeocode(41.2995, 69.2401);
      setTestResults(prev => ({
        ...prev,
        reverse: { success: true, data: result }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        reverse: { success: false, error: error.message }
      }));
    }
    setIsLoading(false);
  };

  const testClosestCity = () => {
    // Test koordinatalari - Toshkent yaqinidagi nuqta
    const result = YandexMapsUtils.findClosestUzbekCity(41.25, 69.20);
    setTestResults(prev => ({
      ...prev,
      closest: { success: true, data: result }
    }));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🗺️ Yandex Maps API Test</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Shahar nomini kiriting..."
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px'
          }}
        />
        <button onClick={testGeocodingCity} disabled={isLoading}>
          Geocoding Test
        </button>
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        <button onClick={testReverseGeocoding} disabled={isLoading}>
          Reverse Geocoding Test (Toshkent)
        </button>
        
        <button onClick={testClosestCity}>
          Eng Yaqin Shahar Test
        </button>
      </div>

      {/* Results */}
      <div style={{ marginTop: '20px' }}>
        {testResults.geocoding && (
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '6px' }}>
            <h4>Geocoding Natijasi:</h4>
            <pre>{JSON.stringify(testResults.geocoding, null, 2)}</pre>
          </div>
        )}

        {testResults.reverse && (
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f0fff0', borderRadius: '6px' }}>
            <h4>Reverse Geocoding Natijasi:</h4>
            <pre>{JSON.stringify(testResults.reverse, null, 2)}</pre>
          </div>
        )}

        {testResults.closest && (
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff0f0', borderRadius: '6px' }}>
            <h4>Eng Yaqin Shahar:</h4>
            <pre>{JSON.stringify(testResults.closest, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default YandexMapsTest;
