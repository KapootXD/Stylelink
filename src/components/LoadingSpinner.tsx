import React from 'react';
import { motion } from 'framer-motion';

// Type definitions for LoadingSpinner component
export interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color of the spinner */
  color?: string;
  /** Additional CSS classes */
  className?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = '#B7410E',
  className = '',
  'aria-label': ariaLabel = 'Loading...',
}) => {
  // Size-specific dimensions
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Animation variants for the spinner
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  // Container styles for centering
  const containerStyles = `
    flex items-center justify-center
    ${className}
  `;

  return (
    <div className={containerStyles} role="status" aria-label={ariaLabel}>
      <motion.div
        className={`${sizeStyles[size]} border-4 border-[#FAF3E0] border-t-[#B7410E] rounded-full`}
        style={{ borderTopColor: color }}
        variants={spinnerVariants}
        animate="animate"
        aria-hidden="true"
      />
      {/* Screen reader text */}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

// Alternative spinner with pulsing dots animation
export const LoadingDots: React.FC<Omit<LoadingSpinnerProps, 'size'> & { size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md',
  color = '#B7410E',
  className = '',
  'aria-label': ariaLabel = 'Loading...',
}) => {
  // Size-specific dot dimensions
  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  // Animation variants for dots
  const dotVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Staggered animation for multiple dots
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const containerStyles = `
    flex items-center justify-center gap-2
    ${className}
  `;

  return (
    <div className={containerStyles} role="status" aria-label={ariaLabel}>
      <motion.div
        variants={containerVariants}
        animate="animate"
        className="flex gap-2"
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`${dotSizes[size]} rounded-full`}
            style={{ backgroundColor: color }}
            variants={dotVariants}
            aria-hidden="true"
          />
        ))}
      </motion.div>
      {/* Screen reader text */}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

// Circular progress spinner with percentage
export const CircularProgress: React.FC<{
  progress: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  'aria-label'?: string;
}> = ({
  progress,
  size = 'md',
  color = '#B7410E',
  className = '',
  'aria-label': ariaLabel,
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const strokeWidth = {
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  };

  const radius = {
    sm: 14,
    md: 20,
    lg: 26,
    xl: 32,
  };

  const circumference = 2 * Math.PI * radius[size];
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const containerStyles = `
    flex items-center justify-center relative
    ${className}
  `;

  return (
    <div className={containerStyles} role="progressbar" aria-label={ariaLabel} aria-valuenow={progress}>
      <svg className={`${sizeStyles[size]} transform -rotate-90`} viewBox={`0 0 ${radius[size] * 2 + strokeWidth[size]} ${radius[size] * 2 + strokeWidth[size]}`}>
        {/* Background circle */}
        <circle
          cx={radius[size] + strokeWidth[size] / 2}
          cy={radius[size] + strokeWidth[size] / 2}
          r={radius[size]}
          stroke="#FAF3E0"
          strokeWidth={strokeWidth[size]}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={radius[size] + strokeWidth[size] / 2}
          cy={radius[size] + strokeWidth[size] / 2}
          r={radius[size]}
          stroke={color}
          strokeWidth={strokeWidth[size]}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </svg>
      {/* Progress text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-[#2D2D2D]">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
