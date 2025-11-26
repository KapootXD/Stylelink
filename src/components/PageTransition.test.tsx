import React from 'react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { act, render, screen } from '../test/test-utils';
import PageTransition, {
  createAnimationVariants,
  useReducedMotion,
} from './PageTransition';

let motionDivProps: any = null;

// Simplify framer-motion so we can inspect the props the component passes through.
vi.mock('framer-motion', () => {
  const React = require('react');
  const MockMotionDiv = React.forwardRef((props: any, ref: any) => {
    motionDivProps = props;
    return <div ref={ref} data-testid="motion-div" {...props} />;
  });

  return {
    motion: { div: MockMotionDiv },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

afterEach(() => {
  motionDivProps = null;
  vi.restoreAllMocks();
});

describe('PageTransition', () => {
  it('renders children and forwards the correct variant props', () => {
    render(
      <PageTransition pageKey="page-1" variant="slideLeft" duration={0.5} delay={0.1}>
        <div>Content</div>
      </PageTransition>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(motionDivProps).toBeTruthy();
    expect(motionDivProps.variants.initial).toEqual({ opacity: 0, x: 60 });
    expect(motionDivProps.variants.animate.transition).toMatchObject({
      duration: 0.5,
      delay: 0.1,
    });
  });
});

describe('useReducedMotion', () => {
  const TestComponent = () => {
    const prefersReducedMotion = useReducedMotion();
    return <span>{prefersReducedMotion ? 'reduced' : 'normal'}</span>;
  };

  it('respects the prefers-reduced-motion media query and cleans up listeners', () => {
    let changeHandler: ((event: MediaQueryListEvent) => void) | null = null;
    const addEventListener = vi.fn((_, cb) => {
      changeHandler = cb;
    });
    const removeEventListener = vi.fn();

    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener,
      removeEventListener,
      dispatchEvent: vi.fn(),
    }) as MediaQueryList);

    const { unmount, getByText } = render(<TestComponent />);

    expect(getByText('reduced')).toBeInTheDocument();
    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

    act(() => {
      changeHandler?.({ matches: false } as MediaQueryListEvent);
    });
    expect(getByText('normal')).toBeInTheDocument();

    unmount();
    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});

describe('createAnimationVariants', () => {
  it('returns reduced-motion friendly variants when requested', () => {
    const baseVariants = {
      initial: { opacity: 0, x: 10 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -10 },
    };

    const reduced = createAnimationVariants(baseVariants, true);
    expect(reduced).toEqual({
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.3 } },
      exit: { opacity: 0, transition: { duration: 0.2 } },
    });

    const normal = createAnimationVariants(baseVariants, false);
    expect(normal).toBe(baseVariants);
  });
});
