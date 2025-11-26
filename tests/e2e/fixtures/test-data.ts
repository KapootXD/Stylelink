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
