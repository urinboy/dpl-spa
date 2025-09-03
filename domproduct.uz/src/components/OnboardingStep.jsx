import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

const OnboardingStep = ({ 
  step, 
  isActive, 
  isAnimating,
  onNext,
  onPrevious,
  onSkip,
  onComplete,
  isFirst,
  isLast,
  // Location props
  locationLoading,
  locationData,
  locationError,
  onLocationPermission
}) => {
  const { t, i18n } = useTranslation();
  const { languages, changeLanguage } = useLanguage();

  if (!isActive) return null;

  return (
    <div className={`onboarding-step ${isAnimating ? 'fade-out' : 'fade-in'}`}>
      <div className="onboarding-content">
        
        {/* Skip tugmasi (oxirgi bosqichda ko'rsatilmaydi) */}
        {!isLast && (
          <button 
            className="onboarding-skip"
            onClick={onSkip}
          >
            {t('skip')}
          </button>
        )}

        {/* Step rasm yoki animatsiya */}
        <div className="onboarding-image">
          <div className={`onboarding-illustration onboarding-step-${step.id}`}>
            {step.icon && <i className={step.icon}></i>}
            {step.image && <img src={step.image} alt={step.title} />}
          </div>
        </div>

        {/* Step mazmuni */}
        <div className="onboarding-text">
          <h2 className="onboarding-title">{t(step.title)}</h2>
          <p className="onboarding-description">{t(step.description)}</p>
          
          {/* Language Step uchun maxsus UI */}
          {step.isLanguageStep && (
            <div className="language-selection">
              <div className="language-options">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`language-option ${i18n.language === lang.code ? 'selected' : ''}`}
                    onClick={() => changeLanguage(lang.code)}
                  >
                    <span className="language-flag">{lang.flag}</span>
                    <div className="language-info">
                      <span className="language-name">{lang.name}</span>
                      <span className="language-native">{lang.nativeName}</span>
                    </div>
                    {i18n.language === lang.code && (
                      <i className="fas fa-check language-check"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Welcome + Location Step uchun maxsus UI */}
          {step.isWelcomeLocationStep && (
            <div className="welcome-location-container">
              {/* Location detection */}
              <div className={`location-detection ${locationData ? 'has-location' : ''}`}>
                <h3 className="location-title">{t('location_detection_title')}</h3>
                <p className="location-subtitle">{t('location_detection_subtitle')}</p>
                
                <div className="location-action-center">
                  {!locationData && !locationLoading && !locationError && (
                    <button 
                      className="location-btn location-btn-primary"
                      onClick={onLocationPermission}
                    >
                      <i className="fas fa-map-marker-alt"></i>
                      {t('detect_location')}
                    </button>
                  )}
                  
                  {locationLoading && (
                    <div className="location-loading">
                      <div className="location-spinner"></div>
                      <p>{t('detecting_location')}</p>
                    </div>
                  )}
                  
                  {locationError && (
                    <div className="location-error">
                      <i className="fas fa-exclamation-triangle"></i>
                      <p>{locationError}</p>
                      <button 
                        className="location-btn location-btn-retry"
                        onClick={onLocationPermission}
                      >
                        <i className="fas fa-redo"></i>
                        {t('try_again')}
                      </button>
                    </div>
                  )}
                  
                  {locationData && (
                    <div className="location-success-card">
                      <div className="location-success-content">
                        <div className="location-info-section">
                          <span className="location-pin">📍</span>
                          <div className="location-details">
                            <div className="location-main-text">
                              {locationData.address.city}
                              {locationData.address.district && `, ${locationData.address.district}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Welcome Features - Location success dan keyin ko'rinadi */}
                {locationData && (
                  <div className="welcome-content">
                    <div className="welcome-features">
                      <div className="welcome-feature">
                        <i className="fas fa-shopping-bag"></i>
                        <span>{t('quality_products')}</span>
                      </div>
                      <div className="welcome-feature">
                        <i className="fas fa-truck"></i>
                        <span>{t('fast_delivery')}</span>
                      </div>
                      <div className="welcome-feature">
                        <i className="fas fa-shield-alt"></i>
                        <span>{t('secure_payment')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Features Step uchun ixcham UI */}
          {step.isFeaturesStep && (
            <div className="features-compact-container">
              <div className="features-compact-grid">
                {/* Products */}
                <div className="feature-compact-card">
                  <div className="feature-compact-icon">
                    <i className="fas fa-shopping-bag"></i>
                  </div>
                  <div className="feature-compact-text">
                    <h4>{t('onboarding_products_title')}</h4>
                    <p>{t('products_short_desc')}</p>
                  </div>
                </div>

                {/* Delivery */}
                <div className="feature-compact-card">
                  <div className="feature-compact-icon">
                    <i className="fas fa-truck"></i>
                  </div>
                  <div className="feature-compact-text">
                    <h4>{t('onboarding_delivery_title')}</h4>
                    <p>{t('delivery_short_desc')}</p>
                  </div>
                </div>

                {/* Payment */}
                <div className="feature-compact-card">
                  <div className="feature-compact-icon">
                    <i className="fas fa-credit-card"></i>
                  </div>
                  <div className="feature-compact-text">
                    <h4>{t('onboarding_payment_title')}</h4>
                    <p>{t('payment_short_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation tugmalari */}
        <div className="onboarding-navigation">
          {!isFirst && (
            <button 
              className="onboarding-btn onboarding-btn-secondary"
              onClick={onPrevious}
              disabled={isAnimating || locationLoading}
            >
              <i className="fas fa-arrow-left"></i>
              {t('previous')}
            </button>
          )}

          {!isLast ? (
            <button 
              className="onboarding-btn onboarding-btn-primary"
              onClick={onNext}
              disabled={isAnimating || (step.isWelcomeLocationStep && !locationData)}
            >
              {t('next')}
              <i className="fas fa-arrow-right"></i>
            </button>
          ) : (
            <button 
              className="onboarding-btn onboarding-btn-success"
              onClick={onComplete}
              disabled={isAnimating}
            >
              {t('get_started')}
              <i className="fas fa-check"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};export default OnboardingStep;
