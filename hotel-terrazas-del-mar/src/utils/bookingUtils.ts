import { BookingReservation, Room, HotelConfig } from '../types';
import { ADDON_PRICING } from '../data/hotelData';

export function calculateNights(checkInStr: string, checkOutStr: string): number {
  if (!checkInStr || !checkOutStr) return 1;
  const start = new Date(checkInStr);
  const end = new Date(checkOutStr);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function getDefaultDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const checkOut = new Date(tomorrow);
  checkOut.setDate(tomorrow.getDate() + 3);

  const toInputFormat = (d: Date) => d.toISOString().split('T')[0];

  return {
    checkIn: toInputFormat(tomorrow),
    checkOut: toInputFormat(checkOut)
  };
}

export interface QuoteBreakdown {
  nights: number;
  basePricePerNight: number;
  originalPricePerNight: number;
  subtotal: number;
  directBookingDiscount: number; // Legacy field retained for compatibility; no promotion applies
  addonsCost: number;
  addonsList: { name: string; cost: number }[];
  total: number;
  rateLabel?: string;
  totalGuests: number;
}

export function getRoomRateForGuests(room: Room, totalGuests: number): {
  pricePerNight: number;
  originalPrice: number;
  rateLabel: string;
} {
  if (room.id === 'habitacion-familiar-vistas-lago') {
    if (totalGuests >= 4) {
      return {
        pricePerNight: 90,
        originalPrice: 105,
        rateLabel: 'Tarifa 4 personas ($90 USD/noche)'
      };
    } else {
      return {
        pricePerNight: 70,
        originalPrice: 85,
        rateLabel: 'Tarifa 1 a 3 personas ($70 USD/noche)'
      };
    }
  }

  // Habitación con 2 camas grandes ($60 USD)
  return {
    pricePerNight: room.pricePerNight || 60,
    originalPrice: room.originalPrice || 72,
    rateLabel: 'Tarifa fija ($60 USD/noche)'
  };
}

export function calculateQuote(
  reservation: BookingReservation,
  room?: Room
): QuoteBreakdown {
  const nights = calculateNights(reservation.checkIn, reservation.checkOut);
  const totalGuests = (reservation.adults || 1) + (reservation.children || 0);

  let pricePerNight = room ? room.pricePerNight : 60;
  let originalPrice = room ? room.originalPrice : 72;
  let rateLabel = 'Tarifa Directa';

  if (room) {
    const rateInfo = getRoomRateForGuests(room, totalGuests);
    pricePerNight = rateInfo.pricePerNight;
    originalPrice = rateInfo.originalPrice;
    rateLabel = rateInfo.rateLabel;
  }

  const standardSubtotal = pricePerNight * nights * (reservation.roomsCount || 1);
  const discountedSubtotal = standardSubtotal;
  const directBookingDiscount = 0;

  let addonsCost = 0;
  const addonsList: { name: string; cost: number }[] = [];

  if (reservation.addons.breakfast) {
    const cost = ADDON_PRICING.breakfast.price * totalGuests * nights;
    addonsCost += cost;
    addonsList.push({ name: `Desayuno (${totalGuests} pax × ${nights} d)`, cost });
  }

  if (reservation.addons.airportTransfer) {
    const cost = ADDON_PRICING.airportTransfer.price;
    addonsCost += cost;
    addonsList.push({ name: 'Traslado VIP Aeropuerto R/T', cost });
  }

  if (reservation.addons.romanticPackage) {
    const cost = ADDON_PRICING.romanticPackage.price;
    addonsCost += cost;
    addonsList.push({ name: 'Paquete Romance de Bienvenida', cost });
  }

  if (reservation.addons.lateCheckout) {
    const cost = ADDON_PRICING.lateCheckout.price;
    addonsCost += cost;
    addonsList.push({ name: 'Late Check-out 17:00 garantizado', cost });
  }

  const total = discountedSubtotal + addonsCost;

  return {
    nights,
    basePricePerNight: pricePerNight,
    originalPricePerNight: originalPrice,
    subtotal: standardSubtotal,
    directBookingDiscount,
    addonsCost,
    addonsList,
    total,
    rateLabel,
    totalGuests
  };
}

export function generateWhatsAppMessage(
  reservation: BookingReservation,
  room: Room,
  hotelConfig: HotelConfig
): string {
  const quote = calculateQuote(reservation, room);
  const checkInFormatted = formatDisplayDate(reservation.checkIn);
  const checkOutFormatted = formatDisplayDate(reservation.checkOut);
  const totalPax = reservation.adults + reservation.children;

  let msg = `🛎️ *SOLICITUD DE RESERVA - ${hotelConfig.name.toUpperCase()}*\n`;
  msg += `_¡Hola! Deseo cotizar y reservar con la tarifa de Reserva Directa:_\n\n`;

  msg += `🏨 *Habitación:* ${room.name} (${room.type})\n`;
  msg += `🚪 *Cantidad:* ${reservation.roomsCount} habitación(es)\n`;
  msg += `📅 *Llegada (Check-in):* ${checkInFormatted}\n`;
  msg += `🛫 *Salida (Check-out):* ${checkOutFormatted}\n`;
  msg += `🌙 *Duración:* ${quote.nights} noche(s)\n`;
  msg += `👥 *Huéspedes:* ${reservation.adults} adulto(s)${reservation.children > 0 ? `, ${reservation.children} niño(s)` : ''} (Total: ${totalPax} pers. / Máx: ${room.maxOccupancy} pers.)\n`;
  msg += `🏷️ *Tarifa aplicada:* ${quote.rateLabel} → $${quote.basePricePerNight} USD/noche\n\n`;

  if (quote.addonsList.length > 0) {
    msg += `✨ *Servicios adicionales seleccionados:*\n`;
    quote.addonsList.forEach(addon => {
      msg += ` • ${addon.name} (+$${addon.cost} USD)\n`;
    });
    msg += `\n`;
  }

  msg += `💰 *DESGLOSE DE TARIFA DIRECTA:*\n`;
  msg += ` • Tarifa base (${quote.nights} noche(s) × $${quote.basePricePerNight} USD): $${quote.basePricePerNight * quote.nights * (reservation.roomsCount || 1)} USD\n`;
  if (quote.addonsCost > 0) {
    msg += ` • Adicionales: +$${quote.addonsCost} USD\n`;
  }
  msg += ` • *TOTAL ESTIMADO: $${quote.total} USD* (sujeto a confirmación)\n\n`;

  if (reservation.guestName.trim()) {
    msg += `👤 *Titular:* ${reservation.guestName.trim()}\n`;
  }
  if (reservation.guestPhone.trim()) {
    msg += `📱 *Teléfono de contacto:* ${reservation.guestPhone.trim()}\n`;
  }
  if (reservation.guestEmail.trim()) {
    msg += `✉️ *Correo:* ${reservation.guestEmail.trim()}\n`;
  }
  if (reservation.specialRequests.trim()) {
    msg += `📝 *Petición especial / Horario estimado:* ${reservation.specialRequests.trim()}\n`;
  }

  msg += `\n¿Tienen disponibilidad confirmada para estas fechas? Quedo atento/a para finalizar la reserva. ¡Muchas gracias!`;

  return msg;
}

export function buildWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
