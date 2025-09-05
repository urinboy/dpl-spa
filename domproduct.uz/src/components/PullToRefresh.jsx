import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const PullToRefresh = ({ onRefresh, children, threshold = 80 }) => {
  const { t } = useTranslation();
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let touchStartY = 0;
    let touchMoveY = 0;

    const handleTouchStart = (e) => {
      // Faqat sahifa yuqorisida bo'lganda ishlaydi
      if (window.scrollY === 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (window.scrollY > 0) {
        return;
      }
      
      touchMoveY = e.touches[0].clientY;
      const diff = touchMoveY - touchStartY;

      // Faqat pastga swipe qilganda
      if (diff > 0 && window.scrollY === 0) {
        e.preventDefault(); // Scrollni to'xtatamiz
        
        const distance = Math.min(diff * 0.5, threshold * 1.5); // Qarshilik qo'shamiz
        setPullDistance(distance);
        
        if (distance > threshold) {
          setIsPulling(true);
        } else {
          setIsPulling(false);
        }
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance > threshold && !isRefreshing) {
        setIsRefreshing(true);
        setIsPulling(false);
        
        // Refresh funksiyasini ishga tushiramiz
        if (onRefresh) {
          Promise.resolve(onRefresh()).finally(() => {
            setTimeout(() => {
              setIsRefreshing(false);
              setPullDistance(0);
            }, 1000); // Minimum 1 soniya ko'rsatish
          });
        }
      } else {
        // Agar threshold ga yetmagan bo'lsa, qaytaramiz
        setPullDistance(0);
        setIsPulling(false);
      }
    };

    // Event listenerlarni qo'shamiz
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  const getRefreshText = () => {
    if (isRefreshing) {
      return t('refreshing');
    }
    if (isPulling) {
      return t('release_to_refresh');
    }
    return t('pull_to_refresh');
  };

  const getIconRotation = () => {
    if (isRefreshing) {
      return 'rotate(360deg)';
    }
    if (isPulling) {
      return 'rotate(180deg)';
    }
    return 'rotate(0deg)';
  };

  return (
    <div ref={containerRef} className="pull-to-refresh-container">
      {/* Pull to Refresh indikatori */}
      <div 
        className="pull-to-refresh-indicator"
        style={{
          transform: `translateY(${Math.max(0, pullDistance - threshold)}px)`,
          opacity: pullDistance > 20 ? 1 : 0,
        }}
      >
        <div className="refresh-content">
          <div 
            className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`}
            style={{
              transform: getIconRotation(),
            }}
          >
            <i className="fas fa-sync-alt"></i>
          </div>
          <span className="refresh-text">{getRefreshText()}</span>
        </div>
      </div>
      
      {/* Asosiy kontent */}
      <div 
        className="pull-to-refresh-content"
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: pullDistance === 0 ? 'transform 0.3s ease' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
