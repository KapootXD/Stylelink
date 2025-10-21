import { OutfitUpload, ClothingItem, UserProfile, StyleAnalysis } from '../types';

// Demo clothing items
const demoClothingItems: ClothingItem[] = [
  {
    id: 'item-1',
    name: 'Classic White Button-Up Shirt',
    brand: 'Everlane',
    price: 78,
    currency: 'USD',
    size: 'M',
    color: 'White',
    category: 'top',
    directLink: 'https://www.everlane.com/products/womens-cotton-oxford-shirt',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    availability: 'in-stock'
  },
  {
    id: 'item-2',
    name: 'High-Waisted Denim Jeans',
    brand: 'Levi\'s',
    price: 98,
    currency: 'USD',
    size: '28',
    color: 'Blue',
    category: 'bottom',
    directLink: 'https://www.levi.com/US/en_US/clothing/women/jeans/501-original-fit-jeans/p/5010000000',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400',
    availability: 'in-stock'
  },
  {
    id: 'item-3',
    name: 'Leather Ankle Boots',
    brand: 'Dr. Martens',
    price: 150,
    currency: 'USD',
    size: '8',
    color: 'Black',
    category: 'shoes',
    directLink: 'https://www.drmartens.com/us/en/p/1460-smooth-leather-ankle-boots',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    availability: 'in-stock'
  },
  {
    id: 'item-4',
    name: 'Oversized Blazer',
    brand: 'Zara',
    price: 89,
    currency: 'USD',
    size: 'M',
    color: 'Navy',
    category: 'outerwear',
    directLink: 'https://www.zara.com/us/en/woman-blazers-c358002.html',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
    availability: 'in-stock'
  },
  {
    id: 'item-5',
    name: 'Minimalist Gold Hoop Earrings',
    brand: 'Mejuri',
    price: 45,
    currency: 'USD',
    color: 'Gold',
    category: 'accessories',
    directLink: 'https://mejuri.com/shop/products/classic-hoop-earring',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
    availability: 'in-stock'
  }
];

// Demo user profiles
export const demoUsers: UserProfile[] = [
  {
    id: 'user-1',
    username: 'stylequeen_sarah',
    displayName: 'Sarah Chen',
    bio: 'Fashion enthusiast sharing daily outfit inspiration ✨',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    followers: 12500,
    following: 890,
    outfits: [],
    isVerified: true,
    joinedAt: new Date('2023-01-15')
  },
  {
    id: 'user-2',
    username: 'minimalist_maya',
    displayName: 'Maya Rodriguez',
    bio: 'Sustainable fashion advocate | Minimalist lifestyle',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    followers: 8900,
    following: 1200,
    outfits: [],
    isVerified: false,
    joinedAt: new Date('2023-03-22')
  }
];

// Demo outfit uploads with realistic scenarios
export const demoOutfits: OutfitUpload[] = [
  {
    id: 'outfit-1',
    userId: 'user-1',
    title: 'Casual Friday Office Look',
    description: 'Perfect for those casual Friday meetings. The blazer adds professionalism while keeping it relaxed.',
    occasion: 'work',
    season: 'fall',
    styleTags: ['casual', 'professional', 'minimalist'],
    items: [demoClothingItems[0], demoClothingItems[1], demoClothingItems[3]],
    mainImageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
    additionalImages: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    likes: 234,
    shares: 45,
    isPublic: true
  },
  {
    id: 'outfit-2',
    userId: 'user-2',
    title: 'Weekend Brunch Vibes',
    description: 'Comfortable yet stylish for weekend outings. The oversized blazer keeps it chic.',
    occasion: 'casual',
    season: 'spring',
    styleTags: ['casual', 'weekend', 'comfortable'],
    items: [demoClothingItems[0], demoClothingItems[1], demoClothingItems[4]],
    mainImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600',
    additionalImages: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600'
    ],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    likes: 189,
    shares: 23,
    isPublic: true
  },
  {
    id: 'outfit-3',
    userId: 'user-1',
    title: 'Date Night Elegance',
    description: 'Sophisticated look for a romantic dinner. The blazer elevates the entire ensemble.',
    occasion: 'date',
    season: 'winter',
    styleTags: ['elegant', 'romantic', 'sophisticated'],
    items: [demoClothingItems[0], demoClothingItems[1], demoClothingItems[2], demoClothingItems[4]],
    mainImageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
    additionalImages: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600'
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    likes: 456,
    shares: 78,
    isPublic: true
  },
  {
    id: 'outfit-4',
    userId: 'user-2',
    title: 'Minimalist Monday',
    description: 'Clean, simple, and professional. Perfect for starting the week with confidence.',
    occasion: 'work',
    season: 'spring',
    styleTags: ['minimalist', 'professional', 'clean'],
    items: [demoClothingItems[0], demoClothingItems[1]],
    mainImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600',
    additionalImages: [],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    likes: 123,
    shares: 34,
    isPublic: true
  },
  {
    id: 'outfit-5',
    userId: 'user-1',
    title: 'Creative Studio Day',
    description: 'Comfortable yet put-together for a day of creative work. The accessories add personality.',
    occasion: 'creative',
    season: 'summer',
    styleTags: ['creative', 'comfortable', 'artistic'],
    items: [demoClothingItems[0], demoClothingItems[1], demoClothingItems[4]],
    mainImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600',
    additionalImages: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600'
    ],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    likes: 167,
    shares: 29,
    isPublic: true
  },
  {
    id: 'outfit-6',
    userId: 'user-2',
    title: 'Weekend Warrior',
    description: 'Ready for anything the weekend throws at you. Comfortable boots for walking around the city.',
    occasion: 'weekend',
    season: 'fall',
    styleTags: ['weekend', 'comfortable', 'versatile'],
    items: [demoClothingItems[0], demoClothingItems[1], demoClothingItems[2]],
    mainImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600',
    additionalImages: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600'
    ],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    likes: 98,
    shares: 15,
    isPublic: true
  },
  {
    id: 'outfit-7',
    userId: 'user-1',
    title: 'Conference Professional',
    description: 'Sharp and professional for networking events. The blazer commands attention.',
    occasion: 'professional',
    season: 'winter',
    styleTags: ['professional', 'networking', 'sharp'],
    items: [demoClothingItems[0], demoClothingItems[1], demoClothingItems[3], demoClothingItems[4]],
    mainImageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
    additionalImages: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600'
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    likes: 312,
    shares: 67,
    isPublic: true
  },
  {
    id: 'outfit-8',
    userId: 'user-2',
    title: 'Art Gallery Opening',
    description: 'Sophisticated yet approachable for cultural events. The accessories add the perfect touch.',
    occasion: 'cultural',
    season: 'spring',
    styleTags: ['sophisticated', 'cultural', 'elegant'],
    items: [demoClothingItems[0], demoClothingItems[1], demoClothingItems[4]],
    mainImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600',
    additionalImages: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600'
    ],
    createdAt: new Date('2023-12-28'),
    updatedAt: new Date('2023-12-28'),
    likes: 245,
    shares: 41,
    isPublic: true
  },
  {
    id: 'outfit-9',
    userId: 'user-1',
    title: 'Summer Festival Fun',
    description: 'Bright and colorful for outdoor festivals. Comfortable shoes for dancing all day.',
    occasion: 'festival',
    season: 'summer',
    styleTags: ['festival', 'colorful', 'comfortable'],
    items: [demoClothingItems[0], demoClothingItems[1], demoClothingItems[4]],
    mainImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600',
    additionalImages: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600'
    ],
    createdAt: new Date('2023-12-25'),
    updatedAt: new Date('2023-12-25'),
    likes: 178,
    shares: 33,
    isPublic: true
  },
  {
    id: 'outfit-10',
    userId: 'user-2',
    title: 'Winter Cozy Vibes',
    description: 'Perfect for staying warm and stylish during cold winter days.',
    occasion: 'casual',
    season: 'winter',
    styleTags: ['cozy', 'warm', 'winter'],
    items: [demoClothingItems[0], demoClothingItems[1], demoClothingItems[3]],
    mainImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600',
    additionalImages: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'
    ],
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2023-12-20'),
    likes: 156,
    shares: 28,
    isPublic: true
  }
];

// Demo style analysis data
export const demoStyleAnalysis: StyleAnalysis[] = [
  {
    dominantColors: ['white', 'navy', 'black'],
    styleCategory: 'minimalist',
    confidence: 0.85,
    suggestions: [
      'Try adding a pop of color with accessories',
      'Consider layering with a cardigan',
      'The monochromatic palette works well for professional settings'
    ]
  },
  {
    dominantColors: ['blue', 'white', 'gold'],
    styleCategory: 'casual',
    confidence: 0.92,
    suggestions: [
      'Perfect for weekend outings',
      'Consider adding a statement bag',
      'The color combination is very versatile'
    ]
  }
];

// Export all demo data as a typed constant
export const DEMO_DATA = {
  outfits: demoOutfits,
  users: demoUsers,
  clothingItems: demoClothingItems,
  styleAnalysis: demoStyleAnalysis
} as const;
