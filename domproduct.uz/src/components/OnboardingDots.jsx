import React from 'react';

const OnboardingDots = ({ steps, currentStep, onDotClick }) => {
  return (
    <div className="onboarding-dots">
      {steps.map((_, index) => (
        <button
          key={index}
          className={`onboarding-dot ${
            index === currentStep ? 'active' : ''
          } ${index < currentStep ? 'completed' : ''}`}
          onClick={() => onDotClick(index)}
          aria-label={`Go to step ${index + 1}`}
        >
          {index < currentStep && <i className="fas fa-check"></i>}
        </button>
      ))}
    </div>
  );
};

export default OnboardingDots;
