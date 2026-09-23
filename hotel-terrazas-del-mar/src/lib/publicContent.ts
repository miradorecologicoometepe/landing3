import type { HotelConfig, PhotoItem, Room } from '../types';
import { HOTEL_CONFIG } from '../data/hotelData';
import { supabase } from './supabase';

export interface PublicSiteData {
  config?: HotelConfig;
  rooms?: Room[];
  photos?: PhotoItem[];
}

/** Read-only public content. Admin editing is intentionally not enabled until Auth is configured. */
export async function loadPublicSiteData(): Promise<PublicSiteData> {
  if (!supabase) return {};
  const [configResult, roomsResult, photosResult] = await Promise.all([
    supabase.from('site_content').select('value').eq('key', 'hotel_config').maybeSingle(),
    supabase.from('rooms').select('details').order('id'),
    supabase.from('gallery_photos').select('id, category, image_path, details, sort_order').order('sort_order'),
  ]);
  if (configResult.error || roomsResult.error || photosResult.error) {
    console.error('Supabase public content fetch failed', configResult.error, roomsResult.error, photosResult.error);
    return {};
  }
  const config = configResult.data?.value as Partial<HotelConfig> | undefined;
  const rooms = roomsResult.data?.map(row => row.details as Room).filter(room => Boolean(room?.id));
  const photos = photosResult.data?.map(row => ({
    ...(row.details as Omit<PhotoItem, 'id' | 'url'>),
    id: row.id,
    url: row.image_path,
  })).filter(photo => Boolean(photo.url));
  return {
    config: config ? { ...HOTEL_CONFIG, ...config } : undefined,
    rooms: rooms?.length ? rooms : undefined,
    photos: photos?.length ? photos : undefined,
  };
}
