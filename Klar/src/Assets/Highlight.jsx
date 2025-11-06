import React from 'react';
import PropTypes from 'prop-types';

// Predefined color palettes
const COLOR_PALETTES = {
  // Primary colors
  primary: {
    background: '#3b82f6',
    color: '#ffffff',
    border: '#2563eb'
  },
  secondary: {
    background: '#6b7280',
    color: '#ffffff',
    border: '#4b5563'
  },

  // Status colors
  success: {
    background: '#10b981',
    color: '#ffffff',
    border: '#059669'
  },
  warning: {
    background: '#f59e0b',
    color: '#ffffff',
    border: '#d97706'
  },
  error: {
    background: '#ef4444',
    color: '#ffffff',
    border: '#dc2626'
  },
  info: {
    background: '#06b6d4',
    color: '#ffffff',
    border: '#0891b2'
  },

  // Light variations
  lightPrimary: {
    background: '#dbeafe',
    color: '#1d4ed8',
    border: '#93c5fd'
  },
  lightSuccess: {
    background: '#d1fae5',
    color: '#065f46',
    border: '#6ee7b7'
  },
  lightWarning: {
    background: '#fef3c7',
    color: '#92400e',
    border: '#fcd34d'
  },
  lightError: {
    background: '#fee2e2',
    color: '#991b1b',
    border: '#fca5a5'
  },
  lightInfo: {
    background: '#cffafe',
    color: '#0e7490',
    border: '#67e8f9'
  },

  // Gradient styles
  gradientPurple: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    border: '#667eea'
  },
  gradientOrange: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: '#ffffff',
    border: '#f093fb'
  },
  gradientBlue: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: '#ffffff',
    border: '#4facfe'
  },

  // Dark theme
  dark: {
    background: '#1f2937',
    color: '#f9fafb',
    border: '#374151'
  },

  // Custom neutral
  neutral: {
    background: '#f3f4f6',
    color: '#374151',
    border: '#d1d5db'
  }
};

const Highlight = ({
  children,
  text,
  palette = 'primary',
  customColors,
  variant = 'filled',
  size = 'medium',
  rounded = 'medium',
  className = '',
  style = {},
  onClick,
  title,
  id,
  ...props
}) => {
  // Get colors from palette or use custom colors
  const colors = customColors || COLOR_PALETTES[palette] || COLOR_PALETTES.primary;

  // Size variants
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-base',
    xlarge: 'px-6 py-3 text-lg'
  };

  // Rounded variants
  const roundedClasses = {
    none: 'rounded-none',
    small: 'rounded-sm',
    medium: 'rounded-md',
    large: 'rounded-lg',
    full: 'rounded-full'
  };

  // Style variants
  const getVariantStyles = () => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: colors.background,
          color: colors.color,
          border: `1px solid ${colors.border || colors.background}`,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: colors.background,
          border: `2px solid ${colors.background}`,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: colors.background,
          border: 'none',
        };
      case 'subtle':
        return {
          backgroundColor: colors.background + '20', // Adding transparency
          color: colors.background,
          border: `1px solid ${colors.background}40`,
        };
      default:
        return {
          backgroundColor: colors.background,
          color: colors.color,
          border: `1px solid ${colors.border || colors.background}`,
        };
    }
  };

  const baseClasses = `
    inline-flex
    items-center
    justify-center
    font-medium
    transition-all
    duration-200
    ease-in-out
    ${sizeClasses[size]}
    ${roundedClasses[rounded]}
    ${onClick ? 'cursor-pointer hover:opacity-80 hover:scale-105' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const combinedStyles = {
    ...getVariantStyles(),
    ...style,
  };

  // Handle click events
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <span
      id={id}
      className={baseClasses}
      style={combinedStyles}
      onClick={handleClick}
      title={title}
      {...props}
    >
      {text || children}
    </span>
  );
};

Highlight.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string,
  palette: PropTypes.oneOf(Object.keys(COLOR_PALETTES)),
  customColors: PropTypes.shape({
    background: PropTypes.string,
    color: PropTypes.string,
    border: PropTypes.string,
  }),
  variant: PropTypes.oneOf(['filled', 'outlined', 'ghost', 'subtle']),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  rounded: PropTypes.oneOf(['none', 'small', 'medium', 'large', 'full']),
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  title: PropTypes.string,
  id: PropTypes.string,
};

// Export the color palettes for external use
export { COLOR_PALETTES };
export default Highlight;
