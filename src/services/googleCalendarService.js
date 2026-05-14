// src/services/googleCalendarService.js

// Generar enlace para agregar a Google Calendar
export const generarEnlaceGoogleCalendar = (evento) => {
  // Formatear fechas
  const startDate = new Date(`${evento.fecha}T${evento.hora || '09:00'}`);
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 1); // Duración de 1 hora por defecto
  
  // Formato requerido por Google Calendar
  const formatDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };
  
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  
  // Construir URL de Google Calendar
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: evento.titulo,
    dates: `${start}/${end}`,
    details: `${evento.descripcion || ''}\n\nMateria: ${evento.materia || 'No especificada'}\nExpediente: ${evento.expediente || 'N/A'}\nTipo: ${evento.tipo}`,
    location: evento.ubicacion || 'Tribunal'
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// Abrir Google Calendar en nueva ventana
export const agregarAGoolgeCalendar = (evento) => {
  const url = generarEnlaceGoogleCalendar(evento);
  window.open(url, '_blank', 'noopener,noreferrer');
};

// Sincronizar múltiples eventos
export const sincronizarConGoogleCalendar = async (eventos) => {
  return eventos.map(evento => ({
    ...evento,
    googleCalendarLink: generarEnlaceGoogleCalendar(evento)
  }));
};