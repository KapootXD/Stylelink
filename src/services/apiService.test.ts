import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  processOutfitUpload,
  searchOutfits,
  getOutfitById,
  getUserProfile,
  likeOutfit,
  shareOutfit
} from './apiService';
import * as firebaseService from './firebaseService';
import { UserInput, OutfitUpload, SearchFilters, UserProfile } from '../types';
import { DEMO_DATA } from '../data/demoData';

// Mock Firebase service
vi.mock('./firebaseService', () => ({
  createOutfit: vi.fn(),
  getOutfits: vi.fn(),
  searchOutfitsByText: vi.fn(),
  getOutfitById: vi.fn(),
  getUserProfile: vi.fn(),
  likeOutfit: vi.fn(),
  shareOutfit: vi.fn()
}));

// Mock demo data
vi.mock('../data/demoData', () => ({
  DEMO_DATA: {
    outfits: [
      {
        id: 'outfit-1',
        userId: 'user-1',
        title: 'Casual Summer Outfit',
        description: 'Perfect for a sunny day',
        occasion: 'casual',
        season: 'summer',
        styleTags: ['casual', 'summer'],
        items: [],
        mainImageUrl: 'https://example.com/image.jpg',
        additionalImages: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        likes: 10,
        shares: 5,
        isPublic: true
      },
      {
        id: 'outfit-2',
        userId: 'user-2',
        title: 'Winter Formal Wear',
        description: 'Elegant evening attire',
        occasion: 'formal',
        season: 'winter',
        styleTags: ['vintage', 'elegant'],
        items: [],
        mainImageUrl: 'https://example.com/image2.jpg',
        additionalImages: [],
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        likes: 5,
        shares: 2,
        isPublic: true
      }
    ],
    clothingItems: [
      {
        id: 'item-1',
        name: 'Test Item',
        brand: 'Test Brand',
        price: 50,
        currency: 'USD',
        color: 'Blue',
        category: 'top',
        directLink: 'https://example.com',
        imageUrl: 'https://example.com/item.jpg',
        availability: 'in-stock'
      }
    ],
    users: [
      {
        id: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        bio: 'Test bio',
        avatarUrl: 'https://example.com/avatar.jpg',
        followers: 100,
        following: 50,
        outfits: [],
        isVerified: false,
        joinedAt: new Date('2024-01-01')
      }
    ]
  }
}));

describe('apiService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    process.env = { ...originalEnv };
    // Mock setTimeout for simulateApiDelay
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    process.env = originalEnv;
  });

  describe('processOutfitUpload', () => {
    const mockUserInput: UserInput = {
      title: 'Test Outfit',
      description: 'Test description',
      occasion: 'casual',
      season: 'spring',
      styleTags: ['casual'],
      items: [
        {
          name: 'Test Item',
          brand: 'Test Brand',
          price: 50,
          currency: 'USD',
          color: 'Blue',
          category: 'top',
          directLink: 'https://example.com',
          imageUrl: 'https://example.com/item.jpg',
          availability: 'in-stock'
        }
      ],
      mainImageUrl: 'https://example.com/image.jpg',
      isPublic: true
    };

    it('validates input and throws error when title is missing', async () => {
      const invalidInput: UserInput = {
        ...mockUserInput,
        title: ''
      };

      const result = await processOutfitUpload(invalidInput);

      expect(result.status).toBe('error');
      expect(result.message).toContain('Title and at least one clothing item are required');
      expect(result.data.success).toBe(false);
    });

    it('validates input and throws error when items array is empty', async () => {
      const invalidInput: UserInput = {
        ...mockUserInput,
        items: []
      };

      const result = await processOutfitUpload(invalidInput);

      expect(result.status).toBe('error');
      expect(result.message).toContain('Title and at least one clothing item are required');
    });

    it('successfully processes outfit upload in Firebase mode', async () => {
      // Configure Firebase
      process.env.REACT_APP_FIREBASE_API_KEY = 'test-key';
      process.env.REACT_APP_FIREBASE_PROJECT_ID = 'test-project';

      const mockOutfit: OutfitUpload = {
        id: 'outfit-123',
        userId: 'current-user',
        title: mockUserInput.title,
        description: mockUserInput.description,
        occasion: mockUserInput.occasion,
        season: mockUserInput.season,
        styleTags: mockUserInput.styleTags,
        items: mockUserInput.items.map(item => ({ ...item, id: 'item-id' })),
        mainImageUrl: mockUserInput.mainImageUrl,
        additionalImages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        shares: 0,
        isPublic: true
      };

      vi.mocked(firebaseService.createOutfit).mockResolvedValueOnce(mockOutfit);
      vi.mocked(firebaseService.getOutfits).mockResolvedValueOnce({
        outfits: [],
        lastDoc: null,
        hasMore: false
      });

      const result = await processOutfitUpload(mockUserInput);

      expect(result.status).toBe('success');
      expect(result.data.success).toBe(true);
      expect(result.data.outfit).toBeDefined();
      expect(result.data.outfit?.title).toBe(mockUserInput.title);
      expect(result.data.processingTime).toBeGreaterThanOrEqual(0);
      expect(result.data.recommendations).toBeDefined();
      expect(firebaseService.createOutfit).toHaveBeenCalledWith(
        mockUserInput,
        'current-user'
      );
    });

    it('successfully processes outfit upload in demo mode', async () => {
      // Clear Firebase config
      delete process.env.REACT_APP_FIREBASE_API_KEY;
      delete process.env.REACT_APP_FIREBASE_PROJECT_ID;

      const resultPromise = processOutfitUpload(mockUserInput);

      // Fast-forward timers
      vi.advanceTimersByTime(2000);
      const result = await resultPromise;

      expect(result.status).toBe('success');
      expect(result.data.success).toBe(true);
      expect(result.data.outfit).toBeDefined();
      expect(result.data.outfit?.title).toBe(mockUserInput.title);
      expect(result.data.processingTime).toBe(2000);
      expect(result.message).toContain('Demo mode');
    });

    it('processes outfit upload with isPublic set to false in demo mode', async () => {
      delete process.env.REACT_APP_FIREBASE_API_KEY;
      delete process.env.REACT_APP_FIREBASE_PROJECT_ID;

      const inputWithPrivate = {
        ...mockUserInput,
        isPublic: false
      };

      const resultPromise = processOutfitUpload(inputWithPrivate);

      vi.advanceTimersByTime(2000);
      const result = await resultPromise;

      expect(result.status).toBe('success');
      expect(result.data.outfit?.isPublic).toBe(false);
    });

    it('handles errors gracefully', async () => {
      process.env.REACT_APP_FIREBASE_API_KEY = 'test-key';
      process.env.REACT_APP_FIREBASE_PROJECT_ID = 'test-project';

      vi.mocked(firebaseService.createOutfit).mockRejectedValueOnce(
        new Error('Firebase error')
      );

      const result = await processOutfitUpload(mockUserInput);

      expect(result.status).toBe('error');
      expect(result.message).toBe('Firebase error');
      expect(result.data.success).toBe(false);
    });

    it('handles null values in input', async () => {
      const invalidInput: Partial<UserInput> = {
        title: null as any,
        items: null as any
      };

      const result = await processOutfitUpload(invalidInput as UserInput);

      expect(result.status).toBe('error');
    });
  });

  describe('searchOutfits', () => {
    beforeEach(() => {
      delete process.env.REACT_APP_FIREBASE_API_KEY;
      delete process.env.REACT_APP_FIREBASE_PROJECT_ID;
    });

    it('searches outfits successfully in demo mode', async () => {
      const resultPromise = searchOutfits('casual', {}, 1, 10);

      vi.advanceTimersByTime(1500);
      const result = await resultPromise;

      expect(result.status).toBe('success');
      expect(result.data.outfits).toBeDefined();
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
    });

    it('searches outfits with filters in demo mode', async () => {
      const filters: SearchFilters = {
        occasion: 'casual',
        season: 'summer'
      };

      const resultPromise = searchOutfits('', filters, 1, 10);

      vi.advanceTimersByTime(1500);
      const result = await resultPromise;

      expect(result.status).toBe('success');
      expect(result.data.outfits).toBeDefined();
    });

    it('searches outfits successfully in Firebase mode', async () => {
      process.env.REACT_APP_FIREBASE_API_KEY = 'test-key';
      process.env.REACT_APP_FIREBASE_PROJECT_ID = 'test-project';

      const mockOutfits: OutfitUpload[] = [
        {
          id: 'outfit-1',
          userId: 'user-1',
          title: 'Test Outfit',
          description: 'Test',
          occasion: 'casual',
          season: 'spring',
          styleTags: [],
          items: [],
          mainImageUrl: 'https://example.com/image.jpg',
          additionalImages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          likes: 0,
          shares: 0,
          isPublic: true
        }
      ];

      vi.mocked(firebaseService.searchOutfitsByText).mockResolvedValueOnce({
        outfits: mockOutfits,
        totalCount: mockOutfits.length,
        hasMore: false
      });

      const result = await searchOutfits('test', {}, 1, 10);

      expect(result.status).toBe('success');
      expect(result.data.outfits).toEqual(mockOutfits);
      expect(result.data.totalCount).toBe(mockOutfits.length);
      expect(firebaseService.searchOutfitsByText).toHaveBeenCalledWith(
        'test',
        {},
        1,
        10
      );
    });

    it('handles empty query', async () => {
      const resultPromise = searchOutfits('', {}, 1, 10);

      vi.advanceTimersByTime(1500);
      const result = await resultPromise;

      expect(result.status).toBe('success');
      expect(result.data.outfits).toBeDefined();
    });

    it('handles pagination correctly', async () => {
      const resultPromise = searchOutfits('', {}, 2, 5);

      vi.advanceTimersByTime(1500);
      const result = await resultPromise;

      expect(result.status).toBe('success');
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(5);
    });

    it('searches outfits by description in demo mode', async () => {
      delete process.env.REACT_APP_FIREBASE_API_KEY;
      delete process.env.REACT_APP_FIREBASE_PROJECT_ID;

      // The mock DEMO_DATA already has an outfit with description "Perfect for a sunny day"
      // Search for "sunny" which should match the description (line 212)
      const resultPromise = searchOutfits('sunny', {}, 1, 10);

      vi.advanceTimersByTime(1500);
      const result = await resultPromise;

      expect(result.status).toBe('success');
      expect(result.data.outfits.length).toBeGreaterThan(0);
      expect(result.data.outfits.some(o => 
        o.description.toLowerCase().includes('sunny')
      )).toBe(true);
    });

    it('searches outfits by styleTags in demo mode', async () => {
      delete process.env.REACT_APP_FIREBASE_API_KEY;
      delete process.env.REACT_APP_FIREBASE_PROJECT_ID;

      // The mock DEMO_DATA already has an outfit with styleTags ['casual', 'summer']
      // Search for "casual" which should match the styleTags (line 213)
      // This tests the branch where title doesn't match but styleTags do
      const resultPromise = searchOutfits('casual', {}, 1, 10);

      vi.advanceTimersByTime(1500);
      const result = await resultPromise;

      expect(result.status).toBe('success');
      expect(result.data.outfits.length).toBeGreaterThan(0);
      expect(result.data.outfits.some(o => 
        o.styleTags.some(tag => tag.toLowerCase().includes('casual'))
      )).toBe(true);
    });

    it('searches outfits by styleTags when title and description do not match', async () => {
      delete process.env.REACT_APP_FIREBASE_API_KEY;
      delete process.env.REACT_APP_FIREBASE_PROJECT_ID;

      // Test case where query only matches styleTag (not title or description)
      // Search for 'vintage' which is in styleTags but not in title or description of outfit-2
      // This ensures the styleTags.some() branch is fully covered (line 213)
      // The OR condition will check: title (false) -> description (false) -> styleTags (true)
      const resultPromise = searchOutfits('vintage', {}, 1, 10);

      vi.advanceTimersByTime(1500);
      const result = await resultPromise;

      expect(result.status).toBe('success');
      expect(result.data.outfits.length).toBeGreaterThan(0);
      // Verify it matched by styleTags, not title or description
      const matchedOutfit = result.data.outfits.find(o => o.styleTags.includes('vintage'));
      expect(matchedOutfit).toBeDefined();
      expect(matchedOutfit!.title.toLowerCase()).not.toContain('vintage');
      expect(matchedOutfit!.description.toLowerCase()).not.toContain('vintage');
    });

    it('filters outfits by styleTags in demo mode', async () => {
      delete process.env.REACT_APP_FIREBASE_API_KEY;
      delete process.env.REACT_APP_FIREBASE_PROJECT_ID;

      // The mock DEMO_DATA already has an outfit with styleTags ['casual', 'summer']
      // Filter by 'casual' which should match (lines 227-230)
      const filters: SearchFilters = {
        styleTags: ['casual']
      };

      const resultPromise = searchOutfits('', filters, 1, 10);

      vi.advanceTimersByTime(1500);
      const result = await resultPromise;

      expect(result.status).toBe('success');
      expect(result.data.outfits.length).toBeGreaterThan(0);
      expect(result.data.outfits.every(o => 
        o.styleTags.includes('casual')
      )).toBe(true);
    });

    it('handles errors gracefully', async () => {
      process.env.REACT_APP_FIREBASE_API_KEY = 'test-key';
      process.env.REACT_APP_FIREBASE_PROJECT_ID = 'test-project';

      vi.mocked(firebaseService.searchOutfitsByText).mockRejectedValueOnce(
        new Error('Search failed')
      );

      const result = await searchOutfits('test', {}, 1, 10);

      expect(result.status).toBe('error');
      expect(result.message).toBe('Search failed');
      expect(result.data.outfits).toEqual([]);
      expect(result.data.totalCount).toBe(0);
    });
  });

  describe('getOutfitById', () => {
    it('retrieves outfit successfully in demo mode', async () => {
      delete process.env.REACT_APP_FIREBASE_API_KEY;
      delete process.env.REACT_APP_FIREBASE_PROJECT_ID;

      const outfitId = 'outfit-1';

      const resultPromise = getOutfitById(outfitId);

      vi.advanceTimersByTime(1000);
      const result = await resultPromise;

      expect(result.status).toBe('success');
      expect(result.data).toBeDefined();
    });

    it('retrieves outfit successfully in Firebase mode', async () => {
      process.env.REACT_APP_FIREBASE_API_KEY = 'test-key';
      process.env.REACT_APP_FIREBASE_PROJECT_ID = 'test-project';

      const mockOutfit: OutfitUpload = {
        id: 'outfit-123',
        userId: 'user-1',
        title: 'Test Outfit',
        description: 'Test',
        occasion: 'casual',
        season: 'spring',
        styleTags: [],
        items: [],
        mainImageUrl: 'https://example.com/image.jpg',
        additionalImages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        shares: 0,
        isPublic: true
      };

      vi.mocked(firebaseService.getOutfitById).mockResolvedValueOnce(mockOutfit);

      const result = await getOutfitById('outfit-123');

      expect(result.status).toBe('success');
      expect(result.data).toEqual(mockOutfit);
      expect(firebaseService.getOutfitById).toHaveBeenCalledWith('outfit-123');
    });

    it('returns null when outfit not found in Firebase mode', async () => {
      process.env.REACT_APP_FIREBASE_API_KEY = 'test-key';
      process.env.REACT_APP_FIREBASE_PROJECT_ID = 'test-project';

      vi.mocked(firebaseService.getOutfitById).mockResolvedValueOnce(null);

      const result = await getOutfitById('non-existent');

      expect(result.status).toBe('error');
      expect(result.data).toBeNull();
      expect(result.message).toContain('not found');
    });

    it('handles errors gracefully', async () => {
      process.env.REACT_APP_FIREBASE_API_KEY = 'test-key';
      process.env.REACT_APP_FIREBASE_PROJECT_ID = 'test-project';

      vi.mocked(firebaseService.getOutfitById).mockRejectedValueOnce(
        new Error('Failed to fetch')
      );

      const result = await getOutfitById('outfit-123');

      expect(result.status).toBe('error');
      expect(result.message).toBe('Failed to fetch');
      expect(result.data).toBeNull();
    });
  });

  describe('getUserProfile', () => {
    it('retrieves user profile successfully in demo mode', async () => {
      delete process.env.REACT_APP_FIREBASE_API_KEY;
      delete process.env.REACT_APP_FIREBASE_PROJECT_ID;

      const userId = 'user-1';

      const resultPromise = getUserProfile(userId);

      vi.advanceTimersByTime(1000);
      const result = await resultPromise;

      expect(result.status).toBe('success');
      expect(result.data).toBeDefined();
    });

    it('retrieves user profile successfully in Firebase mode', async () => {
      process.env.REACT_APP_FIREBASE_API_KEY = 'test-key';
      process.env.REACT_APP_FIREBASE_PROJECT_ID = 'test-project';

      const mockUser: UserProfile = {
        id: 'user-123',
        username: 'testuser',
        displayName: 'Test User',
        bio: 'Test bio',
        avatarUrl: 'https://example.com/avatar.jpg',
        followers: 100,
        following: 50,
        outfits: [],
        isVerified: false,
        joinedAt: new Date('2024-01-01')
      };

      vi.mocked(firebaseService.getUserProfile).mockResolvedValueOnce(mockUser);

      const result = await getUserProfile('user-123');

      expect(result.status).toBe('success');
      expect(result.data).toEqual(mockUser);
      expect(firebaseService.getUserProfile).toHaveBeenCalledWith('user-123');
    });

    it('returns null when user not found', async () => {
      process.env.REACT_APP_FIREBASE_API_KEY = 'test-key';
      process.env.REACT_APP_FIREBASE_PROJECT_ID = 'test-project';

      vi.mocked(firebaseService.getUserProfile).mockResolvedValueOnce(null);

      const result = await getUserProfile('non-existent');

      expect(result.status).toBe('error');
      expect(result.data).toBeNull();
      expect(result.message).toContain('not found');
    });

    it('handles errors gracefully', async () => {
      process.env.REACT_APP_FIREBASE_API_KEY = 'test-key';
      process.env.REACT_APP_FIREBASE_PROJECT_ID = 'test-project';

      vi.mocked(firebaseService.getUserProfile).mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await getUserProfile('user-123');

      expect(result.status).toBe('error');
      expect(result.message).toBe('Network error');
      expect(result.data).toBeNull();
    });
  });

  describe('likeOutfit', () => {
    it('likes outfit successfully in demo mode', async () => {
      delete process.env.REACT_APP_FIREBASE_API_KEY;
      delete process.env.REACT_APP_FIREBASE_PROJECT_ID;

      const outfitId = 'outfit-1';

      const resultPromise = likeOutfit(outfitId);

      vi.advanceTimersByTime(500);
      const result = await resultPromise;

      expect(result.status).toBe('success');
      expect(result.data.likes).toBeGreaterThanOrEqual(0);
      expect(result.message).toContain('Demo mode');
    });

    it('handles like outfit when outfit not found in demo mode', async () => {
      delete process.env.REACT_APP_FIREBASE_API_KEY;
      delete process.env.REACT_APP_FIREBASE_PROJECT_ID;

      const nonExistentId = 'non-existent-outfit';

      const resultPromise = likeOutfit(nonExistentId);

      vi.advanceTimersByTime(500);
      const result = await resultPromise;

      expect(result.status).toBe('success');
      expect(result.data.likes).toBe(0);
    });

    it('likes outfit successfully in Firebase mode', async () => {
      process.env.REACT_APP_FIREBASE_API_KEY = 'test-key';
      process.env.REACT_APP_FIREBASE_PROJECT_ID = 'test-project';

      vi.mocked(firebaseService.likeOutfit).mockResolvedValueOnce(15);

      const result = await likeOutfit('outfit-123');

      expect(result.status).toBe('success');
      expect(result.data.likes).toBe(15);
      expect(firebaseService.likeOutfit).toHaveBeenCalledWith(
        'outfit-123',
        'current-user'
      );
    });

    it('handles errors gracefully', async () => {
      process.env.REACT_APP_FIREBASE_API_KEY = 'test-key';
      process.env.REACT_APP_FIREBASE_PROJECT_ID = 'test-project';

      vi.mocked(firebaseService.likeOutfit).mockRejectedValueOnce(
        new Error('Like failed')
      );

      const result = await likeOutfit('outfit-123');

      expect(result.status).toBe('error');
      expect(result.message).toBe('Like failed');
      expect(result.data.likes).toBe(0);
    });
  });

  describe('shareOutfit', () => {
    it('shares outfit successfully in demo mode', async () => {
      delete process.env.REACT_APP_FIREBASE_API_KEY;
      delete process.env.REACT_APP_FIREBASE_PROJECT_ID;

      const outfitId = 'outfit-1';

      const resultPromise = shareOutfit(outfitId);

      vi.advanceTimersByTime(500);
      const result = await resultPromise;

      expect(result.status).toBe('success');
      expect(result.data.shares).toBeGreaterThanOrEqual(0);
      expect(result.message).toContain('Demo mode');
    });

    it('handles share outfit when outfit not found in demo mode', async () => {
      delete process.env.REACT_APP_FIREBASE_API_KEY;
      delete process.env.REACT_APP_FIREBASE_PROJECT_ID;

      const nonExistentId = 'non-existent-outfit';

      const resultPromise = shareOutfit(nonExistentId);

      vi.advanceTimersByTime(500);
      const result = await resultPromise;

      expect(result.status).toBe('success');
      expect(result.data.shares).toBe(0);
    });

    it('shares outfit successfully in Firebase mode', async () => {
      process.env.REACT_APP_FIREBASE_API_KEY = 'test-key';
      process.env.REACT_APP_FIREBASE_PROJECT_ID = 'test-project';

      vi.mocked(firebaseService.shareOutfit).mockResolvedValueOnce(8);

      const result = await shareOutfit('outfit-123');

      expect(result.status).toBe('success');
      expect(result.data.shares).toBe(8);
      expect(firebaseService.shareOutfit).toHaveBeenCalledWith(
        'outfit-123',
        'current-user'
      );
    });

    it('handles errors gracefully', async () => {
      process.env.REACT_APP_FIREBASE_API_KEY = 'test-key';
      process.env.REACT_APP_FIREBASE_PROJECT_ID = 'test-project';

      vi.mocked(firebaseService.shareOutfit).mockRejectedValueOnce(
        new Error('Share failed')
      );

      const result = await shareOutfit('outfit-123');

      expect(result.status).toBe('error');
      expect(result.message).toBe('Share failed');
      expect(result.data.shares).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('handles empty string inputs', async () => {
      delete process.env.REACT_APP_FIREBASE_API_KEY;

      const resultPromise = searchOutfits('', {}, 1, 10);

      vi.advanceTimersByTime(1500);
      const result = await resultPromise;

      expect(result.status).toBe('success');
    });

    it('handles very large page numbers', async () => {
      const resultPromise = searchOutfits('', {}, 999999, 10);

      vi.advanceTimersByTime(1500);
      const result = await resultPromise;

      expect(result.status).toBe('success');
    });

    it('handles zero limit', async () => {
      const resultPromise = searchOutfits('', {}, 1, 0);

      vi.advanceTimersByTime(1500);
      const result = await resultPromise;

      expect(result.status).toBe('success');
      expect(result.data.limit).toBe(0);
    });
  });
});

