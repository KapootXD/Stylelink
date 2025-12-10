import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from './PageTransition';

// Type definitions for Button component
export interface ButtonProps {
  /** Button content */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: 'primary' | 'secondary';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
}) => {
  const prefersReducedMotion = useReducedMotion();
  // Base styles shared across all variants
  const baseStyles = `
    inline-flex items-center justify-center
    font-semibold rounded-full
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    transform hover:scale-105 active:scale-95
  `;

  // Variant-specific styles
  const variantStyles = {
    primary: `
      bg-[#D4AF37] hover:bg-[#B8860B] 
      text-[#2D2D2D] 
      focus:ring-[#D4AF37]
      shadow-lg hover:shadow-xl
    `,
    secondary: `
      border-2 border-[#B7410E] 
      bg-transparent hover:bg-[#B7410E] 
      text-[#B7410E] hover:text-white
      focus:ring-[#B7410E]
    `,
  };

  // Size-specific styles
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  // Combine all styles
  const buttonStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.trim();

  // Animation variants that respect reduced motion
  const hoverScale = prefersReducedMotion ? 1 : (disabled ? 1 : 1.05);
  const tapScale = prefersReducedMotion ? 1 : (disabled ? 1 : 0.95);
  const transition = prefersReducedMotion 
    ? { duration: 0.2 } 
    : { type: 'spring', stiffness: 400, damping: 17 };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonStyles}
      aria-label={ariaLabel}
      whileHover={{ 
        scale: hoverScale,
        boxShadow: disabled ? undefined : '0 10px 25px rgba(0,0,0,0.15)'
      }}
      whileTap={{ scale: tapScale }}
      transition={transition}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
