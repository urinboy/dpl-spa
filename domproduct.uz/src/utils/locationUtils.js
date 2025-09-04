/**
 * Location utilities for handling location data formatting and display
 */

// Default district names that should be hidden
const DEFAULT_DISTRICTS = [
    'Shahar markazi',
    'City Center', 
    'Central District',
    'Downtown',
    'Center',
    'Центр города',
    'Центральный район'
];

/**
 * Clean location data by removing default/generic district names
 * @param {Object} locationData - Location data object
 * @returns {Object} - Cleaned location data
 */
export const cleanLocationData = (locationData) => {
    if (!locationData || !locationData.address) {
        return locationData;
    }

    const cleaned = { ...locationData };
    
    // Remove district if it's a default/generic name
    if (cleaned.address.district && DEFAULT_DISTRICTS.includes(cleaned.address.district)) {
        cleaned.address.district = null;
    }

    return cleaned;
};

/**
 * Format location for display (city only or city + district)
 * @param {Object} locationData - Location data object
 * @param {boolean} showDistrict - Whether to show district
 * @returns {string} - Formatted location string
 */
export const formatLocationDisplay = (locationData, showDistrict = true) => {
    if (!locationData || !locationData.address) {
        return 'Unknown Location';
    }

    const { city, district } = locationData.address;
    
    if (!city) {
        return 'Unknown Location';
    }

    // If district should be shown and exists and is not a default district
    if (showDistrict && district && !DEFAULT_DISTRICTS.includes(district)) {
        return `${city}, ${district}`;
    }

    // Return only city name
    return city;
};

/**
 * Get city name only (clean)
 * @param {Object} locationData - Location data object
 * @returns {string} - City name only
 */
export const getCityName = (locationData) => {
    if (!locationData || !locationData.address || !locationData.address.city) {
        return 'Tashkent'; // Default fallback
    }
    
    return locationData.address.city;
};

/**
 * Get district name only (if not default)
 * @param {Object} locationData - Location data object
 * @returns {string|null} - District name or null
 */
export const getDistrictName = (locationData) => {
    if (!locationData || !locationData.address || !locationData.address.district) {
        return null;
    }
    
    const district = locationData.address.district;
    
    // Return null if it's a default district
    if (DEFAULT_DISTRICTS.includes(district)) {
        return null;
    }
    
    return district;
};

/**
 * Check if location data is valid and complete
 * @param {Object} locationData - Location data object
 * @returns {boolean} - True if valid
 */
export const isValidLocation = (locationData) => {
    return !!(locationData && locationData.address && locationData.address.city);
};

/**
 * Translate location based on current language using translation keys
 * @param {Object} locationData - Location data object
 * @param {Function} t - Translation function from useTranslation
 * @returns {Object} - Translated location data
 */
export const translateLocationWithKeys = (locationData, t) => {
    if (!isValidLocation(locationData)) {
        return locationData;
    }

    const translated = { ...locationData };
    const city = locationData.address.city.toLowerCase();
    
    // City name translation mappings
    const cityKeyMap = {
        'tashkent': 'city_tashkent',
        'toshkent': 'city_tashkent',
        'ташкент': 'city_tashkent',
        'samarkand': 'city_samarkand',
        'samarqand': 'city_samarkand',
        'самарканд': 'city_samarkand',
        'bukhara': 'city_bukhara',
        'buxoro': 'city_bukhara',
        'бухара': 'city_bukhara',
        'khiva': 'city_khiva',
        'xiva': 'city_khiva',
        'хива': 'city_khiva',
        'andijan': 'city_andijan',
        'andijon': 'city_andijan',
        'андижан': 'city_andijan',
        'fergana': 'city_fergana',
        "farg'ona": 'city_fergana',
        'фергана': 'city_fergana',
        'namangan': 'city_namangan',
        'наманган': 'city_namangan',
        'karshi': 'city_karshi',
        'qarshi': 'city_karshi',
        'карши': 'city_karshi',
        'termez': 'city_termez',
        'termiz': 'city_termez',
        'термез': 'city_termez',
        'urgench': 'city_urgench',
        'urganch': 'city_urgench',
        'ургенч': 'city_urgench',
        'nukus': 'city_nukus',
        'нукус': 'city_nukus',
        'gulistan': 'city_gulistan',
        'guliston': 'city_gulistan',
        'гулистан': 'city_gulistan',
        'jizzakh': 'city_jizzakh',
        'jizzax': 'city_jizzakh',
        'джизак': 'city_jizzakh',
        'kokand': 'city_kokand',
        "qo'qon": 'city_kokand',
        'коканд': 'city_kokand',
        'margilan': 'city_margilan',
        "marg'ilon": 'city_margilan',
        'маргилан': 'city_margilan'
    };
    
    // Get translation key for city
    const cityKey = cityKeyMap[city];
    if (cityKey) {
        translated.address.city = t(cityKey);
    }

    return translated;
};

/**
 * Get translated city name
 * @param {Object} locationData - Location data object
 * @param {Function} t - Translation function from useTranslation
 * @returns {string} - Translated city name
 */
export const getTranslatedCityName = (locationData, t) => {
    if (!locationData || !locationData.address || !locationData.address.city) {
        return t('city_tashkent'); // Default fallback
    }
    
    const translatedLocation = translateLocationWithKeys(locationData, t);
    return translatedLocation.address.city;
};

/**
 * Get location error message based on error code
 * @param {string} errorCode - Error code from geolocation API
 * @param {Function} t - Translation function
 * @returns {string} - Translated error message
 */
export const getLocationErrorMessage = (errorCode, t) => {
    const errorMessages = {
        'PERMISSION_DENIED': 'location_error_permission',
        'POSITION_UNAVAILABLE': 'location_error_unavailable', 
        'TIMEOUT': 'location_error_timeout',
        'UNKNOWN_ERROR': 'location_error_unknown'
    };
    
    return t(errorMessages[errorCode] || 'location_error_unknown');
};

/**
 * Create location fallback data
 * @param {Function} t - Translation function
 * @returns {Object} - Fallback location data
 */
export const createFallbackLocation = (t) => {
    return {
        address: {
            city: t('city_tashkent'),
            district: null,
            country: 'Uzbekistan'
        },
        coordinates: {
            latitude: 41.2995,
            longitude: 69.2401
        },
        method: 'fallback'
    };
};

/**
 * Validate and clean API response location data
 * @param {Object} apiResponse - Raw API response
 * @param {Function} t - Translation function  
 * @returns {Object} - Cleaned and validated location data
 */
export const processApiLocationData = (apiResponse, t) => {
    try {
        if (!apiResponse || !apiResponse.address) {
            return createFallbackLocation(t);
        }

        // Clean the data
        const cleaned = cleanLocationData(apiResponse);
        
        // Validate required fields
        if (!isValidLocation(cleaned)) {
            return createFallbackLocation(t);
        }

        // Translate to current language
        return translateLocationWithKeys(cleaned, t);
        
    } catch (error) {
        console.error('Error processing API location data:', error);
        return createFallbackLocation(t);
    }
};
