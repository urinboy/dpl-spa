import React from 'react';
import { useLocation } from '../contexts/LocationContext';

const LocationSuccessNotification = () => {
  const { location } = useLocation();

  if (!location.isDetected) return null;

  const getMethodText = () => {
    switch (location.method) {
      case 'gps': return 'GPS orqali';
      case 'ip': return 'IP manzil orqali';
      case 'manual': return 'Qo\'lda tanlangan';
      default: return '';
    }
  };

  const getMethodIcon = () => {
    switch (location.method) {
      case 'gps': return '🎯';
      case 'ip': return '🌍';
      case 'manual': return '📍';
      default: return '📍';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, #4CAF50, #45a049)',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
      zIndex: 10001,
      maxWidth: '300px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '18px' }}>{getMethodIcon()}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
            Joylashuv aniqlandi
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>
            {location.city} • {getMethodText()}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LocationSuccessNotification;
