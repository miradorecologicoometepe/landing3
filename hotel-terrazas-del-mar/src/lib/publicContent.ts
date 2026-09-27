import type { HotelConfig, PhotoItem, Room } from '../types';
import type { FaqItem } from '../data/faqs';
import { HOTEL_CONFIG } from '../data/hotelData';
import { supabase } from './supabase';

export interface PublicSiteData {
  config?: HotelConfig;
  rooms?: Room[];
  photos?: PhotoItem[];
  faqs?: FaqItem[];
  error?: string;
}

/** Read-only public content. Admin editing is intentionally not enabled until Auth is configured. */
export async function loadPublicSiteData(): Promise<PublicSiteData> {
  if (!supabase) return {};
  const [configResult, roomsResult, photosResult, faqsResult] = await Promise.all([
    supabase.from('site_content').select('value').eq('key', 'hotel_config').maybeSingle(),
    supabase.from('rooms').select('details').order('id'),
    supabase.from('gallery_photos').select('id, category, image_path, details, sort_order').order('sort_order'),
    supabase.from('site_content').select('value').eq('key', 'hotel_faqs').maybeSingle(),
  ]);
  if (configResult.error || roomsResult.error || photosResult.error || faqsResult.error) {
    console.error('Supabase public content fetch failed', configResult.error, roomsResult.error, photosResult.error, faqsResult.error);
    return { error: 'No se pudo cargar el contenido publicado.' };
  }
  const config = configResult.data?.value as Partial<HotelConfig> | undefined;
  const rooms = roomsResult.data?.map(row => {
    const room = row.details as Room;
    return room ? { ...room, images: Array.isArray(room.images) ? room.images.filter(Boolean) : [] } : room;
  }).filter(room => Boolean(room?.id));
  const photos = photosResult.data?.map(row => ({
    ...(row.details as Omit<PhotoItem, 'id' | 'url'>),
    id: row.id,
    url: row.image_path,
  })).filter(photo => Boolean(photo.url));
  const faqs = Array.isArray(faqsResult.data?.value) ? (faqsResult.data.value as FaqItem[]).filter(item => typeof item.q === 'string' && typeof item.a === 'string') : undefined;
  return {
    config: config ? { ...HOTEL_CONFIG, ...config } : undefined,
    rooms: rooms?.length ? rooms : undefined,
    photos: photos ?? undefined,
    faqs,
  };
}
