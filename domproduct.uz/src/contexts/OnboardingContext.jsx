import React, { createContext, useContext, useState, useEffect } from 'react';
import { OnboardingStorage } from '../utils/OnboardingStorage';

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Component mount bo'lganda onboarding holatini tekshirish
  useEffect(() => {
    const checkOnboardingStatus = () => {
      const isOnboardingCompleted = OnboardingStorage.isCompleted();
      
      // Onboarding tugallanmagan bo'lsa ko'rsatish
      if (!isOnboardingCompleted) {
        setTimeout(() => {
          setIsOnboardingVisible(true);
        }, 1000); // Splash screen tugagandan keyin
      }
    };

    checkOnboardingStatus();
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
    }, 600); // Animatsiya vaqtini uzaytirdik
  };

  // Oldingi stepga qaytish
  const previousStep = () => {
    if (isAnimating || currentStep === 0) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev - 1);
      setIsAnimating(false);
    }, 600); // Animatsiya vaqtini uzaytirdik
  };

  // Ma'lum stepga o'tish
  const goToStep = (stepIndex) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(stepIndex);
      setIsAnimating(false);
    }, 600); // Animatsiya vaqtini uzaytirdik
  };

  // Onboarding'ni yakunlash
  const completeOnboarding = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // LocalStorage'ga saqlash
    OnboardingStorage.markCompleted();
    
    // Onboarding'ni yashirish
    setTimeout(() => {
      setIsOnboardingVisible(false);
      setCurrentStep(0);
      setIsAnimating(false);
    }, 600); // Animatsiya vaqtini uzaytirdik
  };

  // Onboarding'ni o'tkazib yuborish
  const skipOnboarding = () => {
    completeOnboarding();
  };

  const value = {
    isOnboardingVisible,
    currentStep,
    isAnimating,
    totalSteps: 6, // Language, Welcome, Products, Delivery, Payment, Location
    startOnboarding,
    nextStep,
    previousStep,
    goToStep,
    completeOnboarding,
    skipOnboarding,
    // Utility properties
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === 5 // 6 steps (0-5)
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Hook onboarding context'ini ishlatish uchun
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

export default OnboardingContext;
