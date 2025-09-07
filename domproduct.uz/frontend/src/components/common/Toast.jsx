/**
 * 🍞 Toast Notification System
 * Professional toast notifications with animations and accessibility
 */

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import './Toast.css';

// Utility functions
const generateId = (prefix = 'toast') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const ToastContext = createContext();

/**
 * Toast Provider Component
 * Manages global toast notifications
 */
export const ToastProvider = ({ children, maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, options = {}) => {
    const {
      type = 'info',
      duration = 4000,
      persistent = false,
      action = null,
      position = 'top-right'
    } = options;

    const id = generateId();
    const newToast = {
      id,
      message,
      type,
      duration,
      persistent,
      action,
      position,
      timestamp: Date.now()
    };

    setToasts(prevToasts => {
      const updatedToasts = [newToast, ...prevToasts];
      // Limit number of toasts
      return updatedToasts.slice(0, maxToasts);
    });

    return id; // Return ID for manual dismissal
  }, [maxToasts]);

  const dismissToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message, options = {}) => {
    return showToast(message, { ...options, type: 'success' });
  }, [showToast]);

  const showError = useCallback((message, options = {}) => {
    return showToast(message, { ...options, type: 'error', duration: 6000 });
  }, [showToast]);

  const showWarning = useCallback((message, options = {}) => {
    return showToast(message, { ...options, type: 'warning' });
  }, [showToast]);

  const showInfo = useCallback((message, options = {}) => {
    return showToast(message, { ...options, type: 'info' });
  }, [showToast]);

  const value = {
    toasts,
    showToast,
    dismissToast,
    dismissAll,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
  maxToasts: PropTypes.number,
};

/**
 * Toast Container Component
 * Renders toast notifications in different positions
 */
const ToastContainer = ({ toasts, onDismiss }) => {
  // Group toasts by position
  const toastGroups = toasts.reduce((groups, toast) => {
    const position = toast.position || 'top-right';
    if (!groups[position]) {
      groups[position] = [];
    }
    groups[position].push(toast);
    return groups;
  }, {});

  return (
    <>
      {Object.entries(toastGroups).map(([position, positionToasts]) => (
        <div key={position} className={`toast-container toast-container--${position}`}>
          {positionToasts.map(toast => (
            <ToastItem key={toast.id} {...toast} onDismiss={onDismiss} />
          ))}
        </div>
      ))}
    </>
  );
};

ToastContainer.propTypes = {
  toasts: PropTypes.array.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

/**
 * Individual Toast Item Component
 */
const ToastItem = ({
  id,
  message,
  type,
  duration,
  persistent,
  action,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    // Auto dismiss (if not persistent)
    let dismissTimer;
    if (!persistent && duration > 0) {
      dismissTimer = setTimeout(() => {
        handleDismiss();
      }, duration);
    }

    return () => {
      clearTimeout(showTimer);
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [duration, persistent]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(id);
    }, 300); // Match animation duration
  };

  const handleAction = () => {
    if (action && action.handler) {
      action.handler();
    }
    handleDismiss();
  };

  const toastClasses = [
    'toast',
    `toast--${type}`,
    isVisible && 'toast--visible',
    isExiting && 'toast--exiting'
  ].filter(Boolean).join(' ');

  // Icon mapping
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div
      className={toastClasses}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="toast__content">
        <div className="toast__icon" aria-hidden="true">
          {icons[type] || icons.info}
        </div>

        <div className="toast__message">
          {typeof message === 'string' ? (
            <span>{message}</span>
          ) : (
            message
          )}
        </div>

        {action && (
          <button
            className="toast__action"
            onClick={handleAction}
            type="button"
          >
            {action.label}
          </button>
        )}

        {!persistent && (
          <button
            className="toast__close"
            onClick={handleDismiss}
            type="button"
            aria-label="Close notification"
          >
            ✕
          </button>
        )}
      </div>

      {!persistent && duration > 0 && (
        <div
          className="toast__progress"
          style={{
            animationDuration: `${duration}ms`,
            animationPlayState: isExiting ? 'paused' : 'running'
          }}
        />
      )}
    </div>
  );
};

ToastItem.propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
  duration: PropTypes.number,
  persistent: PropTypes.bool,
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    handler: PropTypes.func.isRequired,
  }),
  onDismiss: PropTypes.func.isRequired,
};

/**
 * Hook to use toast notifications
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * Imperative Toast API (for use outside React components)
 */
let toastApi = null;

export const setToastApi = (api) => {
  toastApi = api;
};

export const toast = {
  show: (message, options) => toastApi?.showToast(message, options),
  success: (message, options) => toastApi?.showSuccess(message, options),
  error: (message, options) => toastApi?.showError(message, options),
  warning: (message, options) => toastApi?.showWarning(message, options),
  info: (message, options) => toastApi?.showInfo(message, options),
  dismiss: (id) => toastApi?.dismissToast(id),
  dismissAll: () => toastApi?.dismissAll(),
};

export default ToastProvider;
