import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from './PageTransition';

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
  const prefersReducedMotion = useReducedMotion();
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

  // Animation variants that respect reduced motion
  const hoverScale = prefersReducedMotion ? 1 : (disabled ? 1 : 1.02);
  const hoverY = prefersReducedMotion ? 0 : (disabled ? 0 : -4);
  const tapScale = prefersReducedMotion ? 1 : (disabled ? 1 : 0.98);
  const transition = prefersReducedMotion 
    ? { duration: 0.2 } 
    : { type: 'spring', stiffness: 400, damping: 17 };

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
          scale: hoverScale,
          y: hoverY,
          boxShadow: disabled ? undefined : '0 20px 40px rgba(0,0,0,0.1)'
        }}
        whileTap={{ scale: tapScale }}
        transition={transition}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={cardStyles} 
      aria-label={ariaLabel}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

export default Card;
