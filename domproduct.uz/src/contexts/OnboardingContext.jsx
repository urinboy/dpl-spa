import React, { createContext, useContext, useState, useEffect } from 'react';
import { OnboardingStorage } from '../utils/OnboardingStorage';

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Component mount bo'lganda onboarding holatini tekshirish
  useEffect(() => {
    const shouldShowOnboarding = !OnboardingStorage.isCompleted();
    setIsOnboardingVisible(shouldShowOnboarding);
  }, []);

  // Onboarding'ni boshlash
  const startOnboarding = () => {
    setCurrentStep(0);
    setIsOnboardingVisible(true);
    OnboardingStorage.reset(); // Holatni tozalash
  };

  // Keyingi stepga o'tish
  const nextStep = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  // Oldingi stepga qaytish
  const previousStep = () => {
    if (isAnimating || currentStep === 0) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev - 1);
      setIsAnimating(false);
    }, 300);
  };

  // Ma'lum stepga o'tish
  const goToStep = (stepIndex) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(stepIndex);
      setIsAnimating(false);
    }, 300);
  };

  // Onboarding'ni yakunlash va GPS orqali location aniqlash
  const completeOnboarding = async () => {
    OnboardingStorage.setCompleted();
    setIsAnimating(true);
    
    // GPS orqali location ni aniqlashga harakat qilish
    try {
      if (navigator.geolocation) {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                // Location ma'lumotlarini saqlash
                const locationData = {
                  position: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  },
                  method: 'gps',
                  timestamp: Date.now(),
                  isDetected: true
                };
                
                // Reverse geocoding orqali address olish
                const address = await reverseGeocode(position.coords.latitude, position.coords.longitude);
                if (address) {
                  locationData.address = address.display_name || address.formatted_address;
                  locationData.city = address.city || address.town || address.village;
                  locationData.region = address.state || address.region;
                  locationData.country = address.country;
                }
                
                // LocalStorage ga saqlash
                localStorage.setItem('user_location', JSON.stringify(locationData));
                console.log('✅ GPS location saved during onboarding completion');
                
                resolve();
              } catch (error) {
                console.error('GPS ma\'lumotlarini saqlashda xatolik:', error);
                resolve(); // Xatolik bo'lsa ham davom etish
              }
            },
            (error) => {
              console.log('GPS ruxsat berilmadi yoki xatolik:', error.message);
              resolve(); // GPS ishlamasa ham onboarding tugashi kerak
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 600000
            }
          );
        });
      }
    } catch (error) {
      console.error('GPS aniqlashda xatolik:', error);
    }
    
    setTimeout(() => {
      setIsOnboardingVisible(false);
      setCurrentStep(0);
      setIsAnimating(false);
    }, 300);
  };

  // Reverse geocoding funksiyasi
  const reverseGeocode = async (lat, lng) => {
    try {
      // OpenStreetMap Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        return {
          display_name: data.display_name,
          city: data.address?.city || data.address?.town || data.address?.village,
          state: data.address?.state || data.address?.region,
          country: data.address?.country
        };
      }
    } catch (error) {
      console.error('Reverse geocoding xatolik:', error);
    }
    return null;
  };

  // Onboarding'ni o'tkazib yuborish
  const skipOnboarding = () => {
    completeOnboarding();
  };

  const value = {
    isOnboardingVisible,
    currentStep,
    isAnimating,
    startOnboarding,
    nextStep,
    previousStep,
    goToStep,
    completeOnboarding,
    skipOnboarding
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
