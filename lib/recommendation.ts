import { DEMO_MOODS, DEMO_PLACES } from './mock-data';
import { Place } from '@/types';

export interface RecommendationInput {
  moodSlug: string;
  activity?: string; // 'nugas' | 'meeting' | 'date' | 'hangout' | 'relax'
  extraPreferences?: string[]; // 'wifi' | 'outdoor' | 'colokan' | 'live_music' | 'pet_friendly' | 'late_night'
  city?: string;
}

export function calculatePlaceMatchScore(
  place: Place,
  moodSlug: string,
  activity?: string,
  extraPreferences: string[] = []
): number {
  let score = 50; // Base score

  // 1. Mood Matching
  const placeMood = place.moods?.find((m) => m.slug === moodSlug);
  if (placeMood) {
    score += (placeMood.score || 80) * 0.35; // Add up to 35 points based on direct mood score
  } else {
    // Check if category or description contains keyword related to mood
    const targetMoodObj = DEMO_MOODS.find((m) => m.slug === moodSlug);
    if (targetMoodObj) {
      if (place.description.toLowerCase().includes(targetMoodObj.name.toLowerCase())) {
        score += 15;
      }
    }
  }

  // 2. Mood Specific Rules
  switch (moodSlug) {
    case 'fokus':
    case 'nugas':
      // Requires wifi & colokan
      const hasWifi = place.facilities?.some((f) => f.name.toLowerCase().includes('wifi'));
      const hasColokan = place.facilities?.some((f) => f.name.toLowerCase().includes('colokan'));
      const hasErgonomic = place.facilities?.some((f) => f.name.toLowerCase().includes('meja kerja'));
      if (hasWifi) score += 10;
      if (hasColokan) score += 10;
      if (hasErgonomic) score += 5;
      if (place.category?.slug === 'work-coffee-space') score += 10;
      break;

    case 'santai':
      if (place.facilities?.some((f) => f.name.toLowerCase().includes('outdoor'))) score += 10;
      if (place.category?.slug === 'garden-cafe-outdoor') score += 10;
      break;

    case 'ngobrol':
    case 'ramai':
      if (place.facilities?.some((f) => f.name.toLowerCase().includes('outdoor') || f.name.toLowerCase().includes('parkir'))) score += 10;
      break;

    case 'romantis':
      if (place.price_level >= 2) score += 5;
      if (place.name.toLowerCase().includes('glasshouse') || place.name.toLowerCase().includes('terrace') || place.name.toLowerCase().includes('lumina')) score += 12;
      break;

    case 'estetik':
      if (place.name.toLowerCase().includes('aesthetic') || place.description.toLowerCase().includes('instagramable') || place.description.toLowerCase().includes('estetik')) score += 15;
      break;

    case 'live-music':
      if (place.description.toLowerCase().includes('music') || place.description.toLowerCase().includes('acoustic')) score += 20;
      break;

    case 'nongkrong-malam':
      const isLateOpen = place.opening_hours.some((h) => h.close === '00:00' || h.close === '01:00' || h.close === '02:00' || h.close === '24:00');
      if (isLateOpen) score += 20;
      break;
  }

  // 3. Activity Matching
  if (activity) {
    if (activity === 'nugas' && (place.facilities?.some((f) => f.name.includes('Colokan')) || place.category_id.includes('4'))) {
      score += 8;
    } else if (activity === 'date' && (place.moods?.some((m) => m.slug === 'romantis') || place.price_level >= 2)) {
      score += 8;
    } else if (activity === 'hangout' && place.moods?.some((m) => m.slug === 'ngobrol' || m.slug === 'santai')) {
      score += 8;
    }
  }

  // 4. Extra Preferences Matching
  extraPreferences.forEach((pref) => {
    if (pref === 'wifi' && place.facilities?.some((f) => f.name.toLowerCase().includes('wifi'))) score += 5;
    if (pref === 'outdoor' && place.facilities?.some((f) => f.name.toLowerCase().includes('outdoor'))) score += 5;
    if (pref === 'colokan' && place.facilities?.some((f) => f.name.toLowerCase().includes('colokan'))) score += 5;
    if (pref === 'pet_friendly' && place.facilities?.some((f) => f.name.toLowerCase().includes('pet'))) score += 5;
    if (pref === 'late_night' && place.opening_hours.some((h) => h.close === '00:00' || h.close === '01:00' || h.close === '24:00')) score += 5;
  });

  // Rating boost
  score += Math.round(place.average_rating * 2);

  // Cap score between 75% and 99%
  return Math.min(99, Math.max(72, Math.round(score)));
}

export function getRecommendedPlaces(
  input: RecommendationInput,
  placesList: Place[] = DEMO_PLACES
): Place[] {
  let filtered = [...placesList];

  if (input.city && input.city !== 'Semua') {
    filtered = filtered.filter((p) => p.city.toLowerCase() === input.city?.toLowerCase());
  }

  const scored = filtered.map((place) => {
    const matchScore = calculatePlaceMatchScore(place, input.moodSlug, input.activity, input.extraPreferences);
    return { ...place, match_score: matchScore };
  });

  // Sort by match score descending
  return scored.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
}
