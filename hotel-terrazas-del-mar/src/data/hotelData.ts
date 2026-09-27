import { Room, PhotoItem, ReviewItem, HotelConfig } from '../types';

export const HOTEL_CONFIG: HotelConfig = {
  name: 'Hotel Mirador Ecológico',
  stars: 0,
  ratingScore: 0,
  totalReviews: 0,
  whatsAppNumber: '50557642833', // Direct WhatsApp E.164 without '+'
  displayPhone: '+505 5764 2833',
  address: 'Finca El Mirador Ecológico, Altagracia, Isla de Ometepe, Rivas, Nicaragua',
  locationArea: 'Altagracia • Mirador Panorámico • Vista al Lago Cocibolca y Volcanes',
  email: '',
  currency: 'USD',
  checkInTime: '14:00 hrs',
  checkOutTime: '11:00 hrs',
  dayPass: {
    enabled: false,
    title: 'Day Pass Piscina',
    days: [],
    startTime: '',
    endTime: '',
    price: null,
    notes: '',
  },
};

export const ROOMS_DATA: Room[] = [
  {
    id: 'habitacion-2-camas-grandes',
    name: 'Habitación matrimonial',
    tagline: 'Habitación matrimonial para dos personas. Tarifa de $60 USD por noche.',
    type: 'Habitación Estándar',
    pricePerNight: 60,
    capacity: { adults: 2, children: 0 },
    maxOccupancy: 2, // Máximo 2 personas
    pricingTiers: [
      { guests: 2, price: 60, label: 'Hasta 2 personas: $60 USD' }
    ],
    bedType: 'Cama matrimonial',
    sizeM2: 0,
    view: 'Jardines Tropicales y Mirador',
    badge: 'Fija: $60 USD',
    featured: true,
    amenities: [
      'Cama matrimonial con lencería fresca',
      'Capacidad máxima: 2 personas',
      'Baño privado con ducha y toallas limpias',
      'Aire acondicionado',
      'Balcón o terraza con vista al entorno natural',
      'Conexión WiFi gratuita de alta velocidad',
      'Mosquiteros y ventanas con ventilación cruzada'
    ],
    images: [],
    description: 'Habitación matrimonial con capacidad máxima para 2 personas. Rodeada por la exuberante flora de la finca en Altagracia, ofrece baño privado completo, aire acondicionado y fácil acceso a la piscina panorámica por una tarifa directa de $60 USD/noche.',
    includedServices: ['Acceso a la piscina panorámica', 'Parqueo privado gratuito', 'WiFi en la habitación']
  },
  {
    id: 'habitacion-familiar-vistas-lago',
    name: 'Habitación Familiar con vistas al lago',
    tagline: 'Amplia habitación con 1 cama individual y 2 camas dobles. Máximo 4 personas ($70 para 3 pers., $90 para 4 pers.).',
    type: 'Habitación Familiar Panorámica',
    pricePerNight: 70,
    capacity: { adults: 3, children: 1 },
    maxOccupancy: 4, // Máximo 4 personas
    pricingTiers: [
      { guests: 3, price: 70, label: '3 personas: $70 USD' },
      { guests: 4, price: 90, label: '4 personas: $90 USD' }
    ],
    bedType: '1 cama individual y 2 camas dobles',
    sizeM2: 0,
    view: 'Vistas al Lago de Nicaragua & Volcanes',
    badge: 'Máx. 4 personas',
    featured: true,
    amenities: [
      '1 cama individual + 2 camas dobles',
      'Capacidad máxima: 4 personas (3 pers. $70 / 4 pers. $90)',
      'Balcón o terraza privada con vista panorámica al lago',
      'Baño privado completo',
      'Aire acondicionado',
      'Mobiliario rústico de madera',
      'WiFi gratuito de alta cobertura'
    ],
    images: [],
    description: 'Habitación familiar espaciosa con 1 cama individual y 2 camas dobles, con capacidad máxima estricta para 4 personas. Su tarifa por noche es de $70 USD para 1 a 3 personas, o $90 USD para 4 personas. Dispone de un balcón privado con vistas directas al Lago Cocibolca y a los volcanes de Ometepe.',
    includedServices: ['Piscina al aire libre con solárium', 'Parqueo privado seguro', 'Asistencia para tours y ferrys']
  }
];

export const GALLERY_PHOTOS: PhotoItem[] = [];
