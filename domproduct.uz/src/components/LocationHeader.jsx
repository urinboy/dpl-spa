import React, { useState } from 'react';
import { useLocation } from '../contexts/LocationContext';
import { useTranslation } from 'react-i18next';

const LocationHeader = () => {
  const { t } = useTranslation();
  const { location, setShowLocationModal, refreshLocation } = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!location.isDetected) {
    return null;
  }

  const handleLocationClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleChangeLocation = () => {
    setShowLocationModal(true);
    setShowDropdown(false);
  };

  const handleRefreshLocation = () => {
    refreshLocation();
    setShowDropdown(false);
  };

  const getLocationIcon = () => {
    switch (location.method) {
      case 'gps':
        return '📍';
      case 'ip':
        return '🌐';
      case 'manual':
        return '🏙️';
      default:
        return '📍';
    }
  };

  const getAccuracyText = () => {
    switch (location.method) {
      case 'gps':
        return t('gps_accurate', 'Aniq joylashuv');
      case 'ip':
        return t('ip_approximate', 'Taxminiy joylashuv');
      case 'manual':
        return t('manual_selected', 'Tanlangan');
      default:
        return '';
    }
  };

  return (
    <div className="location-header">
      <div className="location-info" onClick={handleLocationClick}>
        <span className="location-icon">{getLocationIcon()}</span>
        <div className="location-text">
          <div className="location-city">{location.city || t('unknown_location', 'Noma\'lum joylashuv')}</div>
          <div className="location-accuracy">{getAccuracyText()}</div>
        </div>
        <span className="dropdown-arrow">▼</span>
      </div>

      {showDropdown && (
        <div className="location-dropdown">
          <div className="dropdown-header">
            <h4>{t('current_location', 'Joriy joylashuv')}</h4>
            <button 
              className="close-dropdown"
              onClick={() => setShowDropdown(false)}
            >
              ×
            </button>
          </div>

          <div className="location-details">
            <div className="detail-row">
              <span className="detail-label">{t('city', 'Shahar')}:</span>
              <span className="detail-value">{location.city}</span>
            </div>
            {location.region && (
              <div className="detail-row">
                <span className="detail-label">{t('region', 'Viloyat')}:</span>
                <span className="detail-value">{location.region}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">{t('country', 'Mamlakat')}:</span>
              <span className="detail-value">{location.country}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">{t('method', 'Usul')}:</span>
              <span className="detail-value">{getAccuracyText()}</span>
            </div>
          </div>

          <div className="dropdown-actions">
            <button 
              className="action-btn change"
              onClick={handleChangeLocation}
            >
              <span>📍</span>
              {t('change_location', 'Joylashuvni o\'zgartirish')}
            </button>
            <button 
              className="action-btn refresh"
              onClick={handleRefreshLocation}
            >
              <span>🔄</span>
              {t('refresh_location', 'Yangilash')}
            </button>
          </div>
        </div>
      )}

      {showDropdown && (
        <div 
          className="dropdown-overlay" 
          onClick={() => setShowDropdown(false)}
        />
      )}

      <style jsx>{`
        .location-header {
          position: relative;
          display: inline-block;
        }

        .location-info {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #f8f8f8;
          border: 1px solid #e0e0e0;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .location-info:hover {
          background: #f0f0f0;
          border-color: #d0d0d0;
        }

        .location-icon {
          font-size: 16px;
        }

        .location-text {
          display: flex;
          flex-direction: column;
        }

        .location-city {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          line-height: 1;
        }

        .location-accuracy {
          font-size: 11px;
          color: #666;
          line-height: 1;
          margin-top: 2px;
        }

        .dropdown-arrow {
          font-size: 10px;
          color: #666;
          transition: transform 0.2s ease;
          margin-left: 4px;
        }

        .location-info:hover .dropdown-arrow {
          transform: rotate(180deg);
        }

        .location-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          min-width: 280px;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          margin-top: 4px;
          animation: dropdownSlideIn 0.2s ease-out;
        }

        @keyframes dropdownSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #f0f0f0;
        }

        .dropdown-header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .close-dropdown {
          background: none;
          border: none;
          font-size: 20px;
          color: #999;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-dropdown:hover {
          color: #666;
        }

        .location-details {
          padding: 16px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .detail-row:last-child {
          margin-bottom: 0;
        }

        .detail-label {
          font-size: 14px;
          color: #666;
        }

        .detail-value {
          font-size: 14px;
          color: #333;
          font-weight: 500;
        }

        .dropdown-actions {
          padding: 16px;
          border-top: 1px solid #f0f0f0;
          display: flex;
          gap: 8px;
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: white;
          color: #333;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: #f8f8f8;
          border-color: #d0d0d0;
        }

        .action-btn.change:hover {
          background: #e8f5e8;
          border-color: var(--primary-color, #2e7d32);
          color: var(--primary-color, #2e7d32);
        }

        .action-btn.refresh:hover {
          background: #e3f2fd;
          border-color: #2196f3;
          color: #2196f3;
        }

        .action-btn span {
          font-size: 14px;
        }

        .dropdown-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 999;
        }

        @media (max-width: 480px) {
          .location-dropdown {
            min-width: 260px;
            left: 50%;
            transform: translateX(-50%);
          }

          .location-city {
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default LocationHeader;
