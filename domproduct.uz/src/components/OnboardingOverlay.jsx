import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOnboarding } from '../contexts/OnboardingContext';
import { useLanguage } from '../contexts/LanguageContext';
import OnboardingStep from './OnboardingStep';

const OnboardingOverlay = () => {
  const { t } = useTranslation();
  const { changeLanguage, languages } = useLanguage();
  const {
    isOnboardingVisible,
    currentStep,
    isAnimating,
    nextStep,
    previousStep,
    goToStep,
    completeOnboarding,
    skipOnboarding
  } = useOnboarding();

  // Location detection state'lari
  const [locationPermission, setLocationPermission] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Onboarding bosqichlari - yangi tuzilma
  const steps = [
    {
      id: 'language',
      title: 'onboarding_language_title',
      description: 'onboarding_language_description',
      icon: 'fas fa-globe',
      isLanguageStep: true
    },
    {
      id: 'welcome-location',
      title: 'onboarding_welcome_title',
      description: 'onboarding_welcome_description',
    //   icon: 'fas fa-home',
      isWelcomeLocationStep: true,
      image: '/logos/white.png'
    },
    {
      id: 'features',
      title: 'onboarding_features_title',
      description: 'onboarding_features_description',
      icon: 'fas fa-star',
      isFeaturesStep: true
    }
  ];

  // GPS Location Detection funksiyasi
  const handleLocationPermission = async () => {
    if (!navigator.geolocation) {
      setLocationError('GPS qo\'llab-quvvatlanmaydi');
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    try {
      // Permission request
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setLocationPermission(permission.state);
      }

      // Get location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Try multiple geocoding services to avoid CORS
            let locationInfo = null;
            
            // Try Nominatim with proper headers
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
                {
                  headers: {
                    'User-Agent': 'DomProduct.uz/1.0'
                  }
                }
              );
              
              if (response.ok) {
                const data = await response.json();
                locationInfo = {
                  type: 'gps',
                  coordinates: { latitude, longitude },
                  address: {
                    city: data.address?.city || data.address?.town || data.address?.village || 'Toshkent',
                    district: data.address?.suburb || data.address?.district || data.address?.city_district || 'Shahar markazi',
                    country: data.address?.country || 'O\'zbekiston'
                  },
                  timestamp: new Date().toISOString()
                };
              }
            } catch (nominatimError) {
              console.warn('Nominatim failed:', nominatimError);
            }
            
            // Fallback: Use coordinates to determine city
            if (!locationInfo) {
              // Simple coordinate-based city detection for Uzbekistan
              let city = 'Noma\'lum shahar';
              let district = 'Noma\'lum tuman';
              
              // Toshkent coordinates range
              if (latitude >= 41.2 && latitude <= 41.35 && longitude >= 69.1 && longitude <= 69.35) {
                city = 'Toshkent';
                district = 'Shahar markazi';
              }
              
              locationInfo = {
                type: 'gps',
                coordinates: { latitude, longitude },
                address: {
                  city,
                  district,
                  country: 'O\'zbekiston'
                },
                timestamp: new Date().toISOString()
              };
            }

            setLocationData(locationInfo);
            
            // LocalStorage ga saqlash
            localStorage.setItem('dpl_user_location', JSON.stringify(locationInfo));
            
            setLocationLoading(false);
            
            // Location aniqlangandan keyin avtomatik ravishda keyingi stepga o'tmaymiz
            // Foydalanuvchi "Next" tugmasini bosadi
            
          } catch (error) {
            console.warn('Reverse geocoding failed:', error);
            const basicLocationInfo = {
              type: 'gps',
              coordinates: { latitude, longitude },
              address: {
                city: 'Aniqlangan joylashuv',
                district: '',
                country: 'O\'zbekiston'
              },
              timestamp: new Date().toISOString()
            };
            
            setLocationData(basicLocationInfo);
            localStorage.setItem('dpl_user_location', JSON.stringify(basicLocationInfo));
            setLocationLoading(false);
          }
        },
        (error) => {
          console.error('GPS error:', error);
          setLocationLoading(false);
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError('GPS ruxsati berilmadi');
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError('Joylashuv ma\'lumoti mavjud emas');
              break;
            case error.TIMEOUT:
              setLocationError('GPS so\'rovi vaqti tugadi');
              break;
            default:
              setLocationError('GPS xatoligi yuz berdi');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000 // 5 minut
        }
      );
    } catch (error) {
      console.error('Permission error:', error);
      setLocationError('Ruxsat olishda xatolik');
      setLocationLoading(false);
    }
  };

  // Klaviatura navigatsiyasi
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!isOnboardingVisible || isAnimating) return;

      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          if (currentStep < steps.length - 1) {
            nextStep();
          } else {
            completeOnboarding();
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (currentStep > 0) {
            previousStep();
          }
          break;
        case 'Escape':
          event.preventDefault();
          skipOnboarding();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOnboardingVisible, currentStep, isAnimating, nextStep, previousStep, completeOnboarding, skipOnboarding]);

  // Touch/swipe gestures
  const [touchStartX, setTouchStartX] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent scrolling
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    // Minimum swipe distance
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next step
        if (currentStep < steps.length - 1) {
          nextStep();
        } else {
          completeOnboarding();
        }
      } else {
        // Swipe right - previous step
        if (currentStep > 0) {
          previousStep();
        }
      }
    }

    setTouchStartX(null);
  };

  if (!isOnboardingVisible) return null;

  const currentStepData = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return (
    <div 
      className="onboarding-overlay"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="onboarding-container">
        
        {/* Progress bar */}
        <div className="onboarding-progress">
          <div 
            className="onboarding-progress-bar"
            style={{ 
              width: `${((currentStep + 1) / steps.length) * 100}%` 
            }}
          ></div>
        </div>

        {/* Step content */}
        <OnboardingStep
          step={currentStepData}
          isActive={true}
          isAnimating={isAnimating}
          onNext={nextStep}
          onPrevious={previousStep}
          onSkip={skipOnboarding}
          onComplete={completeOnboarding}
          isFirst={isFirst}
          isLast={isLast}
          // Location detection props (faqat welcome-location step uchun)
          locationLoading={currentStepData.isWelcomeLocationStep ? locationLoading : false}
          locationData={currentStepData.isWelcomeLocationStep ? locationData : null}
          locationError={currentStepData.isWelcomeLocationStep ? locationError : null}
          onLocationPermission={currentStepData.isWelcomeLocationStep ? handleLocationPermission : null}
        />
      </div>
    </div>
  );
};

export default OnboardingOverlay;
