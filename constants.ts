import type { Product } from './types';

export const products: Product[] = [
  {
    id: 1,
    name: 'The Natural - Vintage Tee',
    price: 45.00,
    imageUrl: 'https://placehold.co/600x600/1a202c/e53e3e?text=Fighter+Tee',
    category: 'Apparel',
  },
  {
    id: 2,
    name: 'Signature Series Hoodie',
    price: 75.00,
    imageUrl: 'https://placehold.co/600x600/1a202c/e53e3e?text=Fighter+Hoodie',
    category: 'Apparel',
  },
  {
    id: 3,
    name: 'Championship Legacy Hat',
    price: 35.00,
    imageUrl: 'https://placehold.co/600x600/1a202c/e53e3e?text=Fighter+Hat',
    category: 'Accessories',
  },
  {
    id: 4,
    name: 'Signed Fight Poster (Limited Edition)',
    price: 150.00,
    imageUrl: 'https://placehold.co/600x600/1a202c/e53e3e?text=Signed+Poster',
    category: 'Collectibles',
  },
  {
    id: 5,
    name: 'Iron Will Training Shorts',
    price: 55.00,
    imageUrl: 'https://placehold.co/600x600/1a202c/e53e3e?text=Training+Shorts',
    category: 'Apparel',
  },
  {
    id: 6,
    name: 'Victory Rashguard',
    price: 60.00,
    imageUrl: 'https://placehold.co/600x600/1a202c/e53e3e?text=Rashguard',
    category: 'Apparel',
  },
  {
    id: 7,
    name: 'Autographed Fighting Glove',
    price: 250.00,
    imageUrl: 'https://placehold.co/600x600/1a202c/e53e3e?text=Signed+Glove',
    category: 'Collectibles',
  },
  {
    id: 8,
    name: 'Fighter Crest Mug',
    price: 20.00,
    imageUrl: 'https://placehold.co/600x600/1a202c/e53e3e?text=Fighter+Mug',
    category: 'Accessories',
  },
];

export const WEIGHT_CLASSES = [
    "Flyweight",
    "Bantamweight",
    "Featherweight",
    "Lightweight",
    "Welterweight",
    "Middleweight",
    "Light Heavyweight",
    "Heavyweight",
    "Strawweight (Women's)",
    "Flyweight (Women's)",
    "Bantamweight (Women's)",
    "Featherweight (Women's)",
];

// File upload constants
export const FILE_UPLOAD = {
    MAX_SIZE_MB: 100, // 100MB limit - GCS handles large files automatically
    MAX_SIZE_BYTES: 100 * 1024 * 1024,
    ACCEPTED_TYPES: ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/quicktime'],
    ACCEPTED_EXTENSIONS: ['.mp4', '.mov', '.avi', '.webm'],
    GCS_THRESHOLD_MB: 50, // Use GCS for files larger than 50MB
    GCS_THRESHOLD_BYTES: 50 * 1024 * 1024,
} as const;

// Video processing constants
export const VIDEO_PROCESSING = {
    MAX_DURATION_MINUTES: 10,
    RECOMMENDED_DURATION_MINUTES: 5,
    COMPRESSION_QUALITY: 0.8,
} as const;
