// src/modules/Torneos/utils/constantes.js

export const ADMIN_PASSWORD = 'admin123';
export const STORAGE_KEY_TORNEOS = 'lexmindi_torneos';
export const STORAGE_KEY_TORNEO_ACTIVO = 'lexmindi_torneo_activo';
export const STORAGE_KEY_PROGRESO_USUARIO = 'lexmindi_progreso_torneo';

export const especialidadesDisponibles = [
  "Derecho Civil",
  "Derecho Penal",
  "Derecho Constitucional",
  "Derecho Laboral",
  "Derecho Mercantil",
  "Derecho Internacional",
  "Derecho Fiscal",
  "Derecho Administrativo",
  "Derecho Familiar",
  "Derecho Procesal"
];

export const torneosPredeterminados = [
  {
    id: 1,
    nombre: "Lex Mundi Invitational 2026",
    descripcion: "Torneo principal de litigación jurídica",
    premio: { tipo: "dinero", monto: 50000, descripcion: "" },
    costoInscripcion: 10,
    estado: "activo",
    maxParticipantes: 32,
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    rondas: ["clasificacion", "grupos", "octavos", "cuartos", "semifinal", "final"],
    premioSecundario: null
  },
  {
    id: 2,
    nombre: "Copa de Derecho Civil 2026",
    descripcion: "Torneo especializado en Derecho Civil",
    premio: { tipo: "dinero", monto: 25000, descripcion: "" },
    costoInscripcion: 5,
    estado: "activo",
    maxParticipantes: 16,
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    rondas: ["clasificacion", "grupos", "octavos", "cuartos", "semifinal", "final"],
    premioSecundario: null
  },
  {
    id: 3,
    nombre: "Torneo de Derecho Penal",
    descripcion: "Especialidad en materia penal",
    premio: { tipo: "dinero", monto: 30000, descripcion: "" },
    costoInscripcion: 10,
    estado: "activo",
    maxParticipantes: 16,
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    rondas: ["clasificacion", "grupos", "octavos", "cuartos", "semifinal", "final"],
    premioSecundario: null
  }
];

export const rivalesDisponibles = [
  { nombre: "Dr. Legal", avatar: "https://randomuser.me/api/portraits/men/1.jpg", especialidad: "Penal", fuerza: 50 },
  { nombre: "Lex Master", avatar: "https://randomuser.me/api/portraits/women/2.jpg", especialidad: "Constitucional", fuerza: 50 },
  { nombre: "Juris Doctor", avatar: "https://randomuser.me/api/portraits/men/3.jpg", especialidad: "Civil", fuerza: 50 },
  { nombre: "Abogada Pro", avatar: "https://randomuser.me/api/portraits/women/4.jpg", especialidad: "Laboral", fuerza: 50 },
  { nombre: "Dr. Hernández", avatar: "https://randomuser.me/api/portraits/men/5.jpg", especialidad: "Penal", fuerza: 85 },
  { nombre: "Dra. Martínez", avatar: "https://randomuser.me/api/portraits/women/6.jpg", especialidad: "Civil", fuerza: 82 },
  { nombre: "Lic. Rodríguez", avatar: "https://randomuser.me/api/portraits/men/7.jpg", especialidad: "Constitucional", fuerza: 78 },
  { nombre: "Eximio Jurista", avatar: "https://randomuser.me/api/portraits/men/10.jpg", especialidad: "Penal", fuerza: 75 },
  { nombre: "Dra. Valeria", avatar: "https://randomuser.me/api/portraits/women/11.jpg", especialidad: "Civil", fuerza: 78 },
  { nombre: "Lic. Mendoza", avatar: "https://randomuser.me/api/portraits/men/12.jpg", especialidad: "Constitucional", fuerza: 72 },
  { nombre: "Dra. Fuentes", avatar: "https://randomuser.me/api/portraits/women/13.jpg", especialidad: "Laboral", fuerza: 80 },
  { nombre: "Dr. Reyes", avatar: "https://randomuser.me/api/portraits/men/14.jpg", especialidad: "Mercantil", fuerza: 76 },
  { nombre: "Dra. Luna", avatar: "https://randomuser.me/api/portraits/women/15.jpg", especialidad: "Fiscal", fuerza: 74 }
];

export const litigantesInicialesGrupo = [
  { nombre: "Dr. Hernández", avatar: "https://randomuser.me/api/portraits/men/5.jpg", especialidad: "Penal", fuerza: 85 },
  { nombre: "Dra. Martínez", avatar: "https://randomuser.me/api/portraits/women/6.jpg", especialidad: "Civil", fuerza: 82 },
  { nombre: "Lic. Rodríguez", avatar: "https://randomuser.me/api/portraits/men/7.jpg", especialidad: "Constitucional", fuerza: 78 }
];