import { Room, PhotoItem, HotelConfig } from '../types';
import { HOTEL_CONFIG, ROOMS_DATA, GALLERY_PHOTOS } from '../data/hotelData';

const STORAGE_KEYS = {
  HOTEL_CONFIG: 'mirador_hotel_config_v5',
  ROOMS: 'mirador_rooms_v5',
  PHOTOS: 'mirador_photos_v5',
  ADMIN_PIN: 'mirador_admin_pin_v5',
  ADMIN_SESSION: 'mirador_admin_session_v5',
};

const DEFAULT_ADMIN_PIN = '1234';

export function getAdminPin(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_PIN);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  } catch (e) {
    console.error('Error reading admin pin', e);
  }
  return DEFAULT_ADMIN_PIN;
}

export function setAdminPin(pin: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, pin);
  } catch (e) {
    console.error('Error saving admin pin', e);
  }
}

export function isAdminAuthenticated(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
  } catch (e) {
    return false;
  }
}

export function setAdminAuthenticated(auth: boolean): void {
  try {
    if (auth) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    }
  } catch (e) {
    console.error('Error updating admin session', e);
  }
}

// Hotel Config Storage
export function loadHotelConfig(): HotelConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.HOTEL_CONFIG);
    if (saved) {
      return { ...HOTEL_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error reading hotel config from localStorage', e);
  }
  return HOTEL_CONFIG;
}

export function saveHotelConfig(config: HotelConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HOTEL_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving hotel config to localStorage', e);
  }
}

// Rooms Storage
export function loadRooms(): Room[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ROOMS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading rooms from localStorage', e);
  }
  return ROOMS_DATA;
}

export function saveRooms(rooms: Room[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  } catch (e) {
    console.error('Error saving rooms to localStorage', e);
  }
}

// Gallery Storage
export function loadGalleryPhotos(): PhotoItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading photos from localStorage', e);
  }
  return GALLERY_PHOTOS;
}

export function saveGalleryPhotos(photos: PhotoItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
  } catch (e) {
    console.error('Error saving photos to localStorage', e);
  }
}

// Reset all to defaults
export function resetAllDataToDefault(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.HOTEL_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.ROOMS);
    localStorage.removeItem(STORAGE_KEYS.PHOTOS);
  } catch (e) {
    console.error('Error resetting data', e);
  }
}
