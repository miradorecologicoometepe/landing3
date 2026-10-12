import { supabase } from './supabase';
export interface GuideContact { id: string; name: string; phone: string }
export const DEFAULT_GUIDE_CONTACTS: GuideContact[] = [
  { id: 'rey-1', name: 'Rey del Cocibolca', phone: '+505 8445 4000' },
  { id: 'rey-2', name: 'Rey del Cocibolca', phone: '+505 8904 5244' },
  { id: 'cacique', name: 'Cacique Nicarao', phone: '+505 8903 9770' },
];
export const guidePhoneHref = (phone: string) => 'tel:' + phone.replace(/[^+\d]/g, '');
export async function loadGuideContacts(): Promise<GuideContact[]> {
  if (!supabase) return DEFAULT_GUIDE_CONTACTS;
  const { data, error } = await supabase.from('site_content').select('value').eq('key', 'guide_contacts').maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return DEFAULT_GUIDE_CONTACTS;
  if (!Array.isArray(data.value) || data.value.some(item => !item || typeof item.name !== 'string' || typeof item.phone !== 'string')) throw new Error('Contenido de contactos no válido.');
  return data.value.map((item, i) => ({ id: typeof item.id === 'string' ? item.id : 'contact-' + i, name: item.name, phone: item.phone }));
}
