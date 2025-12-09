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

vi.mock('./firebaseService', () => ({
  createOutfit: vi.fn(),
  getOutfits: vi.fn(),
  searchOutfitsByText: vi.fn(),
  getOutfitById: vi.fn(),
  getUserProfile: vi.fn(),
  likeOutfit: vi.fn(),
  shareOutfit: vi.fn()
}));

describe('apiService', () => {
  const originalEnv = process.env;

  const setFirebaseEnv = () => {
    process.env.REACT_APP_FIREBASE_API_KEY = 'test-key';
    process.env.REACT_APP_FIREBASE_PROJECT_ID = 'test-project';
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
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
          size: 'M',
          color: 'Blue',
          category: 'top',
          imageUrl: 'https://example.com/item.jpg',
          directLink: 'https://example.com',
          availability: 'in-stock'
        }
      ],
      mainImageUrl: 'https://example.com/image.jpg',
      additionalImages: [],
      hashtags: [],
      isPublic: true
    };

    it('validates missing title or items', async () => {
      const noTitle = await processOutfitUpload({ ...mockUserInput, title: '' });
      expect(noTitle.status).toBe('error');

      const noItems = await processOutfitUpload({ ...mockUserInput, items: [] });
      expect(noItems.status).toBe('error');
    });

    it('stores the upload locally when Firebase is not configured', async () => {
      delete process.env.REACT_APP_FIREBASE_API_KEY;
      delete process.env.REACT_APP_FIREBASE_PROJECT_ID;
      localStorage.clear();

      const result = await processOutfitUpload(mockUserInput);

      expect(result.status).toBe('success');
      expect(result.data.success).toBe(true);
      expect(result.data.outfit?.id).toContain('offline-');
    });

    it('successfully processes outfit upload when Firebase is configured', async () => {
      setFirebaseEnv();

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
      vi.mocked(firebaseService.getOutfits).mockResolvedValueOnce({ outfits: [], lastDoc: null, hasMore: false });

      const result = await processOutfitUpload(mockUserInput);

      expect(result.status).toBe('success');
      expect(result.data.success).toBe(true);
      expect(result.data.outfit).toEqual(mockOutfit);
      expect(firebaseService.createOutfit).toHaveBeenCalledWith(mockUserInput, 'current-user');
    });

    it('handles Firebase errors gracefully', async () => {
      setFirebaseEnv();
      vi.mocked(firebaseService.createOutfit).mockRejectedValueOnce(new Error('Firebase error'));

      const result = await processOutfitUpload(mockUserInput);

      expect(result.status).toBe('error');
      expect(result.message).toBe('Firebase error');
    });
  });

  describe('searchOutfits', () => {
    it('falls back to offline search when Firebase is not configured', async () => {
      localStorage.clear();
      const result = await searchOutfits('casual');

      expect(result.status).toBe('success');
      expect(result.data.outfits.length).toBeGreaterThan(0);
    });

    it('searches outfits via Firebase', async () => {
      setFirebaseEnv();
      const mockOutfits: OutfitUpload[] = [
        {
          id: 'outfit-1',
          userId: 'user-1',
          title: 'Test Outfit',
          description: 'Test description',
          occasion: 'casual',
          season: 'spring',
          styleTags: ['casual'],
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

      const filters: SearchFilters = { occasion: 'casual' };
      const result = await searchOutfits('test', filters, 1, 5);

      expect(result.status).toBe('success');
      expect(result.data.outfits).toEqual(mockOutfits);
      expect(result.data.limit).toBe(5);
      expect(firebaseService.searchOutfitsByText).toHaveBeenCalledWith('test', filters, 1, 5);
    });

    it('handles Firebase search errors', async () => {
      setFirebaseEnv();
      vi.mocked(firebaseService.searchOutfitsByText).mockRejectedValueOnce(new Error('Search failed'));

      const result = await searchOutfits('test');

      expect(result.status).toBe('error');
      expect(result.message).toBe('Search failed');
      expect(result.data.outfits).toEqual([]);
    });
  });

  describe('getOutfitById', () => {
    it('returns an error when Firebase is not configured', async () => {
      const result = await getOutfitById('outfit-1');
      expect(result.status).toBe('error');
      expect(result.message).toContain('Firebase is not configured');
    });

    it('retrieves outfit with Firebase', async () => {
      setFirebaseEnv();
      const mockOutfit: OutfitUpload = {
        id: 'outfit-1',
        userId: 'user-1',
        title: 'Test Outfit',
        description: 'Test description',
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

      const result = await getOutfitById('outfit-1');

      expect(result.status).toBe('success');
      expect(result.data).toEqual(mockOutfit);
    });

    it('returns an error when outfit is not found', async () => {
      setFirebaseEnv();
      vi.mocked(firebaseService.getOutfitById).mockResolvedValueOnce(null);

      const result = await getOutfitById('missing');

      expect(result.status).toBe('error');
      expect(result.data).toBeNull();
    });
  });

  describe('getUserProfile', () => {
    it('returns an error when Firebase is not configured', async () => {
      const result = await getUserProfile('user-1');
      expect(result.status).toBe('error');
      expect(result.message).toContain('Firebase is not configured');
    });

    it('retrieves user profile with Firebase', async () => {
      setFirebaseEnv();
      const mockProfile: UserProfile = {
        id: 'user-1',
        username: 'tester',
        displayName: 'Tester',
        bio: 'Test bio',
        avatarUrl: 'https://example.com/avatar.jpg',
        followers: 10,
        following: 5,
        outfits: [],
        isVerified: false,
        joinedAt: new Date('2024-01-01')
      };

      vi.mocked(firebaseService.getUserProfile).mockResolvedValueOnce(mockProfile);

      const result = await getUserProfile('user-1');

      expect(result.status).toBe('success');
      expect(result.data).toEqual(mockProfile);
    });

    it('handles missing user profile', async () => {
      setFirebaseEnv();
      vi.mocked(firebaseService.getUserProfile).mockResolvedValueOnce(null);

      const result = await getUserProfile('missing');

      expect(result.status).toBe('error');
      expect(result.data).toBeNull();
    });
  });

  describe('likeOutfit', () => {
    it('errors when Firebase is not configured', async () => {
      const result = await likeOutfit('outfit-1');
      expect(result.status).toBe('error');
    });

    it('likes outfit with Firebase', async () => {
      setFirebaseEnv();
      vi.mocked(firebaseService.likeOutfit).mockResolvedValueOnce(5);

      const result = await likeOutfit('outfit-1');

      expect(result.status).toBe('success');
      expect(result.data.likes).toBe(5);
      expect(firebaseService.likeOutfit).toHaveBeenCalled();
    });
  });

  describe('shareOutfit', () => {
    it('errors when Firebase is not configured', async () => {
      const result = await shareOutfit('outfit-1');
      expect(result.status).toBe('error');
    });

    it('shares outfit with Firebase', async () => {
      setFirebaseEnv();
      vi.mocked(firebaseService.shareOutfit).mockResolvedValueOnce(3);

      const result = await shareOutfit('outfit-1');

      expect(result.status).toBe('success');
      expect(result.data.shares).toBe(3);
      expect(firebaseService.shareOutfit).toHaveBeenCalled();
    });
  });
});
