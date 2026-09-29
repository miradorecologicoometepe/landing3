import React from 'react';
import { ShieldCheck, Wifi, Clock, Bed, Trash2, Wind, Droplets } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  const policies = [
    { icon: Wifi, title: 'Wi-Fi', text: 'Contraseña de Wi-Fi: Gonzo280c.' },
    { icon: Clock, title: 'Horario de desayuno', text: 'El desayuno se sirve de 7:30 a. m. a 9:30 a. m. No se sirve antes ni después de este horario.' },
    { icon: Bed, title: 'Cuidado de colchones', text: 'Mantén los colchones limpios e higiénicos durante tu estancia.' },
    { icon: Trash2, title: 'Uso del inodoro', text: 'No introducir pañales ni toallas húmedas en el inodoro. Un bloqueo ocasionado por estos materiales tiene un costo de reparación de C$ 3,500.' },
    { icon: ShieldCheck, title: 'Toallas y sábanas', text: 'No utilizar las toallas ni las sábanas para retirar maquillaje o pintura, ya que pueden dañarse permanentemente.' },
    { icon: Wind, title: 'Aire acondicionado', text: 'Apaga el aire acondicionado cuando no esté en uso. Evita que los niños jueguen con el control; si se daña o desconfigura, el costo indicado es de C$ 300.' },
    { icon: Droplets, title: 'Uso responsable del agua', text: 'Durante la temporada seca el abastecimiento de agua municipal puede ser limitado. Agradecemos utilizar el agua de manera responsable y evitar desperdiciarla.' },
  ];
  return <div className="pt-28 pb-16 bg-stone-50 min-h-screen">
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-9"><span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider"><ShieldCheck className="w-4 h-4"/>Información para huéspedes</span><h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-stone-900">Políticas de alojamiento</h1><p className="mt-3 text-sm text-stone-600 max-w-2xl mx-auto">Estas normas ayudan a mantener una estancia cómoda y segura para todos los huéspedes de Mirador Ecológico.</p></div>
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm divide-y divide-stone-100">{policies.map(({icon:Icon,title,text},i)=><div key={title} className="p-5 sm:p-6 flex gap-4"><div className="w-10 h-10 shrink-0 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center"><Icon className="w-5 h-5"/></div><div><div className="text-xs font-bold text-teal-700 mb-1">POLÍTICA {i+1}</div><h2 className="font-bold text-stone-900">{title}</h2><p className="mt-1 text-sm text-stone-600 leading-relaxed">{text}</p></div></div>)}</div>
      <p className="mt-6 text-center text-xs text-stone-500">Al solicitar una reserva, el huésped confirma que ha leído y acepta estas políticas de alojamiento.</p>
    </div>
  </div>;
};
