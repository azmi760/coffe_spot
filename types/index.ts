export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  created_at?: string;
}

export interface Mood {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  created_at?: string;
}

export interface Facility {
  id: string;
  name: string;
  icon: string;
}

export interface OpeningHour {
  day: string; // 'Senin', 'Selasa', etc.
  open: string; // '08:00'
  close: string; // '22:00'
  is_closed?: boolean;
}

export interface PlaceImage {
  id: string;
  place_id: string;
  image_url: string;
  alt_text?: string;
  display_order?: number;
}

export interface PlaceMoodScore {
  mood_id: string;
  mood_name?: string;
  score: number; // 1-100 or rating weight
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Kopi' | 'Non-Kopi' | 'Makanan' | 'Dessert';
  price: number; // e.g. 28000
  description?: string;
  is_recommended?: boolean;
  image_url?: string;
}

export interface Place {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  category_id: string;
  price_level: number; // 1: $, 2: $$, 3: $$$, 4: $$$$
  average_rating: number;
  review_count: number;
  opening_hours: OpeningHour[];
  image_url: string;
  is_active: boolean;
  phone_number?: string;
  instagram?: string;
  menu_items?: MenuItem[];
  created_at?: string;
  updated_at?: string;
  // Joined properties
  category?: Category;
  moods?: (Mood & { score?: number })[];
  facilities?: Facility[];
  images?: PlaceImage[];
  match_score?: number; // Calculated match percentage for recommendation
  is_favorite?: boolean;
}

export interface Favorite {
  id: string;
  user_id: string;
  place_id: string;
  created_at: string;
  place?: Place;
}

export interface Review {
  id: string;
  user_id: string;
  place_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at?: string;
  user_profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface FilterState {
  search: string;
  category_id: string;
  mood_slug: string;
  price_level: number | null;
  min_rating: number | null;
  facility_ids: string[];
  open_now: boolean;
  city: string;
}
