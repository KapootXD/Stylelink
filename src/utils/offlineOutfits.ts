import { DEMO_DATA } from '../data/demoData';
import { OutfitUpload, SearchFilters } from '../types';

const STORAGE_KEY = 'stylelink_offline_outfits_v1';

const reviveOutfitDates = (outfit: OutfitUpload): OutfitUpload => ({
  ...outfit,
  createdAt: outfit.createdAt instanceof Date ? outfit.createdAt : new Date(outfit.createdAt),
  updatedAt: outfit.updatedAt instanceof Date ? outfit.updatedAt : new Date(outfit.updatedAt)
});

const loadFromStorage = (): OutfitUpload[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as OutfitUpload[];
    return parsed.map(reviveOutfitDates);
  } catch (error) {
    console.error('Failed to read offline outfits:', error);
    return [];
  }
};

const saveToStorage = (outfits: OutfitUpload[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(outfits));
  } catch (error) {
    console.error('Failed to save offline outfits:', error);
  }
};

const getAllOutfits = (): OutfitUpload[] => {
  const stored = loadFromStorage();
  if (stored.length > 0) return stored;

  // Seed with demo data on first run so the discovery feed has content
  saveToStorage(DEMO_DATA.outfits);
  return DEMO_DATA.outfits;
};

const matchesFilters = (outfit: OutfitUpload, filters: SearchFilters): boolean => {
  if (filters.userId && outfit.userId !== filters.userId) return false;
  if (filters.occasion && outfit.occasion !== filters.occasion) return false;
  if (filters.season && outfit.season !== filters.season) return false;
  if (filters.styleTags && filters.styleTags.length > 0) {
    const hasTag = filters.styleTags.some((tag) => outfit.styleTags.includes(tag));
    if (!hasTag) return false;
  }
  return true;
};

export const searchOfflineOutfits = (
  query: string = '',
  filters: SearchFilters = {},
  page: number = 1,
  limit: number = 10
): { outfits: OutfitUpload[]; hasMore: boolean } => {
  const outfits = getAllOutfits();
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = outfits
    .filter((outfit) => matchesFilters(outfit, filters))
    .filter((outfit) => {
      if (!normalizedQuery) return true;
      return (
        outfit.title.toLowerCase().includes(normalizedQuery) ||
        outfit.description.toLowerCase().includes(normalizedQuery) ||
        outfit.styleTags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);

  return {
    outfits: paginated,
    hasMore: end < filtered.length
  };
};

export const addOfflineOutfit = (outfit: OutfitUpload): OutfitUpload => {
  const outfits = getAllOutfits();
  const updated = [outfit, ...outfits];
  saveToStorage(updated);
  return outfit;
};
