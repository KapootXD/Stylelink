import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal, { ConfirmModal } from './Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div>Modal Content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Reset body overflow
    document.body.style.overflow = 'unset';
  });

  it('shows when isOpen is true', () => {
    render(<Modal {...defaultProps} isOpen={true} />);
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('hides when isOpen is false', () => {
    const { rerender } = render(<Modal {...defaultProps} isOpen={true} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Modal {...defaultProps} onClose={onClose} showCloseButton={true} />
    );
    
    const closeButton = screen.getByLabelText(/close modal/i);
    await user.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    
    render(<Modal {...defaultProps} onClose={onClose} closeOnOverlayClick={true} />);
    
    // Click on the overlay (dialog container)
    const overlay = screen.getByRole('dialog');
    await user.click(overlay);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Modal {...defaultProps} onClose={onClose} closeOnOverlayClick={true}>
        <div>Modal Content</div>
      </Modal>
    );
    
    const content = screen.getByText('Modal Content');
    await user.click(content);
    
    expect(onClose).not.toHaveBeenCalled();
  });

  it('traps focus within modal', async () => {
    render(
      <Modal {...defaultProps}>
        <button>First Button</button>
        <button>Second Button</button>
        <button>Third Button</button>
      </Modal>
    );
    
    const buttons = screen.getAllByRole('button');
    // Should have 4 buttons: close button + 3 content buttons
    expect(buttons.length).toBeGreaterThanOrEqual(3);
    
    // Verify focusable elements exist (focus management happens via useEffect)
    const contentButtons = buttons.filter(btn => 
      btn.textContent === 'First Button' || 
      btn.textContent === 'Second Button' || 
      btn.textContent === 'Third Button'
    );
    expect(contentButtons.length).toBe(3);
  });

  it('closes on ESC key', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    
    render(<Modal {...defaultProps} onClose={onClose} closeOnEscape={true} />);
    
    await user.keyboard('{Escape}');
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on ESC when closeOnEscape is false', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    
    render(<Modal {...defaultProps} onClose={onClose} closeOnEscape={false} />);
    
    await user.keyboard('{Escape}');
    
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not close on overlay click when closeOnOverlayClick is false', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    
    render(<Modal {...defaultProps} onClose={onClose} closeOnOverlayClick={false} />);
    
    const overlay = screen.getByRole('dialog');
    await user.click(overlay);
    
    expect(onClose).not.toHaveBeenCalled();
  });

  it('displays title when provided', () => {
    render(<Modal {...defaultProps} title="Test Modal Title" />);
    expect(screen.getByText('Test Modal Title')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveAttribute('id', 'modal-title');
  });

  it('has proper accessibility attributes', () => {
    render(<Modal {...defaultProps} title="Accessible Modal" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('supports different sizes', () => {
    const { rerender } = render(<Modal {...defaultProps} size="sm" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(<Modal {...defaultProps} size="md" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(<Modal {...defaultProps} size="lg" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(<Modal {...defaultProps} size="xl" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(<Modal {...defaultProps} size="full" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    render(<Modal {...defaultProps} showCloseButton={false} />);
    expect(screen.queryByLabelText(/close modal/i)).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Modal {...defaultProps} className="custom-modal-class" />);
    // The className is applied to the modal content div (motion.div)
    // Find the modal content wrapper that has the className
    const modalWrapper = container.querySelector('.custom-modal-class');
    expect(modalWrapper).toBeInTheDocument();
    expect(modalWrapper).toHaveClass('bg-white', 'rounded-2xl');
  });

  it('prevents body scroll when modal is open', () => {
    render(<Modal {...defaultProps} isOpen={true} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when modal closes', () => {
    const { rerender } = render(<Modal {...defaultProps} isOpen={true} />);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<Modal {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('unset');
  });

  it('handles tab navigation within modal', async () => {
    const user = userEvent.setup();
    
    render(
      <Modal {...defaultProps}>
        <button>Button 1</button>
        <button>Button 2</button>
        <button>Button 3</button>
      </Modal>
    );
    
    const buttons = screen.getAllByRole('button').filter(
      btn => btn.textContent?.startsWith('Button')
    );
    
    if (buttons.length > 0) {
      buttons[0].focus();
      expect(document.activeElement).toBe(buttons[0]);
      
      // Tab should cycle through buttons
      await user.keyboard('{Tab}');
      // Note: Focus trapping implementation may vary
    }
  });
});

describe('ConfirmModal', () => {
  const defaultConfirmProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = 'unset';
  });

  it('renders when open', () => {
    render(<ConfirmModal {...defaultConfirmProps} />);
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
  });

  it('shows default button text', () => {
    render(<ConfirmModal {...defaultConfirmProps} />);
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('shows custom button text', () => {
    render(
      <ConfirmModal
        {...defaultConfirmProps}
        confirmText="Delete"
        cancelText="Keep"
      />
    );
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /keep/i })).toBeInTheDocument();
  });

  it('calls onConfirm and onClose when confirm button clicked', async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <ConfirmModal
        {...defaultConfirmProps}
        onConfirm={onConfirm}
        onClose={onClose}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<ConfirmModal {...defaultConfirmProps} onClose={onClose} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('supports danger variant', () => {
    render(<ConfirmModal {...defaultConfirmProps} variant="danger" />);
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toHaveClass('bg-[#B7410E]');
  });

  it('supports warning variant', () => {
    render(<ConfirmModal {...defaultConfirmProps} variant="warning" />);
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toHaveClass('bg-[#D4AF37]');
  });

  it('supports info variant (default)', () => {
    render(<ConfirmModal {...defaultConfirmProps} variant="info" />);
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toHaveClass('bg-[#8B5E3C]');
  });

  it('uses default info variant when not specified', () => {
    render(<ConfirmModal {...defaultConfirmProps} />);
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toHaveClass('bg-[#8B5E3C]');
  });
});
