import React, { useState } from 'react';
import { useLocation } from '../contexts/LocationContext';
import { useTranslation } from 'react-i18next';

// O'zbekiston shaharlari ma'lumotlari
const uzbekistanCities = [
  { 
    name: 'Toshkent', 
    region: 'Toshkent viloyati',
    coordinates: { latitude: 41.2995, longitude: 69.2401 },
    fullAddress: 'Toshkent, O\'zbekiston'
  },
  { 
    name: 'Samarqand', 
    region: 'Samarqand viloyati',
    coordinates: { latitude: 39.6270, longitude: 66.9750 },
    fullAddress: 'Samarqand, O\'zbekiston'
  },
  { 
    name: 'Buxoro', 
    region: 'Buxoro viloyati',
    coordinates: { latitude: 39.7747, longitude: 64.4286 },
    fullAddress: 'Buxoro, O\'zbekiston'
  },
  { 
    name: 'Andijon', 
    region: 'Andijon viloyati',
    coordinates: { latitude: 40.7821, longitude: 72.3442 },
    fullAddress: 'Andijon, O\'zbekiston'
  },
  { 
    name: 'Farg\'ona', 
    region: 'Farg\'ona viloyati',
    coordinates: { latitude: 40.3842, longitude: 71.7843 },
    fullAddress: 'Farg\'ona, O\'zbekiston'
  },
  { 
    name: 'Namangan', 
    region: 'Namangan viloyati',
    coordinates: { latitude: 41.0015, longitude: 71.6724 },
    fullAddress: 'Namangan, O\'zbekiston'
  },
  { 
    name: 'Qarshi', 
    region: 'Qashqadaryo viloyati',
    coordinates: { latitude: 38.8606, longitude: 65.7890 },
    fullAddress: 'Qarshi, O\'zbekiston'
  },
  { 
    name: 'Nukus', 
    region: 'Qoraqalpog\'iston',
    coordinates: { latitude: 42.4531, longitude: 59.6103 },
    fullAddress: 'Nukus, O\'zbekiston'
  },
  { 
    name: 'Urganch', 
    region: 'Xorazm viloyati',
    coordinates: { latitude: 41.5500, longitude: 60.6333 },
    fullAddress: 'Urganch, O\'zbekiston'
  },
  { 
    name: 'Guliston', 
    region: 'Sirdaryo viloyati',
    coordinates: { latitude: 40.4897, longitude: 68.7844 },
    fullAddress: 'Guliston, O\'zbekiston'
  }
];

const LocationModal = () => {
  const { t } = useTranslation();
  const { 
    showLocationModal, 
    setShowLocationModal,
    detectLocationByGPS,
    detectLocationByIP,
    selectCityManually,
    location 
  } = useLocation();

  const [selectedMethod, setSelectedMethod] = useState('gps'); // 'gps', 'ip', 'manual'
  const [selectedCity, setSelectedCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!showLocationModal) {
    return null;
  }

  // Shaharlarni qidirish
  const filteredCities = uzbekistanCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // GPS orqali aniqlash
  const handleGPSDetection = async () => {
    setIsProcessing(true);
    try {
      await detectLocationByGPS();
    } catch (error) {
      console.error('GPS xatolik:', error);
      // GPS ishlamasa, IP ga o'tish
      try {
        await detectLocationByIP();
      } catch (ipError) {
        console.error('IP xatolik:', ipError);
      }
    }
    setIsProcessing(false);
  };

  // IP orqali aniqlash
  const handleIPDetection = async () => {
    setIsProcessing(true);
    try {
      await detectLocationByIP();
    } catch (error) {
      console.error('IP xatolik:', error);
    }
    setIsProcessing(false);
  };

  // Qo'lda shahar tanlash
  const handleManualSelection = () => {
    if (selectedCity) {
      const cityData = uzbekistanCities.find(city => city.name === selectedCity);
      if (cityData) {
        selectCityManually(cityData);
      }
    }
  };

  // Keyinroq tugmasini bosish
  const handleSkip = () => {
    // Default shahar sifatida Toshkentni o'rnatish
    const tashkent = uzbekistanCities.find(city => city.name === 'Toshkent');
    if (tashkent) {
      selectCityManually(tashkent);
    }
  };

  return (
    <div className="location-modal-overlay">
      <div className="location-modal">
        <div className="location-modal-header">
          <h2>{t('location_title', 'Joylashuvingizni aniqlang')}</h2>
          <p>{t('location_subtitle', 'Sizga eng yaqin mahsulotlar va yetkazib berish variantlarini ko\'rsatish uchun')}</p>
        </div>

        <div className="location-modal-content">
          {/* GPS Detection */}
          <div className="location-method">
            <div className="method-header">
              <input
                type="radio"
                id="gps-method"
                name="location-method"
                value="gps"
                checked={selectedMethod === 'gps'}
                onChange={(e) => setSelectedMethod(e.target.value)}
              />
              <label htmlFor="gps-method">
                <span className="method-icon">📍</span>
                <div className="method-info">
                  <h4>{t('gps_title', 'Avtomatik aniqlash')}</h4>
                  <p>{t('gps_description', 'GPS orqali aniq joylashuvingizni aniqlash')}</p>
                </div>
              </label>
            </div>
            {selectedMethod === 'gps' && (
              <div className="method-action">
                <button 
                  className="location-btn primary"
                  onClick={handleGPSDetection}
                  disabled={isProcessing || location.isLoading}
                >
                  {isProcessing || location.isLoading ? 
                    t('detecting', 'Aniqlanmoqda...') : 
                    t('detect_location', 'Joylashuvni aniqlash')
                  }
                </button>
              </div>
            )}
          </div>

          {/* IP Detection */}
          <div className="location-method">
            <div className="method-header">
              <input
                type="radio"
                id="ip-method"
                name="location-method"
                value="ip"
                checked={selectedMethod === 'ip'}
                onChange={(e) => setSelectedMethod(e.target.value)}
              />
              <label htmlFor="ip-method">
                <span className="method-icon">🌐</span>
                <div className="method-info">
                  <h4>{t('ip_title', 'Internet orqali aniqlash')}</h4>
                  <p>{t('ip_description', 'IP manzil orqali taxminiy joylashuv')}</p>
                </div>
              </label>
            </div>
            {selectedMethod === 'ip' && (
              <div className="method-action">
                <button 
                  className="location-btn secondary"
                  onClick={handleIPDetection}
                  disabled={isProcessing || location.isLoading}
                >
                  {isProcessing || location.isLoading ? 
                    t('detecting', 'Aniqlanmoqda...') : 
                    t('detect_by_ip', 'IP orqali aniqlash')
                  }
                </button>
              </div>
            )}
          </div>

          {/* Manual Selection */}
          <div className="location-method">
            <div className="method-header">
              <input
                type="radio"
                id="manual-method"
                name="location-method"
                value="manual"
                checked={selectedMethod === 'manual'}
                onChange={(e) => setSelectedMethod(e.target.value)}
              />
              <label htmlFor="manual-method">
                <span className="method-icon">🏙️</span>
                <div className="method-info">
                  <h4>{t('manual_title', 'Qo\'lda tanlash')}</h4>
                  <p>{t('manual_description', 'Ro\'yxatdan shahringizni tanlang')}</p>
                </div>
              </label>
            </div>
            {selectedMethod === 'manual' && (
              <div className="method-action">
                <div className="city-search">
                  <input
                    type="text"
                    placeholder={t('search_city', 'Shahringizni qidiring...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="cities-list">
                  {filteredCities.map(city => (
                    <div
                      key={city.name}
                      className={`city-option ${selectedCity === city.name ? 'selected' : ''}`}
                      onClick={() => setSelectedCity(city.name)}
                    >
                      <div className="city-info">
                        <h5>{city.name}</h5>
                        <span>{city.region}</span>
                      </div>
                      {selectedCity === city.name && <span className="check-icon">✓</span>}
                    </div>
                  ))}
                </div>
                <button 
                  className="location-btn primary"
                  onClick={handleManualSelection}
                  disabled={!selectedCity}
                >
                  {t('confirm_city', 'Shahringizni tasdiqlash')}
                </button>
              </div>
            )}
          </div>

          {/* Error Display */}
          {location.error && (
            <div className="location-error">
              <span className="error-icon">⚠️</span>
              <p>{location.error}</p>
            </div>
          )}
        </div>

        <div className="location-modal-footer">
          <button 
            className="location-btn skip"
            onClick={handleSkip}
          >
            {t('skip_later', 'Keyinroq')}
          </button>
        </div>
      </div>

      <style jsx>{`
        .location-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
        }

        .location-modal {
          background: white;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .location-modal-header {
          padding: 24px 24px 0;
          text-align: center;
        }

        .location-modal-header h2 {
          margin: 0 0 8px;
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .location-modal-header p {
          margin: 0;
          color: #666;
          font-size: 14px;
          line-height: 1.5;
        }

        .location-modal-content {
          padding: 24px;
        }

        .location-method {
          margin-bottom: 20px;
          border: 2px solid #f0f0f0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .location-method:hover {
          border-color: #e0e0e0;
        }

        .method-header {
          padding: 16px;
        }

        .method-header input[type="radio"] {
          display: none;
        }

        .method-header label {
          display: flex;
          align-items: center;
          cursor: pointer;
          gap: 12px;
        }

        .method-icon {
          font-size: 24px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f8f8;
          border-radius: 8px;
        }

        .method-info h4 {
          margin: 0 0 4px;
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .method-info p {
          margin: 0;
          font-size: 14px;
          color: #666;
        }

        .location-method input[type="radio"]:checked + label .method-icon {
          background: var(--primary-color, #2e7d32);
          color: white;
        }

        .location-method input[type="radio"]:checked {
          border-color: var(--primary-color, #2e7d32);
        }

        .method-action {
          padding: 0 16px 16px;
          border-top: 1px solid #f0f0f0;
          margin-top: 12px;
          padding-top: 16px;
        }

        .location-btn {
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .location-btn.primary {
          background: var(--primary-color, #2e7d32);
          color: white;
        }

        .location-btn.primary:hover:not(:disabled) {
          background: #1b5e20;
        }

        .location-btn.secondary {
          background: #f5f5f5;
          color: #333;
        }

        .location-btn.secondary:hover:not(:disabled) {
          background: #e0e0e0;
        }

        .location-btn.skip {
          background: transparent;
          color: #666;
          text-decoration: underline;
        }

        .location-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .city-search {
          margin-bottom: 12px;
        }

        .search-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-color, #2e7d32);
        }

        .cities-list {
          max-height: 200px;
          overflow-y: auto;
          border: 1px solid #f0f0f0;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .city-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .city-option:hover {
          background: #f8f8f8;
        }

        .city-option.selected {
          background: #e8f5e8;
          color: var(--primary-color, #2e7d32);
        }

        .city-info h5 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .city-info span {
          font-size: 12px;
          color: #666;
        }

        .check-icon {
          color: var(--primary-color, #2e7d32);
          font-weight: bold;
        }

        .location-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #fff3e0;
          border: 1px solid #ffb74d;
          border-radius: 8px;
          margin-top: 16px;
        }

        .error-icon {
          font-size: 18px;
        }

        .location-error p {
          margin: 0;
          font-size: 14px;
          color: #f57c00;
        }

        .location-modal-footer {
          padding: 0 24px 24px;
          text-align: center;
        }

        @media (max-width: 480px) {
          .location-modal {
            margin: 10px;
            max-width: none;
          }

          .location-modal-header h2 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default LocationModal;
