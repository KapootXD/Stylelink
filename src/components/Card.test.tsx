import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from './Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies custom styling via className', () => {
    render(<Card className="custom-card-class">Content</Card>);
    const card = screen.getByText('Content').closest('div');
    expect(card).toHaveClass('custom-card-class');
  });

  it('handles onClick when provided', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Card onClick={handleClick}>
        <p>Clickable Card</p>
      </Card>
    );
    
    const card = screen.getByText('Clickable Card').closest('[role="button"]');
    expect(card).toBeInTheDocument();
    
    if (card) {
      await user.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });

  it('does not handle onClick when not provided', () => {
    render(
      <Card>
        <p>Non-clickable Card</p>
      </Card>
    );
    
    const card = screen.getByText('Non-clickable Card').closest('div');
    expect(card).not.toHaveAttribute('role', 'button');
  });

  it('has proper accessibility attributes with aria-label', () => {
    render(
      <Card onClick={vi.fn()} aria-label="Product card">
        <p>Content</p>
      </Card>
    );
    
    const card = screen.getByRole('button', { name: /product card/i });
    expect(card).toBeInTheDocument();
  });

  it('handles keyboard events when clickable', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Card onClick={handleClick}>
        <p>Clickable Card</p>
      </Card>
    );
    
    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('does not trigger onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Card onClick={handleClick} disabled>
        <p>Disabled Card</p>
      </Card>
    );
    
    const card = screen.getByText('Disabled Card').closest('[role="button"]');
    if (card) {
      await user.click(card);
      expect(handleClick).not.toHaveBeenCalled();
    }
  });

  it('supports different variants', () => {
    const { rerender } = render(<Card variant="default">Default</Card>);
    expect(screen.getByText('Default')).toBeInTheDocument();

    rerender(<Card variant="outfit">Outfit</Card>);
    expect(screen.getByText('Outfit')).toBeInTheDocument();

    rerender(<Card variant="product">Product</Card>);
    expect(screen.getByText('Product')).toBeInTheDocument();

    rerender(<Card variant="brand">Brand</Card>);
    expect(screen.getByText('Brand')).toBeInTheDocument();
  });
});
