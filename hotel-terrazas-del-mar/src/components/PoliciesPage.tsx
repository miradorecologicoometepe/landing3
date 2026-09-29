import React from 'react';
import { ShieldCheck, Users, Clock, Bed, Trash2, Wind, Droplets, ShowerHead } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  const policies = [
    { icon: Users, title: 'Capacidad de la habitación', text: 'Por seguridad y comodidad, debe respetarse la capacidad máxima de huéspedes indicada para cada tipo de habitación. No se permite alojar personas adicionales por encima del límite establecido.' },
    { icon: Clock, title: 'Horario de desayuno', text: 'El desayuno se sirve de 7:30 a. m. a 9:30 a. m. No se sirve antes ni después de este horario.' },
    { icon: Bed, title: 'Cuidado de la habitación', text: 'Ayúdanos a conservar en buen estado los colchones, ropa de cama, mobiliario y demás elementos de la habitación durante tu estancia.' },
    { icon: Trash2, title: 'Uso del inodoro', text: 'No deposites pañales, toallas húmedas ni otros materiales que puedan obstruir el inodoro. Si se produce un bloqueo por el uso inadecuado, se aplicará un cargo de reparación de C$ 3,500.' },
    { icon: ShieldCheck, title: 'Toallas y ropa de cama', text: 'Evita utilizar toallas o sábanas para retirar maquillaje, pintura u otras sustancias que puedan mancharlas o dañarlas permanentemente.' },
    { icon: Wind, title: 'Uso del aire acondicionado', text: 'Apaga el aire acondicionado cuando no lo necesites y evita manipular innecesariamente su control. Los daños o desconfiguraciones ocasionados por uso inadecuado pueden generar un cargo de C$ 300.' },
    { icon: Droplets, title: 'Uso responsable del agua', text: 'El abastecimiento de agua en la isla puede ser limitado, especialmente durante la temporada seca. Agradecemos utilizarla de manera responsable y evitar desperdicios.' },
    { icon: ShowerHead, title: 'Agua caliente', text: 'Las habitaciones no cuentan con servicio de agua caliente. Te recomendamos tomarlo en cuenta al planificar tu estancia.' },
  ];
  return <div className="pt-28 pb-16 bg-stone-50 min-h-screen">
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-9"><span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider"><ShieldCheck className="w-4 h-4"/>Información para huéspedes</span><h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-stone-900">Políticas de alojamiento</h1><p className="mt-3 text-sm text-stone-600 max-w-2xl mx-auto">Estas normas ayudan a mantener una estancia cómoda y segura para todos los huéspedes de Mirador Ecológico.</p></div>
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm divide-y divide-stone-100">{policies.map(({icon:Icon,title,text},i)=><div key={title} className="p-5 sm:p-6 flex gap-4"><div className="w-10 h-10 shrink-0 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center"><Icon className="w-5 h-5"/></div><div><div className="text-xs font-bold text-teal-700 mb-1">POLÍTICA {i+1}</div><h2 className="font-bold text-stone-900">{title}</h2><p className="mt-1 text-sm text-stone-600 leading-relaxed">{text}</p></div></div>)}</div>
      <p className="mt-6 text-center text-xs text-stone-500">Al solicitar una reserva, el huésped confirma que ha leído y acepta estas políticas de alojamiento.</p>
    </div>
  </div>;
};
