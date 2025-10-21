import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Type definitions for Modal component
export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to call when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Modal size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Whether clicking outside closes the modal */
  closeOnOverlayClick?: boolean;
  /** Whether pressing ESC closes the modal */
  closeOnEscape?: boolean;
  /** Additional CSS classes for modal content */
  className?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);
  const [currentFocusIndex, setCurrentFocusIndex] = useState(0);

  // Size-specific styles
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Get all focusable elements within the modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      setFocusableElements(Array.from(focusable));
      setCurrentFocusIndex(0);
    }
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen && focusableElements.length > 0) {
      focusableElements[currentFocusIndex]?.focus();
    }
  }, [isOpen, focusableElements, currentFocusIndex]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  // Handle tab navigation within modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      if (e.shiftKey) {
        // Shift + Tab (go backwards)
        setCurrentFocusIndex(prev => 
          prev === 0 ? focusableElements.length - 1 : prev - 1
        );
      } else {
        // Tab (go forwards)
        setCurrentFocusIndex(prev => 
          prev === focusableElements.length - 1 ? 0 : prev + 1
        );
      }
    }
  };

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-label={ariaLabel}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            className={`
              relative bg-white rounded-2xl shadow-2xl w-full
              ${sizeStyles[size]}
              ${className}
            `}
            variants={modalVariants}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-[#8B5E3C]/20">
                {title && (
                  <h2 
                    id="modal-title"
                    className="text-xl font-semibold text-[#2D2D2D]"
                  >
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <motion.button
                    onClick={onClose}
                    className="
                      p-2 rounded-full hover:bg-[#FAF3E0] 
                      text-[#2D2D2D]/60 hover:text-[#2D2D2D]
                      transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-[#B7410E] focus:ring-offset-2
                    "
                    aria-label="Close modal"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            )}
            
            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Convenience components for common modal patterns
export const ConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
}) => {
  const variantStyles = {
    danger: 'bg-[#B7410E] hover:bg-[#A0350C]',
    warning: 'bg-[#D4AF37] hover:bg-[#B8860B] text-[#2D2D2D]',
    info: 'bg-[#8B5E3C] hover:bg-[#7A5235]',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <p className="text-[#2D2D2D]/80 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="
            px-4 py-2 border border-[#8B5E3C]/30 rounded-lg
            text-[#2D2D2D] hover:bg-[#FAF3E0]
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-[#B7410E] focus:ring-offset-2
          "
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`
            px-4 py-2 rounded-lg text-white font-semibold
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${variantStyles[variant]}
            ${variant === 'warning' ? 'focus:ring-[#D4AF37]' : 'focus:ring-[#B7410E]'}
          `}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default Modal;
