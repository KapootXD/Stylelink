export type TestUser = {
  email: string;
  password: string;
  displayName: string;
};

export type FeatureInput = {
  searchTerm: string;
  preferences: string[];
};

export const testUser: TestUser = {
  email: 'tester@example.com',
  password: 'P@ssword1234!',
  displayName: 'Test User',
};

export const featureInput: FeatureInput = {
  searchTerm: 'streetwear',
  preferences: ['casual', 'black', 'minimal'],
};

export const testData = {
  validInput: {
    field1: 'Valid value',
    field2: 'Another valid value',
    searchTerm: 'streetwear',
    preferences: ['casual', 'minimal'],
    occasion: 'casual',
    season: 'fall',
  },
  invalidInput: {
    field1: '',
    field2: 'invalid@@@',
    searchTerm: '',
  },
  edgeCases: {
    veryLongInput: 'a'.repeat(1000),
    specialChars: '!@#$%^&*()',
    unicodeChars: '你好世界',
    emptyString: '',
    whitespaceOnly: '   ',
    sqlInjection: "'; DROP TABLE users; --",
    xssAttempt: '<script>alert("xss")</script>',
    veryLongEmail: 'a'.repeat(100) + '@example.com',
    numericString: '1234567890',
    mixedCase: 'MiXeD CaSe StRiNg',
  },
};

export const mockApiResponses = {
  profile: {
    id: 'user-123',
    name: 'Test User',
    favorites: ['minimal', 'modern'],
  },
  searchResults: [
    { id: 'look-1', title: 'Monochrome Layered Look' },
    { id: 'look-2', title: 'Athleisure Staples' },
  ],
};
