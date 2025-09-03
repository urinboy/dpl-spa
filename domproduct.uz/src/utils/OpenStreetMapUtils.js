/**
 * OpenStreetMap (OSM) Utilities
 * Bepul geocoding va reverse geocoding uchun
 * API key kerak emas!
 */

class OpenStreetMapUtils {
  static baseURL = 'https://nominatim.openstreetmap.org';
  
  // User-Agent headers (OSM requirement)
  static headers = {
    'User-Agent': 'DomProduct-SPA/1.0 (https://domproduct.uz)'
  };

  /**
   * Koordinatalardan manzil olish (Reverse Geocoding)
   * @param {number} lat - Kenglik
   * @param {number} lon - Uzunlik
   * @param {string} language - Til kodi (uz, ru, en)
   * @returns {Promise<Object>} - Manzil ma'lumotlari
   */
  static async reverseGeocode(lat, lon, language = 'uz') {
    try {
      const url = new URL(`${this.baseURL}/reverse`);
      url.searchParams.set('lat', lat.toString());
      url.searchParams.set('lon', lon.toString());
      url.searchParams.set('format', 'json');
      url.searchParams.set('addressdetails', '1');
      url.searchParams.set('accept-language', language);
      url.searchParams.set('zoom', '18'); // Detailed level

      const response = await fetch(url.toString(), {
        headers: this.headers,
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`OSM API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return this.formatOSMAddress(data);
    } catch (error) {
      console.error('OSM Reverse Geocoding failed:', error);
      throw error;
    }
  }

  /**
   * Manzildan koordinatalar olish (Forward Geocoding)
   * @param {string} address - Manzil (shahar, ko'cha, uy)
   * @param {string} language - Til kodi
   * @returns {Promise<Array>} - Koordinatalar ro'yxati
   */
  static async geocode(address, language = 'uz') {
    try {
      const url = new URL(`${this.baseURL}/search`);
      url.searchParams.set('q', address);
      url.searchParams.set('format', 'json');
      url.searchParams.set('addressdetails', '1');
      url.searchParams.set('accept-language', language);
      url.searchParams.set('limit', '5');
      url.searchParams.set('countrycodes', 'uz'); // Faqat Uzbekiston

      const response = await fetch(url.toString(), {
        headers: this.headers,
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`OSM API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No results found');
      }

      return data.map(item => this.formatOSMAddress(item));
    } catch (error) {
      console.error('OSM Geocoding failed:', error);
      throw error;
    }
  }

  /**
   * Shahar/viloyat bo'yicha qidirish
   * @param {string} cityName - Shahar nomi
   * @param {string} language - Til kodi
   * @returns {Promise<Object>} - Shahar ma'lumotlari
   */
  static async searchCity(cityName, language = 'uz') {
    try {
      const searchQuery = `${cityName}, Uzbekistan`;
      const results = await this.geocode(searchQuery, language);
      
      // Eng mos natijani tanlash
      const city = results.find(result => 
        result.type === 'city' || 
        result.type === 'town' || 
        result.type === 'village' ||
        result.importance > 0.5
      ) || results[0];

      return city;
    } catch (error) {
      console.error('OSM City Search failed:', error);
      throw error;
    }
  }

  /**
   * Yaqin shaharlarni topish
   * @param {number} lat - Kenglik
   * @param {number} lon - Uzunlik
   * @param {number} radius - Radius (km)
   * @returns {Promise<Array>} - Yaqin shaharlar
   */
  static async findNearbyCities(lat, lon, radius = 50) {
    try {
      // Overpass API orqali yaqin shaharlarni qidirish
      const overpassUrl = 'https://overpass-api.de/api/interpreter';
      const query = `
        [out:json][timeout:25];
        (
          node["place"~"^(city|town)$"](around:${radius * 1000},${lat},${lon});
          way["place"~"^(city|town)$"](around:${radius * 1000},${lat},${lon});
          relation["place"~"^(city|town)$"](around:${radius * 1000},${lat},${lon});
        );
        out center meta;
      `;

      const response = await fetch(overpassUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...this.headers
        },
        body: `data=${encodeURIComponent(query)}`
      });

      if (!response.ok) {
        throw new Error(`Overpass API Error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.elements.map(element => ({
        name: element.tags?.name || 'Unknown',
        name_uz: element.tags?.['name:uz'] || element.tags?.name,
        name_ru: element.tags?.['name:ru'] || element.tags?.name,
        type: element.tags?.place,
        latitude: element.lat || element.center?.lat,
        longitude: element.lon || element.center?.lon,
        distance: this.calculateDistance(lat, lon, 
          element.lat || element.center?.lat, 
          element.lon || element.center?.lon
        )
      })).sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error('OSM Nearby Cities failed:', error);
      return [];
    }
  }

  /**
   * OSM javobini formatlash
   * @param {Object} osmData - OSM dan kelgan ma'lumot
   * @returns {Object} - Formatlangan ma'lumot
   */
  static formatOSMAddress(osmData) {
    const address = osmData.address || {};
    
    return {
      formatted_address: osmData.display_name,
      latitude: parseFloat(osmData.lat),
      longitude: parseFloat(osmData.lon),
      
      // Manzil komponentlari
      house_number: address.house_number,
      road: address.road,
      neighbourhood: address.neighbourhood || address.suburb,
      city: address.city || address.town || address.village,
      county: address.county,
      state: address.state,
      country: address.country,
      postcode: address.postcode,
      
      // OSM specific
      place_id: osmData.place_id,
      osm_type: osmData.osm_type,
      osm_id: osmData.osm_id,
      type: osmData.type || osmData.class,
      importance: osmData.importance,
      
      // Qo'shimcha ma'lumotlar
      boundingbox: osmData.boundingbox,
      licence: osmData.licence || 'OpenStreetMap contributors',
      source: 'OpenStreetMap'
    };
  }

  /**
   * Ikki nuqta orasidagi masofani hisoblash (Haversine formula)
   * @param {number} lat1 - Birinchi nuqta kengligi
   * @param {number} lon1 - Birinchi nuqta uzunligi
   * @param {number} lat2 - Ikkinchi nuqta kengligi
   * @param {number} lon2 - Ikkinchi nuqta uzunligi
   * @returns {number} - Masofa (km)
   */
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Yer radiusi (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Uzbekiston shaharlari ro'yxati (OSM dan)
   * @returns {Promise<Array>} - Shaharlar ro'yxati
   */
  static async getUzbekistanCities() {
    try {
      const overpassUrl = 'https://overpass-api.de/api/interpreter';
      const query = `
        [out:json][timeout:25];
        area["ISO3166-1"="UZ"][admin_level=2];
        (
          node["place"="city"](area);
          node["place"="town"](area);
        );
        out;
      `;

      const response = await fetch(overpassUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...this.headers
        },
        body: `data=${encodeURIComponent(query)}`
      });

      const data = await response.json();
      
      return data.elements.map(city => ({
        id: city.id,
        name: city.tags.name,
        name_uz: city.tags['name:uz'] || city.tags.name,
        name_ru: city.tags['name:ru'] || city.tags.name,
        name_en: city.tags['name:en'] || city.tags.name,
        type: city.tags.place,
        latitude: city.lat,
        longitude: city.lon,
        population: parseInt(city.tags.population) || null,
        source: 'OpenStreetMap'
      })).sort((a, b) => (b.population || 0) - (a.population || 0));
    } catch (error) {
      console.error('Failed to get Uzbekistan cities:', error);
      return [];
    }
  }

  /**
   * Test qilish uchun
   */
  static async test() {
    console.log('🧪 OpenStreetMap Utils Test');
    
    try {
      // 1. Toshkent koordinatalariga reverse geocoding
      console.log('1. Testing reverse geocoding...');
      const address = await this.reverseGeocode(41.2995, 69.2401);
      console.log('✅ Reverse geocoding success:', address.formatted_address);
      
      // 2. Toshkent qidirish
      console.log('2. Testing city search...');
      const tashkent = await this.searchCity('Tashkent');
      console.log('✅ City search success:', tashkent.formatted_address);
      
      // 3. Yaqin shaharlar
      console.log('3. Testing nearby cities...');
      const nearby = await this.findNearbyCities(41.2995, 69.2401, 100);
      console.log(`✅ Found ${nearby.length} nearby cities`);
      
      console.log('🎉 All OSM tests passed!');
      return true;
    } catch (error) {
      console.error('❌ OSM test failed:', error);
      return false;
    }
  }
}

export default OpenStreetMapUtils;
