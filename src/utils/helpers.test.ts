import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDate,
  formatCurrency,
  formatNumber,
  truncate,
  capitalize,
  toTitleCase,
  cleanWhitespace,
  slugify,
  getInitials,
  debounce,
  throttle,
  clamp,
  generateId,
  isEmpty,
  deepClone,
  formatFileSize,
  sleep
} from './helpers';

describe('helpers', () => {
  describe('formatDate', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('formats date in short format', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, 'short');
      expect(result).toContain('Jan');
      expect(result).toContain('2024');
    });

    it('formats date in long format', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, 'long');
      expect(result).toContain('January');
      expect(result).toContain('2024');
    });

    it('formats date in time format', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const result = formatDate(date, 'time');
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('formats date in datetime format', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const result = formatDate(date, 'datetime');
      expect(result).toContain('Jan');
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('formats date in relative format - just now', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const result = formatDate(date, 'relative');
      expect(result).toBe('just now');
    });

    it('formats date in relative format - minutes ago', () => {
      const date = new Date('2024-01-15T11:55:00Z');
      const result = formatDate(date, 'relative');
      expect(result).toContain('minute');
      expect(result).toContain('ago');
    });

    it('formats date in relative format - hours ago', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      const result = formatDate(date, 'relative');
      expect(result).toContain('hour');
      expect(result).toContain('ago');
    });

    it('formats date in relative format - days ago', () => {
      const date = new Date('2024-01-13T12:00:00Z');
      const result = formatDate(date, 'relative');
      expect(result).toContain('day');
      expect(result).toContain('ago');
    });

    it('handles date string input', () => {
      const result = formatDate('2024-01-15', 'short');
      expect(result).toBeDefined();
      expect(result).not.toBe('Invalid date');
    });

    it('handles timestamp number input', () => {
      const timestamp = new Date('2024-01-15').getTime();
      const result = formatDate(timestamp, 'short');
      expect(result).toBeDefined();
      expect(result).not.toBe('Invalid date');
    });

    it('returns "Invalid date" for invalid input', () => {
      expect(formatDate('invalid', 'short')).toBe('Invalid date');
      expect(formatDate(NaN as any, 'short')).toBe('Invalid date');
    });

    it('uses default format when not specified', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toBeDefined();
    });
  });

  describe('formatCurrency', () => {
    it('formats currency correctly for USD', () => {
      const result = formatCurrency(1234.56, 'USD');
      expect(result).toContain('$');
      expect(result).toContain('1,234.56');
    });

    it('formats currency for different locales', () => {
      const result = formatCurrency(1234.56, 'EUR', 'de-DE');
      expect(result).toContain('€');
    });

    it('handles zero', () => {
      const result = formatCurrency(0);
      expect(result).toContain('$0.00');
    });

    it('handles negative numbers', () => {
      const result = formatCurrency(-100);
      expect(result).toContain('-');
    });

    it('returns "Invalid amount" for invalid input', () => {
      expect(formatCurrency(NaN)).toBe('Invalid amount');
      expect(formatCurrency('invalid' as any)).toBe('Invalid amount');
    });

    it('uses default currency and locale', () => {
      const result = formatCurrency(100);
      expect(result).toContain('$');
    });
  });

  describe('formatNumber', () => {
    it('formats number with default decimals', () => {
      const result = formatNumber(1234.567);
      expect(result).toBe('1,235');
    });

    it('formats number with specified decimals', () => {
      const result = formatNumber(1234.567, 2);
      expect(result).toBe('1,234.57');
    });

    it('handles zero', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(0, 2)).toBe('0.00');
    });

    it('returns "0" for invalid input', () => {
      expect(formatNumber(NaN)).toBe('0');
      expect(formatNumber('invalid' as any)).toBe('0');
    });
  });

  describe('truncate', () => {
    it('truncates string longer than maxLength', () => {
      const result = truncate('This is a long string', 10);
      expect(result.length).toBeLessThanOrEqual(10 + 3); // +3 for suffix
      expect(result).toContain('...');
    });

    it('does not truncate string shorter than maxLength', () => {
      const str = 'Short';
      const result = truncate(str, 10);
      expect(result).toBe(str);
    });

    it('uses custom suffix', () => {
      const result = truncate('Long string', 5, '…');
      expect(result).toContain('…');
    });

    it('returns empty string for non-string input', () => {
      expect(truncate(null as any, 10)).toBe('');
      expect(truncate(123 as any, 10)).toBe('');
    });

    it('handles empty string', () => {
      expect(truncate('', 10)).toBe('');
    });
  });

  describe('capitalize', () => {
    it('capitalizes first letter and lowercases rest', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('Hello');
      expect(capitalize('hELLO')).toBe('Hello');
    });

    it('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('handles single character', () => {
      expect(capitalize('h')).toBe('H');
    });

    it('handles non-string input', () => {
      expect(capitalize(null as any)).toBe(null);
    });
  });

  describe('toTitleCase', () => {
    it('capitalizes first letter of each word', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
      expect(toTitleCase('hello   world')).toBe('Hello   World');
    });

    it('handles empty string', () => {
      expect(toTitleCase('')).toBe('');
    });

    it('handles single word', () => {
      expect(toTitleCase('hello')).toBe('Hello');
    });

    it('handles non-string input', () => {
      expect(toTitleCase(null as any)).toBe(null);
    });
  });

  describe('cleanWhitespace', () => {
    it('removes extra whitespace', () => {
      expect(cleanWhitespace('  hello   world  ')).toBe('hello world');
      expect(cleanWhitespace('hello\t\tworld')).toBe('hello world');
      expect(cleanWhitespace('hello\n\nworld')).toBe('hello world');
    });

    it('handles already clean strings', () => {
      expect(cleanWhitespace('hello world')).toBe('hello world');
    });

    it('returns empty string for non-string input', () => {
      expect(cleanWhitespace(null as any)).toBe('');
    });
  });

  describe('slugify', () => {
    it('converts string to slug format', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Hello   World')).toBe('hello-world');
      expect(slugify('Hello-World')).toBe('hello-world');
    });

    it('removes special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
      expect(slugify('Hello @ World #')).toBe('hello-world');
    });

    it('removes leading/trailing hyphens', () => {
      expect(slugify('-hello-world-')).toBe('hello-world');
      expect(slugify('_hello-world_')).toBe('hello-world');
    });

    it('handles empty string', () => {
      expect(slugify('')).toBe('');
    });

    it('returns empty string for non-string input', () => {
      expect(slugify(null as any)).toBe('');
    });
  });

  describe('getInitials', () => {
    it('extracts initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('John Michael Doe')).toBe('JM');
    });

    it('respects maxInitials parameter', () => {
      expect(getInitials('John Michael Doe', 1)).toBe('J');
      expect(getInitials('John Michael Doe', 3)).toBe('JMD');
    });

    it('handles single word', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('handles empty string', () => {
      expect(getInitials('')).toBe('');
    });

    it('returns empty string for non-string input', () => {
      expect(getInitials(null as any)).toBe('');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('delays function execution', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced();
      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('cancels previous calls', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced();
      debounced();
      debounced();

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('passes arguments correctly', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced('arg1', 'arg2');
      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('limits function execution rate', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      throttled();
      expect(func).toHaveBeenCalledTimes(1); // Still 1, within throttle period

      vi.advanceTimersByTime(100);
      throttled();
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('passes arguments correctly', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      throttled('arg1', 'arg2');
      expect(func).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('clamp', () => {
    it('clamps value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('handles value at boundaries', () => {
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });

    it('returns min for invalid input', () => {
      expect(clamp(NaN, 0, 10)).toBe(0);
      expect(clamp('invalid' as any, 0, 10)).toBe(0);
    });
  });

  describe('generateId', () => {
    it('generates ID of specified length', () => {
      const id = generateId(10);
      expect(id.length).toBe(10);
    });

    it('generates ID of default length', () => {
      const id = generateId();
      expect(id.length).toBe(8);
    });

    it('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('generates alphanumeric IDs', () => {
      const id = generateId(100);
      expect(id).toMatch(/^[A-Za-z0-9]+$/);
    });
  });

  describe('isEmpty', () => {
    it('returns true for empty values', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    it('returns false for non-empty values', () => {
      expect(isEmpty('value')).toBe(false);
      expect(isEmpty([1, 2])).toBe(false);
      expect(isEmpty({ key: 'value' })).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });
  });

  describe('deepClone', () => {
    it('clones objects deeply', () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });

    it('clones arrays deeply', () => {
      const original = [1, [2, 3], { a: 4 }];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[1]).not.toBe(original[1]);
    });

    it('clones dates', () => {
      const date = new Date('2024-01-15');
      const cloned = deepClone(date);

      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
      expect(cloned.getTime()).toBe(date.getTime());
    });

    it('returns primitive values as-is', () => {
      expect(deepClone(123)).toBe(123);
      expect(deepClone('string')).toBe('string');
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
    });
  });

  describe('formatFileSize', () => {
    it('formats file size in bytes', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(512)).toContain('Bytes');
    });

    it('formats file size in KB', () => {
      const result = formatFileSize(1024);
      expect(result).toContain('KB');
    });

    it('formats file size in MB', () => {
      const result = formatFileSize(1024 * 1024);
      expect(result).toContain('MB');
    });

    it('formats file size in GB', () => {
      const result = formatFileSize(1024 * 1024 * 1024);
      expect(result).toContain('GB');
    });

    it('handles zero', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
    });

    it('handles invalid input', () => {
      expect(formatFileSize(-1)).toBe('0 Bytes');
      expect(formatFileSize(NaN)).toBe('0 Bytes');
    });
  });

  describe('sleep', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('resolves after specified time', async () => {
      const promise = sleep(100);
      let resolved = false;

      promise.then(() => {
        resolved = true;
      });

      expect(resolved).toBe(false);
      vi.advanceTimersByTime(100);
      await promise;
      expect(resolved).toBe(true);
    });
  });
});

