/**
 * 🔄 Loading Component & Context
 * Professional loading system with context management
 */

import React, { useState, createContext, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import './Loading.css';

const LoadingContext = createContext();

/**
 * Loading Provider Component
 * Manages global loading state across the application
 */
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const showLoading = useCallback((text = '') => {
    setLoadingText(text);
    setLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setLoading(false);
    setLoadingText('');
  }, []);

  const value = {
    loading,
    showLoading,
    hideLoading,
    loadingText
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {loading && <LoadingOverlay text={loadingText} />}
    </LoadingContext.Provider>
  );
};

LoadingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Loading Overlay Component
 * Displays full-screen loading indicator
 */
const LoadingOverlay = ({ text }) => {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        {text && (
          <p className="loading-text" aria-label={`Loading: ${text}`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

LoadingOverlay.propTypes = {
  text: PropTypes.string,
};

/**
 * Inline Loading Spinner Component
 * For use within components
 */
export const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  'aria-label': ariaLabel = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'loading-spinner--sm',
    md: 'loading-spinner--md',
    lg: 'loading-spinner--lg',
    xl: 'loading-spinner--xl'
  };

  const colorClasses = {
    primary: 'loading-spinner--primary',
    secondary: 'loading-spinner--secondary',
    success: 'loading-spinner--success',
    danger: 'loading-spinner--danger',
    warning: 'loading-spinner--warning',
    info: 'loading-spinner--info'
  };

  return (
    <div
      className={`loading-spinner-inline ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label={ariaLabel}
    >
      <div className="spinner-circle"></div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  className: PropTypes.string,
  'aria-label': PropTypes.string,
};

/**
 * Loading Button Component
 * Button with integrated loading state
 */
export const LoadingButton = ({
  children,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  loadingText = 'Loading...',
  ...props
}) => {
  const isDisabled = disabled || loading;

  const baseClasses = 'btn loading-btn';
  const variantClasses = {
    primary: 'btn--primary',
    secondary: 'btn--secondary',
    outline: 'btn--outline',
    ghost: 'btn--ghost'
  };
  const sizeClasses = {
    sm: 'btn--sm',
    md: 'btn--md',
    lg: 'btn--lg'
  };

  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    loading && 'btn--loading',
    isDisabled && 'btn--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <LoadingSpinner
          size="sm"
          color="inherit"
          className="btn-spinner"
          aria-label="Loading"
        />
      )}
      <span className={loading ? 'btn-text--hidden' : 'btn-text'}>
        {loading ? loadingText : children}
      </span>
    </button>
  );
};

LoadingButton.propTypes = {
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  loadingText: PropTypes.string,
};

/**
 * Loading Skeleton Component
 * For content placeholders while loading
 */
export const LoadingSkeleton = ({
  width = '100%',
  height = '20px',
  className = '',
  animate = true
}) => {
  return (
    <div
      className={`loading-skeleton ${animate ? 'loading-skeleton--animated' : ''} ${className}`}
      style={{ width, height }}
      role="status"
      aria-label="Loading content..."
    />
  );
};

LoadingSkeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  animate: PropTypes.bool,
};

/**
 * Hook to use loading context
 */
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export default LoadingProvider;
