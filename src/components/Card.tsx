import React from 'react';
import { motion } from 'framer-motion';

// Type definitions for Card component
export interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Optional click handler for interactive cards */
  onClick?: () => void;
  /** Card variant for different use cases */
  variant?: 'default' | 'outfit' | 'product' | 'brand';
  /** Disabled state for interactive cards */
  disabled?: boolean;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  variant = 'default',
  disabled = false,
  'aria-label': ariaLabel,
}) => {
  // Base styles shared across all variants
  const baseStyles = `
    bg-[#FAF3E0] rounded-2xl shadow-lg
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-[#B7410E] focus:ring-offset-2
    ${onClick ? 'cursor-pointer hover:shadow-xl' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  // Variant-specific styles
  const variantStyles = {
    default: 'border border-[#8B5E3C]/20',
    outfit: 'border border-[#B7410E]/30 hover:border-[#B7410E]/50',
    product: 'border border-[#D4AF37]/30 hover:border-[#D4AF37]/50',
    brand: 'border border-[#8B5E3C]/30 hover:border-[#8B5E3C]/50',
  };

  // Padding styles based on variant
  const paddingStyles = {
    default: 'p-6',
    outfit: 'p-4',
    product: 'p-6',
    brand: 'p-8',
  };

  // Combine all styles
  const cardStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${paddingStyles[variant]}
    ${className}
  `.trim();

  // Render as motion.div for animations if clickable, otherwise regular div
  if (onClick) {
    return (
      <motion.div
        className={cardStyles}
        onClick={disabled ? undefined : onClick}
        aria-label={ariaLabel}
        role="button"
        tabIndex={!disabled ? 0 : undefined}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
          }
        }}
        whileHover={{ 
          scale: disabled ? 1 : 1.02,
          y: disabled ? 0 : -4
        }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardStyles} aria-label={ariaLabel}>
      {children}
    </div>
  );
};

export default Card;
