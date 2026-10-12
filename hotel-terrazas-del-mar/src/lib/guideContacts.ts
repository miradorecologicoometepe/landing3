import { supabase } from './supabase';
export interface GuideContact { id: string; name: string; phone: string }
export const DEFAULT_GUIDE_CONTACTS: GuideContact[] = [
  {
    "id": "ometepe-0",
    "name": "Ferry Ometepe (Milton Arcia)",
    "phone": "+505 2569-4284"
  },
  {
    "id": "ometepe-1",
    "name": "Ferry Ometepe (Milton Arcia)",
    "phone": "+505 8966-4983"
  },
  {
    "id": "ometepe-2",
    "name": "Ferry Ometepe (Milton Arcia)",
    "phone": "+505 8966-4981"
  },
  {
    "id": "che-0",
    "name": "Ferry Che Guevara",
    "phone": "+505 8401-8035"
  },
  {
    "id": "che-1",
    "name": "Ferry Che Guevara",
    "phone": "+505 2569-4101"
  },
  {
    "id": "che-2",
    "name": "Ferry Che Guevara",
    "phone": "+505 2563-4779"
  },
  {
    "id": "cacique-0",
    "name": "Ferry Cacique Nicarao",
    "phone": "+505 8631-2654"
  },
  {
    "id": "cacique-1",
    "name": "Ferry Cacique Nicarao",
    "phone": "+505 8808-9712"
  },
  {
    "id": "cacique-2",
    "name": "Ferry Cacique Nicarao",
    "phone": "+505 8658-8047"
  },
  {
    "id": "rey-0",
    "name": "Ferry Rey del Cocibolca",
    "phone": "+505 2565-2387"
  },
  {
    "id": "rey-1",
    "name": "Ferry Rey del Cocibolca",
    "phone": "+505 8691-3669"
  },
  {
    "id": "rey-2",
    "name": "Ferry Rey del Cocibolca",
    "phone": "+505 5765-7664"
  },
  {
    "id": "sultana-0",
    "name": "Ferry La Gran Sultana",
    "phone": "+505 8883-6943"
  }
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
