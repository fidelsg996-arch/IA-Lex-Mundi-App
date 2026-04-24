// src/modules/Torneos/Torneos.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBilletera } from '../../context/BilleteraContext';

// ============================================================
// CONFIGURACIÓN ADMIN
// ============================================================
const ADMIN_PASSWORD = 'admin123';
const STORAGE_KEY_TORNEOS = 'lexmindi_torneos';
const STORAGE_KEY_TORNEO_ACTIVO = 'lexmindi_torneo_activo';
const STORAGE_KEY_PROGRESO_USUARIO = 'lexmindi_progreso_torneo';

// ============================================================
// LIBROS DISPONIBLES PARA PREMIOS
// ============================================================
const obtenerLibrosParaPremios = () => {
  const stored = localStorage.getItem('lexmindi_libros');
  if (stored) {
    return JSON.parse(stored).map(libro => ({
      id: libro.id,
      titulo: libro.titulo,
      imagen: libro.imagen,
      precio: libro.precio
    }));
  }
  return [];
};

// ============================================================
// TORNEOS PREDETERMINADOS
// ============================================================
const torneosPredeterminados = [
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

// ============================================================
// BANCO DE PREGUNTAS POR ÁREA (AMPLIADO)
// ============================================================
const bancoPreguntasPorArea = {
  "Derecho Civil": [
    { pregunta: "¿Qué artículo del Código Civil Federal regula la capacidad jurídica de las personas?", opciones: ["Artículo 22", "Artículo 24", "Artículo 450", "Artículo 1795"], correcta: 1, area: "Derecho Civil" },
    { pregunta: "¿Qué tipo de contrato se perfecciona con la simple manifestación de la voluntad?", opciones: ["Contrato real", "Contrato consensual", "Contrato formal", "Contrato unilateral"], correcta: 1, area: "Derecho Civil" },
    { pregunta: "¿Cuál es el plazo para la prescripción positiva de bienes inmuebles?", opciones: ["3 años", "5 años", "10 años", "15 años"], correcta: 2, area: "Derecho Civil" },
    { pregunta: "¿Qué es la acción reivindicatoria?", opciones: ["Recuperar la posesión", "Reclamar la propiedad", "Demandar daños", "Impugnar un testamento"], correcta: 1, area: "Derecho Civil" },
    { pregunta: "¿Qué es el usufructo?", opciones: ["Derecho de usar y disfrutar", "Derecho de propiedad", "Derecho de posesión", "Derecho de habitación"], correcta: 0, area: "Derecho Civil" },
    { pregunta: "¿Qué es la cosa juzgada?", opciones: ["Sentencia firme e inapelable", "Juicio en curso", "Prueba documental", "Testimonio de parte"], correcta: 0, area: "Derecho Civil" },
    { pregunta: "¿Qué es el contrato de adhesión?", opciones: ["Contrato negociado", "Contrato con cláusulas predispuestas", "Contrato bilateral", "Contrato gratuito"], correcta: 1, area: "Derecho Civil" },
    { pregunta: "¿Qué requiere el pago de una obligación?", opciones: ["Consentimiento del deudor", "Entrega de la cosa o cantidad debida", "Presencia de un notario", "Documento escrito"], correcta: 1, area: "Derecho Civil" }
  ],
  "Derecho Penal": [
    { pregunta: "¿Cuál es el principio fundamental del derecho penal que establece que una persona es inocente hasta que se demuestre lo contrario?", opciones: ["Principio de legalidad", "Presunción de inocencia", "Debido proceso", "Non bis in idem"], correcta: 1, area: "Derecho Penal" },
    { pregunta: "¿Qué tipo de falta se sanciona con prisión preventiva oficiosa?", opciones: ["Faltas administrativas", "Delitos graves", "Faltas cívicas", "Delitos culposos"], correcta: 1, area: "Derecho Penal" },
    { pregunta: "¿Qué es el dolo en materia penal?", opciones: ["Culpa", "Negligencia", "Intención de cometer el delito", "Caso fortuito"], correcta: 2, area: "Derecho Penal" },
    { pregunta: "¿Qué es la tentativa en derecho penal?", opciones: ["Delito consumado", "Actos preparatorios punibles", "Inicio de ejecución sin consumación", "Desistimiento voluntario"], correcta: 2, area: "Derecho Penal" },
    { pregunta: "¿Qué es el delito culposo?", opciones: ["Intencional", "Por imprudencia o negligencia", "Por caso fortuito", "Por fuerza mayor"], correcta: 1, area: "Derecho Penal" }
  ],
  "Derecho Constitucional": [
    { pregunta: "¿Qué artículo de la Constitución Mexicana establece la división de poderes?", opciones: ["Artículo 39", "Artículo 49", "Artículo 123", "Artículo 27"], correcta: 1, area: "Derecho Constitucional" },
    { pregunta: "¿Cuántos ministros integran la Suprema Corte de Justicia de la Nación?", opciones: ["9", "11", "13", "15"], correcta: 1, area: "Derecho Constitucional" },
    { pregunta: "¿Qué es la 'acción de amparo'?", opciones: ["Un recurso para proteger derechos humanos", "Una sentencia judicial", "Un tipo de contrato", "Una ley federal"], correcta: 0, area: "Derecho Constitucional" },
    { pregunta: "¿Qué es el principio de supremacía constitucional?", opciones: ["La constitución está sobre cualquier ley", "El presidente está sobre la constitución", "Las leyes locales tienen prioridad", "Los tratados internacionales no aplican"], correcta: 0, area: "Derecho Constitucional" },
    { pregunta: "¿Qué es el juicio de controversia constitucional?", opciones: ["Entre poderes o niveles de gobierno", "Entre particulares", "Por violación de derechos humanos", "Amparo directo"], correcta: 0, area: "Derecho Constitucional" }
  ],
  "Derecho Laboral": [
    { pregunta: "¿Qué principio del derecho laboral protege al trabajador en caso de duda?", opciones: ["Principio de continuidad", "Principio in dubio pro operario", "Principio de primacía de la realidad", "Principio de irrenunciabilidad"], correcta: 1, area: "Derecho Laboral" },
    { pregunta: "¿Cuál es la jornada máxima de trabajo diurna en México?", opciones: ["6 horas", "8 horas", "10 horas", "12 horas"], correcta: 1, area: "Derecho Laboral" },
    { pregunta: "¿Qué es el salario mínimo?", opciones: ["Salario más bajo legal", "Salario promedio", "Salario más alto", "Salario por hora"], correcta: 0, area: "Derecho Laboral" }
  ],
  "Derecho Mercantil": [
    { pregunta: "¿Qué principio rige la competencia económica en México?", opciones: ["Monopolio estatal", "Libre competencia", "Intervención total", "Economía cerrada"], correcta: 1, area: "Derecho Mercantil" },
    { pregunta: "¿Qué ley regula los títulos de crédito en México?", opciones: ["Ley General de Sociedades", "Ley de Títulos y Operaciones de Crédito", "Código de Comercio", "Ley de Quiebras"], correcta: 1, area: "Derecho Mercantil" },
    { pregunta: "¿Qué es una letra de cambio?", opciones: ["Contrato de compraventa", "Título de crédito", "Documento fiscal", "Recibo de pago"], correcta: 1, area: "Derecho Mercantil" }
  ]
};

// ============================================================
// ESPECIALIDADES DISPONIBLES
// ============================================================
const especialidadesDisponibles = [
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

// ============================================================
// FUNCIÓN PARA RESPONDER DEL RIVAL (95% DE EFECTIVIDAD)
// ============================================================
const respuestaRivalInteligente = (pregunta) => {
  const acierta = Math.random() < 0.95;
  
  if (acierta) {
    return pregunta.correcta;
  } else {
    const opcionesIncorrectas = pregunta.opciones
      .map((_, idx) => idx)
      .filter(idx => idx !== pregunta.correcta);
    return opcionesIncorrectas[Math.floor(Math.random() * opcionesIncorrectas.length)];
  }
};

// ============================================================
// COMPONENTE FORMULARIO DE TORNEO
// ============================================================
const FormularioTorneo = ({ torneo, onSave, onCancel, librosDisponibles }) => {
  const [formData, setFormData] = useState({
    nombre: torneo?.nombre || '',
    descripcion: torneo?.descripcion || '',
    premio: { tipo: torneo?.premio?.tipo || 'dinero', monto: torneo?.premio?.monto || 50000, descripcion: torneo?.premio?.descripcion || '' },
    costoInscripcion: torneo?.costoInscripcion || 10,
    estado: torneo?.estado || 'activo',
    maxParticipantes: torneo?.maxParticipantes || 32,
    fechaInicio: torneo?.fechaInicio || new Date().toISOString().split('T')[0],
    fechaFin: torneo?.fechaFin || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    rondas: torneo?.rondas || ['clasificacion', 'grupos', 'octavos', 'cuartos', 'semifinal', 'final'],
    premioSecundario: torneo?.premioSecundario || null
  });

  const [mostrarPremioSecundario, setMostrarPremioSecundario] = useState(!!formData.premioSecundario);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-4">{torneo ? 'Editar Torneo' : 'Nuevo Torneo'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold">Nombre del Torneo *</label>
            <input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full p-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-bold">Descripción</label>
            <textarea value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="w-full p-2 border rounded-lg" rows="2" />
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-bold mb-2">🏆 Premio Principal</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Tipo de premio</label>
                <select value={formData.premio.tipo} onChange={e => setFormData({...formData, premio: {...formData.premio, tipo: e.target.value}})} className="w-full p-2 border rounded-lg">
                  <option value="dinero">💰 Dinero</option>
                  <option value="libro">📚 Libro</option>
                  <option value="ambos">💰 Dinero + 📚 Libro</option>
                </select>
              </div>
              {(formData.premio.tipo === 'dinero' || formData.premio.tipo === 'ambos') && (
                <div>
                  <label className="block text-sm">Monto ($)</label>
                  <input type="number" value={formData.premio.monto} onChange={e => setFormData({...formData, premio: {...formData.premio, monto: parseInt(e.target.value) || 0}})} className="w-full p-2 border rounded-lg" />
                </div>
              )}
            </div>
            {(formData.premio.tipo === 'libro' || formData.premio.tipo === 'ambos') && (
              <div className="mt-2">
                <label className="block text-sm">Seleccionar libro</label>
                <select value={formData.premio.descripcion} onChange={e => setFormData({...formData, premio: {...formData.premio, descripcion: e.target.value}})} className="w-full p-2 border rounded-lg">
                  <option value="">-- Selecciona un libro --</option>
                  {librosDisponibles.map(libro => (
                    <option key={libro.id} value={libro.titulo}>{libro.titulo} (${libro.precio})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">🎁 Premio Secundario (participación)</h3>
              <button type="button" onClick={() => {
                if (mostrarPremioSecundario) {
                  setFormData({...formData, premioSecundario: null});
                  setMostrarPremioSecundario(false);
                } else {
                  setFormData({...formData, premioSecundario: { tipo: 'libro', descripcion: '', libroId: null }});
                  setMostrarPremioSecundario(true);
                }
              }} className="text-sm text-blue-500 hover:text-blue-700">
                {mostrarPremioSecundario ? '❌ Eliminar premio' : '➕ Agregar premio secundario'}
              </button>
            </div>
            {mostrarPremioSecundario && (
              <>
                <div>
                  <label className="block text-sm">Descripción del premio</label>
                  <input type="text" value={formData.premioSecundario?.descripcion || ''} onChange={e => setFormData({...formData, premioSecundario: {...formData.premioSecundario, descripcion: e.target.value}})} placeholder="Ej: Formulario Práctico Forense" className="w-full p-2 border rounded-lg" />
                </div>
                <div className="mt-2">
                  <label className="block text-sm">Vincular con libro (opcional)</label>
                  <select value={formData.premioSecundario?.libroId || ''} onChange={e => { 
                    const libroId = e.target.value ? parseInt(e.target.value) : null; 
                    const libro = librosDisponibles.find(l => l.id === libroId); 
                    setFormData({...formData, premioSecundario: {...formData.premioSecundario, libroId, descripcion: libro ? libro.titulo : formData.premioSecundario?.descripcion || ''}}); 
                  }} className="w-full p-2 border rounded-lg">
                    <option value="">-- Ninguno --</option>
                    {librosDisponibles.map(libro => <option key={libro.id} value={libro.id}>{libro.titulo} (${libro.precio})</option>)}
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold">Costo inscripción ($)</label>
              <input type="number" value={formData.costoInscripcion} onChange={e => setFormData({...formData, costoInscripcion: parseInt(e.target.value) || 0})} className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold">Estado</label>
              <select value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})} className="w-full p-2 border rounded-lg">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold">Fecha inicio</label>
              <input type="date" value={formData.fechaInicio} onChange={e => setFormData({...formData, fechaInicio: e.target.value})} className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold">Fecha fin</label>
              <input type="date" value={formData.fechaFin} onChange={e => setFormData({...formData, fechaFin: e.target.value})} className="w-full p-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold">Máximo participantes</label>
            <input type="number" value={formData.maxParticipantes} onChange={e => setFormData({...formData, maxParticipantes: parseInt(e.target.value) || 32})} className="w-full p-2 border rounded-lg" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">Guardar Torneo</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
const Torneos = () => {
  const { user } = useAuth();
  const billetera = useBilletera();
  const { saldo, transacciones, recargarSaldo, realizarPago } = billetera;

  // Estados principales
  const [torneos, setTorneos] = useState([]);
  const [torneoActivo, setTorneoActivo] = useState(null);
  const [modoAdmin, setModoAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [editandoTorneo, setEditandoTorneo] = useState(null);
  const [showFormTorneo, setShowFormTorneo] = useState(false);
  const [librosDisponibles, setLibrosDisponibles] = useState([]);

  // Estados del torneo (jugador)
  const [ronda, setRonda] = useState('registroTorneo');
  const [dueloActivo, setDueloActivo] = useState(null);
  const [turnoActual, setTurnoActual] = useState('usuario');
  const [puntajeUsuario, setPuntajeUsuario] = useState(0);
  const [puntajeRival, setPuntajeRival] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [mensajeDuelo, setMensajeDuelo] = useState('');
  const [dueloTerminado, setDueloTerminado] = useState(false);
  const [ganadorDuelo, setGanadorDuelo] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(20);
  const [temporizadorActivo, setTemporizadorActivo] = useState(false);
  const [esperandoCambioTurno, setEsperandoCambioTurno] = useState(false);
  const [victorias, setVictorias] = useState(0);
  const [derrotas, setDerrotas] = useState(0);
  const [buscandoRival, setBuscandoRival] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState(null);

  // Estados del jugador
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [avatarSeleccionado, setAvatarSeleccionado] = useState(null);
  const [mostrarModalRecarga, setMostrarModalRecarga] = useState(false);
  const [mostrarModalHistorial, setMostrarModalHistorial] = useState(false);
  const [montoRecarga, setMontoRecarga] = useState(0);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [datosPago, setDatosPago] = useState({ numeroTarjeta: '', fechaExpiracion: '', cvv: '' });
  const [cargando, setCargando] = useState(false);
  const [mostrarConfirmacionPago, setMostrarConfirmacionPago] = useState(false);
  const [mostrandoPago, setMostrandoPago] = useState(false);

  // Estados fase de grupos
  const [grupos, setGrupos] = useState([]);
  const [grupoActual, setGrupoActual] = useState(null);
  const [partidosGrupo, setPartidosGrupo] = useState([]);
  const [partidoActual, setPartidoActual] = useState(null);
  const [partidoIndex, setPartidoIndex] = useState(0);
  const [puntosGrupo, setPuntosGrupo] = useState(0);
  const [argumentosFavor, setArgumentosFavor] = useState(0);
  const [argumentosContra, setArgumentosContra] = useState(0);
  const [faseGrupoTerminada, setFaseGrupoTerminada] = useState(false);
  const [clasificados, setClasificados] = useState([]);

  // Estados fase eliminatorias
  const [faseActual, setFaseActual] = useState('octavos');
  const [llaveA, setLlaveA] = useState([]);
  const [llaveB, setLlaveB] = useState([]);
  const [partidosEliminatoria, setPartidosEliminatoria] = useState([]);
  const [partidoActualEliminatoria, setPartidoActualEliminatoria] = useState(null);
  const [ganadoresRonda, setGanadoresRonda] = useState([]);
  const [rondaEliminatoriaActual, setRondaEliminatoriaActual] = useState(0);
  const [campeon, setCampeon] = useState(null);
  const [mostrarCampeon, setMostrarCampeon] = useState(false);

  // ============================================================
  // FUNCIÓN PARA SELECCIONAR PREGUNTA ALEATORIA
  // ============================================================
  const seleccionarPreguntaAleatoria = useCallback(() => {
    const areas = Object.keys(bancoPreguntasPorArea);
    const areaAleatoria = areas[Math.floor(Math.random() * areas.length)];
    const preguntasArea = bancoPreguntasPorArea[areaAleatoria];
    const indice = Math.floor(Math.random() * preguntasArea.length);
    setPreguntaActual(preguntasArea[indice]);
  }, []);

  // ============================================================
  // FUNCIÓN PARA CAMBIAR TURNO
  // ============================================================
  const cambiarTurno = useCallback(() => {
    setEsperandoCambioTurno(true);
    setTimeout(() => {
      setTurnoActual(prev => prev === "usuario" ? "rival" : "usuario");
      setTiempoRestante(20);
      setTemporizadorActivo(true);
      setRespuestaSeleccionada(null);
      setMensajeDuelo("");
      setEsperandoCambioTurno(false);
      seleccionarPreguntaAleatoria();
    }, 1500);
  }, [seleccionarPreguntaAleatoria]);

  // ============================================================
  // FUNCIÓN PARA TERMINAR DUELO
  // ============================================================
  const terminarDuelo = useCallback((ganador) => {
    setDueloTerminado(true);
    setGanadorDuelo(ganador);
    
    if (ganador === "usuario") {
      const nuevasVictorias = victorias + 1;
      setVictorias(nuevasVictorias);
      
      if (ronda === "faseLitigios") {
        setPuntosGrupo(prev => prev + 3);
        setArgumentosFavor(prev => prev + puntajeUsuario);
        setArgumentosContra(prev => prev + puntajeRival);
      } else if (ronda === "eliminatoria") {
        actualizarEliminatoria("usuario");
      }
      
      if (nuevasVictorias >= 3 && ronda !== "faseLitigios" && ronda !== "eliminatoria") {
        setTimeout(() => iniciarFaseLitigios(), 2000);
      } else if (ronda === "faseLitigios") {
        setTimeout(() => siguienteLitigioGrupo(), 2000);
      } else if (ronda === "eliminatoria") {
        setTimeout(() => siguienteEliminatoria(), 2000);
      } else {
        setTimeout(() => setRonda("salaEspera"), 2000);
      }
    } else {
      const nuevasDerrotas = derrotas + 1;
      setDerrotas(nuevasDerrotas);
      
      if (ronda === "faseLitigios") {
        setArgumentosFavor(prev => prev + puntajeUsuario);
        setArgumentosContra(prev => prev + puntajeRival);
      } else if (ronda === "eliminatoria") {
        actualizarEliminatoria("rival");
      }
      
      if (nuevasDerrotas >= 2 && ronda !== "faseLitigios" && ronda !== "eliminatoria") {
        setTimeout(() => setRonda("eliminado"), 2000);
      } else if (ronda === "faseLitigios") {
        setTimeout(() => siguienteLitigioGrupo(), 2000);
      } else if (ronda === "eliminatoria") {
        setTimeout(() => siguienteEliminatoria(), 2000);
      } else {
        setTimeout(() => setRonda("salaEspera"), 2000);
      }
    }
  }, [victorias, derrotas, ronda, puntajeUsuario, puntajeRival]);

  // ============================================================
  // FUNCIÓN PARA RESPONDER DEL USUARIO
  // ============================================================
  const responderPregunta = useCallback((indice) => {
    if (respuestaSeleccionada !== null || dueloTerminado || esperandoCambioTurno || !preguntaActual) return;
    setTemporizadorActivo(false);
    setRespuestaSeleccionada(indice);
    const esCorrecta = indice === preguntaActual.correcta;
    if (turnoActual === "usuario") {
      if (esCorrecta) {
        const nuevo = puntajeUsuario + 10;
        setPuntajeUsuario(nuevo);
        setMensajeDuelo(`✅ Correcto! +10 puntos (${nuevo}/100) - ${preguntaActual.area}`);
        if (nuevo >= 100) terminarDuelo("usuario");
        else cambiarTurno();
      } else {
        setMensajeDuelo(`❌ Incorrecto. Respuesta correcta: ${preguntaActual.opciones[preguntaActual.correcta]}`);
        cambiarTurno();
      }
    }
  }, [respuestaSeleccionada, dueloTerminado, turnoActual, puntajeUsuario, preguntaActual, terminarDuelo, cambiarTurno, esperandoCambioTurno]);

  // ============================================================
  // FUNCIÓN PARA RESPUESTA DEL RIVAL (95% EFECTIVIDAD)
  // ============================================================
  const respuestaRivalHandler = useCallback(() => {
    if (turnoActual !== "rival" || dueloTerminado || respuestaSeleccionada !== null || esperandoCambioTurno || !preguntaActual) return;
    setTemporizadorActivo(false);
    
    const indiceRespuesta = respuestaRivalInteligente(preguntaActual);
    setRespuestaSeleccionada(indiceRespuesta);
    
    const acierta = indiceRespuesta === preguntaActual.correcta;
    if (acierta) {
      const nuevo = puntajeRival + 10;
      setPuntajeRival(nuevo);
      setMensajeDuelo(`⚖️ Rival acertó! +10 puntos (${nuevo}/100) - ${preguntaActual.area}`);
      if (nuevo >= 100) terminarDuelo("rival");
      else cambiarTurno();
    } else {
      setMensajeDuelo(`📜 Rival falló. Respuesta correcta: ${preguntaActual.opciones[preguntaActual.correcta]}`);
      cambiarTurno();
    }
  }, [turnoActual, dueloTerminado, respuestaSeleccionada, esperandoCambioTurno, puntajeRival, preguntaActual, terminarDuelo, cambiarTurno]);

  // ============================================================
  // FUNCIÓN PARA REINICIAR TORNEO COMPLETO
  // ============================================================
  const reiniciarTorneoCompleto = () => {
    localStorage.removeItem(STORAGE_KEY_PROGRESO_USUARIO);
    
    const usuario = JSON.parse(localStorage.getItem('torneo_usuario') || '{}');
    if (usuario && usuario.nombre) {
      usuario.inscrito = false;
      usuario.duelosGanados = 0;
      usuario.duelosPerdidos = 0;
      localStorage.setItem('torneo_usuario', JSON.stringify(usuario));
    }
    
    setVictorias(0);
    setDerrotas(0);
    setGrupos([]);
    setGrupoActual(null);
    setPartidosGrupo([]);
    setPartidoActual(null);
    setPuntosGrupo(0);
    setArgumentosFavor(0);
    setArgumentosContra(0);
    setFaseGrupoTerminada(false);
    setClasificados([]);
    setLlaveA([]);
    setLlaveB([]);
    setPartidosEliminatoria([]);
    setRondaEliminatoriaActual(0);
    setCampeon(null);
    setMostrarCampeon(false);
    setMostrandoPago(true);
    setRonda("registroTorneo");
  };

  // ============================================================
  // INICIAR FASE DE LITIGIOS (GRUPOS)
  // ============================================================
  const iniciarFaseLitigios = () => {
    const especialidadesLista = Object.keys(bancoPreguntasPorArea);
    const especialidadAleatoria = especialidadesLista[Math.floor(Math.random() * especialidadesLista.length)];
    const usuarioLocal = JSON.parse(localStorage.getItem('torneo_usuario') || '{}');
    
    const litigantesDisponibles = [
      { nombre: "Dr. Hernández", avatar: "https://randomuser.me/api/portraits/men/5.jpg", especialidad: especialidadAleatoria, fuerza: 85 },
      { nombre: "Dra. Martínez", avatar: "https://randomuser.me/api/portraits/women/6.jpg", especialidad: especialidadAleatoria, fuerza: 82 },
      { nombre: "Lic. Rodríguez", avatar: "https://randomuser.me/api/portraits/men/7.jpg", especialidad: especialidadAleatoria, fuerza: 78 }
    ];
    
    const grupoUsuario = {
      id: 1,
      nombre: "Grupo A",
      especialidad: especialidadAleatoria,
      litigantes: [
        { ...usuarioLocal, especialidad: usuarioLocal.especialidad || "General", fuerza: 90, esUsuario: true, puntosTabla: 0, ganados: 0, perdidos: 0, realizados: 0, argumentosFavor: 0, argumentosContra: 0, diferenciaArgumentos: 0 },
        ...litigantesDisponibles
      ]
    };
    
    setGrupos([grupoUsuario]);
    setGrupoActual(grupoUsuario);
    generarLitigiosGrupo(grupoUsuario);
    setRonda("vistaLitigios");
    guardarProgresoCompleto();
  };

  // ============================================================
  // GENERAR LITIGIOS DEL GRUPO
  // ============================================================
  const generarLitigiosGrupo = (grupo) => {
    const litigios = [];
    const litigantes = grupo.litigantes;
    for (let i = 0; i < litigantes.length; i++) {
      for (let j = i + 1; j < litigantes.length; j++) {
        litigios.push({
          id: `${i}-${j}`,
          litigante1: litigantes[i],
          litigante2: litigantes[j],
          realizado: false,
          resultado: null,
          ganador: null,
          puntos1: 0,
          puntos2: 0
        });
      }
    }
    setPartidosGrupo(litigios);
    setPartidoIndex(0);
    setPartidoActual(litigios[0]);
    setPuntosGrupo(0);
    setArgumentosFavor(0);
    setArgumentosContra(0);
    setFaseGrupoTerminada(false);
  };

  // ============================================================
  // INICIAR LITIGIO EN GRUPOS
  // ============================================================
  const iniciarLitigioGrupo = (litigio) => {
    const esUsuario = litigio.litigante1.esUsuario || litigio.litigante2.esUsuario;
    if (esUsuario) {
      const rival = litigio.litigante1.esUsuario ? litigio.litigante2 : litigio.litigante1;
      setDueloActivo(rival);
      setPuntajeUsuario(0);
      setPuntajeRival(0);
      setTurnoActual("usuario");
      setDueloTerminado(false);
      setGanadorDuelo(null);
      setRespuestaSeleccionada(null);
      setMensajeDuelo("");
      setTiempoRestante(20);
      setTemporizadorActivo(true);
      setEsperandoCambioTurno(false);
      seleccionarPreguntaAleatoria();
      setRonda("litigioGrupo");
    } else {
      simularLitigioIA(litigio);
    }
  };

  // ============================================================
  // SIMULAR LITIGIO ENTRE IAs
  // ============================================================
  const simularLitigioIA = (litigio) => {
    const fuerza1 = litigio.litigante1.fuerza || 50;
    const fuerza2 = litigio.litigante2.fuerza || 50;
    const total = fuerza1 + fuerza2;
    const probabilidadGana1 = fuerza1 / total;
    const random = Math.random();
    
    let puntos1, puntos2;
    if (random < probabilidadGana1) {
      puntos1 = Math.floor(Math.random() * 90) + 10;
      puntos2 = Math.floor(Math.random() * puntos1);
    } else {
      puntos2 = Math.floor(Math.random() * 90) + 10;
      puntos1 = Math.floor(Math.random() * puntos2);
    }
    
    actualizarResultadoGrupo(litigio, puntos1, puntos2);
  };

  // ============================================================
  // ACTUALIZAR RESULTADO DEL GRUPO
  // ============================================================
  const actualizarResultadoGrupo = (litigio, puntos1, puntos2) => {
    const litigiosActualizados = partidosGrupo.map(p => {
      if (p.id === litigio.id) {
        const ganadorObj = puntos1 > puntos2 ? p.litigante1 : p.litigante2;
        return { 
          ...p, 
          realizado: true, 
          resultado: `${ganadorObj.nombre} gana`,
          ganador: ganadorObj.nombre,
          puntos1, 
          puntos2 
        };
      }
      return p;
    });
    setPartidosGrupo(litigiosActualizados);
    
    const litigantesActualizados = grupoActual.litigantes.map(litigante => {
      const litigiosDelLitigante = litigiosActualizados.filter(p => 
        p.litigante1.nombre === litigante.nombre || p.litigante2.nombre === litigante.nombre
      );
      
      let puntos = 0;
      let argumentosFavorLit = 0;
      let argumentosContraLit = 0;
      let ganados = 0, perdidos = 0;
      let duelosJugados = 0;
      
      litigiosDelLitigante.forEach(p => {
        if (p.realizado) {
          duelosJugados++;
          const esLitigante1 = p.litigante1.nombre === litigante.nombre;
          const puntosLit = esLitigante1 ? p.puntos1 : p.puntos2;
          const puntosRival = esLitigante1 ? p.puntos2 : p.puntos1;
          
          argumentosFavorLit += puntosLit;
          argumentosContraLit += puntosRival;
          
          if (puntosLit > puntosRival) {
            puntos += 3;
            ganados++;
          } else {
            perdidos++;
          }
        }
      });
      
      return {
        ...litigante,
        puntosTabla: puntos,
        ganados,
        perdidos,
        realizados: duelosJugados,
        argumentosFavor: argumentosFavorLit,
        argumentosContra: argumentosContraLit,
        diferenciaArgumentos: argumentosFavorLit - argumentosContraLit
      };
    });
    
    setGrupoActual({ ...grupoActual, litigantes: litigantesActualizados });
    
    const todosRealizados = litigiosActualizados.every(p => p.realizado === true);
    
    if (todosRealizados) {
      finalizarFaseLitigios();
    } else {
      const siguiente = litigiosActualizados.find(p => !p.realizado);
      if (siguiente) {
        setPartidoActual(siguiente);
        setPartidoIndex(litigiosActualizados.findIndex(p => p.id === siguiente.id));
      }
    }
    
    // Forzar actualización de la vista
    if (ronda === "litigioGrupo") {
      setTimeout(() => setRonda("vistaLitigios"), 500);
    }
  };

  // ============================================================
  // SIGUIENTE LITIGIO EN GRUPO
  // ============================================================
  const siguienteLitigioGrupo = () => {
    const puntosUsuarioFinal = puntajeUsuario;
    const puntosRivalFinal = puntajeRival;
    const litigioActual = partidoActual;
    
    if (litigioActual.litigante1.esUsuario) {
      actualizarResultadoGrupo(litigioActual, puntosUsuarioFinal, puntosRivalFinal);
    } else if (litigioActual.litigante2.esUsuario) {
      actualizarResultadoGrupo(litigioActual, puntosRivalFinal, puntosUsuarioFinal);
    } else {
      actualizarResultadoGrupo(litigioActual, puntosUsuarioFinal, puntosRivalFinal);
    }
    
    setDueloActivo(null);
    setPuntajeUsuario(0);
    setPuntajeRival(0);
    setTurnoActual("usuario");
    setDueloTerminado(false);
    setRespuestaSeleccionada(null);
    setMensajeDuelo("");
  };

  // ============================================================
  // FINALIZAR FASE DE GRUPOS
  // ============================================================
  const finalizarFaseLitigios = () => {
    const litigantesConPuntos = [...grupoActual.litigantes];
    
    litigantesConPuntos.sort((a, b) => {
      if (a.puntosTabla !== b.puntosTabla) return b.puntosTabla - a.puntosTabla;
      return b.diferenciaArgumentos - a.diferenciaArgumentos;
    });
    
    const clasificadosLitigio = litigantesConPuntos.slice(0, 2);
    setClasificados(clasificadosLitigio);
    setFaseGrupoTerminada(true);
    
    const usuarioClasificado = clasificadosLitigio.some(l => l.esUsuario);
    if (usuarioClasificado) {
      inicializarEliminatorias(clasificadosLitigio);
      setTimeout(() => setRonda("clasificadoEliminatorias"), 2000);
    } else {
      setTimeout(() => setRonda("eliminadoLitigios"), 2000);
    }
  };

  // ============================================================
  // INICIALIZAR ELIMINATORIAS
  // ============================================================
  const inicializarEliminatorias = (clasificadosLitigio) => {
    const primero = clasificadosLitigio[0];
    const segundo = clasificadosLitigio[1];
    
    setLlaveA([primero]);
    setLlaveB([segundo]);
    
    const oponentesSimulados = [
      { nombre: "Eximio Jurista", avatar: "https://randomuser.me/api/portraits/men/10.jpg", especialidad: "Derecho Penal", fuerza: 75, esUsuario: false },
      { nombre: "Dra. Valeria", avatar: "https://randomuser.me/api/portraits/women/11.jpg", especialidad: "Derecho Civil", fuerza: 78, esUsuario: false },
      { nombre: "Lic. Mendoza", avatar: "https://randomuser.me/api/portraits/men/12.jpg", especialidad: "Derecho Constitucional", fuerza: 72, esUsuario: false },
      { nombre: "Dra. Fuentes", avatar: "https://randomuser.me/api/portraits/women/13.jpg", especialidad: "Derecho Laboral", fuerza: 80, esUsuario: false },
      { nombre: "Dr. Reyes", avatar: "https://randomuser.me/api/portraits/men/14.jpg", especialidad: "Derecho Mercantil", fuerza: 76, esUsuario: false },
      { nombre: "Dra. Luna", avatar: "https://randomuser.me/api/portraits/women/15.jpg", especialidad: "Derecho Fiscal", fuerza: 74, esUsuario: false }
    ];
    
    const octavosPartidos = [
      { id: 1, ronda: "octavos", participante1: primero, participante2: oponentesSimulados[0], realizado: false, ganador: null, puntos1: 0, puntos2: 0 },
      { id: 2, ronda: "octavos", participante1: oponentesSimulados[1], participante2: oponentesSimulados[2], realizado: false, ganador: null, puntos1: 0, puntos2: 0 },
      { id: 3, ronda: "octavos", participante1: oponentesSimulados[3], participante2: oponentesSimulados[4], realizado: false, ganador: null, puntos1: 0, puntos2: 0 },
      { id: 4, ronda: "octavos", participante1: segundo, participante2: oponentesSimulados[5], realizado: false, ganador: null, puntos1: 0, puntos2: 0 }
    ];
    
    setPartidosEliminatoria(octavosPartidos);
    setRondaEliminatoriaActual(0);
    setFaseActual("octavos");
    
    const primerPartidoUsuario = octavosPartidos.find(p => 
      p.participante1?.esUsuario || p.participante2?.esUsuario
    );
    setPartidoActualEliminatoria(primerPartidoUsuario);
  };

  // ============================================================
  // INICIAR LITIGIO EN ELIMINATORIAS
  // ============================================================
  const iniciarLitigioEliminatoria = (partido) => {
    const esUsuario = partido.participante1?.esUsuario || partido.participante2?.esUsuario;
    if (esUsuario) {
      const rival = partido.participante1?.esUsuario ? partido.participante2 : partido.participante1;
      setDueloActivo(rival);
      setPuntajeUsuario(0);
      setPuntajeRival(0);
      setTurnoActual("usuario");
      setDueloTerminado(false);
      setGanadorDuelo(null);
      setRespuestaSeleccionada(null);
      setMensajeDuelo("");
      setTiempoRestante(20);
      setTemporizadorActivo(true);
      setEsperandoCambioTurno(false);
      seleccionarPreguntaAleatoria();
      setRonda("eliminatoria");
    } else {
      simularLitigioEliminatoria(partido);
    }
  };

  // ============================================================
  // SIMULAR LITIGIO EN ELIMINATORIAS
  // ============================================================
  const simularLitigioEliminatoria = (partido) => {
    const fuerza1 = partido.participante1?.fuerza || 50;
    const fuerza2 = partido.participante2?.fuerza || 50;
    const total = fuerza1 + fuerza2;
    const probabilidadGana1 = fuerza1 / total;
    const random = Math.random();
    
    let puntos1, puntos2;
    if (random < probabilidadGana1) {
      puntos1 = Math.floor(Math.random() * 90) + 10;
      puntos2 = Math.floor(Math.random() * puntos1);
    } else {
      puntos2 = Math.floor(Math.random() * 90) + 10;
      puntos1 = Math.floor(Math.random() * puntos2);
    }
    
    actualizarResultadoEliminatoria(partido.id, puntos1, puntos2);
  };

  // ============================================================
  // ACTUALIZAR RESULTADO DE ELIMINATORIA
  // ============================================================
  const actualizarResultadoEliminatoria = (partidoId, puntos1, puntos2) => {
    const partidosActualizados = partidosEliminatoria.map(p => {
      if (p.id === partidoId) {
        const ganador = puntos1 > puntos2 ? p.participante1 : p.participante2;
        return { 
          ...p, 
          realizado: true, 
          ganador,
          puntos1, 
          puntos2 
        };
      }
      return p;
    });
    setPartidosEliminatoria(partidosActualizados);
    
    const partidosRondaActual = partidosActualizados.filter(p => p.ronda === faseActual);
    const todosRealizados = partidosRondaActual.every(p => p.realizado);
    
    if (todosRealizados) {
      avanzarASiguienteRonda(partidosActualizados);
    }
  };

  // ============================================================
  // ACTUALIZAR ELIMINATORIA DESDE DUELO DE USUARIO
  // ============================================================
  const actualizarEliminatoria = (ganador) => {
    const puntosUsuarioFinal = puntajeUsuario;
    const puntosRivalFinal = puntajeRival;
    
    const partidosActualizados = partidosEliminatoria.map(p => {
      if (p.id === partidoActualEliminatoria.id) {
        const ganadorObjeto = ganador === "usuario" ? p.participante1?.esUsuario ? p.participante1 : p.participante2 : p.participante1?.esUsuario ? p.participante2 : p.participante1;
        return { 
          ...p, 
          realizado: true, 
          ganador: ganadorObjeto,
          puntos1: p.participante1?.esUsuario ? puntosUsuarioFinal : puntosRivalFinal,
          puntos2: p.participante1?.esUsuario ? puntosRivalFinal : puntosUsuarioFinal
        };
      }
      return p;
    });
    setPartidosEliminatoria(partidosActualizados);
    
    const partidosRondaActual = partidosActualizados.filter(p => p.ronda === faseActual);
    const todosRealizados = partidosRondaActual.every(p => p.realizado);
    
    if (todosRealizados) {
      avanzarASiguienteRonda(partidosActualizados);
    }
  };

  // ============================================================
  // AVANZAR A LA SIGUIENTE RONDA ELIMINATORIA
  // ============================================================
  const avanzarASiguienteRonda = (partidosActualizados) => {
    const ganadoresRondaActual = partidosActualizados
      .filter(p => p.ronda === faseActual && p.realizado)
      .map(p => p.ganador);
    
    setGanadoresRonda(ganadoresRondaActual);
    
    let siguienteRonda = "";
    let siguientesPartidos = [];
    
    switch(faseActual) {
      case "octavos":
        siguienteRonda = "cuartos";
        if (ganadoresRondaActual.length >= 4) {
          siguientesPartidos = [
            { id: Date.now() + 1, ronda: "cuartos", participante1: ganadoresRondaActual[0], participante2: ganadoresRondaActual[1], realizado: false, ganador: null, puntos1: 0, puntos2: 0 },
            { id: Date.now() + 2, ronda: "cuartos", participante1: ganadoresRondaActual[2], participante2: ganadoresRondaActual[3], realizado: false, ganador: null, puntos1: 0, puntos2: 0 }
          ];
        }
        break;
      case "cuartos":
        siguienteRonda = "semifinal";
        if (ganadoresRondaActual.length >= 2) {
          siguientesPartidos = [
            { id: Date.now() + 1, ronda: "semifinal", participante1: ganadoresRondaActual[0], participante2: ganadoresRondaActual[1], realizado: false, ganador: null, puntos1: 0, puntos2: 0 }
          ];
        }
        break;
      case "semifinal":
        siguienteRonda = "final";
        if (ganadoresRondaActual.length >= 1) {
          siguientesPartidos = [
            { id: Date.now() + 1, ronda: "final", participante1: ganadoresRondaActual[0], participante2: null, realizado: false, ganador: null, puntos1: 0, puntos2: 0 }
          ];
        }
        break;
      case "final":
        if (ganadoresRondaActual.length >= 1) {
          setCampeon(ganadoresRondaActual[0]);
          setMostrarCampeon(true);
          setRonda("campeon");
        }
        return;
      default:
        break;
    }
    
    if (siguientesPartidos.length > 0) {
      const nuevosPartidos = [...partidosActualizados, ...siguientesPartidos];
      setPartidosEliminatoria(nuevosPartidos);
      setFaseActual(siguienteRonda);
      setRondaEliminatoriaActual(prev => prev + 1);
      
      const usuarioLocal = JSON.parse(localStorage.getItem('torneo_usuario') || '{}');
      const partidoUsuario = nuevosPartidos.find(p => 
        p.participante1?.esUsuario || p.participante2?.esUsuario
      );
      setPartidoActualEliminatoria(partidoUsuario || siguientesPartidos[0]);
      setRonda("vistaEliminatorias");
    }
  };

  // ============================================================
  // SIGUIENTE PARTIDO EN ELIMINATORIA
  // ============================================================
  const siguienteEliminatoria = () => {
    const partidosRestantes = partidosEliminatoria.filter(p => !p.realizado);
    if (partidosRestantes.length > 0) {
      const usuarioLocal = JSON.parse(localStorage.getItem('torneo_usuario') || '{}');
      const partidoUsuario = partidosRestantes.find(p => 
        p.participante1?.esUsuario || p.participante2?.esUsuario
      );
      setPartidoActualEliminatoria(partidoUsuario || partidosRestantes[0]);
      setRonda("vistaEliminatorias");
    }
  };

  // ============================================================
  // FUNCIÓN PARA GUARDAR EL PROGRESO COMPLETO
  // ============================================================
  const guardarProgresoCompleto = useCallback(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem('torneo_usuario') || '{}');
    if (!usuarioLocal.nombre) return;
    
    const progreso = {
      usuarioId: usuarioLocal.id || Date.now(),
      nombre: usuarioLocal.nombre,
      avatar: usuarioLocal.avatar,
      especialidad: usuarioLocal.especialidad,
      ronda: ronda,
      victorias: victorias,
      derrotas: derrotas,
      torneoActivoId: torneoActivo?.id,
      grupos: grupos,
      grupoActual: grupoActual,
      partidosGrupo: partidosGrupo,
      partidoActual: partidoActual,
      partidoIndex: partidoIndex,
      puntosGrupo: puntosGrupo,
      argumentosFavor: argumentosFavor,
      argumentosContra: argumentosContra,
      faseGrupoTerminada: faseGrupoTerminada,
      clasificados: clasificados,
      dueloActivo: dueloActivo,
      puntajeUsuario: puntajeUsuario,
      puntajeRival: puntajeRival,
      turnoActual: turnoActual,
      faseActual: faseActual,
      llaveA: llaveA,
      llaveB: llaveB,
      partidosEliminatoria: partidosEliminatoria,
      partidoActualEliminatoria: partidoActualEliminatoria,
      rondaEliminatoriaActual: rondaEliminatoriaActual,
      campeon: campeon,
      ultimaActualizacion: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY_PROGRESO_USUARIO, JSON.stringify(progreso));
  }, [ronda, victorias, derrotas, torneoActivo, grupos, grupoActual, partidosGrupo, partidoActual, partidoIndex, puntosGrupo, argumentosFavor, argumentosContra, faseGrupoTerminada, clasificados, dueloActivo, puntajeUsuario, puntajeRival, turnoActual, faseActual, llaveA, llaveB, partidosEliminatoria, partidoActualEliminatoria, rondaEliminatoriaActual, campeon]);

  // ============================================================
  // FUNCIÓN PARA CARGAR EL PROGRESO GUARDADO
  // ============================================================
  const cargarProgresoGuardado = useCallback(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem('torneo_usuario') || '{}');
    if (!usuarioLocal.nombre) return false;
    
    const progreso = localStorage.getItem(STORAGE_KEY_PROGRESO_USUARIO);
    if (!progreso) return false;
    
    const datos = JSON.parse(progreso);
    
    if (datos.usuarioId !== usuarioLocal.id && datos.nombre !== usuarioLocal.nombre) {
      return false;
    }
    
    if (datos.ronda && datos.ronda !== 'eliminado' && datos.ronda !== 'eliminadoLitigios' && datos.ronda !== 'campeon') {
      setRonda(datos.ronda);
      setVictorias(datos.victorias || 0);
      setDerrotas(datos.derrotas || 0);
      
      if (datos.grupos) setGrupos(datos.grupos);
      if (datos.grupoActual) setGrupoActual(datos.grupoActual);
      if (datos.partidosGrupo) setPartidosGrupo(datos.partidosGrupo);
      if (datos.partidoActual) setPartidoActual(datos.partidoActual);
      if (datos.partidoIndex !== undefined) setPartidoIndex(datos.partidoIndex);
      if (datos.puntosGrupo !== undefined) setPuntosGrupo(datos.puntosGrupo);
      if (datos.argumentosFavor !== undefined) setArgumentosFavor(datos.argumentosFavor);
      if (datos.argumentosContra !== undefined) setArgumentosContra(datos.argumentosContra);
      if (datos.faseGrupoTerminada !== undefined) setFaseGrupoTerminada(datos.faseGrupoTerminada);
      if (datos.clasificados) setClasificados(datos.clasificados);
      if (datos.faseActual) setFaseActual(datos.faseActual);
      if (datos.llaveA) setLlaveA(datos.llaveA);
      if (datos.llaveB) setLlaveB(datos.llaveB);
      if (datos.partidosEliminatoria) setPartidosEliminatoria(datos.partidosEliminatoria);
      if (datos.partidoActualEliminatoria) setPartidoActualEliminatoria(datos.partidoActualEliminatoria);
      if (datos.rondaEliminatoriaActual !== undefined) setRondaEliminatoriaActual(datos.rondaEliminatoriaActual);
      if (datos.campeon) setCampeon(datos.campeon);
      
      if (datos.dueloActivo && (datos.ronda === 'duelo' || datos.ronda === 'litigioGrupo' || datos.ronda === 'eliminatoria') && seleccionarPreguntaAleatoria) {
        setDueloActivo(datos.dueloActivo);
        setPuntajeUsuario(datos.puntajeUsuario || 0);
        setPuntajeRival(datos.puntajeRival || 0);
        setTurnoActual(datos.turnoActual || 'usuario');
        seleccionarPreguntaAleatoria();
      }
      
      return true;
    }
    
    return false;
  }, [seleccionarPreguntaAleatoria]);

  // ============================================================
  // CARGA INICIAL
  // ============================================================
  useEffect(() => {
    const storedTorneos = localStorage.getItem(STORAGE_KEY_TORNEOS);
    if (storedTorneos) {
      setTorneos(JSON.parse(storedTorneos));
    } else {
      setTorneos(torneosPredeterminados);
      localStorage.setItem(STORAGE_KEY_TORNEOS, JSON.stringify(torneosPredeterminados));
    }

    const storedActivo = localStorage.getItem(STORAGE_KEY_TORNEO_ACTIVO);
    if (storedActivo) {
      setTorneoActivo(JSON.parse(storedActivo));
    } else {
      setTorneoActivo(torneosPredeterminados[0]);
      localStorage.setItem(STORAGE_KEY_TORNEO_ACTIVO, JSON.stringify(torneosPredeterminados[0]));
    }

    setLibrosDisponibles(obtenerLibrosParaPremios());

    const userStorage = localStorage.getItem('torneo_usuario');
    if (userStorage) {
      const userData = JSON.parse(userStorage);
      if (userData.inscrito) {
        const progresoCargado = cargarProgresoGuardado();
        if (!progresoCargado) {
          setRonda("salaEspera");
        }
      } else {
        setRonda("registroTorneo");
        if (userData.nombre) setMostrandoPago(true);
      }
    } else {
      setRonda("registroTorneo");
    }
  }, [cargarProgresoGuardado]);

  // Guardar progreso automáticamente
  useEffect(() => {
    const timeout = setTimeout(() => {
      const usuarioLocal = JSON.parse(localStorage.getItem('torneo_usuario') || '{}');
      if (usuarioLocal.nombre && usuarioLocal.inscrito && ronda !== 'registroTorneo') {
        guardarProgresoCompleto();
      }
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [ronda, victorias, derrotas, grupos, grupoActual, partidosGrupo, partidoActual, partidoIndex, puntosGrupo, argumentosFavor, argumentosContra, faseGrupoTerminada, clasificados, dueloActivo, puntajeUsuario, puntajeRival, turnoActual, guardarProgresoCompleto]);

  // ============================================================
  // REGISTRAR USUARIO
  // ============================================================
  const registrarUsuario = () => {
    if (!nombre.trim()) { alert("❌ Ingresa tu nombre"); return; }
    if (!especialidad) { alert("❌ Selecciona tu especialidad"); return; }
    if (!avatarSeleccionado) { alert("❌ Selecciona una imagen de perfil"); return; }
    setCargando(true);
    setTimeout(() => {
      const nuevoUsuario = {
        id: Date.now(),
        nombre: nombre,
        especialidad: especialidad,
        avatar: avatarSeleccionado,
        email: `${nombre.replace(/\s/g, '').toLowerCase()}@torneo.com`,
        inscrito: false,
        duelosGanados: 0,
        duelosPerdidos: 0
      };
      localStorage.setItem('torneo_usuario', JSON.stringify(nuevoUsuario));
      setMostrandoPago(true);
      setNombre("");
      setEspecialidad("");
      setAvatarSeleccionado(null);
      setCargando(false);
      alert("✅ Usuario registrado correctamente");
    }, 500);
  };

  // ============================================================
  // PAGAR INSCRIPCIÓN
  // ============================================================
  const pagarInscripcion = () => {
    const usuarioLocal = JSON.parse(localStorage.getItem('torneo_usuario'));
    if (!usuarioLocal && !user) { alert("❌ No hay usuario registrado"); return; }
    if (saldo < torneoActivo?.costoInscripcion) {
      alert(`❌ Saldo insuficiente. Necesitas $${torneoActivo?.costoInscripcion} MXN.`);
      setMostrarModalRecarga(true);
      setMostrarConfirmacionPago(false);
      return;
    }
    setCargando(true);
    setTimeout(() => {
      const exito = realizarPago(torneoActivo.costoInscripcion, `Inscripción al torneo ${torneoActivo.nombre}`);
      if (exito) {
        if (usuarioLocal) { 
          usuarioLocal.inscrito = true; 
          localStorage.setItem('torneo_usuario', JSON.stringify(usuarioLocal)); 
        }
        setRonda("salaEspera");
        setMostrandoPago(false);
        setMostrarConfirmacionPago(false);
        alert("✅ Inscripción pagada. ¡Buena suerte!");
        guardarProgresoCompleto();
      } else alert("❌ Error al procesar el pago");
      setCargando(false);
    }, 500);
  };

  // ============================================================
  // INICIAR BÚSQUEDA DE RIVAL
  // ============================================================
  const iniciarBusquedaRival = () => {
    setBuscandoRival(true);
    setTimeout(() => {
      setBuscandoRival(false);
      const rivales = [
        { nombre: "Dr. Legal", avatar: "https://randomuser.me/api/portraits/men/1.jpg", especialidad: "Penal", fuerza: 50 },
        { nombre: "Lex Master", avatar: "https://randomuser.me/api/portraits/women/2.jpg", especialidad: "Constitucional", fuerza: 50 },
        { nombre: "Juris Doctor", avatar: "https://randomuser.me/api/portraits/men/3.jpg", especialidad: "Civil", fuerza: 50 },
        { nombre: "Abogada Pro", avatar: "https://randomuser.me/api/portraits/women/4.jpg", especialidad: "Laboral", fuerza: 50 }
      ];
      const rivalAleatorio = rivales[Math.floor(Math.random() * rivales.length)];
      setDueloActivo(rivalAleatorio);
      setPuntajeUsuario(0);
      setPuntajeRival(0);
      setTurnoActual("usuario");
      setDueloTerminado(false);
      setGanadorDuelo(null);
      setRespuestaSeleccionada(null);
      setMensajeDuelo("");
      setTiempoRestante(20);
      setTemporizadorActivo(true);
      setEsperandoCambioTurno(false);
      seleccionarPreguntaAleatoria();
      setRonda("duelo");
    }, 2000);
  };

  // ============================================================
  // EFECTOS DEL TEMPORIZADOR
  // ============================================================
  useEffect(() => {
    let interval;
    if (temporizadorActivo && tiempoRestante > 0 && !dueloTerminado && !esperandoCambioTurno) {
      interval = setInterval(() => setTiempoRestante(prev => prev - 1), 1000);
    } else if (tiempoRestante === 0 && temporizadorActivo && !dueloTerminado && !esperandoCambioTurno) {
      setTemporizadorActivo(false);
      setMensajeDuelo(`⏰ Tiempo agotado! ${turnoActual === "usuario" ? "Pierdes turno" : "Rival pierde turno"}`);
      cambiarTurno();
    }
    return () => clearInterval(interval);
  }, [temporizadorActivo, tiempoRestante, dueloTerminado, turnoActual, esperandoCambioTurno, cambiarTurno]);

  // ============================================================
  // EFECTO PARA RESPUESTA AUTOMÁTICA DEL RIVAL
  // ============================================================
  useEffect(() => {
    if ((ronda === "duelo" || ronda === "litigioGrupo" || ronda === "eliminatoria") && dueloActivo && turnoActual === "rival" && !dueloTerminado && !respuestaSeleccionada && temporizadorActivo && !esperandoCambioTurno) {
      const delay = Math.random() * 15000 + 4000;
      const timeout = setTimeout(() => respuestaRivalHandler(), delay);
      return () => clearTimeout(timeout);
    }
  }, [ronda, dueloActivo, turnoActual, dueloTerminado, respuestaSeleccionada, temporizadorActivo, esperandoCambioTurno, respuestaRivalHandler]);

  // ============================================================
  // FUNCIONES ADMINISTRADOR
  // ============================================================
  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setModoAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
      setAdminError('');
      setShowAdminPanel(true);
    } else {
      setAdminError('Contraseña incorrecta');
    }
  };

  const handleAdminLogout = () => {
    setModoAdmin(false);
    setShowAdminPanel(false);
    setEditandoTorneo(null);
    setShowFormTorneo(false);
  };

  const abrirFormNuevoTorneo = () => {
    setEditandoTorneo(null);
    setShowFormTorneo(true);
  };

  const abrirFormEditarTorneo = (torneo) => {
    setEditandoTorneo(torneo);
    setShowFormTorneo(true);
  };

  const guardarTorneo = (formData) => {
    let torneoGuardado;
    
    if (editandoTorneo) {
      torneoGuardado = { ...formData, id: editandoTorneo.id };
      setTorneos(torneos.map(t => t.id === editandoTorneo.id ? torneoGuardado : t));
      
      if (torneoActivo?.id === editandoTorneo.id) {
        setTorneoActivo(torneoGuardado);
        localStorage.setItem(STORAGE_KEY_TORNEO_ACTIVO, JSON.stringify(torneoGuardado));
      }
    } else {
      torneoGuardado = { ...formData, id: Date.now() };
      setTorneos([...torneos, torneoGuardado]);
    }
    
    setShowFormTorneo(false);
    setEditandoTorneo(null);
    alert(`✅ Torneo "${torneoGuardado.nombre}" guardado correctamente`);
  };

  const eliminarTorneo = (id) => {
    const torneoAEliminar = torneos.find(t => t.id === id);
    if (!torneoAEliminar) return;
    
    if (window.confirm(`¿Eliminar permanentemente el torneo "${torneoAEliminar.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
      const nuevosTorneos = torneos.filter(t => t.id !== id);
      setTorneos(nuevosTorneos);
      
      if (torneoActivo?.id === id) {
        const otroTorneo = nuevosTorneos.find(t => t.estado === 'activo') || nuevosTorneos[0];
        if (otroTorneo) {
          setTorneoActivo(otroTorneo);
          localStorage.setItem(STORAGE_KEY_TORNEO_ACTIVO, JSON.stringify(otroTorneo));
          alert(`⚠️ El torneo activo fue eliminado. Se ha activado "${otroTorneo.nombre}" como nuevo torneo activo.`);
        } else {
          setTorneoActivo(null);
          localStorage.removeItem(STORAGE_KEY_TORNEO_ACTIVO);
          alert(`⚠️ El torneo activo fue eliminado. No hay torneos disponibles. Crea uno nuevo.`);
        }
      }
      
      alert(`✅ Torneo "${torneoAEliminar.nombre}" eliminado`);
    }
  };

  const activarTorneo = (torneo) => {
    setTorneoActivo(torneo);
    localStorage.setItem(STORAGE_KEY_TORNEO_ACTIVO, JSON.stringify(torneo));
    alert(`✅ Torneo "${torneo.nombre}" activado`);
  };

  // ============================================================
  // COMPONENTE BILLETERA
  // ============================================================
  const Billetera = () => {
    const usuarioLocal = JSON.parse(localStorage.getItem('torneo_usuario') || '{}');
    if ((!usuarioLocal.nombre && !user) || (ronda !== "registroTorneo" && ronda !== "salaEspera" && ronda !== "vistaLitigios" && ronda !== "vistaEliminatorias")) return null;
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 inline-flex items-center gap-3 shadow-lg mb-4">
        <div className="flex items-center gap-2"><span className="text-xl">⚖️</span><span className="font-bold text-white text-sm">{usuarioLocal.nombre || (user?.email)}</span></div>
        <div className="flex items-center gap-2 bg-black/30 rounded-full px-3 py-1"><span className="text-lg">💰</span><span className="font-bold text-white">${saldo.toLocaleString()}</span></div>
        <button onClick={() => setMostrarModalRecarga(true)} className="bg-white text-[#1a1a2e] text-xs px-3 py-1 rounded-full font-bold">Recargar</button>
        <button onClick={() => setMostrarModalHistorial(true)} className="bg-white text-[#1a1a2e] text-xs px-3 py-1 rounded-full font-bold">Historial</button>
        {!modoAdmin && (
          <button onClick={() => setShowAdminLogin(true)} className="bg-amber-500 text-[#1a1a2e] text-xs px-3 py-1 rounded-full font-bold">⚙️ Admin</button>
        )}
        {modoAdmin && (
          <button onClick={() => setShowAdminPanel(!showAdminPanel)} className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">📋 Panel Admin</button>
        )}
      </div>
    );
  };

  if (cargando) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div></div>;

  // ============================================================
  // PANEL DE ADMINISTRACIÓN
  // ============================================================
  if (showAdminPanel && modoAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Panel de Administración de Torneos</h1>
            <div className="flex gap-3">
              <button onClick={abrirFormNuevoTorneo} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">+ Nuevo Torneo</button>
              <button onClick={() => setShowAdminPanel(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">Cerrar Panel</button>
              <button onClick={handleAdminLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">Salir Admin</button>
            </div>
          </div>

          <div className="bg-amber-500/20 border border-amber-500/50 rounded-xl p-3 mb-6">
            <p className="text-amber-300 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">info</span>
              Torneo actualmente activo: <strong className="text-white">{torneoActivo?.nombre}</strong>
              <button onClick={() => { setShowAdminPanel(false); setRonda("registroTorneo"); }} className="ml-auto bg-amber-500 text-white px-3 py-1 rounded text-xs hover:bg-amber-600 transition">Ver Torneo</button>
            </p>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="bg-gray-100 px-4 py-3 border-b">
              <h2 className="font-bold text-gray-700">📋 Todos los Torneos</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b">
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Torneo</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Premio Principal</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Premio Secundario</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Costo</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Estado</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {torneos.map(torneo => (
                    <tr key={torneo.id} className={`border-t hover:bg-gray-50 transition ${torneoActivo?.id === torneo.id ? 'bg-amber-50' : ''}`}>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {torneoActivo?.id === torneo.id && <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">ACTIVO</span>}
                          <div><p className="font-bold text-gray-800">{torneo.nombre}</p><p className="text-xs text-gray-500">{torneo.descripcion?.substring(0, 50)}...</p></div>
                        </div>
                      </td>
                      <td className="p-3">
                        {torneo.premio?.tipo === "dinero" && <span className="text-green-600 font-bold">${torneo.premio.monto?.toLocaleString()} MXN</span>}
                        {torneo.premio?.tipo === "libro" && <span className="text-blue-600">📚 {torneo.premio.descripcion || "Libro"}</span>}
                        {torneo.premio?.tipo === "ambos" && (<div><span className="text-green-600 font-bold">${torneo.premio.monto?.toLocaleString()} MXN</span><span className="text-blue-600 block text-xs">+ 📚 {torneo.premio.descripcion}</span></div>)}
                      </td>
                      <td className="p-3">
                        {torneo.premioSecundario?.descripcion ? <span className="text-purple-600 text-sm">🎁 {torneo.premioSecundario.descripcion}</span> : <span className="text-gray-400 text-sm">—</span>}
                      </td>
                      <td className="p-3 font-bold">${torneo.costoInscripcion} MXN</td>
                      <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${torneo.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{torneo.estado === 'activo' ? 'Activo' : 'Inactivo'}</span></td>
                      <td className="p-3">
                        <div className="flex gap-2 flex-wrap">
                          <button onClick={() => activarTorneo(torneo)} className={`px-2 py-1 rounded text-xs transition ${torneoActivo?.id === torneo.id ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`} disabled={torneoActivo?.id === torneo.id}>Activar</button>
                          <button onClick={() => abrirFormEditarTorneo(torneo)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600 transition">Editar</button>
                          <button onClick={() => eliminarTorneo(torneo.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition">Eliminar</button>
                        </div>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 bg-gray-800/50 rounded-xl p-4">
            <p className="text-gray-400 text-sm flex items-center gap-2">💡 Para editar un torneo, haz clic en "Editar". Para cambiar el torneo activo, haz clic en "Activar". El torneo activo se muestra con fondo amarillo y badge "ACTIVO".</p>
          </div>
        </div>

        {showFormTorneo && <FormularioTorneo torneo={editandoTorneo} onSave={guardarTorneo} onCancel={() => setShowFormTorneo(false)} librosDisponibles={librosDisponibles} />}
      </div>
    );
  }

  // ============================================================
  // MODAL DE LOGIN ADMIN
  // ============================================================
  if (showAdminLogin) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-sm w-full p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Acceso Administrador</h2>
          <input type="password" placeholder="Contraseña" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full p-3 border rounded-xl mb-3" onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()} />
          {adminError && <p className="text-red-500 text-sm mb-3">{adminError}</p>}
          <div className="flex gap-3"><button onClick={() => setShowAdminLogin(false)} className="flex-1 bg-gray-200 py-2 rounded-xl">Cancelar</button><button onClick={handleAdminLogin} className="flex-1 bg-amber-500 text-white py-2 rounded-xl">Entrar</button></div>
        </div>
      </div>
    );
  }

  // ============================================================
  // PANTALLA DE REGISTRO
  // ============================================================
  if (ronda === "registroTorneo") {
    const usuarioLocal = JSON.parse(localStorage.getItem('torneo_usuario') || '{}');
    const esReinscripcion = usuarioLocal.nombre && !usuarioLocal.inscrito;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end mb-4"><Billetera /></div>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#0f3460] to-[#1a1a2e] p-6 text-white">
              <h1 className="text-3xl font-bold">{torneoActivo?.nombre || "Torneo Jurídico"}</h1>
              <p className="text-gray-300 mt-2">{torneoActivo?.descripcion}</p>
              <div className="flex gap-4 mt-3 flex-wrap">
                <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm">🏆 Premio: {torneoActivo?.premio?.tipo === 'dinero' ? `$${torneoActivo.premio.monto?.toLocaleString()}` : torneoActivo?.premio?.descripcion}</span>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">💰 Inscripción: ${torneoActivo?.costoInscripcion}</span>
              </div>
            </div>
            <div className="p-6">
              {(!usuarioLocal.nombre) && !mostrandoPago && (
                <>
                  <h2 className="text-2xl font-bold text-center mb-6">Registro de Litigante</h2>
                  
                  <input 
                    type="text" 
                    value={nombre} 
                    onChange={e => setNombre(e.target.value)} 
                    placeholder="Nombre completo" 
                    className="w-full p-3 border rounded-xl mb-4" 
                  />
                  
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">📚 Especialidad Jurídica</label>
                    <select 
                      value={especialidad} 
                      onChange={e => setEspecialidad(e.target.value)} 
                      className="w-full p-3 border rounded-xl bg-white"
                    >
                      <option value="">-- Selecciona tu especialidad --</option>
                      {especialidadesDisponibles.map(esp => (
                        <option key={esp} value={esp}>{esp}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Tu especialidad aparecerá junto a tu nombre en los duelos</p>
                  </div>
                  
                  <div className="flex flex-col items-center gap-4 mb-6">
                    {avatarSeleccionado ? (
                      <div className="relative">
                        <img src={avatarSeleccionado} alt="Avatar" className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-500" />
                        <button onClick={() => setAvatarSeleccionado(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6">✖</button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl">⚖️</div>
                    )}
                    <label className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition">
                      Subir imagen de perfil
                      <input type="file" accept="image/*" className="hidden" onChange={e => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setAvatarSeleccionado(reader.result); reader.readAsDataURL(file); } }} />
                    </label>
                  </div>
                  
                  <button onClick={registrarUsuario} className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition">
                    Registrarse
                  </button>
                </>
              )}
              {(usuarioLocal.nombre && !usuarioLocal.inscrito && mostrandoPago) && (
                <div>
                  <h2 className="text-2xl font-bold text-center mb-6">
                    {esReinscripcion ? "🔄 Reinscripción al Torneo" : "💰 Pago de Inscripción"}
                  </h2>
                  <div className={`p-4 rounded-lg mb-6 text-center ${esReinscripcion ? 'bg-yellow-50' : 'bg-green-50'}`}>
                    <p className="font-semibold">✅ Bienvenido, {usuarioLocal.nombre}</p>
                    <p className="text-sm text-gray-600 mt-1">📚 Especialidad: {usuarioLocal.especialidad || "No especificada"}</p>
                    {esReinscripcion && (
                      <p className="text-sm text-red-600 mt-1">⚠️ Fuiste eliminado anteriormente. Debes pagar nuevamente la inscripción para volver a participar.</p>
                    )}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl mb-6">
                    <div className="flex justify-between mb-2">
                      <span>Costo de {esReinscripcion ? "reinscripción" : "inscripción"}:</span>
                      <span className="font-bold">${torneoActivo?.costoInscripcion} MXN</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saldo disponible:</span>
                      <span className={`font-bold ${saldo >= torneoActivo?.costoInscripcion ? 'text-blue-600' : 'text-red-600'}`}>${saldo.toLocaleString()} MXN</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setMostrarConfirmacionPago(true)} 
                    disabled={saldo < torneoActivo?.costoInscripcion} 
                    className="w-full bg-green-500 text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-green-600 transition"
                  >
                    Pagar {esReinscripcion ? "Reinscripción" : "Inscripción"} ${torneoActivo?.costoInscripcion} MXN
                  </button>
                  {esReinscripcion && (
                    <button 
                      onClick={() => {
                        if (window.confirm("¿Estás seguro de que quieres salir? Perderás la oportunidad de reinscribirte.")) {
                          setMostrandoPago(false);
                          setRonda("registroTorneo");
                        }
                      }}
                      className="w-full mt-3 bg-gray-300 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-400 transition"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {mostrarConfirmacionPago && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-center mb-4">Confirmar {JSON.parse(localStorage.getItem('torneo_usuario') || '{}').inscrito === false ? 'Reinscripción' : 'Inscripción'}</h2>
              <p className="text-center mb-4">Costo: ${torneoActivo?.costoInscripcion} MXN</p>
              <div className="flex gap-3">
                <button onClick={() => setMostrarConfirmacionPago(false)} className="flex-1 bg-gray-200 py-2 rounded-xl">Cancelar</button>
                <button onClick={pagarInscripcion} className="flex-1 bg-green-500 text-white py-2 rounded-xl">Confirmar Pago</button>
              </div>
            </div>
          </div>
        )}
        {mostrarModalRecarga && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-center mb-4">Recargar Billetera</h2>
              <p className="text-center mb-4">Saldo actual: ${saldo.toLocaleString()}</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[50,100,200,500].map(m => <button key={m} onClick={() => setMontoRecarga(m)} className="p-2 border rounded-xl">${m}</button>)}
              </div>
              <input type="number" value={montoRecarga} onChange={e => setMontoRecarga(parseInt(e.target.value) || 0)} placeholder="Monto" className="w-full p-3 border rounded-xl mb-4" />
              <div className="border-t pt-4">
                <input type="text" placeholder="Número de tarjeta (16 dígitos)" value={datosPago.numeroTarjeta} onChange={e => setDatosPago({...datosPago, numeroTarjeta: e.target.value.replace(/\D/g,'').slice(0,16)})} className="w-full p-3 border rounded-xl mb-3" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/AA" value={datosPago.fechaExpiracion} onChange={e => setDatosPago({...datosPago, fechaExpiracion: e.target.value})} className="p-3 border rounded-xl" />
                  <input type="text" placeholder="CVV" value={datosPago.cvv} onChange={e => setDatosPago({...datosPago, cvv: e.target.value.slice(0,3)})} className="p-3 border rounded-xl" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setMostrarModalRecarga(false)} className="flex-1 bg-gray-200 py-3 rounded-xl">Cancelar</button>
                <button onClick={() => { setProcesandoPago(true); setTimeout(() => { recargarSaldo(montoRecarga, "Recarga manual"); setProcesandoPago(false); setMostrarModalRecarga(false); }, 500); }} disabled={procesandoPago} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold">Recargar</button>
              </div>
            </div>
          </div>
        )}
        {mostrarModalHistorial && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[80vh] overflow-auto">
              <h2 className="text-2xl font-bold text-center mb-4">Historial de Transacciones</h2>
              {transacciones.length === 0 ? <p className="text-center">Sin transacciones</p> : transacciones.slice().reverse().map(t => <div key={t.id} className="border-b py-2"><p className="font-semibold">{t.tipo}</p><p>${Math.abs(t.monto).toLocaleString()} - {new Date(t.fecha).toLocaleString()}</p><p className="text-xs">{t.descripcion || t.metodo}</p></div>)}
              <button onClick={() => setMostrarModalHistorial(false)} className="mt-4 w-full bg-gray-200 py-2 rounded-xl">Cerrar</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // SALA DE ESPERA
  // ============================================================
  if (ronda === "salaEspera") {
    const usuarioLocal = JSON.parse(localStorage.getItem('torneo_usuario') || '{}');
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end mb-4"><Billetera /></div>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white text-center">
              <h1 className="text-3xl font-bold">SALA DE DUELOS JURÍDICOS</h1>
              <p className="text-sm mt-2">Gana 3 duelos para clasificar a la Fase de Grupos</p>
              <p className="text-xs mt-1">Torneo: {torneoActivo?.nombre}</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 text-center rounded">
                  <p className="text-3xl font-bold text-blue-600">{victorias}</p>
                  <p>Duelos Ganados</p>
                  <p className="text-xs text-gray-500">Necesitas: 3</p>
                </div>
                <div className="bg-red-50 p-4 text-center rounded">
                  <p className="text-3xl font-bold text-red-600">{derrotas}</p>
                  <p>Duelos Perdidos</p>
                  <p className="text-xs text-gray-500">Máximo: 2</p>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-xl p-4 mb-6 flex items-center gap-4">
                <img src={usuarioLocal.avatar} className="w-16 h-16 rounded-full object-cover" alt="" />
                <div>
                  <p className="font-bold text-lg">{usuarioLocal.nombre}</p>
                  <p className="text-sm text-blue-600 font-semibold">📚 Especialidad: {usuarioLocal.especialidad || "General"}</p>
                  <p className="text-xs text-gray-500">⚖️ Listo para litigar</p>
                </div>
              </div>
              
              <button onClick={iniciarBusquedaRival} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold text-xl hover:from-amber-600 hover:to-orange-600 transition">
                BUSCAR OPOSITOR
              </button>
            </div>
          </div>
        </div>
        {mostrarModalRecarga && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-center mb-4">Recargar Billetera</h2>
              <p className="text-center mb-4">Saldo actual: ${saldo.toLocaleString()}</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[50,100,200,500].map(m => <button key={m} onClick={() => setMontoRecarga(m)} className="p-2 border rounded-xl">${m}</button>)}
              </div>
              <input type="number" value={montoRecarga} onChange={e => setMontoRecarga(parseInt(e.target.value) || 0)} placeholder="Monto" className="w-full p-3 border rounded-xl mb-4" />
              <div className="border-t pt-4">
                <input type="text" placeholder="Número de tarjeta (16 dígitos)" value={datosPago.numeroTarjeta} onChange={e => setDatosPago({...datosPago, numeroTarjeta: e.target.value.replace(/\D/g,'').slice(0,16)})} className="w-full p-3 border rounded-xl mb-3" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/AA" value={datosPago.fechaExpiracion} onChange={e => setDatosPago({...datosPago, fechaExpiracion: e.target.value})} className="p-3 border rounded-xl" />
                  <input type="text" placeholder="CVV" value={datosPago.cvv} onChange={e => setDatosPago({...datosPago, cvv: e.target.value.slice(0,3)})} className="p-3 border rounded-xl" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setMostrarModalRecarga(false)} className="flex-1 bg-gray-200 py-3 rounded-xl">Cancelar</button>
                <button onClick={() => { setProcesandoPago(true); setTimeout(() => { recargarSaldo(montoRecarga, "Recarga manual"); setProcesandoPago(false); setMostrarModalRecarga(false); }, 500); }} disabled={procesandoPago} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold">Recargar</button>
              </div>
            </div>
          </div>
        )}
        {mostrarModalHistorial && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[80vh] overflow-auto">
              <h2 className="text-2xl font-bold text-center mb-4">Historial de Transacciones</h2>
              {transacciones.length === 0 ? <p className="text-center">Sin transacciones</p> : transacciones.slice().reverse().map(t => <div key={t.id} className="border-b py-2"><p className="font-semibold">{t.tipo}</p><p>${Math.abs(t.monto).toLocaleString()} - {new Date(t.fecha).toLocaleString()}</p><p className="text-xs">{t.descripcion || t.metodo}</p></div>)}
              <button onClick={() => setMostrarModalHistorial(false)} className="mt-4 w-full bg-gray-200 py-2 rounded-xl">Cerrar</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // BUSCANDO RIVAL
  // ============================================================
  if (buscandoRival) {
    const usuarioLocal = JSON.parse(localStorage.getItem('torneo_usuario') || '{}');
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-4"></div>
          <h2 className="text-white text-2xl font-bold">Buscando opositor...</h2>
          <p className="text-gray-400 mt-2">Para {usuarioLocal.nombre} ({usuarioLocal.especialidad || "General"})</p>
          <div className="bg-black/50 rounded-lg p-3 mt-4 inline-block">
            <p className="text-green-500">🎯 Duelos ganados: {victorias}/3</p>
            <p className="text-red-500">💀 Duelos perdidos: {derrotas}/2</p>
          </div>
          <p className="text-yellow-500 text-sm mt-4">⏳ Asignando opositor en unos segundos...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // DUELO NORMAL
  // ============================================================
  if (ronda === "duelo" && dueloActivo && preguntaActual) {
    const usuarioLocal = JSON.parse(localStorage.getItem('torneo_usuario') || '{}');
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4"><h1 className="text-3xl font-bold">DUELO JURÍDICO</h1><p>Primero en 100 puntos gana el caso</p></div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="bg-white p-6 rounded-xl text-center shadow">
              <img src={usuarioLocal.avatar} className="w-32 h-32 rounded-full mx-auto object-cover" />
              <h3 className="text-xl font-bold mt-2">{usuarioLocal.nombre}</h3>
              <p className="text-xs text-blue-600 font-semibold">{usuarioLocal.especialidad || "General"}</p>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-blue-600 h-4 rounded-full" style={{width: `${puntajeUsuario}%`}}></div>
                </div>
                <p className="text-2xl font-bold">{puntajeUsuario}/100</p>
              </div>
              {turnoActual === "usuario" && !dueloTerminado && <div className="mt-2 text-yellow-600 animate-pulse">Tu turno</div>}
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-white">VS</span>
              </div>
              <div className="mt-2 bg-black/50 rounded-full px-4 py-1 inline-block">
                <span className={`text-xl font-bold ${tiempoRestante <=5 ? "text-red-500 animate-pulse" : "text-white"}`}>⏱️ {tiempoRestante}s</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl text-center shadow">
              <img src={dueloActivo.avatar} className="w-32 h-32 rounded-full mx-auto object-cover" />
              <h3 className="text-xl font-bold mt-2">{dueloActivo.nombre}</h3>
              <p className="text-xs text-red-600 font-semibold">{dueloActivo.especialidad || "Opositor"}</p>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-red-600 h-4 rounded-full" style={{width: `${puntajeRival}%`}}></div>
                </div>
                <p className="text-2xl font-bold">{puntajeRival}/100</p>
              </div>
              {turnoActual === "rival" && !dueloTerminado && <div className="mt-2 text-yellow-600 animate-pulse">Turno del opositor</div>}
            </div>
          </div>
          {!dueloTerminado ? (
            <div className="bg-white mt-6 p-8 rounded-xl shadow">
              <div className="mb-2 text-sm text-gray-500">Área: {preguntaActual.area}</div>
              <h3 className="text-xl font-semibold mb-4">{preguntaActual.pregunta}</h3>
              <div className="grid gap-3">
                {preguntaActual.opciones.map((op, idx) => (
                  <button key={idx} onClick={() => responderPregunta(idx)} disabled={respuestaSeleccionada !== null || turnoActual !== "usuario" || esperandoCambioTurno} className="p-3 text-left rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50">
                    {String.fromCharCode(65+idx)}. {op}
                  </button>
                ))}
              </div>
              {mensajeDuelo && <div className={`mt-4 p-3 rounded-lg text-center ${mensajeDuelo.includes("Correcto") ? "bg-green-100" : "bg-red-100"}`}>{mensajeDuelo}</div>}
            </div>
          ) : (
            <div className="text-center bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-12 mt-6">
              <h2 className="text-3xl font-bold text-white">{ganadorDuelo === "usuario" ? usuarioLocal.nombre : dueloActivo.nombre}</h2>
              <p className="text-white text-xl mt-2">¡GANADOR DEL DUELO!</p>
              <button onClick={() => setRonda("salaEspera")} className="mt-6 bg-white text-gray-800 px-8 py-3 rounded-full font-bold">Continuar</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // VISTA DE LITIGIOS (Fase de Grupos) - CORREGIDA CON RESULTADOS
  // ============================================================
  if (ronda === "vistaLitigios" && grupoActual && !faseGrupoTerminada) {
    const litigiosRealizados = partidosGrupo.filter(p => p.realizado);
    const totalDuelosGrupo = partidosGrupo.length;
    const duelosPorLitigante = 3;
    const nombreGrupo = "Grupo A";
    
    const litigantesConPuntos = grupoActual.litigantes.map(litigante => {
      const litigiosLitigante = partidosGrupo.filter(p => 
        p.litigante1.nombre === litigante.nombre || p.litigante2.nombre === litigante.nombre
      );
      
      let puntos = 0;
      let argumentosFavorLit = 0;
      let argumentosContraLit = 0;
      let ganados = 0, perdidos = 0;
      let duelosJugados = 0;
      
      litigiosLitigante.forEach(p => {
        if (p.realizado) {
          duelosJugados++;
          const esLitigante1 = p.litigante1.nombre === litigante.nombre;
          const puntosLit = esLitigante1 ? p.puntos1 : p.puntos2;
          const puntosRival = esLitigante1 ? p.puntos2 : p.puntos1;
          
          argumentosFavorLit += puntosLit;
          argumentosContraLit += puntosRival;
          
          if (puntosLit > puntosRival) {
            puntos += 3;
            ganados++;
          } else {
            perdidos++;
          }
        }
      });
      
      return {
        ...litigante,
        puntosTabla: puntos,
        ganados,
        perdidos,
        realizados: duelosJugados,
        argumentosFavor: argumentosFavorLit,
        argumentosContra: argumentosContraLit,
        diferenciaArgumentos: argumentosFavorLit - argumentosContraLit
      };
    });
    
    litigantesConPuntos.sort((a, b) => {
      if (a.puntosTabla !== b.puntosTabla) return b.puntosTabla - a.puntosTabla;
      return b.diferenciaArgumentos - a.diferenciaArgumentos;
    });
    
    const duelosJugados = litigiosRealizados.length;
    
    // Encontrar el siguiente partido no realizado
    const siguientePartido = partidosGrupo.find(p => !p.realizado);
    if (siguientePartido && (!partidoActual || partidoActual.realizado)) {
      setPartidoActual(siguientePartido);
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Billetera />
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white font-bold">📊 Puntos grupo: {puntosGrupo} | ⚖️ AF: {argumentosFavor} | EC: {argumentosContra}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
              <h1 className="text-3xl font-bold">Fase de Grupos: {nombreGrupo}</h1>
              <p className="text-sm mt-2">Especialidad del grupo: {grupoActual.especialidad}</p>
              <p className="text-sm">Duelos en el grupo: {duelosJugados} de {totalDuelosGrupo} | Cada litigante afronta {duelosPorLitigante} duelos</p>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">📋 Tabla de Litigantes</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 text-left">Litigante</th>
                          <th className="p-2 text-center">DJ</th>
                          <th className="p-2 text-center">G</th>
                          <th className="p-2 text-center">P</th>
                          <th className="p-2 text-center">AF</th>
                          <th className="p-2 text-center">EC</th>
                          <th className="p-2 text-center">DIF</th>
                          <th className="p-2 text-center">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {litigantesConPuntos.map((litigante, idx) => (
                          <tr key={idx} className={litigante.esUsuario ? "bg-yellow-50 font-bold" : "border-b"}>
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <img src={litigante.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />
                                <span>{litigante.nombre}</span>
                                {litigante.esUsuario && <span className="text-xs bg-yellow-500 text-white px-1 rounded">Tú</span>}
                              </div>
                            </td>
                            <td className="p-2 text-center">{litigante.realizados}/{duelosPorLitigante}</td>
                            <td className="p-2 text-center text-green-600">{litigante.ganados}</td>
                            <td className="p-2 text-center text-red-600">{litigante.perdidos}</td>
                            <td className="p-2 text-center">{litigante.argumentosFavor}</td>
                            <td className="p-2 text-center">{litigante.argumentosContra}</td>
                            <td className="p-2 text-center">{litigante.diferenciaArgumentos}</td>
                            <td className="p-2 text-center font-bold">{litigante.puntosTabla}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Mostrar resultados de duelos realizados */}
                  <div className="mt-6">
                    <h3 className="font-bold mb-2 text-gray-700">📊 Resultados de duelos realizados</h3>
                    {litigiosRealizados.length === 0 ? (
                      <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500 text-sm">
                        Aún no hay duelos realizados. ¡Inicia el primer duelo!
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {litigiosRealizados.map((p, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3 text-sm border-l-4 border-green-500">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <img src={p.litigante1.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />
                                <span className="font-medium">{p.litigante1.nombre}</span>
                                <span className="text-xs text-gray-500">({p.litigante1.especialidad?.substring(0, 15) || "General"})</span>
                              </div>
                              <span className="font-bold text-lg text-blue-600">{p.puntos1} - {p.puntos2}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{p.litigante2.nombre}</span>
                                <span className="text-xs text-gray-500">({p.litigante2.especialidad?.substring(0, 15) || "General"})</span>
                                <img src={p.litigante2.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />
                              </div>
                            </div>
                            <div className="text-xs text-green-600 text-center mt-1 font-semibold">
                              🏆 {p.resultado}
                            </div>
                            <div className="text-xs text-gray-500 text-center mt-1">
                              {p.puntos1 > p.puntos2 ? `${p.litigante1.nombre} obtuvo ${p.puntos1} puntos` : `${p.litigante2.nombre} obtuvo ${p.puntos2} puntos`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4">⚖️ Próximo Duelo</h2>
                  {partidoActual && !partidoActual.realizado ? (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex-1">
                          <img src={partidoActual.litigante1.avatar} className="w-20 h-20 rounded-full mx-auto mb-2 object-cover border-2 border-blue-400" alt="" />
                          <p className="font-bold">{partidoActual.litigante1.nombre}</p>
                          <p className="text-xs text-gray-600">{partidoActual.litigante1.especialidad || "General"}</p>
                          {partidoActual.litigante1.esUsuario && <span className="text-xs bg-yellow-500 text-white px-2 rounded inline-block mt-1">Tú</span>}
                        </div>
                        <div className="text-3xl font-bold text-gray-400">VS</div>
                        <div className="flex-1">
                          <img src={partidoActual.litigante2.avatar} className="w-20 h-20 rounded-full mx-auto mb-2 object-cover border-2 border-red-400" alt="" />
                          <p className="font-bold">{partidoActual.litigante2.nombre}</p>
                          <p className="text-xs text-gray-600">{partidoActual.litigante2.especialidad || "General"}</p>
                          {partidoActual.litigante2.esUsuario && <span className="text-xs bg-yellow-500 text-white px-2 rounded inline-block mt-1">Tú</span>}
                        </div>
                      </div>
                      <button 
                        onClick={() => iniciarLitigioGrupo(partidoActual)}
                        className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition"
                      >
                        INICIAR DUELO
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-xl p-6 text-center">
                      <p className="text-gray-600">Cargando próximo duelo...</p>
                    </div>
                  )}
                  
                  <div className="mt-6 p-3 bg-blue-50 rounded-lg text-xs text-gray-600">
                    <p className="font-bold text-blue-700">📖 ¿Cómo se obtienen los puntos?</p>
                    <p>✓ Cada respuesta correcta = <strong>10 puntos</strong></p>
                    <p>✓ El primer litigante en llegar a 100 puntos GANA el duelo</p>
                    <p>✓ El ganador recibe <strong>3 puntos</strong> en la tabla</p>
                    <p>✓ Los puntos AF/EC son el total acumulado de todos sus duelos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // LITIGIO EN FASE DE GRUPOS
  // ============================================================
  if (ronda === "litigioGrupo" && dueloActivo && preguntaActual) {
    const usuarioLocal = JSON.parse(localStorage.getItem('torneo_usuario') || '{}');
    const nombreGrupo = "Grupo A";
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-t-xl text-center">
            <h2 className="text-xl font-bold">Fase de Grupos: {nombreGrupo}</h2>
            <p className="text-sm">Especialidad: {grupoActual?.especialidad}</p>
          </div>
          <div className="text-center mb-4 mt-4">
            <h1 className="text-3xl font-bold">LITIGIO</h1>
            <p>Primero en 100 puntos gana el caso</p>
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="bg-white p-6 rounded-xl text-center shadow">
              <img src={usuarioLocal.avatar} className="w-32 h-32 rounded-full mx-auto object-cover" />
              <h3 className="text-xl font-bold mt-2">{usuarioLocal.nombre}</h3>
              <p className="text-xs text-blue-600 font-semibold">{usuarioLocal.especialidad || "General"}</p>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-blue-600 h-4 rounded-full" style={{width: `${puntajeUsuario}%`}}></div>
                </div>
                <p className="text-2xl font-bold">{puntajeUsuario}/100</p>
              </div>
              {turnoActual === "usuario" && !dueloTerminado && <div className="mt-2 text-yellow-600 animate-pulse">Tu turno</div>}
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-white">VS</span>
              </div>
              <div className="mt-2 bg-black/50 rounded-full px-4 py-1 inline-block">
                <span className={`text-xl font-bold ${tiempoRestante <=5 ? "text-red-500 animate-pulse" : "text-white"}`}>⏱️ {tiempoRestante}s</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl text-center shadow">
              <img src={dueloActivo.avatar} className="w-32 h-32 rounded-full mx-auto object-cover" />
              <h3 className="text-xl font-bold mt-2">{dueloActivo.nombre}</h3>
              <p className="text-xs text-red-600 font-semibold">{dueloActivo.especialidad}</p>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-red-600 h-4 rounded-full" style={{width: `${puntajeRival}%`}}></div>
                </div>
                <p className="text-2xl font-bold">{puntajeRival}/100</p>
              </div>
              {turnoActual === "rival" && !dueloTerminado && <div className="mt-2 text-yellow-600 animate-pulse">Turno del opositor</div>}
            </div>
          </div>
          {!dueloTerminado ? (
            <div className="bg-white mt-6 p-8 rounded-xl shadow">
              <div className="mb-2 text-sm text-gray-500">Área: {preguntaActual.area}</div>
              <h3 className="text-xl font-semibold mb-4">{preguntaActual.pregunta}</h3>
              <div className="grid gap-3">
                {preguntaActual.opciones.map((op, idx) => (
                  <button key={idx} onClick={() => responderPregunta(idx)} disabled={respuestaSeleccionada !== null || turnoActual !== "usuario" || esperandoCambioTurno} className="p-3 text-left rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50">
                    {String.fromCharCode(65+idx)}. {op}
                  </button>
                ))}
              </div>
              {mensajeDuelo && <div className={`mt-4 p-3 rounded-lg text-center ${mensajeDuelo.includes("Correcto") ? "bg-green-100" : "bg-red-100"}`}>{mensajeDuelo}</div>}
            </div>
          ) : (
            <div className="text-center bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-12 mt-6">
              <h2 className="text-3xl font-bold text-white">{ganadorDuelo === "usuario" ? usuarioLocal.nombre : dueloActivo.nombre}</h2>
              <p className="text-white text-xl mt-2">¡GANADOR DEL LITIGIO!</p>
              <button onClick={() => setRonda("vistaLitigios")} className="mt-6 bg-white text-gray-800 px-8 py-3 rounded-full font-bold">Continuar</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // CLASIFICADO A ELIMINATORIAS
  // ============================================================
  if (ronda === "clasificadoEliminatorias") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-12 text-center max-w-lg">
          <span className="text-6xl">🏆</span>
          <h1 className="text-3xl font-bold text-green-600 mt-4">¡CLASIFICASTE A LAS ELIMINATORIAS!</h1>
          <p className="text-gray-600 mt-2">Superaste la Fase de Grupos como uno de los dos mejores litigantes</p>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="font-bold">📊 Tus estadísticas:</p>
            <p>Puntos: {puntosGrupo} | AF: {argumentosFavor} | EC: {argumentosContra}</p>
          </div>
          <button onClick={() => setRonda("vistaEliminatorias")} className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-full">Continuar a Eliminatorias</button>
        </div>
      </div>
    );
  }

  // ============================================================
  // VISTA DE ELIMINATORIAS
  // ============================================================
  if (ronda === "vistaEliminatorias") {
    const partidosOctavos = partidosEliminatoria.filter(p => p.ronda === "octavos");
    const partidosCuartos = partidosEliminatoria.filter(p => p.ronda === "cuartos");
    const partidosSemifinal = partidosEliminatoria.filter(p => p.ronda === "semifinal");
    const partidoFinal = partidosEliminatoria.find(p => p.ronda === "final");
    
    let tituloRonda = "";
    switch(faseActual) {
      case "octavos": tituloRonda = "OCTAVOS DE FINAL"; break;
      case "cuartos": tituloRonda = "CUARTOS DE FINAL"; break;
      case "semifinal": tituloRonda = "SEMIFINAL"; break;
      case "final": tituloRonda = "FINAL"; break;
      default: tituloRonda = "ELIMINATORIAS";
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-end mb-4"><Billetera /></div>
          
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white text-center">
              <h1 className="text-3xl font-bold">🏆 {tituloRonda} 🏆</h1>
              <p className="text-sm mt-2">Torneo: {torneoActivo?.nombre}</p>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 bg-gray-50 rounded-xl p-4">
                  <h2 className="text-xl font-bold text-center mb-4 text-blue-600">🏛️ LLAVE A</h2>
                  <div className="space-y-4">
                    {partidosOctavos.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">OCTAVOS DE FINAL</h3>
                        {partidosOctavos.slice(0, 2).map((partido, idx) => (
                          <div key={idx} className="bg-white border rounded-lg p-2 mb-2">
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                {partido.participante1?.avatar && <img src={partido.participante1.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />}
                                <span className={partido.participante1?.esUsuario ? "font-bold text-blue-600" : ""}>{partido.participante1?.nombre || "---"}</span>
                              </div>
                              <span className="font-bold">{partido.realizado ? `${partido.puntos1} - ${partido.puntos2}` : "vs"}</span>
                              <div className="flex items-center gap-2">
                                <span className={partido.participante2?.esUsuario ? "font-bold text-blue-600" : ""}>{partido.participante2?.nombre || "---"}</span>
                                {partido.participante2?.avatar && <img src={partido.participante2.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />}
                              </div>
                            </div>
                            {partido.realizado && partido.ganador && (
                              <div className="text-xs text-green-600 text-center mt-1">Ganador: {partido.ganador.nombre}</div>
                            )}
                            {!partido.realizado && partidoActualEliminatoria?.id === partido.id && (
                              <button onClick={() => iniciarLitigioEliminatoria(partido)} className="w-full mt-2 bg-green-500 text-white text-xs py-1 rounded hover:bg-green-600 transition">Jugar Duelo</button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {partidosCuartos.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">CUARTOS DE FINAL</h3>
                        {partidosCuartos.slice(0, 1).map((partido, idx) => (
                          <div key={idx} className="bg-white border rounded-lg p-2 mb-2">
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                {partido.participante1?.avatar && <img src={partido.participante1.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />}
                                <span className={partido.participante1?.esUsuario ? "font-bold text-blue-600" : ""}>{partido.participante1?.nombre || "---"}</span>
                              </div>
                              <span className="font-bold">{partido.realizado ? `${partido.puntos1} - ${partido.puntos2}` : "vs"}</span>
                              <div className="flex items-center gap-2">
                                <span className={partido.participante2?.esUsuario ? "font-bold text-blue-600" : ""}>{partido.participante2?.nombre || "---"}</span>
                                {partido.participante2?.avatar && <img src={partido.participante2.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />}
                              </div>
                            </div>
                            {partido.realizado && partido.ganador && <div className="text-xs text-green-600 text-center mt-1">Ganador: {partido.ganador.nombre}</div>}
                            {!partido.realizado && partidoActualEliminatoria?.id === partido.id && (
                              <button onClick={() => iniciarLitigioEliminatoria(partido)} className="w-full mt-2 bg-green-500 text-white text-xs py-1 rounded hover:bg-green-600 transition">Jugar Duelo</button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center px-4">
                  <div className="text-6xl mb-2">🏆</div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 font-bold">GRAN FINAL</p>
                    <div className="w-px h-20 bg-gradient-to-b from-amber-500 to-transparent mx-auto my-2"></div>
                  </div>
                  {partidoFinal && partidoFinal.realizado && partidoFinal.ganador && (
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500">CAMPEÓN</p>
                      <p className="font-bold text-amber-600">{partidoFinal.ganador.nombre}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 bg-gray-50 rounded-xl p-4">
                  <h2 className="text-xl font-bold text-center mb-4 text-red-600">🏛️ LLAVE B</h2>
                  <div className="space-y-4">
                    {partidosOctavos.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">OCTAVOS DE FINAL</h3>
                        {partidosOctavos.slice(2, 4).map((partido, idx) => (
                          <div key={idx} className="bg-white border rounded-lg p-2 mb-2">
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                {partido.participante1?.avatar && <img src={partido.participante1.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />}
                                <span className={partido.participante1?.esUsuario ? "font-bold text-blue-600" : ""}>{partido.participante1?.nombre || "---"}</span>
                              </div>
                              <span className="font-bold">{partido.realizado ? `${partido.puntos1} - ${partido.puntos2}` : "vs"}</span>
                              <div className="flex items-center gap-2">
                                <span className={partido.participante2?.esUsuario ? "font-bold text-blue-600" : ""}>{partido.participante2?.nombre || "---"}</span>
                                {partido.participante2?.avatar && <img src={partido.participante2.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />}
                              </div>
                            </div>
                            {partido.realizado && partido.ganador && <div className="text-xs text-green-600 text-center mt-1">Ganador: {partido.ganador.nombre}</div>}
                            {!partido.realizado && partidoActualEliminatoria?.id === partido.id && (
                              <button onClick={() => iniciarLitigioEliminatoria(partido)} className="w-full mt-2 bg-green-500 text-white text-xs py-1 rounded hover:bg-green-600 transition">Jugar Duelo</button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {partidosCuartos.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">CUARTOS DE FINAL</h3>
                        {partidosCuartos.slice(1, 2).map((partido, idx) => (
                          <div key={idx} className="bg-white border rounded-lg p-2 mb-2">
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                {partido.participante1?.avatar && <img src={partido.participante1.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />}
                                <span className={partido.participante1?.esUsuario ? "font-bold text-blue-600" : ""}>{partido.participante1?.nombre || "---"}</span>
                              </div>
                              <span className="font-bold">{partido.realizado ? `${partido.puntos1} - ${partido.puntos2}` : "vs"}</span>
                              <div className="flex items-center gap-2">
                                <span className={partido.participante2?.esUsuario ? "font-bold text-blue-600" : ""}>{partido.participante2?.nombre || "---"}</span>
                                {partido.participante2?.avatar && <img src={partido.participante2.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />}
                              </div>
                            </div>
                            {partido.realizado && partido.ganador && <div className="text-xs text-green-600 text-center mt-1">Ganador: {partido.ganador.nombre}</div>}
                            {!partido.realizado && partidoActualEliminatoria?.id === partido.id && (
                              <button onClick={() => iniciarLitigioEliminatoria(partido)} className="w-full mt-2 bg-green-500 text-white text-xs py-1 rounded hover:bg-green-600 transition">Jugar Duelo</button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {(partidosSemifinal.length > 0 || partidoFinal) && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-center gap-8">
                    {partidosSemifinal.length > 0 && (
                      <div className="flex-1 max-w-xs">
                        <h3 className="text-sm font-semibold text-gray-500 text-center mb-2">SEMIFINAL</h3>
                        {partidosSemifinal.map((partido, idx) => (
                          <div key={idx} className="bg-white border rounded-lg p-2">
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                {partido.participante1?.avatar && <img src={partido.participante1.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />}
                                <span className={partido.participante1?.esUsuario ? "font-bold text-blue-600" : ""}>{partido.participante1?.nombre || "---"}</span>
                              </div>
                              <span className="font-bold">{partido.realizado ? `${partido.puntos1} - ${partido.puntos2}` : "vs"}</span>
                              <div className="flex items-center gap-2">
                                <span className={partido.participante2?.esUsuario ? "font-bold text-blue-600" : ""}>{partido.participante2?.nombre || "---"}</span>
                                {partido.participante2?.avatar && <img src={partido.participante2.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />}
                              </div>
                            </div>
                            {partido.realizado && partido.ganador && <div className="text-xs text-green-600 text-center mt-1">Ganador: {partido.ganador.nombre}</div>}
                            {!partido.realizado && partidoActualEliminatoria?.id === partido.id && (
                              <button onClick={() => iniciarLitigioEliminatoria(partido)} className="w-full mt-2 bg-green-500 text-white text-xs py-1 rounded hover:bg-green-600 transition">Jugar Duelo</button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {partidoFinal && (
                      <div className="flex-1 max-w-xs">
                        <h3 className="text-sm font-semibold text-amber-600 text-center mb-2">🏆 GRAN FINAL 🏆</h3>
                        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-400 rounded-lg p-3">
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              {partidoFinal.participante1?.avatar && <img src={partidoFinal.participante1.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />}
                              <span className={partidoFinal.participante1?.esUsuario ? "font-bold text-blue-600" : "font-bold"}>{partidoFinal.participante1?.nombre || "---"}</span>
                            </div>
                            <span className="font-bold text-lg">{partidoFinal.realizado ? `${partidoFinal.puntos1} - ${partidoFinal.puntos2}` : "VS"}</span>
                            <div className="flex items-center gap-2">
                              <span className={partidoFinal.participante2?.esUsuario ? "font-bold text-blue-600" : "font-bold"}>{partidoFinal.participante2?.nombre || "---"}</span>
                              {partidoFinal.participante2?.avatar && <img src={partidoFinal.participante2.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />}
                            </div>
                          </div>
                          {partidoFinal.realizado && partidoFinal.ganador && (
                            <div className="text-center mt-2">
                              <div className="text-xs text-green-600 font-bold">¡CAMPEÓN!</div>
                              <div className="font-bold text-amber-700 text-lg">{partidoFinal.ganador.nombre}</div>
                              <div className="text-2xl mt-1">🏆</div>
                            </div>
                          )}
                          {!partidoFinal.realizado && partidoActualEliminatoria?.id === partidoFinal.id && (
                            <button onClick={() => iniciarLitigioEliminatoria(partidoFinal)} className="w-full mt-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg font-bold hover:from-amber-600 hover:to-orange-600 transition">JUGAR FINAL</button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mt-6 text-center text-gray-500 text-sm">
                <p>🔹 Los partidos en color son tus próximos duelos</p>
                <p>✅ Gana todos los duelos para avanzar a la siguiente ronda y convertirte en CAMPEÓN</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // DUELO EN ELIMINATORIAS
  // ============================================================
  if (ronda === "eliminatoria" && dueloActivo && preguntaActual) {
    const usuarioLocal = JSON.parse(localStorage.getItem('torneo_usuario') || '{}');
    const nombreRonda = faseActual === "octavos" ? "OCTAVOS DE FINAL" : faseActual === "cuartos" ? "CUARTOS DE FINAL" : faseActual === "semifinal" ? "SEMIFINAL" : "FINAL";
    
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-t-xl text-center">
            <h2 className="text-xl font-bold">🏆 {nombreRonda} 🏆</h2>
            <p className="text-sm">Torneo: {torneoActivo?.nombre}</p>
          </div>
          <div className="text-center mb-4 mt-4">
            <h1 className="text-3xl font-bold">LITIGIO ELIMINATORIO</h1>
            <p>Primero en 100 puntos gana el caso y avanza a la siguiente ronda</p>
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="bg-white p-6 rounded-xl text-center shadow">
              <img src={usuarioLocal.avatar} className="w-32 h-32 rounded-full mx-auto object-cover" />
              <h3 className="text-xl font-bold mt-2">{usuarioLocal.nombre}</h3>
              <p className="text-xs text-blue-600 font-semibold">{usuarioLocal.especialidad || "General"}</p>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-blue-600 h-4 rounded-full" style={{width: `${puntajeUsuario}%`}}></div>
                </div>
                <p className="text-2xl font-bold">{puntajeUsuario}/100</p>
              </div>
              {turnoActual === "usuario" && !dueloTerminado && <div className="mt-2 text-yellow-600 animate-pulse">Tu turno</div>}
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-white">VS</span>
              </div>
              <div className="mt-2 bg-black/50 rounded-full px-4 py-1 inline-block">
                <span className={`text-xl font-bold ${tiempoRestante <=5 ? "text-red-500 animate-pulse" : "text-white"}`}>⏱️ {tiempoRestante}s</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl text-center shadow">
              <img src={dueloActivo.avatar} className="w-32 h-32 rounded-full mx-auto object-cover" />
              <h3 className="text-xl font-bold mt-2">{dueloActivo.nombre}</h3>
              <p className="text-xs text-red-600 font-semibold">{dueloActivo.especialidad}</p>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-red-600 h-4 rounded-full" style={{width: `${puntajeRival}%`}}></div>
                </div>
                <p className="text-2xl font-bold">{puntajeRival}/100</p>
              </div>
              {turnoActual === "rival" && !dueloTerminado && <div className="mt-2 text-yellow-600 animate-pulse">Turno del opositor</div>}
            </div>
          </div>
          {!dueloTerminado ? (
            <div className="bg-white mt-6 p-8 rounded-xl shadow">
              <div className="mb-2 text-sm text-gray-500">Área: {preguntaActual.area}</div>
              <h3 className="text-xl font-semibold mb-4">{preguntaActual.pregunta}</h3>
              <div className="grid gap-3">
                {preguntaActual.opciones.map((op, idx) => (
                  <button key={idx} onClick={() => responderPregunta(idx)} disabled={respuestaSeleccionada !== null || turnoActual !== "usuario" || esperandoCambioTurno} className="p-3 text-left rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50">
                    {String.fromCharCode(65+idx)}. {op}
                  </button>
                ))}
              </div>
              {mensajeDuelo && <div className={`mt-4 p-3 rounded-lg text-center ${mensajeDuelo.includes("Correcto") ? "bg-green-100" : "bg-red-100"}`}>{mensajeDuelo}</div>}
            </div>
          ) : (
            <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-12 mt-6">
              <h2 className="text-3xl font-bold text-white">{ganadorDuelo === "usuario" ? usuarioLocal.nombre : dueloActivo.nombre}</h2>
              <p className="text-white text-xl mt-2">¡GANADOR DEL LITIGIO!</p>
              <p className="text-white text-sm mt-1">Avanza a la siguiente ronda</p>
              <button onClick={() => setRonda("vistaEliminatorias")} className="mt-6 bg-white text-gray-800 px-8 py-3 rounded-full font-bold">Continuar</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // CAMPEÓN
  // ============================================================
  if (ronda === "campeon" && campeon) {
    const usuarioLocal = JSON.parse(localStorage.getItem('torneo_usuario') || '{}');
    const esCampeon = campeon.esUsuario || campeon.nombre === usuarioLocal.nombre;
    const premioMonto = torneoActivo?.premio?.monto || 0;
    const premioDescripcion = torneoActivo?.premio?.descripcion || "";
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 to-amber-700 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-12 text-center max-w-2xl">
          <div className="text-8xl mb-4">🏆⚖️🏆</div>
          <h1 className="text-4xl font-bold text-amber-600 mt-2">¡CAMPEÓN DEL TORNEO!</h1>
          <div className="my-6">
            <img src={campeon.avatar} className="w-40 h-40 rounded-full mx-auto object-cover border-8 border-amber-400" alt="" />
            <h2 className="text-3xl font-bold mt-4">{campeon.nombre}</h2>
            <p className="text-lg text-gray-600">{campeon.especialidad || "General"}</p>
          </div>
          
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-6 my-4">
            <p className="text-xl font-bold text-amber-700">¡FELICIDADES!</p>
            <p className="text-gray-700 mt-2">Has demostrado tu excelencia en el litigio jurídico y te coronas como el gran campeón del torneo.</p>
          </div>
          
          {(torneoActivo?.premio?.tipo === "dinero" || torneoActivo?.premio?.tipo === "ambos") && (
            <div className="bg-green-100 rounded-xl p-4 my-4">
              <p className="text-2xl font-bold text-green-700">💰 ${premioMonto.toLocaleString()} MXN</p>
              <p className="text-sm text-green-600">Premio en efectivo</p>
            </div>
          )}
          
          {(torneoActivo?.premio?.tipo === "libro" || torneoActivo?.premio?.tipo === "ambos") && (
            <div className="bg-blue-100 rounded-xl p-4 my-4">
              <p className="text-xl font-bold text-blue-700">📚 {premioDescripcion || "Libro Especializado"}</p>
              <p className="text-sm text-blue-600">Premio académico</p>
            </div>
          )}
          
          <div className="flex gap-3 mt-6">
            <button onClick={() => window.location.reload()} className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-bold hover:bg-gray-600 transition">Salir</button>
            <button onClick={reiniciarTorneoCompleto} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition">Jugar de nuevo</button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // ELIMINADO EN FASE DE GRUPOS
  // ============================================================
  if (ronda === "eliminadoLitigios") {
    const usuarioLocal = JSON.parse(localStorage.getItem('torneo_usuario') || '{}');
    const costoReinscripcion = torneoActivo?.costoInscripcion || 10;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <span className="text-6xl">⚖️💀</span>
          <h1 className="text-3xl font-bold text-red-600 mt-4">ELIMINADO EN FASE DE GRUPOS</h1>
          <p className="text-gray-600 mt-2">{usuarioLocal.nombre || "Litigante"}, no lograste clasificar a las eliminatorias</p>
          
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="font-bold">📊 Tus estadísticas finales:</p>
            <p>Puntos: {puntosGrupo} | AF: {argumentosFavor} | EC: {argumentosContra}</p>
          </div>
          
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <p className="font-bold text-red-700">Debes pagar nuevamente la inscripción para volver a participar</p>
            <p className="text-2xl font-bold text-red-600 mt-2">${costoReinscripcion} MXN</p>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button onClick={() => setRonda("registroTorneo")} className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-bold hover:bg-gray-600 transition">Salir</button>
            <button onClick={reiniciarTorneoCompleto} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition">Pagar ${costoReinscripcion} y Reintentar</button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // ELIMINADO EN FASE DE CLASIFICACIÓN
  // ============================================================
  if (ronda === "eliminado") {
    const usuarioLocal = JSON.parse(localStorage.getItem('torneo_usuario') || '{}');
    const costoReinscripcion = torneoActivo?.costoInscripcion || 10;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <span className="text-6xl">⚖️💀</span>
          <h1 className="text-3xl font-bold text-red-600 mt-4">ELIMINADO DEL TORNEO</h1>
          <p className="text-gray-600 mt-2">{usuarioLocal.nombre || "Litigante"}, perdiste 2 duelos en la fase de clasificación</p>
          
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <p className="font-bold text-red-700">Debes pagar nuevamente la inscripción para volver a participar</p>
            <p className="text-2xl font-bold text-red-600 mt-2">${costoReinscripcion} MXN</p>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button onClick={() => setRonda("registroTorneo")} className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-bold hover:bg-gray-600 transition">Salir</button>
            <button onClick={reiniciarTorneoCompleto} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition">Pagar ${costoReinscripcion} y Reintentar</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Torneos;