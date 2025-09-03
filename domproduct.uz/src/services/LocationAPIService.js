/**
 * Location API Service
 * Backend API bilan location ma'lumotlarini almashish uchun
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class LocationAPIService {
  
  /**
   * User location ni backend ga jo'natish
   * @param {Object} locationData - Location ma'lumotlari
   * @returns {Promise<Object>} - API response
   */
  static async saveUserLocation(locationData) {
    try {
      const payload = {
        user_id: locationData.userId || null,
        latitude: locationData.position?.latitude,
        longitude: locationData.position?.longitude,
        address: locationData.address,
        city: locationData.city,
        region: locationData.region,
        country: locationData.country,
        detection_method: locationData.method, // 'gps', 'ip', 'manual'
        accuracy: locationData.accuracy || null,
        provider: locationData.provider || 'unknown',
        is_detected: locationData.isDetected || false,
        timestamp: locationData.timestamp || new Date().toISOString(),
        
        // Qo'shimcha ma'lumotlar
        device_info: {
          user_agent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language
        }
      };

      const response = await fetch(`${API_BASE_URL}/user-location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Location API save failed:', error);
      throw error;
    }
  }

  /**
   * User ning saqlangan location larini olish
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - User locations
   */
  static async getUserLocations(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/user-locations/${userId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get user locations failed:', error);
      return [];
    }
  }

  /**
   * Yaqin foydalanuvchilarni topish
   * @param {Object} coordinates - {latitude, longitude}
   * @param {number} radius - Radius (km)
   * @returns {Promise<Array>} - Yaqin users
   */
  static async findNearbyUsers(coordinates, radius = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/nearby-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          radius: radius
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Find nearby users failed:', error);
      return [];
    }
  }

  /**
   * Regiondagi mahsulotlarni olish
   * @param {Object} locationData - Location ma'lumotlari
   * @returns {Promise<Array>} - Regional products
   */
  static async getRegionalProducts(locationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/regional-products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          city: locationData.city,
          region: locationData.region,
          coordinates: locationData.position
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get regional products failed:', error);
      return [];
    }
  }

  /**
   * Delivery zones ni tekshirish
   * @param {Object} coordinates - {latitude, longitude}
   * @returns {Promise<Object>} - Delivery info
   */
  static async checkDeliveryZone(coordinates) {
    try {
      const response = await fetch(`${API_BASE_URL}/delivery-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delivery check failed:', error);
      return {
        available: false,
        message: 'Delivery zone checking failed'
      };
    }
  }

  /**
   * Location analytics jo'natish
   * @param {Object} analyticsData - Analytics ma'lumotlari
   * @returns {Promise<Object>} - Response
   */
  static async sendLocationAnalytics(analyticsData) {
    try {
      const response = await fetch(`${API_BASE_URL}/location-analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...analyticsData,
          timestamp: new Date().toISOString(),
          session_id: this.getSessionId()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Location analytics failed:', error);
      return false;
    }
  }

  /**
   * Auth token olish
   * @returns {string|null} - Auth token
   */
  static getAuthToken() {
    return localStorage.getItem('auth_token') || 
           sessionStorage.getItem('auth_token') || 
           null;
  }

  /**
   * Session ID olish yoki yaratish
   * @returns {string} - Session ID
   */
  static getSessionId() {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Location ma'lumotlarini format qilish (API uchun)
   * @param {Object} rawLocation - Xom location data
   * @returns {Object} - Formatted data
   */
  static formatLocationForAPI(rawLocation) {
    return {
      id: rawLocation.id || null,
      user_id: rawLocation.userId || null,
      latitude: rawLocation.position?.latitude || rawLocation.latitude,
      longitude: rawLocation.position?.longitude || rawLocation.longitude,
      address: rawLocation.address || rawLocation.formatted_address,
      city: rawLocation.city,
      region: rawLocation.region || rawLocation.state,
      country: rawLocation.country,
      postal_code: rawLocation.postcode || rawLocation.postal_code,
      detection_method: rawLocation.method,
      accuracy: rawLocation.accuracy,
      provider: rawLocation.provider || rawLocation.source,
      is_detected: rawLocation.isDetected || false,
      is_active: true,
      created_at: rawLocation.timestamp || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Backend dan kelgan ma'lumotni frontend format ga o'girish
   * @param {Object} apiLocation - API dan kelgan data
   * @returns {Object} - Frontend format
   */
  static formatLocationFromAPI(apiLocation) {
    return {
      id: apiLocation.id,
      userId: apiLocation.user_id,
      isLoading: false,
      error: null,
      position: {
        latitude: parseFloat(apiLocation.latitude),
        longitude: parseFloat(apiLocation.longitude)
      },
      address: apiLocation.address,
      city: apiLocation.city,
      region: apiLocation.region,
      country: apiLocation.country,
      postcode: apiLocation.postal_code,
      isDetected: apiLocation.is_detected,
      method: apiLocation.detection_method,
      accuracy: apiLocation.accuracy,
      provider: apiLocation.provider,
      timestamp: apiLocation.created_at
    };
  }

  /**
   * Test uchun mock API response
   * @param {Object} locationData - Test data
   * @returns {Promise<Object>} - Mock response
   */
  static async mockSaveLocation(locationData) {
    // Development rejimida mock response
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Location saved successfully',
      data: {
        id: Math.floor(Math.random() * 1000),
        ...this.formatLocationForAPI(locationData)
      }
    };
  }
}

export default LocationAPIService;
