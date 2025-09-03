import { useContext, useEffect, useState } from 'react';
import { LocationContext } from '../contexts/LocationContext';
import LocationAPIService from '../services/LocationAPIService';
import LocationStorageService from '../services/LocationStorageService';

/**
 * HomePage uchun location hook
 * Asosiy sahifaga location ma'lumotlari va qo'shimcha functionality ni taqdim etadi
 */
const useHomepageLocation = () => {
  const { location, setLocation, detectLocationByGPS, detectLocationByIP } = useContext(LocationContext);
  const [regionalProducts, setRegionalProducts] = useState([]);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [isLoadingRegionalData, setIsLoadingRegionalData] = useState(false);

  // Location o'zgarganda regional ma'lumotlarni yuklash
  useEffect(() => {
    if (location && location.city && !location.isLoading) {
      loadRegionalData();
    }
  }, [location?.city]);

  /**
   * Regional ma'lumotlarni yuklash
   */
  const loadRegionalData = async () => {
    if (!location || !location.city) return;

    setIsLoadingRegionalData(true);

    try {
      // Parallel ravishda regional data larni yuklash
      const [products, delivery, nearby] = await Promise.allSettled([
        LocationAPIService.getRegionalProducts(location),
        LocationAPIService.checkDeliveryZone(location.position),
        LocationAPIService.findNearbyUsers(location.position, 10)
      ]);

      // Regional products
      if (products.status === 'fulfilled') {
        setRegionalProducts(products.value || []);
        console.log(`📦 Loaded ${products.value?.length || 0} regional products`);
      }

      // Delivery info
      if (delivery.status === 'fulfilled') {
        setDeliveryInfo(delivery.value);
        console.log(`🚚 Delivery available: ${delivery.value?.available ? 'Yes' : 'No'}`);
      }

      // Nearby users (agar feature yoqilgan bo'lsa)
      if (nearby.status === 'fulfilled') {
        setNearbyUsers(nearby.value || []);
        console.log(`👥 Found ${nearby.value?.length || 0} nearby users`);
      }

      // Analytics jo'natish
      LocationAPIService.sendLocationAnalytics({
        action: 'regional_data_loaded',
        city: location.city,
        products_count: products.value?.length || 0,
        delivery_available: delivery.value?.available || false,
        nearby_users_count: nearby.value?.length || 0
      });

    } catch (error) {
      console.error('❌ Failed to load regional data:', error);
      
      LocationAPIService.sendLocationAnalytics({
        action: 'regional_data_failed',
        city: location.city,
        error: error.message
      });
    } finally {
      setIsLoadingRegionalData(false);
    }
  };

  /**
   * Location ni qayta aniqlash
   */
  const refreshLocation = async (method = 'auto') => {
    try {
      let newLocation = null;

      switch (method) {
        case 'gps':
          newLocation = await detectLocationByGPS();
          break;
        case 'ip':
          newLocation = await detectLocationByIP();
          break;
        default:
          // Auto - birinchi IP, keyin GPS
          try {
            newLocation = await detectLocationByIP();
          } catch (error) {
            console.warn('IP detection failed, trying GPS...');
            newLocation = await detectLocationByGPS();
          }
      }

      if (newLocation) {
        console.log('🔄 Location refreshed:', newLocation.city);
        return newLocation;
      }
    } catch (error) {
      console.error('❌ Failed to refresh location:', error);
      throw error;
    }
  };

  /**
   * Manual location selection
   * @param {Object} selectedLocation - User tomonidan tanlangan location
   */
  const selectManualLocation = async (selectedLocation) => {
    try {
      const manualLocation = {
        ...selectedLocation,
        isDetected: false,
        method: 'manual',
        timestamp: new Date().toISOString(),
        provider: 'user_selection'
      };

      setLocation(manualLocation);

      // Save to storage and API
      await saveLocationData(manualLocation);

      console.log('👆 Manual location selected:', manualLocation.city);
      return manualLocation;
    } catch (error) {
      console.error('❌ Failed to select manual location:', error);
      throw error;
    }
  };

  /**
   * Location ma'lumotlarini saqlash
   * @param {Object} locationData - Saqlanadigan location
   */
  const saveLocationData = async (locationData) => {
    try {
      // LocalStorage ga saqlash
      LocationStorageService.saveUserLocation(locationData);

      // API ga jo'natish
      await LocationAPIService.saveUserLocation(locationData);

      console.log('💾 Location data saved successfully');
    } catch (error) {
      console.warn('⚠️ Failed to save location data:', error);
    }
  };

  /**
   * Location preferences ni yangilash
   * @param {Object} preferences - Yangi preferences
   */
  const updateLocationPreferences = (preferences) => {
    LocationStorageService.saveLocationPreferences(preferences);
    
    console.log('⚙️ Location preferences updated:', preferences);
  };

  /**
   * Location history ni olish
   * @returns {Array} - Location history
   */
  const getLocationHistory = () => {
    return LocationStorageService.getLocationHistory();
  };

  /**
   * Location statistics ni olish
   * @returns {Object} - Location stats
   */
  const getLocationStats = () => {
    const history = LocationStorageService.getLocationHistory();
    const preferences = LocationStorageService.getLocationPreferences();
    const storageInfo = LocationStorageService.getStorageInfo();

    return {
      totalDetections: history.length,
      mostUsedMethod: getMostUsedMethod(history),
      citiesVisited: [...new Set(history.map(h => h.city))].length,
      lastDetection: LocationStorageService.getLastDetectionTime(),
      preferences,
      storage: storageInfo,
      currentLocation: location
    };
  };

  /**
   * Eng ko'p ishlatiladigan detection method ni topish
   * @param {Array} history - Location history
   * @returns {string} - Method name
   */
  const getMostUsedMethod = (history) => {
    if (!history.length) return 'unknown';

    const methodCounts = history.reduce((acc, item) => {
      acc[item.method] = (acc[item.method] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(methodCounts).reduce((a, b) => 
      methodCounts[a] > methodCounts[b] ? a : b
    );
  };

  /**
   * Location cache ni tozalash
   */
  const clearLocationCache = () => {
    LocationStorageService.clearAllLocationData();
    setRegionalProducts([]);
    setDeliveryInfo(null);
    setNearbyUsers([]);
    
    console.log('🗑️ Location cache cleared');
  };

  /**
   * Location ma'lumotlarini export qilish
   * @returns {Object} - Export data
   */
  const exportLocationData = () => {
    return LocationStorageService.exportLocationData();
  };

  return {
    // Location state
    location,
    isLoadingRegionalData,
    
    // Regional data
    regionalProducts,
    deliveryInfo,
    nearbyUsers,
    
    // Actions
    refreshLocation,
    selectManualLocation,
    updateLocationPreferences,
    loadRegionalData,
    
    // Utility functions
    getLocationHistory,
    getLocationStats,
    clearLocationCache,
    exportLocationData,
    
    // Helper flags
    hasLocation: !!location && !!location.city,
    isLocationDetected: location?.isDetected || false,
    detectionMethod: location?.method || 'unknown',
    lastUpdated: location?.timestamp || null
  };
};

export default useHomepageLocation;
