// src/pages/AgendaLaboral.jsx
import { useState, useEffect } from 'react';
import { usePersistencia } from '../hooks/usePersistencia';

// ------------------------------------------------------------
// CONFIGURACIÓN DE CALENDARIOS JUDICIALES
// ------------------------------------------------------------
const calendariosJudiciales = {
  'Oaxaca': {
    2026: {
      nombre: 'Poder Judicial del Estado de Oaxaca',
      diasInhabiles: [
        '2026-01-01', '2026-02-02', '2026-03-16', '2026-05-01',
        '2026-09-16', '2026-11-16', '2026-12-25'
      ],
      vacaciones: (() => {
        const vac = [];
        for (let d = 13; d <= 31; d++) vac.push(`2026-07-${String(d).padStart(2,'0')}`);
        for (let d = 14; d <= 31; d++) vac.push(`2026-12-${String(d).padStart(2,'0')}`);
        return vac;
      })(),
      suspensionFemenino: ['2026-03-08'],
      suspensionMasculino: ['2026-11-19'],
      suspensionMediaJornada: ['2026-12-24', '2026-12-31']
    }
  },
  'Ciudad de México': {
    2026: {
      nombre: 'Poder Judicial de la CDMX',
      diasInhabiles: [
        '2026-01-01', '2026-02-02', '2026-03-16', '2026-05-01',
        '2026-09-16', '2026-11-16', '2026-12-25'
      ],
      vacaciones: (() => {
        const vac = [];
        for (let d = 15; d <= 31; d++) vac.push(`2026-07-${String(d).padStart(2,'0')}`);
        for (let d = 1; d <= 15; d++) vac.push(`2026-08-${String(d).padStart(2,'0')}`);
        for (let d = 20; d <= 31; d++) vac.push(`2026-12-${String(d).padStart(2,'0')}`);
        for (let d = 1; d <= 10; d++) vac.push(`2027-01-${String(d).padStart(2,'0')}`);
        return vac;
      })(),
      suspensionFemenino: ['2026-03-08'],
      suspensionMasculino: ['2026-11-19'],
      suspensionMediaJornada: ['2026-12-24', '2026-12-31']
    }
  },
  'Estado de México': {
    2026: {
      nombre: 'Poder Judicial del Estado de México',
      diasInhabiles: [
        '2026-01-01', '2026-02-02', '2026-03-16', '2026-05-01',
        '2026-09-16', '2026-11-16', '2026-12-25'
      ],
      vacaciones: (() => {
        const vac = [];
        for (let d = 13; d <= 31; d++) vac.push(`2026-07-${String(d).padStart(2,'0')}`);
        for (let d = 21; d <= 31; d++) vac.push(`2026-12-${String(d).padStart(2,'0')}`);
        for (let d = 1; d <= 13; d++) vac.push(`2027-01-${String(d).padStart(2,'0')}`);
        return vac;
      })(),
      suspensionFemenino: ['2026-03-08'],
      suspensionMasculino: ['2026-11-19'],
      suspensionMediaJornada: ['2026-12-24', '2026-12-31']
    }
  },
  'Federal (TFJA)': {
    2026: {
      nombre: 'Tribunal Federal de Justicia Administrativa',
      diasInhabiles: [
        '2026-01-01', '2026-02-02', '2026-03-16', '2026-05-01',
        '2026-09-16', '2026-11-16', '2026-12-25'
      ],
      vacaciones: (() => {
        const vac = [];
        for (let d = 15; d <= 31; d++) vac.push(`2026-07-${String(d).padStart(2,'0')}`);
        for (let d = 20; d <= 31; d++) vac.push(`2026-12-${String(d).padStart(2,'0')}`);
        return vac;
      })(),
      suspensionFemenino: ['2026-03-08'],
      suspensionMasculino: ['2026-11-19'],
      suspensionMediaJornada: ['2026-12-24', '2026-12-31']
    }
  }
};

const estadosDisponibles = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua',
  'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Estado de México', 'Guanajuato', 'Guerrero',
  'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla',
  'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas',
  'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas', 'Federal (TFJA)'
];

const añosDisponibles = [2025, 2026, 2027, 2028];

const materiasJudiciales = [
  'Constitución y Garantías (Amparo, Controversias, Inconstitucionalidad)',
  'Penal',
  'Civil',
  'Mercantil',
  'Laboral',
  'Administrativo (Contencioso Administrativo)',
  'Familiar',
  'Agrario'
];

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------
const AgendaLaboral = () => {
  const [vista, setVista] = useState('mes');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Oaxaca');
  const [añoSeleccionado, setAñoSeleccionado] = useState(2026);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [fechaSeleccionada, setFechaSeleccionada] = useState(() => {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,'0')}-${String(hoy.getDate()).padStart(2,'0')}`;
  });
  
  // Usar persistencia para eventos personales
  const { datos: eventosPersonales, guardarDatos, cargando } = usePersistencia('agenda_personal', []);
  const [eventosLocal, setEventosLocal] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoEvento, setEditandoEvento] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'audiencia',
    materia: '',
    fecha: '',
    hora: '',
    descripcion: '',
    expediente: ''
  });

  // Sincronizar eventos con Firestore
  useEffect(() => {
    if (eventosPersonales && eventosPersonales.length > 0) {
      setEventosLocal(eventosPersonales);
    } else if (!cargando && (!eventosPersonales || eventosPersonales.length === 0)) {
      const hoy = new Date().toISOString().split('T')[0];
      const ejemplos = [
        { id: 1, titulo: 'Audiencia de conciliación', tipo: 'audiencia', materia: 'Laboral', fecha: hoy, hora: '10:00', descripcion: 'Juzgado laboral', expediente: '2025-001' }
      ];
      setEventosLocal(ejemplos);
      guardarDatos(ejemplos);
    }
  }, [eventosPersonales, cargando]);

  // Obtener calendario judicial
  const obtenerCalendarioJudicial = () => {
    const estadoData = calendariosJudiciales[estadoSeleccionado];
    if (estadoData && estadoData[añoSeleccionado]) {
      return estadoData[añoSeleccionado];
    }
    return { diasInhabiles: [], vacaciones: [], suspensionFemenino: [], suspensionMasculino: [], suspensionMediaJornada: [] };
  };

  const { diasInhabiles, vacaciones, suspensionFemenino, suspensionMasculino, suspensionMediaJornada } = obtenerCalendarioJudicial();

  const esDiaInhabil = (fechaStr) => diasInhabiles.includes(fechaStr);
  const esVacacion = (fechaStr) => vacaciones.includes(fechaStr);
  const esSuspensionFemenino = (fechaStr) => suspensionFemenino.includes(fechaStr);
  const esSuspensionMasculino = (fechaStr) => suspensionMasculino.includes(fechaStr);
  const esSuspensionMediaJornada = (fechaStr) => suspensionMediaJornada.includes(fechaStr);

  const getColorDia = (fechaStr) => {
    if (esSuspensionFemenino(fechaStr)) return 'bg-pink-500 text-white';
    if (esSuspensionMasculino(fechaStr)) return 'bg-purple-500 text-white';
    if (esSuspensionMediaJornada(fechaStr)) return 'bg-green-500 text-white';
    if (esVacacion(fechaStr)) return 'bg-yellow-500 text-white';
    if (esDiaInhabil(fechaStr)) return 'bg-red-500 text-white';
    return 'bg-white text-gray-800';
  };

  const getEventosPersonalesPorFecha = (fechaStr) => {
    return eventosLocal.filter(ev => ev.fecha === fechaStr);
  };

  // Navegación
  const cambiarVista = (nuevaVista) => setVista(nuevaVista);

  const cambiarMes = (delta) => {
    let nuevoMes = mesSeleccionado + delta;
    let nuevoAño = añoSeleccionado;
    if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoAño--;
    } else if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoAño++;
    }
    if (nuevoAño >= 2025 && nuevoAño <= 2028) {
      setMesSeleccionado(nuevoMes);
      setAñoSeleccionado(nuevoAño);
    }
  };

  const cambiarSemana = (delta) => {
    const fecha = new Date(fechaSeleccionada);
    fecha.setDate(fecha.getDate() + delta * 7);
    const nuevaFechaStr = fecha.toISOString().split('T')[0];
    setFechaSeleccionada(nuevaFechaStr);
    const nuevoAño = fecha.getFullYear();
    if (nuevoAño !== añoSeleccionado && nuevoAño >= 2025 && nuevoAño <= 2028) {
      setAñoSeleccionado(nuevoAño);
    }
    setMesSeleccionado(fecha.getMonth());
  };

  const cambiarDia = (delta) => {
    const fecha = new Date(fechaSeleccionada);
    fecha.setDate(fecha.getDate() + delta);
    const nuevaFechaStr = fecha.toISOString().split('T')[0];
    setFechaSeleccionada(nuevaFechaStr);
    const nuevoAño = fecha.getFullYear();
    if (nuevoAño !== añoSeleccionado && nuevoAño >= 2025 && nuevoAño <= 2028) {
      setAñoSeleccionado(nuevoAño);
    }
    setMesSeleccionado(fecha.getMonth());
  };

  const irAHoy = () => {
    const hoy = new Date();
    setFechaSeleccionada(hoy.toISOString().split('T')[0]);
    setAñoSeleccionado(hoy.getFullYear());
    setMesSeleccionado(hoy.getMonth());
  };

  const obtenerDiasMes = () => {
    const primerDia = new Date(añoSeleccionado, mesSeleccionado, 1);
    const ultimoDia = new Date(añoSeleccionado, mesSeleccionado + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicioSemana = primerDia.getDay();
    const dias = [];
    const diasMesAnterior = new Date(añoSeleccionado, mesSeleccionado, 0).getDate();
    for (let i = diaInicioSemana - 1; i >= 0; i--) {
      const fecha = new Date(añoSeleccionado, mesSeleccionado - 1, diasMesAnterior - i);
      const fechaStr = `${fecha.getFullYear()}-${String(fecha.getMonth()+1).padStart(2,'0')}-${String(fecha.getDate()).padStart(2,'0')}`;
      dias.push({ fechaStr, esMesActual: false, fecha });
    }
    for (let i = 1; i <= diasEnMes; i++) {
      const fechaStr = `${añoSeleccionado}-${String(mesSeleccionado+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
      const fecha = new Date(añoSeleccionado, mesSeleccionado, i);
      dias.push({ fechaStr, esMesActual: true, fecha });
    }
    const restantes = 42 - dias.length;
    for (let i = 1; i <= restantes; i++) {
      const fecha = new Date(añoSeleccionado, mesSeleccionado + 1, i);
      const fechaStr = `${fecha.getFullYear()}-${String(fecha.getMonth()+1).padStart(2,'0')}-${String(fecha.getDate()).padStart(2,'0')}`;
      dias.push({ fechaStr, esMesActual: false, fecha });
    }
    const semanas = [];
    for (let i = 0; i < dias.length; i += 7) {
      semanas.push(dias.slice(i, i+7));
    }
    return semanas;
  };

  const obtenerSemana = () => {
    const fecha = new Date(fechaSeleccionada);
    const diaSemana = fecha.getDay();
    const inicioSemana = new Date(fecha);
    inicioSemana.setDate(fecha.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
    const diasSemana = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicioSemana);
      dia.setDate(inicioSemana.getDate() + i);
      const fechaStr = `${dia.getFullYear()}-${String(dia.getMonth()+1).padStart(2,'0')}-${String(dia.getDate()).padStart(2,'0')}`;
      diasSemana.push({ fechaStr, fecha: dia });
    }
    return diasSemana;
  };

  const obtenerEventosSemana = () => {
    const semana = obtenerSemana();
    const eventosSemana = [];
    semana.forEach(dia => {
      const eventosDia = getEventosPersonalesPorFecha(dia.fechaStr);
      eventosDia.forEach(ev => {
        eventosSemana.push({ ...ev, fechaObj: dia.fecha, fechaStr: dia.fechaStr });
      });
    });
    return eventosSemana.sort((a,b) => {
      if (a.fechaStr !== b.fechaStr) return a.fechaStr.localeCompare(b.fechaStr);
      return (a.hora || '00:00').localeCompare(b.hora || '00:00');
    });
  };

  // CRUD eventos personales con persistencia en Firebase
  const abrirModalNuevo = (fecha = null) => {
    setEditandoEvento(null);
    setFormData({
      titulo: '',
      tipo: 'audiencia',
      materia: '',
      fecha: fecha || fechaSeleccionada,
      hora: '',
      descripcion: '',
      expediente: ''
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (evento) => {
    setEditandoEvento(evento);
    setFormData({
      titulo: evento.titulo,
      tipo: evento.tipo,
      materia: evento.materia || '',
      fecha: evento.fecha,
      hora: evento.hora || '',
      descripcion: evento.descripcion || '',
      expediente: evento.expediente || ''
    });
    setModalAbierto(true);
  };

  const guardarEvento = async () => {
    if (!formData.titulo || !formData.fecha) {
      alert('Completa los campos obligatorios: título y fecha');
      return;
    }
    let nuevosEventos;
    if (editandoEvento) {
      nuevosEventos = eventosLocal.map(ev => ev.id === editandoEvento.id ? { ...formData, id: ev.id } : ev);
    } else {
      nuevosEventos = [...eventosLocal, { ...formData, id: Date.now() }];
    }
    setEventosLocal(nuevosEventos);
    await guardarDatos(nuevosEventos);
    setModalAbierto(false);
  };

  const eliminarEvento = async (id) => {
    if (window.confirm('¿Eliminar este evento?')) {
      const nuevosEventos = eventosLocal.filter(ev => ev.id !== id);
      setEventosLocal(nuevosEventos);
      await guardarDatos(nuevosEventos);
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'audiencia': return 'bg-red-100 text-red-800';
      case 'diligencia': return 'bg-indigo-100 text-indigo-800';
      case 'plazo': return 'bg-orange-100 text-orange-800';
      case 'reunion': return 'bg-blue-100 text-blue-800';
      case 'notificacion': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoIcono = (tipo) => {
    switch (tipo) {
      case 'audiencia': return 'gavel';
      case 'diligencia': return 'assignment';
      case 'plazo': return 'schedule';
      case 'reunion': return 'group';
      case 'notificacion': return 'notifications';
      default: return 'event';
    }
  };

  const handleDiaClick = (fechaStr) => {
    setFechaSeleccionada(fechaStr);
    setVista('dia');
  };

  const renderVistaMes = () => {
    const semanas = obtenerDiasMes();
    const nombreMes = new Date(añoSeleccionado, mesSeleccionado, 1).toLocaleString('es-MX', { month: 'long' });
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-green-700 text-white text-center font-bold py-3 text-lg uppercase flex justify-between items-center px-4">
          <button onClick={() => cambiarMes(-1)} className="hover:bg-green-600 rounded-full w-8 h-8 flex items-center justify-center">&lt;</button>
          <span>{nombreMes} {añoSeleccionado}</span>
          <button onClick={() => cambiarMes(1)} className="hover:bg-green-600 rounded-full w-8 h-8 flex items-center justify-center">&gt;</button>
        </div>
        <div className="grid grid-cols-7 text-center font-semibold border-b bg-gray-100 py-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => <div key={d}>{d}</div>)}
        </div>
        {semanas.map((semana, idx) => (
          <div key={idx} className="grid grid-cols-7 border-b">
            {semana.map((dia, i) => {
              const eventos = getEventosPersonalesPorFecha(dia.fechaStr);
              const tieneEvento = eventos.length > 0;
              const colorClases = getColorDia(dia.fechaStr);
              const esHoy = dia.fechaStr === new Date().toISOString().split('T')[0];
              return (
                <div
                  key={i}
                  onClick={() => handleDiaClick(dia.fechaStr)}
                  className={`min-h-24 p-1 border-r relative cursor-pointer hover:brightness-95 transition ${colorClases} ${!dia.esMesActual ? 'opacity-50' : ''} ${fechaSeleccionada === dia.fechaStr ? 'ring-2 ring-amber-400 ring-inset' : ''} ${esHoy ? 'font-bold' : ''}`}
                >
                  <div className="text-right text-sm font-bold">{dia.fecha.getDate()}</div>
                  {tieneEvento && (
                    <div className="absolute bottom-1 left-1">
                      <span className="material-symbols-outlined text-3xl text-amber-600 drop-shadow-md">event</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderVistaSemana = () => {
    const semana = obtenerSemana();
    const eventosSemana = obtenerEventosSemana();
    return (
      <div>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-green-700 text-white text-center font-bold py-3 text-lg flex justify-between items-center px-4">
            <button onClick={() => cambiarSemana(-1)} className="hover:bg-green-600 rounded-full w-8 h-8 flex items-center justify-center">&lt;</button>
            <span>Semana del {semana[0].fecha.toLocaleDateString('es-MX')} al {semana[6].fecha.toLocaleDateString('es-MX')}</span>
            <button onClick={() => cambiarSemana(1)} className="hover:bg-green-600 rounded-full w-8 h-8 flex items-center justify-center">&gt;</button>
          </div>
          <div className="grid grid-cols-7 text-center font-semibold border-b bg-gray-100 py-2">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {semana.map((dia, i) => {
              const eventos = getEventosPersonalesPorFecha(dia.fechaStr);
              const tieneEvento = eventos.length > 0;
              const colorClases = getColorDia(dia.fechaStr);
              const esHoy = dia.fechaStr === new Date().toISOString().split('T')[0];
              return (
                <div
                  key={i}
                  onClick={() => handleDiaClick(dia.fechaStr)}
                  className={`min-h-32 p-2 border-r relative cursor-pointer hover:brightness-95 transition ${colorClases} ${fechaSeleccionada === dia.fechaStr ? 'ring-2 ring-amber-400 ring-inset' : ''} ${esHoy ? 'font-bold' : ''}`}
                >
                  <div className="text-right text-sm font-bold">{dia.fecha.getDate()}</div>
                  <div className="text-center text-xs font-semibold">{dia.fecha.toLocaleDateString('es-MX', { weekday: 'short' })}</div>
                  {tieneEvento && (
                    <div className="mt-2 flex justify-center">
                      <span className="material-symbols-outlined text-3xl text-amber-600 drop-shadow-md">event</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-6 bg-white rounded-xl shadow-md border border-gray-200 p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Eventos de la semana</h3>
          {eventosSemana.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay eventos programados esta semana.</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {eventosSemana.map((ev, idx) => (
                <div key={idx} className={`p-3 rounded-lg border-l-4 ${getTipoColor(ev.tipo).replace('bg-','border-').replace('text-','')}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">{getTipoIcono(ev.tipo)}</span>
                      <span className="font-bold text-sm">{ev.titulo}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setFechaSeleccionada(ev.fechaStr); setVista('dia'); }} className="text-blue-500 text-xs" title="Ver día">📅</button>
                      <button onClick={() => abrirModalEditar(ev)} className="text-blue-500"><span className="material-symbols-outlined text-sm">edit</span></button>
                      <button onClick={() => eliminarEvento(ev.id)} className="text-red-500"><span className="material-symbols-outlined text-sm">delete</span></button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {ev.fechaObj.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' })} - {ev.hora || 'Hora no especificada'}
                    {ev.materia && <span className="ml-2 badge bg-gray-200 px-1 rounded">⚖️ {ev.materia}</span>}
                    {ev.expediente && <span className="ml-2">📁 {ev.expediente}</span>}
                  </div>
                  {ev.descripcion && <p className="text-xs text-gray-500 mt-1">{ev.descripcion}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderVistaDia = () => {
    const eventos = getEventosPersonalesPorFecha(fechaSeleccionada);
    const colorFondo = getColorDia(fechaSeleccionada);
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-green-700 text-white text-center font-bold py-3 text-lg flex justify-between items-center px-4">
          <button onClick={() => cambiarDia(-1)} className="hover:bg-green-600 rounded-full w-8 h-8 flex items-center justify-center">&lt;</button>
          <span>{fechaFormateada}</span>
          <button onClick={() => cambiarDia(1)} className="hover:bg-green-600 rounded-full w-8 h-8 flex items-center justify-center">&gt;</button>
        </div>
        <div className={`p-4 ${colorFondo}`}>
          <div className="text-center text-sm font-semibold mb-2">
            {esDiaInhabil(fechaSeleccionada) && '🔴 Día inhábil'}
            {esVacacion(fechaSeleccionada) && '🟡 Vacaciones'}
            {esSuspensionFemenino(fechaSeleccionada) && '🌸 Suspensión solo femenino'}
            {esSuspensionMasculino(fechaSeleccionada) && '🟣 Suspensión solo masculino'}
            {esSuspensionMediaJornada(fechaSeleccionada) && '🟢 Suspensión a partir de 13:00 hrs'}
            {!esDiaInhabil(fechaSeleccionada) && !esVacacion(fechaSeleccionada) && !esSuspensionFemenino(fechaSeleccionada) && !esSuspensionMasculino(fechaSeleccionada) && !esSuspensionMediaJornada(fechaSeleccionada) && '✅ Día hábil'}
          </div>
          {eventos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay eventos programados para este día.</p>
          ) : (
            <div className="space-y-3">
              {eventos.map(ev => (
                <div key={ev.id} className={`p-3 rounded-lg border-l-4 ${getTipoColor(ev.tipo).replace('bg-','border-').replace('text-','')}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">{getTipoIcono(ev.tipo)}</span>
                      <span className="font-bold text-sm">{ev.titulo}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => abrirModalEditar(ev)} className="text-blue-500"><span className="material-symbols-outlined text-sm">edit</span></button>
                      <button onClick={() => eliminarEvento(ev.id)} className="text-red-500"><span className="material-symbols-outlined text-sm">delete</span></button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {ev.hora && <span>🕒 {ev.hora}</span>}
                    {ev.materia && <span className="ml-2">⚖️ Materia: {ev.materia}</span>}
                    {ev.expediente && <span className="ml-2">📁 {ev.expediente}</span>}
                  </div>
                  {ev.descripcion && <p className="text-xs text-gray-500 mt-1">{ev.descripcion}</p>}
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 text-center">
            <button onClick={() => abrirModalNuevo(fechaSeleccionada)} className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-600">
              + Agregar evento
            </button>
          </div>
        </div>
      </div>
    );
  };

  const fechaFormateada = new Date(fechaSeleccionada).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (cargando) return <div className="text-center py-20">Cargando agenda...</div>;

  return (
    <div className="px-4">
      {/* Portada */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-700"></div>
        <img 
          src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop" 
          alt="Calendario judicial"
          className="w-full h-32 object-cover opacity-30"
        />
        <div className="relative z-10 p-4 text-white">
          <div className="flex items-center gap-3 mb-1">
            <span className="material-symbols-outlined text-4xl text-amber-400">event_available</span>
            <h1 className="text-2xl font-black">Agenda Laboral</h1>
          </div>
          <p className="text-gray-200 text-sm">Calendario judicial + tus eventos personales</p>
        </div>
      </div>

      {/* Controles superiores */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div className="flex gap-3">
          <div>
            <label className="block text-xs font-bold">Estado / Federación</label>
            <select value={estadoSeleccionado} onChange={(e) => setEstadoSeleccionado(e.target.value)} className="border rounded px-2 py-1 text-sm">
              {estadosDisponibles.map(est => <option key={est}>{est}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold">Año</label>
            <select value={añoSeleccionado} onChange={(e) => setAñoSeleccionado(parseInt(e.target.value))} className="border rounded px-2 py-1 text-sm">
              {añosDisponibles.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button onClick={() => cambiarVista('mes')} className={`px-3 py-1 rounded-md text-sm ${vista === 'mes' ? 'bg-amber-500 text-white' : 'bg-gray-200'}`}>Mes</button>
          <button onClick={() => cambiarVista('semana')} className={`px-3 py-1 rounded-md text-sm ${vista === 'semana' ? 'bg-amber-500 text-white' : 'bg-gray-200'}`}>Semana</button>
          <button onClick={() => cambiarVista('dia')} className={`px-3 py-1 rounded-md text-sm ${vista === 'dia' ? 'bg-amber-500 text-white' : 'bg-gray-200'}`}>Día</button>
        </div>
        <button onClick={() => abrirModalNuevo()} className="bg-amber-500 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm">
          <span className="material-symbols-outlined text-sm">add</span>
          Nuevo evento
        </button>
      </div>

      {/* Leyenda compacta */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 mb-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-white border border-gray-300"></div> Hábil</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500"></div> Inhábil</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500"></div> Vacaciones</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-pink-500"></div> Susp. femenino</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500"></div> Susp. masculino</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500"></div> Susp. 13:00</div>
        <div className="flex items-center gap-1"><span className="material-symbols-outlined text-amber-600 text-base">event</span> Evento personal</div>
      </div>

      {/* Contenido dinámico */}
      <div className="mb-6">
        {vista === 'mes' && renderVistaMes()}
        {vista === 'semana' && renderVistaSemana()}
        {vista === 'dia' && renderVistaDia()}
      </div>

      {/* Modal de creación/edición */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">{editandoEvento ? 'Editar evento' : 'Nuevo evento personal'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold">Título *</label>
                <input type="text" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold">Tipo</label>
                <select value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                  <option value="audiencia">Audiencia</option>
                  <option value="diligencia">Diligencia</option>
                  <option value="plazo">Plazo procesal</option>
                  <option value="reunion">Reunión</option>
                  <option value="notificacion">Notificación</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold">Materia / Tipo de proceso judicial</label>
                <select value={formData.materia} onChange={e => setFormData({...formData, materia: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">-- Seleccione --</option>
                  {materiasJudiciales.map(mat => <option key={mat}>{mat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold">Fecha *</label>
                <input type="date" value={formData.fecha} onChange={e => setFormData({...formData, fecha: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold">Hora (opcional)</label>
                <input type="time" value={formData.hora} onChange={e => setFormData({...formData, hora: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold">Expediente vinculado</label>
                <input type="text" value={formData.expediente} onChange={e => setFormData({...formData, expediente: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Número de expediente" />
              </div>
              <div>
                <label className="block text-sm font-bold">Descripción</label>
                <textarea rows="2" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="w-full px-3 py-2 border rounded-lg"></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModalAbierto(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
              <button onClick={guardarEvento} className="px-4 py-2 bg-amber-500 text-white rounded-lg">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaLaboral;