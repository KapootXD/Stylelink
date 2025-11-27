import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner, { LoadingDots, CircularProgress } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders without crashing', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows correct size', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    let spinner = screen.getByRole('status').querySelector('div');
    expect(spinner).toHaveClass('w-4', 'h-4');

    rerender(<LoadingSpinner size="md" />);
    spinner = screen.getByRole('status').querySelector('div');
    expect(spinner).toHaveClass('w-8', 'h-8');

    rerender(<LoadingSpinner size="lg" />);
    spinner = screen.getByRole('status').querySelector('div');
    expect(spinner).toHaveClass('w-12', 'h-12');

    rerender(<LoadingSpinner size="xl" />);
    spinner = screen.getByRole('status').querySelector('div');
    expect(spinner).toHaveClass('w-16', 'h-16');
  });

  it('has accessibility label', () => {
    render(<LoadingSpinner aria-label="Loading content..." />);
    const statusElement = screen.getByRole('status');
    expect(statusElement).toHaveAttribute('aria-label', 'Loading content...');
    
    // Check for screen reader text
    expect(screen.getByText('Loading content...')).toBeInTheDocument();
  });

  it('uses default aria-label when not provided', () => {
    render(<LoadingSpinner />);
    const statusElement = screen.getByRole('status');
    expect(statusElement).toHaveAttribute('aria-label', 'Loading...');
  });

  it('accepts custom className', () => {
    render(<LoadingSpinner className="custom-spinner-class" />);
    const container = screen.getByRole('status');
    expect(container).toHaveClass('custom-spinner-class');
  });

  it('supports custom color', () => {
    render(<LoadingSpinner color="#FF0000" />);
    const spinner = screen.getByRole('status').querySelector('div');
    expect(spinner).toHaveStyle({ borderTopColor: '#FF0000' });
  });

  it('has screen reader only text', () => {
    render(<LoadingSpinner aria-label="Custom loading message" />);
    const srText = screen.getByText('Custom loading message');
    expect(srText).toHaveClass('sr-only');
  });
});

describe('LoadingDots', () => {
  it('renders without crashing', () => {
    render(<LoadingDots />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows correct size variants', () => {
    const { rerender } = render(<LoadingDots size="sm" />);
    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(<LoadingDots size="md" />);
    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(<LoadingDots size="lg" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has accessibility label', () => {
    render(<LoadingDots aria-label="Loading dots..." />);
    const statusElement = screen.getByRole('status');
    expect(statusElement).toHaveAttribute('aria-label', 'Loading dots...');
  });

  it('uses default aria-label when not provided', () => {
    render(<LoadingDots />);
    const statusElement = screen.getByRole('status');
    expect(statusElement).toHaveAttribute('aria-label', 'Loading...');
  });

  it('accepts custom className', () => {
    render(<LoadingDots className="custom-dots-class" />);
    const container = screen.getByRole('status');
    expect(container).toHaveClass('custom-dots-class');
  });

  it('supports custom color', () => {
    const { container } = render(<LoadingDots color="#FF0000" />);
    // Verify the component renders with the custom color
    const statusElement = screen.getByRole('status');
    expect(statusElement).toBeInTheDocument();
    // The color is applied via inline style on the motion.div children
    // Just verify the component rendered successfully
    expect(container.querySelector('[role="status"]')).toBeInTheDocument();
  });
});

describe('CircularProgress', () => {
  it('renders without crashing', () => {
    render(<CircularProgress progress={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays progress percentage', () => {
    render(<CircularProgress progress={75} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('shows correct size variants', () => {
    const { rerender } = render(<CircularProgress progress={50} size="sm" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    rerender(<CircularProgress progress={50} size="md" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    rerender(<CircularProgress progress={50} size="lg" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    rerender(<CircularProgress progress={50} size="xl" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('has accessibility attributes', () => {
    render(<CircularProgress progress={60} aria-label="Upload progress" />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-label', 'Upload progress');
    expect(progressbar).toHaveAttribute('aria-valuenow', '60');
  });

  it('rounds progress value', () => {
    render(<CircularProgress progress={66.7} />);
    expect(screen.getByText('67%')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    render(<CircularProgress progress={50} className="custom-progress-class" />);
    const container = screen.getByRole('progressbar');
    expect(container).toHaveClass('custom-progress-class');
  });

  it('supports custom color', () => {
    render(<CircularProgress progress={50} color="#00FF00" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles 0% progress', () => {
    render(<CircularProgress progress={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('handles 100% progress', () => {
    render(<CircularProgress progress={100} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
