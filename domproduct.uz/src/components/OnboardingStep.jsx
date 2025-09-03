import React from 'react';
import { useTranslation } from 'react-i18next';

const OnboardingStep = ({ 
  step, 
  isActive, 
  isAnimating,
  onNext,
  onPrevious,
  onSkip,
  onComplete,
  isFirst,
  isLast
}) => {
  const { t } = useTranslation();

  if (!isActive) return null;

  return (
    <div className={`onboarding-step ${isAnimating ? 'animating' : ''}`}>
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
        </div>

        {/* Navigation tugmalari */}
        <div className="onboarding-navigation">
          {!isFirst && (
            <button 
              className="onboarding-btn onboarding-btn-secondary"
              onClick={onPrevious}
              disabled={isAnimating}
            >
              <i className="fas fa-arrow-left"></i>
              {t('previous')}
            </button>
          )}

          {!isLast ? (
            <button 
              className="onboarding-btn onboarding-btn-primary"
              onClick={onNext}
              disabled={isAnimating}
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
};

export default OnboardingStep;
