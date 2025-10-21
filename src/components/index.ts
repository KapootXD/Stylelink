// Export all UI components for easy importing
export { default as Button } from './Button';
export type { ButtonProps } from './Button';

export { default as Card } from './Card';
export type { CardProps } from './Card';

export { default as Input } from './Input';
export type { InputProps } from './Input';

export { default as LoadingSpinner, LoadingDots, CircularProgress } from './LoadingSpinner';
export type { LoadingSpinnerProps } from './LoadingSpinner';

export { default as Modal, ConfirmModal } from './Modal';
export type { ModalProps } from './Modal';

export { default as PageTransition, useReducedMotion, createAnimationVariants } from './PageTransition';
export type { PageTransitionProps } from './PageTransition';

// Re-export existing components
export { default as Footer } from './Footer';
export { default as Navbar } from './Navbar';
