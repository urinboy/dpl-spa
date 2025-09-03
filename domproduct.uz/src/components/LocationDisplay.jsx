import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const LocationDisplay = () => {
  const { t } = useTranslation();
  const [locationData, setLocationData] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const loadLocationData = useCallback(() => {
    try {
      const stored = localStorage.getItem('dpl_user_location');
      if (stored) {
        const data = JSON.parse(stored);
        setLocationData(prevData => {
          if (!prevData || prevData.timestamp !== data.timestamp) {
            setIsAnimating(true);
            setTimeout(() => {
              setIsAnimating(false);
            }, 300);
            return data;
          }
          return prevData;
        });
      }
    } catch (error) {
      console.error('Location data loading error:', error);
    }
  }, []);

  useEffect(() => {
    loadLocationData();

    // Storage o'zgarishlarini kuzatish
    const handleStorageChange = (e) => {
      if (e.key === 'dpl_user_location') {
        loadLocationData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Interval bilan ham tekshirish (bir tab ichida o'zgarishlar uchun)
    const intervalId = setInterval(loadLocationData, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [loadLocationData]);

  if (!locationData || !locationData.address) {
    return (
      <div className="location-display location-placeholder">
        <div className="location-icon">
          <i className="fas fa-map-marker-alt"></i>
        </div>
        <div className="location-text">
          <span className="location-city">{t('detecting_location_short')}</span>
          <div className="location-pulse"></div>
        </div>
      </div>
    );
  }

  const displayLocation = () => {
    const { address } = locationData;
    
    // Faqat shahar nomini ko'rsatish
    if (address.city) {
      return {
        city: address.city,
        district: address.district || null
      };
    }
    
    // Agar shahar yo'q bo'lsa, district yoki boshqa ma'lumotni ko'rsatish
    return {
      city: address.district || address.country || 'Joylashuv',
      district: null
    };
  };

  const location = displayLocation();

  return (
    <div className={`location-display ${isAnimating ? 'animating' : ''}`}>
      <div className="location-icon">
        <i className="fas fa-map-marker-alt"></i>
        <div className="location-dot"></div>
      </div>
      <div className="location-text">
        <span className="location-city">{location.city}</span>
        {location.district && (
          <span className="location-district">{location.district}</span>
        )}
      </div>
      <div className="location-arrow">
        <i className="fas fa-chevron-down"></i>
      </div>
    </div>
  );
};

export default LocationDisplay;
