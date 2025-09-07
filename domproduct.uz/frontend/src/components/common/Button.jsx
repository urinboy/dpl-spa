/**
 * 🔘 Button Component
 * Professional, accessible button component with multiple variants
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { LoadingSpinner } from './Loading';
import './Button.css';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  type = 'button',
  loadingText = 'Loading...',
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  // Build class names
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn--primary',
    secondary: 'btn--secondary',
    outline: 'btn--outline',
    ghost: 'btn--ghost',
    danger: 'btn--danger',
    success: 'btn--success',
    warning: 'btn--warning',
    info: 'btn--info'
  };
  const sizeClasses = {
    sm: 'btn--sm',
    md: 'btn--md',
    lg: 'btn--lg',
    xl: 'btn--xl'
  };

  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'btn--full-width',
    loading && 'btn--loading',
    isDisabled && 'btn--disabled',
    icon && 'btn--with-icon',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={isDisabled}
      type={type}
      aria-busy={loading}
      aria-label={ariaLabel || (loading ? loadingText : undefined)}
      {...props}
    >
      {loading && (
        <LoadingSpinner
          size="sm"
          color="inherit"
          className="btn__spinner"
          aria-label="Loading"
        />
      )}

      {!loading && icon && iconPosition === 'left' && (
        <span className="btn__icon btn__icon--left" aria-hidden="true">
          {icon}
        </span>
      )}

      <span className={`btn__content ${loading ? 'btn__content--hidden' : ''}`}>
        {loading ? loadingText : children}
      </span>

      {!loading && icon && iconPosition === 'right' && (
        <span className="btn__icon btn__icon--right" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'primary', 'secondary', 'outline', 'ghost',
    'danger', 'success', 'warning', 'info'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  loadingText: PropTypes.string,
  'aria-label': PropTypes.string,
};

/**
 * Icon Button Component
 * Square button for icons only
 */
export const IconButton = forwardRef(({
  children,
  variant = 'ghost',
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const buttonClasses = [
    'btn',
    'btn--icon-only',
    `btn--${variant}`,
    `btn--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      className={buttonClasses}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
});

IconButton.displayName = 'IconButton';

IconButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'primary', 'secondary', 'outline', 'ghost',
    'danger', 'success', 'warning', 'info'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  'aria-label': PropTypes.string.isRequired,
};

/**
 * Button Group Component
 * Groups related buttons together
 */
export const ButtonGroup = ({
  children,
  orientation = 'horizontal',
  size = 'md',
  variant = 'primary',
  className = '',
  ...props
}) => {
  const groupClasses = [
    'btn-group',
    `btn-group--${orientation}`,
    `btn-group--${size}`,
    className
  ].filter(Boolean).join(' ');

  // Clone children and add group styling
  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child) && child.type === Button) {
      return React.cloneElement(child, {
        variant: child.props.variant || variant,
        size: child.props.size || size,
        className: `${child.props.className || ''} btn-group__item`.trim()
      });
    }
    return child;
  });

  return (
    <div className={groupClasses} role="group" {...props}>
      {enhancedChildren}
    </div>
  );
};

ButtonGroup.propTypes = {
  children: PropTypes.node.isRequired,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf([
    'primary', 'secondary', 'outline', 'ghost',
    'danger', 'success', 'warning', 'info'
  ]),
  className: PropTypes.string,
};

export default Button;
