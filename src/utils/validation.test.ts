import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  isValidEmail,
  validatePassword,
  validatePasswordStrength,
  validatePasswordMatch,
  validateUsername,
  validateRequired,
  validateLength,
  validateUrl,
  validatePhoneNumber,
  validateNumberRange,
  validateNotEmpty,
  type PasswordStrengthOptions
} from './validation';

describe('validation', () => {
  describe('validateEmail', () => {
    it('returns valid for correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.co.uk',
        'user+tag@example.com',
        'test123@test-domain.com',
        'a@b.co',
        'user_name@example-domain.com'
      ];

      validEmails.forEach(email => {
        const result = validateEmail(email);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('returns invalid for incorrect email addresses', () => {
      const invalidEmails = [
        'invalid',
        '@example.com',
        'test@',
        'test@.com',
        'test @example.com',
        'test@example',
        'test..test@example.com',
        '.test@example.com',
        'test@example.com.',
        ''
      ];

      invalidEmails.forEach(email => {
        const result = validateEmail(email);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    it('returns error when email is too long', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      const result = validateEmail(longEmail);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too long');
    });

    it('returns error when email starts or ends with dot', () => {
      const result1 = validateEmail('.test@example.com');
      const result2 = validateEmail('test.@example.com');

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
      expect(result1.error).toContain('dot');
    });

    it('returns error when email is null or undefined', () => {
      const result1 = validateEmail(null as any);
      const result2 = validateEmail(undefined as any);

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
      expect(result1.error).toContain('required');
    });

    it('returns error when email is only whitespace', () => {
      const result = validateEmail('   ');

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('required');
    });
  });

  describe('isValidEmail', () => {
    it('returns true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user@domain.co.uk')).toBe(true);
    });

    it('returns false for invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('returns valid for passwords meeting minimum length', () => {
      const result = validatePassword('password123', 6);
      expect(result.isValid).toBe(true);
    });

    it('returns invalid for passwords below minimum length', () => {
      const result = validatePassword('short', 6);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least');
    });

    it('uses default minimum length of 6', () => {
      const result1 = validatePassword('pass1');
      const result2 = validatePassword('password');

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(true);
    });

    it('returns error when password is null or undefined', () => {
      const result1 = validatePassword(null as any);
      const result2 = validatePassword(undefined as any);

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
    });

    it('handles empty string', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('returns valid for strong passwords', () => {
      const options: PasswordStrengthOptions = {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true
      };

      const result = validatePasswordStrength('Password123!', options);
      expect(result.isValid).toBe(true);
    });

    it('validates uppercase requirement', () => {
      const options: PasswordStrengthOptions = {
        requireUppercase: true
      };

      const result1 = validatePasswordStrength('password123', options);
      const result2 = validatePasswordStrength('Password123', options);

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(true);
    });

    it('validates lowercase requirement', () => {
      const options: PasswordStrengthOptions = {
        requireLowercase: true
      };

      const result1 = validatePasswordStrength('PASSWORD123', options);
      const result2 = validatePasswordStrength('Password123', options);

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(true);
    });

    it('validates number requirement', () => {
      const options: PasswordStrengthOptions = {
        requireNumbers: true
      };

      const result1 = validatePasswordStrength('Password', options);
      const result2 = validatePasswordStrength('Password123', options);

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(true);
    });

    it('validates special character requirement', () => {
      const options: PasswordStrengthOptions = {
        requireSpecialChars: true
      };

      const result1 = validatePasswordStrength('Password123', options);
      const result2 = validatePasswordStrength('Password123!', options);

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(true);
    });

    it('validates minimum length', () => {
      const options: PasswordStrengthOptions = {
        minLength: 10
      };

      const result1 = validatePasswordStrength('Short1!', options);
      const result2 = validatePasswordStrength('LongPassword123!', options);

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(true);
    });
  });

  describe('validatePasswordMatch', () => {
    it('returns valid when passwords match', () => {
      const result = validatePasswordMatch('password123', 'password123');
      expect(result.isValid).toBe(true);
    });

    it('returns invalid when passwords do not match', () => {
      const result = validatePasswordMatch('password123', 'password456');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('match');
    });

    it('returns error when confirmPassword is empty', () => {
      const result = validatePasswordMatch('password123', '');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('confirm');
    });

    it('handles null and undefined', () => {
      const result1 = validatePasswordMatch('password123', null as any);
      const result2 = validatePasswordMatch('password123', undefined as any);

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
    });
  });

  describe('validateUsername', () => {
    it('returns valid for correct usernames', () => {
      const validUsernames = [
        'username',
        'user_name',
        'user-name',
        'user123',
        'User_Name-123'
      ];

      validUsernames.forEach(username => {
        const result = validateUsername(username);
        expect(result.isValid).toBe(true);
      });
    });

    it('returns invalid for usernames below minimum length', () => {
      const result = validateUsername('ab', 3);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least');
    });

    it('returns invalid for usernames above maximum length', () => {
      const longUsername = 'a'.repeat(31);
      const result = validateUsername(longUsername, 3, 30);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('no more than');
    });

    it('returns invalid for usernames with special characters', () => {
      const invalidUsernames = [
        'user@name',
        'user name',
        'user.name',
        'user!name'
      ];

      invalidUsernames.forEach(username => {
        const result = validateUsername(username);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('letters, numbers');
      });
    });

    it('returns invalid when username starts or ends with underscore or hyphen', () => {
      const result1 = validateUsername('_username');
      const result2 = validateUsername('username_');
      const result3 = validateUsername('-username');
      const result4 = validateUsername('username-');

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
      expect(result3.isValid).toBe(false);
      expect(result4.isValid).toBe(false);
    });

    it('returns error when username is null or undefined', () => {
      const result1 = validateUsername(null as any);
      const result2 = validateUsername(undefined as any);

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
    });

    it('returns error when username is only whitespace', () => {
      const result = validateUsername('   ');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('returns valid for non-empty values', () => {
      expect(validateRequired('value').isValid).toBe(true);
      expect(validateRequired(123).isValid).toBe(true);
      expect(validateRequired([1, 2, 3]).isValid).toBe(true);
      expect(validateRequired({ key: 'value' }).isValid).toBe(true);
    });

    it('returns invalid for null or undefined', () => {
      expect(validateRequired(null).isValid).toBe(false);
      expect(validateRequired(undefined).isValid).toBe(false);
    });

    it('returns invalid for empty string', () => {
      expect(validateRequired('').isValid).toBe(false);
      expect(validateRequired('   ').isValid).toBe(false);
    });

    it('returns invalid for empty array', () => {
      expect(validateRequired([]).isValid).toBe(false);
    });

    it('includes field name in error message', () => {
      const result = validateRequired('', 'Email');
      expect(result.error).toContain('Email');
    });
  });

  describe('validateLength', () => {
    it('returns valid for strings within length range', () => {
      const result = validateLength('hello', 3, 10);
      expect(result.isValid).toBe(true);
    });

    it('returns invalid for strings below minimum length', () => {
      const result = validateLength('hi', 3, 10);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least');
    });

    it('returns invalid for strings above maximum length', () => {
      const result = validateLength('this is too long', 3, 10);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('no more than');
    });

    it('validates only minimum length when max is not provided', () => {
      const result1 = validateLength('hello', 3);
      const result2 = validateLength('hi', 3);

      expect(result1.isValid).toBe(true);
      expect(result2.isValid).toBe(false);
    });

    it('validates only maximum length when min is not provided', () => {
      const result1 = validateLength('hello', undefined, 10);
      const result2 = validateLength('this is too long', undefined, 10);

      expect(result1.isValid).toBe(true);
      expect(result2.isValid).toBe(false);
    });

    it('returns error when value is not a string', () => {
      const result = validateLength(123 as any, 3, 10);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('string');
    });
  });

  describe('validateUrl', () => {
    it('returns valid for correct URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://example.com',
        'https://www.example.com/path?query=value',
        'http://subdomain.example.com'
      ];

      validUrls.forEach(url => {
        const result = validateUrl(url);
        expect(result.isValid).toBe(true);
      });
    });

    it('returns invalid for incorrect URLs', () => {
      const invalidUrls = [
        'not-a-url',
        'example.com',
        'ftp://example.com',
        'javascript:alert(1)',
        ''
      ];

      invalidUrls.forEach(url => {
        const result = validateUrl(url);
        expect(result.isValid).toBe(false);
      });
    });

    it('returns error when URL is null or undefined', () => {
      const result1 = validateUrl(null as any);
      const result2 = validateUrl(undefined as any);

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('returns valid for correct phone numbers', () => {
      const validPhones = [
        '1234567890',
        '123-456-7890',
        '(123) 456-7890',
        '+1 123-456-7890',
        '123 456 7890'
      ];

      validPhones.forEach(phone => {
        const result = validatePhoneNumber(phone);
        expect(result.isValid).toBe(true);
      });
    });

    it('returns invalid for phone numbers with letters', () => {
      const result = validatePhoneNumber('123-456-ABCD');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('digits');
    });

    it('returns invalid for phone numbers that are too short', () => {
      const result = validatePhoneNumber('12345');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('between 10 and 15');
    });

    it('returns invalid for phone numbers that are too long', () => {
      const result = validatePhoneNumber('1'.repeat(16));
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('between 10 and 15');
    });

    it('returns error when phone is null or undefined', () => {
      const result1 = validatePhoneNumber(null as any);
      const result2 = validatePhoneNumber(undefined as any);

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
    });
  });

  describe('validateNumberRange', () => {
    it('returns valid for numbers within range', () => {
      const result = validateNumberRange(5, 1, 10);
      expect(result.isValid).toBe(true);
    });

    it('returns invalid for numbers below minimum', () => {
      const result = validateNumberRange(0, 1, 10);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least');
    });

    it('returns invalid for numbers above maximum', () => {
      const result = validateNumberRange(11, 1, 10);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('no more than');
    });

    it('validates only minimum when max is not provided', () => {
      const result1 = validateNumberRange(5, 1);
      const result2 = validateNumberRange(0, 1);

      expect(result1.isValid).toBe(true);
      expect(result2.isValid).toBe(false);
    });

    it('validates only maximum when min is not provided', () => {
      const result1 = validateNumberRange(5, undefined, 10);
      const result2 = validateNumberRange(11, undefined, 10);

      expect(result1.isValid).toBe(true);
      expect(result2.isValid).toBe(false);
    });

    it('returns error when value is not a number', () => {
      const result1 = validateNumberRange('not a number' as any, 1, 10);
      const result2 = validateNumberRange(NaN, 1, 10);

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
      expect(result1.error).toContain('valid number');
    });

    it('includes field name in error message', () => {
      const result = validateNumberRange(0, 1, 10, 'Price');
      expect(result.error).toContain('Price');
    });
  });

  describe('validateNotEmpty', () => {
    it('returns valid for non-empty values', () => {
      expect(validateNotEmpty('value').isValid).toBe(true);
      expect(validateNotEmpty([1, 2]).isValid).toBe(true);
      expect(validateNotEmpty({ key: 'value' }).isValid).toBe(true);
      expect(validateNotEmpty(0).isValid).toBe(true);
      expect(validateNotEmpty(false).isValid).toBe(true);
    });

    it('returns invalid for null or undefined', () => {
      expect(validateNotEmpty(null).isValid).toBe(false);
      expect(validateNotEmpty(undefined).isValid).toBe(false);
    });

    it('returns invalid for empty string', () => {
      expect(validateNotEmpty('').isValid).toBe(false);
      expect(validateNotEmpty('   ').isValid).toBe(false);
    });

    it('returns invalid for empty array', () => {
      expect(validateNotEmpty([]).isValid).toBe(false);
    });

    it('returns invalid for empty object', () => {
      expect(validateNotEmpty({}).isValid).toBe(false);
    });

    it('includes field name in error message', () => {
      const result = validateNotEmpty('', 'Description');
      expect(result.error).toContain('Description');
    });
  });
});

