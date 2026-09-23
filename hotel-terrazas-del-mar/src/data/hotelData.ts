import { Room, PhotoItem, ReviewItem, HotelConfig } from '../types';

export const HOTEL_CONFIG: HotelConfig = {
  name: 'Hotel Mirador Ecológico',
  stars: 4,
  ratingScore: 9.8,
  totalReviews: 384,
  whatsAppNumber: '50557642833', // Direct WhatsApp E.164 without '+'
  displayPhone: '+505 5764 2833',
  address: 'Finca El Mirador Ecológico, Altagracia, Isla de Ometepe, Rivas, Nicaragua',
  locationArea: 'Altagracia • Mirador Panorámico • Vista al Lago Cocibolca y Volcanes',
  email: 'reservas@hotelmiradorecologico.com',
  currency: 'USD',
  checkInTime: '14:00 hrs',
  checkOutTime: '11:00 hrs',
};

export const ROOMS_DATA: Room[] = [
  {
    id: 'habitacion-2-camas-grandes',
    name: 'Habitación con 2 camas grandes',
    tagline: 'Comodidad rústica con 2 camas dobles grandes. Tarifa fija de $60 USD por noche.',
    type: 'Habitación Estándar',
    pricePerNight: 60,
    capacity: { adults: 2, children: 1 },
    maxOccupancy: 3, // Máximo 3 personas
    pricingTiers: [
      { guests: 3, price: 60, label: 'Hasta 3 personas: $60 USD' }
    ],
    bedType: '2 camas dobles grandes',
    sizeM2: 32,
    view: 'Jardines Tropicales y Mirador',
    badge: 'Fija: $60 USD',
    featured: true,
    amenities: [
      '2 camas dobles grandes con lencería fresca',
      'Capacidad máxima: 3 personas',
      'Baño privado con ducha y toallas limpias',
      'Aire acondicionado y ventilador de techo',
      'Balcón o terraza con vista al entorno natural',
      'Conexión WiFi gratuita de alta velocidad',
      'Mosquiteros y ventanas con ventilación cruzada'
    ],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Habitación fresca y luminosa equipada con dos camas dobles grandes y capacidad máxima para 3 personas. Rodeada por la exuberante flora de la finca en Altagracia, ofrece baño privado completo, aire acondicionado y fácil acceso a la piscina panorámica por una tarifa directa de $60 USD/noche.',
    includedServices: ['Desayuno continental campestre diario', 'Acceso a la piscina panorámica', 'Parqueo privado gratuito', 'WiFi en la habitación']
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
    sizeM2: 56,
    view: 'Vistas al Lago de Nicaragua & Volcanes',
    badge: 'Máx. 4 personas',
    featured: true,
    amenities: [
      '1 cama individual + 2 camas dobles',
      'Capacidad máxima: 4 personas (3 pers. $70 / 4 pers. $90)',
      'Balcón o terraza privada con vista panorámica al lago',
      'Baño privado completo con agua caliente',
      'Aire acondicionado ecológico y ventilador',
      'Mobiliario rústico de madera y hamaca relajante',
      'WiFi gratuito de alta cobertura'
    ],
    images: [
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Habitación familiar espaciosa con 1 cama individual y 2 camas dobles, con capacidad máxima estricta para 4 personas. Su tarifa por noche es de $70 USD para 1 a 3 personas, o $90 USD para 4 personas. Dispone de un balcón privado con vistas directas al Lago Cocibolca y a los volcanes de Ometepe.',
    includedServices: ['Desayuno campestre para todos los huéspedes', 'Piscina al aire libre con solárium', 'Parqueo privado seguro', 'Asistencia para tours y ferrys']
  }
];

export const GALLERY_PHOTOS: PhotoItem[] = [
  {
    id: 'p1',
    title: 'Vista Panorámica desde El Mirador',
    category: 'pool',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
    caption: 'Vista aérea hacia la piscina entre palmeras, tejados rústicos y el horizonte azul del Lago de Nicaragua.',
    aspectRatio: 'landscape'
  },
  {
    id: 'p2',
    title: 'Habitación con 2 Camas Grandes',
    category: 'rooms',
    url: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=85',
    caption: 'Habitaciones frescas con acabados rústicos, terraza privada y vegetación tropical.',
    aspectRatio: 'landscape',
    roomTypeId: 'habitacion-2-camas-grandes'
  },
  {
    id: 'p3',
    title: 'Piscina Empedrada & Área Familiar',
    category: 'pool',
    url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85',
    caption: 'Piscina refrescante rodeada de bosque tropical, mesas de patio y vistas a la naturaleza.',
    aspectRatio: 'landscape'
  },
  {
    id: 'p4',
    title: 'Piscina Iluminada al Atardecer',
    category: 'pool',
    url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85',
    caption: 'Noches mágicas junto a la piscina con la suave brisa del lago y cielo estrellado.',
    aspectRatio: 'landscape'
  },
  {
    id: 'p5',
    title: 'Habitación con 2 Camas - Interior',
    category: 'rooms',
    url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=85',
    caption: 'Habitaciones frescas con techos altos de madera y camas confortables.',
    aspectRatio: 'landscape',
    roomTypeId: 'habitacion-2-camas-grandes'
  },
  {
    id: 'p6',
    title: 'Desayuno Campestre Nicaragüense',
    category: 'gastronomy',
    url: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=85',
    caption: 'Gallo pinto tradicional, queso frito, plátanos maduros, frutas frescas y café orgánico.',
    aspectRatio: 'landscape'
  },
  {
    id: 'p7',
    title: 'Volcanes Concepción y Maderas',
    category: 'outdoors',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    caption: 'El majestuoso perfil volcánico de la Isla de Ometepe visto desde nuestra propiedad.',
    aspectRatio: 'landscape'
  },
  {
    id: 'p8',
    title: 'Hamacas de Descanso & Brisa',
    category: 'outdoors',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
    caption: 'Rincones de lectura y siesta bajo la sombra de mangos, ceibas y palmeras.',
    aspectRatio: 'landscape'
  },
  {
    id: 'p9',
    title: 'Senderos Naturales & Vida Silvestre',
    category: 'outdoors',
    url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85',
    caption: 'Caminatas por senderos botánicos donde habitan monos congo, colibríes y mariposas morpho.',
    aspectRatio: 'landscape'
  },
  {
    id: 'p10',
    title: 'Habitación Familiar - Área de Descanso',
    category: 'rooms',
    url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85',
    caption: 'Espacios amplios y cómodos diseñados para familias con 1 cama individual y 2 camas dobles.',
    aspectRatio: 'landscape',
    roomTypeId: 'habitacion-familiar-vistas-lago'
  },
  {
    id: 'p11',
    title: 'Atardecer Dorado en Lago Cocibolca',
    category: 'outdoors',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85',
    caption: 'Puestas de sol inolvidables que tiñen de dorado las aguas del Gran Lago de Nicaragua.',
    aspectRatio: 'landscape'
  },
  {
    id: 'p12',
    title: 'Café Orgánico de Altura en la Terraza',
    category: 'gastronomy',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
    caption: 'Café de estricta altura recolectado en fincas volcánicas de Ometepe y tostado artesanalmente.',
    aspectRatio: 'landscape'
  }
];

export const REVIEWS_DATA: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Gabriel & Lucía Valenzuela',
    country: 'Costa Rica',
    flag: '🇨🇷',
    rating: 10,
    date: 'Hace 4 días',
    title: '¡El mejor mirador y la paz más hermosa de Ometepe!',
    comment: 'Reservamos directo por WhatsApp y nos asistieron con el ferry y el taxi desde Moyogalpa sin complicaciones. La vista desde la habitación al lago con el volcán Concepción de fondo es algo que no se olvida. La comida campestre deliciosa y la piscina súper refrescante.',
    roomStayed: 'Habitación con 2 Camas Grandes',
    travelerType: 'Pareja'
  },
  {
    id: 'rev-2',
    author: 'Thomas & Sarah Jenkins',
    country: 'Estados Unidos / Canadá',
    flag: '🇨🇦',
    rating: 9.8,
    date: 'La semana pasada',
    title: 'Authentic eco-lodge with warm hospitality and stunning pool',
    comment: 'We spent 4 nights in the family room. The kids loved the pool and looking at the howler monkeys in the mango trees. Booking via WhatsApp was smooth and fast. The local coffee and homemade plantains are unbeatable.',
    roomStayed: 'Habitación Familiar con Vistas al Lago',
    travelerType: 'Familia con niños'
  },
  {
    id: 'rev-3',
    author: 'Ing. Carlos Mendoza',
    country: 'Nicaragua',
    flag: '🇳🇮',
    rating: 10,
    date: 'Hace 2 semanas',
    title: 'Orgullo de nuestra Isla de Ometepe, un verdadero paraíso ecológico',
    comment: 'La tranquilidad del lugar es única. Despertar con la brisa fresca del volcán y el canto de las urracas no tiene precio. Todo el personal es sumamente atento. Las tarifas directas por WhatsApp fueron las más justas de la isla.',
    roomStayed: 'Habitación con 2 Camas Grandes',
    travelerType: 'Viaje de descanso'
  }
];

export const HOTEL_AMENITIES = [
  {
    title: 'Piscina Panorámica & Solárium',
    desc: 'Piscina al aire libre refrescante rodeada de jardines tropicales, solárium y camastros para disfrutar la brisa.',
    icon: 'Waves'
  },
  {
    title: 'Local para Eventos & Celebraciones',
    desc: 'Espacio para bodas frente al lago, cumpleaños, convivios familiares y retiros grupales con catering campestre.',
    icon: 'Sparkles'
  },
  {
    title: 'Mirador a los Volcanes & Lago',
    desc: 'Punto panorámico privilegiado con vistas directas al Volcán Concepción, Volcán Maderas y Lago Cocibolca.',
    icon: 'Compass'
  },
  {
    title: 'Habitaciones Campestres & Hamacas',
    desc: 'Construidas con materiales frescos y piedra volcánica, terrazas privadas y hamacas para el descanso.',
    icon: 'Home'
  },
  {
    title: 'Senderos & Observación de Aves',
    desc: 'Caminatas botánicas privadas con avistamiento de monos congo, colibríes, urracas y fauna autóctona.',
    icon: 'Trees'
  },
  {
    title: 'Asistencia con Ferries & Transporte',
    desc: 'Asistencia directa en WhatsApp con horarios actualizados de barcos, taxis y alquiler de motos en la isla.',
    icon: 'Ship'
  }
];

export const ADDON_PRICING = {
  breakfast: { name: 'Desayuno Campestre Típico Completo', price: 10, unit: 'por persona / día' },
  airportTransfer: { name: 'Traslado Privado desde Puerto Moyogalpa / San José', price: 30, unit: 'por trayecto (hasta 4 pax)' },
  romanticPackage: { name: 'Paquete Romántico Atardecer en Ometepe', price: 45, unit: 'por estancia con flores y vino' },
  lateCheckout: { name: 'Late Check-Out Flexible en Mirador & Piscina', price: 20, unit: 'hasta las 17:00' },
  volcanoTour: { name: 'Excursión Guiada al Volcán Maderas o Concepción', price: 45, unit: 'por persona con guía' },
  kayakIstian: { name: 'Tour en Kayak por el Humedal de Río Istián', price: 35, unit: 'por persona con equipo' },
  breakfastCampestre: { name: 'Desayuno Campestre Típico Completo', price: 10, unit: 'por persona / día' },
  motoRental: { name: 'Alquiler de Motocicleta / Scooter 150cc (24 hrs)', price: 25, unit: 'por día' },
  ferryTransfer: { name: 'Coordinación de Traslado Privado desde Puerto Moyogalpa / San José', price: 30, unit: 'por trayecto (hasta 4 pax)' }
};
