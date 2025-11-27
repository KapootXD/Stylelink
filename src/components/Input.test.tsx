import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Username" />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  });

  it('shows error state and message', () => {
    render(<Input label="Email" error="Invalid email address" />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('handles onChange events', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    
    render(<Input label="Test Input" onChange={handleChange} />);
    const input = screen.getByLabelText(/test input/i);
    
    await user.type(input, 'Hello');
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows different input types', () => {
    const { rerender } = render(<Input label="Text" type="text" />);
    expect(screen.getByLabelText(/text/i)).toHaveAttribute('type', 'text');

    rerender(<Input label="Email" type="email" />);
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');

    rerender(<Input label="Password" type="password" />);
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');

    rerender(<Input label="Number" type="number" />);
    expect(screen.getByLabelText(/number/i)).toHaveAttribute('type', 'number');

    rerender(<Input label="Tel" type="tel" />);
    expect(screen.getByLabelText(/tel/i)).toHaveAttribute('type', 'tel');

    rerender(<Input label="URL" type="url" />);
    expect(screen.getByLabelText(/url/i)).toHaveAttribute('type', 'url');

    rerender(<Input label="Search" type="search" />);
    expect(screen.getByLabelText(/search/i)).toHaveAttribute('type', 'search');
  });

  it('has proper accessibility - label for input', () => {
    render(<Input label="Accessible Input" id="test-input" />);
    const label = screen.getByText(/accessible input/i);
    const input = screen.getByLabelText(/accessible input/i);
    
    expect(label).toHaveAttribute('for', input.id);
    expect(input).toHaveAttribute('id', 'test-input');
  });

  it('shows required indicator', () => {
    render(<Input label="Required Field" required />);
    const label = screen.getByText(/required field/i);
    // Required indicator is added via CSS ::after pseudo-element
    // Check that the label element has the required styling class
    expect(label).toBeInTheDocument();
    // The asterisk is rendered via CSS, so we just verify the label exists
    // and the input has required attribute
    const input = screen.getByLabelText(/required field/i);
    expect(input).toHaveAttribute('required');
  });

  it('handles disabled state', () => {
    render(<Input label="Disabled Input" disabled />);
    const input = screen.getByLabelText(/disabled input/i);
    expect(input).toBeDisabled();
  });

  it('handles focus and blur events', async () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Input 
        label="Focus Test" 
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
    
    const input = screen.getByLabelText(/focus test/i);
    await user.click(input);
    expect(handleFocus).toHaveBeenCalled();
    
    await user.tab();
    expect(handleBlur).toHaveBeenCalled();
  });

  it('displays placeholder text', () => {
    render(<Input label="Input" placeholder="Enter your name" />);
    const input = screen.getByPlaceholderText(/enter your name/i);
    expect(input).toBeInTheDocument();
  });

  it('displays help text when no error', () => {
    render(<Input label="Input" helpText="This is helpful information" />);
    expect(screen.getByText(/this is helpful information/i)).toBeInTheDocument();
  });

  it('does not display help text when error is shown', () => {
    render(
      <Input 
        label="Input" 
        error="This is an error"
        helpText="This should not show"
      />
    );
    expect(screen.queryByText(/this should not show/i)).not.toBeInTheDocument();
    expect(screen.getByText(/this is an error/i)).toBeInTheDocument();
  });

  it('respects maxLength attribute', () => {
    render(<Input label="Limited Input" maxLength={10} />);
    const input = screen.getByLabelText(/limited input/i);
    expect(input).toHaveAttribute('maxLength', '10');
  });

  it('has proper aria-describedby for error messages', () => {
    render(<Input label="Input" error="Error message" />);
    const input = screen.getByLabelText(/input/i);
    const errorId = input.getAttribute('aria-describedby');
    expect(errorId).toBeTruthy();
    expect(errorId).toContain('error');
  });

  it('accepts value prop', () => {
    render(<Input label="Controlled Input" value="Initial value" />);
    const input = screen.getByLabelText(/controlled input/i) as HTMLInputElement;
    expect(input.value).toBe('Initial value');
  });
});
