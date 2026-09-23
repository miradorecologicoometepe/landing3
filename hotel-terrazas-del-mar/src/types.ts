export interface PricingTier {
  guests: number;
  price: number;
  label?: string;
}

export interface Room {
  id: string;
  name: string;
  tagline: string;
  type: string;
  pricePerNight: number;
  originalPrice: number;
  capacity: {
    adults: number;
    children: number;
  };
  maxOccupancy: number; // Cantidad máxima de personas permitidas
  pricingTiers?: PricingTier[];
  bedType: string;
  sizeM2: number;
  view: string;
  badge?: string;
  featured?: boolean;
  amenities: string[];
  images: string[];
  description: string;
  includedServices: string[];
}

export interface BookingReservation {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomTypeId: string;
  roomsCount: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  specialRequests: string;
  addons: {
    breakfast: boolean;
    airportTransfer: boolean;
    romanticPackage: boolean;
    lateCheckout: boolean;
  };
}

export type PhotoCategory = 'all' | 'rooms' | 'pool' | 'gastronomy' | 'events' | 'spa' | 'outdoors';

export interface PhotoItem {
  id: string;
  title: string;
  category: PhotoCategory;
  url: string;
  caption: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  roomTypeId?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  country: string;
  flag: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  roomStayed: string;
  travelerType: string;
}

export interface HotelConfig {
  logoUrl?: string;
  name: string;
  stars: number;
  ratingScore: number;
  totalReviews: number;
  whatsAppNumber: string;
  displayPhone: string;
  address: string;
  locationArea: string;
  email: string;
  currency: 'USD' | 'EUR' | 'MXN';
  checkInTime: string;
  checkOutTime: string;
}
