import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOnboarding } from '../contexts/OnboardingContext';
import { useLanguage } from '../contexts/LanguageContext';
import OnboardingStep from './OnboardingStep';
import OnboardingDots from './OnboardingDots';

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

  // Onboarding bosqichlari
  const steps = [
    {
      id: 'welcome',
      title: 'onboarding_welcome_title',
      description: 'onboarding_welcome_description',
      icon: 'fas fa-home',
      image: '/logos/green.png'
    },
    {
      id: 'products',
      title: 'onboarding_products_title',
      description: 'onboarding_products_description',
      icon: 'fas fa-shopping-bag',
    },
    {
      id: 'delivery',
      title: 'onboarding_delivery_title',
      description: 'onboarding_delivery_description',
      icon: 'fas fa-truck',
    },
    {
      id: 'payment',
      title: 'onboarding_payment_title',
      description: 'onboarding_payment_description',
      icon: 'fas fa-credit-card',
    },
    {
      id: 'language',
      title: 'onboarding_language_title',
      description: 'onboarding_language_description',
      icon: 'fas fa-globe',
      isLanguageStep: true
    }
  ];

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
        />

        {/* Maxsus til tanlash bosqichi */}
        {currentStepData.isLanguageStep && (
          <div className="onboarding-language-selector">
            <div className="language-options">
              {languages.filter(lang => lang.is_active).map(lang => (
                <button
                  key={lang.code}
                  className="language-option"
                  onClick={() => changeLanguage(lang.code)}
                >
                  <span className="language-flag">{lang.flag}</span>
                  <span className="language-name">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation dots */}
        <OnboardingDots
          steps={steps}
          currentStep={currentStep}
          onDotClick={goToStep}
        />

        {/* Step indicator */}
        <div className="onboarding-step-indicator">
          <span className="step-number">{currentStep + 1}</span>
          <span className="step-divider">/</span>
          <span className="step-total">{steps.length}</span>
        </div>
      </div>
    </div>
  );
};

export default OnboardingOverlay;
