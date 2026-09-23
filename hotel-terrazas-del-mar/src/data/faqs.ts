import { HOTEL_CONFIG } from '../data/hotelData';
export interface FaqItem { q: string; a: string }
export const DEFAULT_FAQS: FaqItem[] = [
    {
      q: '¿Cómo funciona el sistema de reserva directa por WhatsApp?',
      a: 'Es muy sencillo: seleccionas tus fechas y la cabaña o villa deseada en nuestra web. Al pulsar "Consultar por WhatsApp", se genera un mensaje ordenado con el desglose exacto de noches, huéspedes y los detalles de tu estancia. Nuestro equipo te responderá para confirmar disponibilidad y asistirte con los horarios del ferry a la isla.'
    },
    {
      q: '¿Cómo se llega al Hotel Mirador Ecológico en Ometepe?',
      a: 'Tomas el ferry desde el puerto de San Jorge (Rivas) hacia Moyogalpa o San José del Sur en Ometepe (1 hora de travesía). Desde el puerto, puedes tomar taxi, bus local o solicitarnos coordinar un traslado privado hasta la puerta del hotel.'
    },
    {
      q: '¿Cómo se garantiza y abona la reserva?',
      a: 'No necesitas introducir tarjetas de crédito en la web. Una vez acordados los detalles por WhatsApp, te proporcionamos opciones seguras de pago o depósito para confirmar tu estancia.'
    },
    {
      q: '¿Cuál es la política de cancelación flexible?',
      a: 'Para reservas directas por WhatsApp, ofrecemos cancelación gratuita y reprogramación sin penalización avisando con 48 horas de anticipación.'
    },
    {
      q: '¿Cuáles son los horarios de Check-in y Check-out?',
      a: `El Check-in oficial es a partir de las ${HOTEL_CONFIG.checkInTime} y el Check-out es a las ${HOTEL_CONFIG.checkOutTime}. Si tu ferry llega más temprano o sale más tarde, puedes disfrutar de la piscina y dejar tu equipaje en recepción con total comodidad.`
    }
  ];
