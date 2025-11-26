import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Type definitions for PageTransition component
export interface PageTransitionProps {
  /** Page content */
  children: React.ReactNode;
  /** Unique key for the page */
  pageKey: string;
  /** Animation variant */
  variant?: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight';
  /** Animation duration */
  duration?: number;
  /** Delay before animation starts */
  delay?: number;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  pageKey,
  variant = 'fade',
  duration = 0.6,
  delay = 0,
}) => {
  // Animation variants
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { 
        opacity: 1,
        transition: { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }
      },
      exit: { 
        opacity: 0,
        transition: { duration: duration * 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
      },
    },
    slideUp: {
      initial: { opacity: 0, y: 60 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }
      },
      exit: { 
        opacity: 0, 
        y: -30,
        transition: { duration: duration * 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
      },
    },
    slideDown: {
      initial: { opacity: 0, y: -60 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }
      },
      exit: { 
        opacity: 0, 
        y: 30,
        transition: { duration: duration * 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
      },
    },
    slideLeft: {
      initial: { opacity: 0, x: 60 },
      animate: { 
        opacity: 1, 
        x: 0,
        transition: { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }
      },
      exit: { 
        opacity: 0, 
        x: -30,
        transition: { duration: duration * 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
      },
    },
    slideRight: {
      initial: { opacity: 0, x: -60 },
      animate: { 
        opacity: 1, 
        x: 0,
        transition: { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }
      },
      exit: { 
        opacity: 0, 
        x: 30,
        transition: { duration: duration * 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        variants={variants[variant]}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Hook for reduced motion preference
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Animation variants that respect reduced motion
type AnimationVariants = {
  initial: Record<string, unknown>;
  animate: Record<string, unknown>;
  exit: Record<string, unknown>;
};

export const createAnimationVariants = (
  baseVariants: AnimationVariants,
  reducedMotion: boolean
) => {
  if (reducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.3 } },
      exit: { opacity: 0, transition: { duration: 0.2 } },
    };
  }
  return baseVariants;
};

export default PageTransition;
