/**
 * LocalStorage Utils for Location Management
 * User location ni localStorage da saqlash va boshqarish
 */

class LocationStorageService {
  
  static STORAGE_KEYS = {
    USER_LOCATION: 'user_location',
    LOCATION_HISTORY: 'location_history',
    LOCATION_PREFERENCES: 'location_preferences',
    LAST_DETECTION_TIME: 'last_location_detection',
    DELIVERY_ZONES: 'delivery_zones_cache'
  };

  /**
   * User location ni localStorage ga saqlash
   * @param {Object} locationData - Location ma'lumotlari
   * @returns {boolean} - Success status
   */
  static saveUserLocation(locationData) {
    try {
      const locationToSave = {
        ...locationData,
        savedAt: new Date().toISOString(),
        version: '1.0'
      };

      localStorage.setItem(
        this.STORAGE_KEYS.USER_LOCATION, 
        JSON.stringify(locationToSave)
      );

      // History ga ham qo'shish
      this.addToLocationHistory(locationData);

      console.log('✅ Location saved to localStorage:', locationToSave.city);
      return true;
    } catch (error) {
      console.error('❌ Failed to save location to localStorage:', error);
      return false;
    }
  }

  /**
   * Saqlangan user location ni olish
   * @returns {Object|null} - Saqlangan location yoki null
   */
  static getUserLocation() {
    try {
      const savedLocation = localStorage.getItem(this.STORAGE_KEYS.USER_LOCATION);
      
      if (!savedLocation) {
        return null;
      }

      const locationData = JSON.parse(savedLocation);
      
      // Ma'lumot 24 soatdan eski bo'lsa, null qaytarish
      if (this.isLocationExpired(locationData.savedAt)) {
        this.clearUserLocation();
        return null;
      }

      console.log('📍 Location loaded from localStorage:', locationData.city);
      return locationData;
    } catch (error) {
      console.error('❌ Failed to load location from localStorage:', error);
      return null;
    }
  }

  /**
   * User location ni o'chirish
   */
  static clearUserLocation() {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.USER_LOCATION);
      console.log('🗑️ User location cleared from localStorage');
    } catch (error) {
      console.error('❌ Failed to clear user location:', error);
    }
  }

  /**
   * Location history ga qo'shish
   * @param {Object} locationData - Location data
   */
  static addToLocationHistory(locationData) {
    try {
      const history = this.getLocationHistory();
      
      const historyItem = {
        ...locationData,
        detectedAt: new Date().toISOString(),
        id: Date.now().toString()
      };

      history.unshift(historyItem);

      // Faqat oxirgi 10 ta location ni saqlash
      const limitedHistory = history.slice(0, 10);

      localStorage.setItem(
        this.STORAGE_KEYS.LOCATION_HISTORY, 
        JSON.stringify(limitedHistory)
      );
    } catch (error) {
      console.error('❌ Failed to add to location history:', error);
    }
  }

  /**
   * Location history ni olish
   * @returns {Array} - Location history
   */
  static getLocationHistory() {
    try {
      const history = localStorage.getItem(this.STORAGE_KEYS.LOCATION_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('❌ Failed to get location history:', error);
      return [];
    }
  }

  /**
   * Location preferences ni saqlash
   * @param {Object} preferences - User preferences
   */
  static saveLocationPreferences(preferences) {
    try {
      const prefs = {
        ...preferences,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(
        this.STORAGE_KEYS.LOCATION_PREFERENCES,
        JSON.stringify(prefs)
      );

      console.log('⚙️ Location preferences saved');
    } catch (error) {
      console.error('❌ Failed to save location preferences:', error);
    }
  }

  /**
   * Location preferences ni olish
   * @returns {Object} - User preferences
   */
  static getLocationPreferences() {
    try {
      const prefs = localStorage.getItem(this.STORAGE_KEYS.LOCATION_PREFERENCES);
      return prefs ? JSON.parse(prefs) : {
        autoDetect: true,
        allowGPS: false,
        saveHistory: true,
        shareLocation: false,
        defaultMethod: 'ip'
      };
    } catch (error) {
      console.error('❌ Failed to get location preferences:', error);
      return {};
    }
  }

  /**
   * Oxirgi detection vaqtini saqlash
   * @param {string} method - Detection method
   */
  static saveLastDetectionTime(method = 'unknown') {
    try {
      const detectionInfo = {
        timestamp: new Date().toISOString(),
        method: method,
        success: true
      };

      localStorage.setItem(
        this.STORAGE_KEYS.LAST_DETECTION_TIME,
        JSON.stringify(detectionInfo)
      );
    } catch (error) {
      console.error('❌ Failed to save detection time:', error);
    }
  }

  /**
   * Oxirgi detection vaqtini olish
   * @returns {Object|null} - Detection info
   */
  static getLastDetectionTime() {
    try {
      const info = localStorage.getItem(this.STORAGE_KEYS.LAST_DETECTION_TIME);
      return info ? JSON.parse(info) : null;
    } catch (error) {
      console.error('❌ Failed to get detection time:', error);
      return null;
    }
  }

  /**
   * Delivery zones ni cache qilish
   * @param {Array} zones - Delivery zones
   */
  static cacheDeliveryZones(zones) {
    try {
      const cacheData = {
        zones: zones,
        cachedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 soat
      };

      localStorage.setItem(
        this.STORAGE_KEYS.DELIVERY_ZONES,
        JSON.stringify(cacheData)
      );
    } catch (error) {
      console.error('❌ Failed to cache delivery zones:', error);
    }
  }

  /**
   * Cache dan delivery zones ni olish
   * @returns {Array|null} - Delivery zones yoki null
   */
  static getCachedDeliveryZones() {
    try {
      const cached = localStorage.getItem(this.STORAGE_KEYS.DELIVERY_ZONES);
      
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      
      // Cache expired bo'lsa
      if (new Date() > new Date(cacheData.expiresAt)) {
        localStorage.removeItem(this.STORAGE_KEYS.DELIVERY_ZONES);
        return null;
      }

      return cacheData.zones;
    } catch (error) {
      console.error('❌ Failed to get cached delivery zones:', error);
      return null;
    }
  }

  /**
   * Location ma'lumot eski ekanligini tekshirish
   * @param {string} savedAt - Saqlangan vaqt
   * @param {number} expiryHours - Muddat (soatlarda)
   * @returns {boolean} - Eski yoki yangi
   */
  static isLocationExpired(savedAt, expiryHours = 24) {
    try {
      const savedTime = new Date(savedAt);
      const currentTime = new Date();
      const diffHours = (currentTime - savedTime) / (1000 * 60 * 60);
      
      return diffHours > expiryHours;
    } catch (error) {
      console.error('❌ Failed to check location expiry:', error);
      return true;
    }
  }

  /**
   * LocalStorage dan barcha location ma'lumotlarini o'chirish
   */
  static clearAllLocationData() {
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log('🗑️ All location data cleared from localStorage');
    } catch (error) {
      console.error('❌ Failed to clear all location data:', error);
    }
  }

  /**
   * Location data ning umumiy ma'lumotini olish
   * @returns {Object} - Storage info
   */
  static getStorageInfo() {
    try {
      const info = {
        hasUserLocation: !!localStorage.getItem(this.STORAGE_KEYS.USER_LOCATION),
        historyCount: this.getLocationHistory().length,
        hasPreferences: !!localStorage.getItem(this.STORAGE_KEYS.LOCATION_PREFERENCES),
        lastDetection: this.getLastDetectionTime(),
        hasCachedZones: !!localStorage.getItem(this.STORAGE_KEYS.DELIVERY_ZONES),
        storageSize: this.calculateStorageSize()
      };

      return info;
    } catch (error) {
      console.error('❌ Failed to get storage info:', error);
      return {};
    }
  }

  /**
   * Location data ning storage size ni hisoblash
   * @returns {string} - Size in KB
   */
  static calculateStorageSize() {
    try {
      let totalSize = 0;
      
      Object.values(this.STORAGE_KEYS).forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          totalSize += data.length;
        }
      });

      return `${(totalSize / 1024).toFixed(2)} KB`;
    } catch (error) {
      console.error('❌ Failed to calculate storage size:', error);
      return '0 KB';
    }
  }

  /**
   * Location data ni export qilish (backup uchun)
   * @returns {Object} - Barcha location data
   */
  static exportLocationData() {
    try {
      const exportData = {};
      
      Object.entries(this.STORAGE_KEYS).forEach(([key, storageKey]) => {
        const data = localStorage.getItem(storageKey);
        if (data) {
          exportData[key] = JSON.parse(data);
        }
      });

      exportData.exportedAt = new Date().toISOString();
      return exportData;
    } catch (error) {
      console.error('❌ Failed to export location data:', error);
      return {};
    }
  }

  /**
   * Location data ni import qilish (restore uchun)
   * @param {Object} importData - Import qilinadigan data
   * @returns {boolean} - Success status
   */
  static importLocationData(importData) {
    try {
      Object.entries(this.STORAGE_KEYS).forEach(([key, storageKey]) => {
        if (importData[key]) {
          localStorage.setItem(storageKey, JSON.stringify(importData[key]));
        }
      });

      console.log('✅ Location data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to import location data:', error);
      return false;
    }
  }
}

export default LocationStorageService;
