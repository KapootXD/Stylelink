import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

// Type definitions for Input component
export interface InputProps {
  /** Input label */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  /** Placeholder text */
  placeholder?: string;
  /** Input value */
  value?: string;
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Blur handler */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Focus handler */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Required field indicator */
  required?: boolean;
  /** Input name attribute */
  name?: string;
  /** Input id attribute */
  id?: string;
  /** Additional CSS classes */
  className?: string;
  /** ARIA describedby for error messages */
  'aria-describedby'?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  name,
  id,
  className = '',
  'aria-describedby': ariaDescribedby,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate unique IDs if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;

  // Base input styles
  const baseStyles = `
    w-full px-4 py-3 rounded-lg border-2
    bg-white text-[#2D2D2D] placeholder-[#2D2D2D]/60
    transition-all duration-300 ease-in-out
    focus:outline-none
    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100
  `;

  // State-specific border styles
  const getBorderStyles = () => {
    if (error) {
      return 'border-[#B7410E] focus:border-[#B7410E] focus:ring-[#B7410E]/20';
    }
    if (isFocused) {
      return 'border-[#B7410E] focus:border-[#B7410E] focus:ring-[#B7410E]/20';
    }
    return 'border-[#8B5E3C]/30 focus:border-[#B7410E] focus:ring-[#B7410E]/20';
  };

  // Combine all styles
  const inputStyles = `
    ${baseStyles}
    ${getBorderStyles()}
    ${className}
  `.trim();

  // Label styles
  const labelStyles = `
    block text-sm font-medium text-[#2D2D2D] mb-2
    ${required ? "after:content-['*'] after:text-[#B7410E] after:ml-1" : ''}
  `;

  // Error message styles
  const errorStyles = `
    text-sm text-[#B7410E] mt-2 flex items-center gap-2
  `;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <motion.label
          htmlFor={inputId}
          className={labelStyles}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}

      {/* Input Field */}
      <motion.input
        ref={inputRef}
        id={inputId}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        required={required}
        className={inputStyles}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId || ariaDescribedby}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        whileFocus={{ scale: 1.01 }}
      />

      {/* Error Message */}
      {error && (
        <motion.div
          id={errorId}
          className={errorStyles}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          role="alert"
          aria-live="polite"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default Input;
