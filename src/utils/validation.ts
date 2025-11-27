/**
 * Validation utility functions
 * Provides comprehensive validation for forms, emails, passwords, and other inputs
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates email address
 * @param email - Email string to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim();
  
  if (!trimmedEmail) {
    return { isValid: false, error: 'Email is required' };
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  // Additional validation for common edge cases
  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }

  // Split email into local and domain parts for validation
  const parts = trimmedEmail.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  const localPart = parts[0];
  const domainPart = parts[1];

  // Check if email starts with a dot (before @)
  if (trimmedEmail.startsWith('.')) {
    return { isValid: false, error: 'Email address cannot start with a dot' };
  }

  // Check for consecutive dots in local part
  if (localPart.includes('..')) {
    return { isValid: false, error: 'Email address cannot contain consecutive dots' };
  }

  // Check if local part starts or ends with a dot
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return { isValid: false, error: 'Email address local part cannot start or end with a dot' };
  }

  // Check for consecutive dots in domain part
  if (domainPart.includes('..')) {
    return { isValid: false, error: 'Email address domain cannot contain consecutive dots' };
  }

  // Check if domain part starts or ends with a dot
  if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
    return { isValid: false, error: 'Email address domain cannot start or end with a dot' };
  }

  return { isValid: true };
};

/**
 * Validates email address (simple boolean version)
 * @param email - Email string to validate
 * @returns boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  return validateEmail(email).isValid;
};

/**
 * Validates password strength
 * @param password - Password string to validate
 * @param minLength - Minimum length (default: 6)
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validatePassword = (
  password: string,
  minLength: number = 6
): ValidationResult => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters long`
    };
  }

  return { isValid: true };
};

/**
 * Validates password strength with additional requirements
 * @param password - Password string to validate
 * @param options - Password strength options
 * @returns ValidationResult with isValid flag and optional error message
 */
export interface PasswordStrengthOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}

export const validatePasswordStrength = (
  password: string,
  options: PasswordStrengthOptions = {}
): ValidationResult => {
  const {
    minLength = 8,
    requireUppercase = false,
    requireLowercase = false,
    requireNumbers = false,
    requireSpecialChars = false
  } = options;

  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters long`
    };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (requireNumbers && !/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one special character'
    };
  }

  return { isValid: true };
};

/**
 * Checks if two passwords match
 * @param password - Original password
 * @param confirmPassword - Password confirmation
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword || typeof confirmPassword !== 'string') {
    return { isValid: false, error: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true };
};

/**
 * Validates username
 * @param username - Username string to validate
 * @param minLength - Minimum length (default: 3)
 * @param maxLength - Maximum length (default: 30)
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateUsername = (
  username: string,
  minLength: number = 3,
  maxLength: number = 30
): ValidationResult => {
  if (!username || typeof username !== 'string') {
    return { isValid: false, error: 'Username is required' };
  }

  const trimmedUsername = username.trim();

  if (!trimmedUsername) {
    return { isValid: false, error: 'Username is required' };
  }

  if (trimmedUsername.length < minLength) {
    return {
      isValid: false,
      error: `Username must be at least ${minLength} characters long`
    };
  }

  if (trimmedUsername.length > maxLength) {
    return {
      isValid: false,
      error: `Username must be no more than ${maxLength} characters long`
    };
  }

  // Allow alphanumeric, underscores, and hyphens
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(trimmedUsername)) {
    return {
      isValid: false,
      error: 'Username can only contain letters, numbers, underscores, and hyphens'
    };
  }

  // Cannot start or end with underscore or hyphen
  if (/^[_-]|[_-]$/.test(trimmedUsername)) {
    return {
      isValid: false,
      error: 'Username cannot start or end with an underscore or hyphen'
    };
  }

  return { isValid: true };
};

/**
 * Validates required field
 * @param value - Value to validate
 * @param fieldName - Name of the field (for error message)
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateRequired = (value: unknown, fieldName: string = 'Field'): ValidationResult => {
  if (value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (typeof value === 'string' && !value.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (Array.isArray(value) && value.length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
};

/**
 * Validates string length
 * @param value - String value to validate
 * @param minLength - Minimum length
 * @param maxLength - Maximum length
 * @param fieldName - Name of the field (for error message)
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateLength = (
  value: string,
  minLength?: number,
  maxLength?: number,
  fieldName: string = 'Field'
): ValidationResult => {
  if (typeof value !== 'string') {
    return { isValid: false, error: `${fieldName} must be a string` };
  }

  if (minLength !== undefined && value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters long`
    };
  }

  if (maxLength !== undefined && value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${maxLength} characters long`
    };
  }

  return { isValid: true };
};

/**
 * Validates URL
 * @param url - URL string to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateUrl = (url: string): ValidationResult => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL must start with http:// or https://' };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
};

/**
 * Validates phone number (simple validation)
 * @param phone - Phone number string to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');

  // Check if it's all digits
  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, error: 'Phone number must contain only digits' };
  }

  // Check length (typically 10-15 digits for international numbers)
  if (cleaned.length < 10 || cleaned.length > 15) {
    return {
      isValid: false,
      error: 'Phone number must be between 10 and 15 digits'
    };
  }

  return { isValid: true };
};

/**
 * Validates number range
 * @param value - Number to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @param fieldName - Name of the field (for error message)
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateNumberRange = (
  value: number,
  min?: number,
  max?: number,
  fieldName: string = 'Field'
): ValidationResult => {
  if (typeof value !== 'number' || isNaN(value)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }

  if (min !== undefined && value < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }

  if (max !== undefined && value > max) {
    return { isValid: false, error: `${fieldName} must be no more than ${max}` };
  }

  return { isValid: true };
};

/**
 * Validates that value is not empty (for strings, arrays, objects)
 * @param value - Value to validate
 * @param fieldName - Name of the field (for error message)
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateNotEmpty = (value: unknown, fieldName: string = 'Field'): ValidationResult => {
  if (value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} cannot be empty` };
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    return { isValid: false, error: `${fieldName} cannot be empty` };
  }

  if (Array.isArray(value) && value.length === 0) {
    return { isValid: false, error: `${fieldName} cannot be empty` };
  }

  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return { isValid: false, error: `${fieldName} cannot be empty` };
  }

  return { isValid: true };
};

