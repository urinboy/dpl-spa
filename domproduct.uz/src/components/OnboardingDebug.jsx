import React from 'react';
import { OnboardingStorage } from '../utils/OnboardingStorage';
import { useOnboarding } from '../contexts/OnboardingContext';

const OnboardingDebug = () => {
  const { startOnboarding } = useOnboarding();

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const handleResetOnboarding = () => {
    OnboardingStorage.reset();
    window.location.reload();
  };

  const handleStartOnboarding = () => {
    startOnboarding();
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <button
        onClick={handleResetOnboarding}
        style={{
          padding: '10px 15px',
          background: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Reset Onboarding
      </button>
      <button
        onClick={handleStartOnboarding}
        style={{
          padding: '10px 15px',
          background: '#059669',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Start Onboarding
      </button>
      <div style={{
        padding: '5px 10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        borderRadius: '4px',
        fontSize: '10px',
        textAlign: 'center'
      }}>
        Completed: {OnboardingStorage.isCompleted() ? 'Yes' : 'No'}
      </div>
    </div>
  );
};

export default OnboardingDebug;
