/**
 * Test helper utilities for E2E tests
 */

/**
 * Generate a random email address for testing
 */
export function generateRandomEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `test-${timestamp}-${random}@example.com`;
}

/**
 * Generate a random string
 */
export function generateRandomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random phone number
 */
export function generateRandomPhone(): string {
  const areaCode = Math.floor(Math.random() * 800) + 200;
  const exchange = Math.floor(Math.random() * 800) + 200;
  const number = Math.floor(Math.random() * 10000);
  return `${areaCode}-${exchange}-${number.toString().padStart(4, '0')}`;
}

/**
 * Wait for a condition to be true
 */
export async function waitForCondition(
  condition: () => Promise<boolean>,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Create a test image file (for file upload tests)
 * Note: In actual tests, you would use real image files from fixtures
 */
export function createTestImageFile(): File {
  // This is a placeholder - in real tests, read from fixture files
  const blob = new Blob(['fake image content'], { type: 'image/jpeg' });
  return new File([blob], 'test-image.jpg', { type: 'image/jpeg' });
}

