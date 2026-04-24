const Torneo = require('../models/Torneo');
const Participante = require('../models/Participante');
const Duelo = require('../models/Duelo');
const Usuario = require('../models/User');

// ========== UTILIDADES ==========
const obtenerOTorneoActivo = async () => {
  let torneo = await Torneo.findOne({ estado: { $ne: 'finalizado' } });
  if (!torneo) {
    torneo = await Torneo.create({
      nombre: "Lex Mundi Invitational 2024",
      descripcion: "Torneo de litigación jurídica",
      premio: "$50,000 MXN",
      costoInscripcion: 10,
      estado: 'registro'
    });
  }
  return torneo;
};

const preguntaUnica = {
  pregunta: "¿Cuál es el principio fundamental del derecho penal que establece que una persona es inocente hasta que se demuestre lo contrario?",
  opciones: ["Principio de legalidad", "Presunción de inocencia", "Debido proceso", "Non bis in idem"],
  correcta: 1
};

// ========== TORNEOS ==========
exports.obtenerTorneoActivo = async (req, res) => {
  try {
    const torneo = await obtenerOTorneoActivo();
    res.json({ success: true, data: torneo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.registrarParticipante = async (req, res) => {
  try {
    const { nombre, avatar, email } = req.body;
    console.log('📝 Registrando participante:', { nombre, email });
    
    // Buscar o crear usuario por email
    let user = await Usuario.findOne({ email });
    if (!user) {
      user = await Usuario.create({
        email: email,
        name: nombre || email.split('@')[0],
        password: 'temporal123',
        role: 'user'
      });
      console.log('🆕 Usuario creado:', user._id);
    }
    
    const torneo = await obtenerOTorneoActivo();
    
    let participante = await Participante.findOne({ usuario: user._id, torneo: torneo._id });
    if (participante) {
      return res.status(400).json({ success: false, error: "Ya estás registrado en este torneo" });
    }
    
    // Crear participante con saldo inicial de 1000
    participante = await Participante.create({
      usuario: user._id,
      torneo: torneo._id,
      nombre: nombre || user.name || "Participante",
      avatar: avatar || "",
      saldo: 1000, // Saldo inicial
      puntajeTotal: 1000,
      inscrito: false
    });
    
    console.log('✅ Participante creado con saldo:', participante.saldo);
    res.json({ success: true, data: participante });
  } catch (error) {
    console.error('❌ Error en registrarParticipante:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.pagarInscripcion = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('💳 Procesando pago inscripción para usuario:', userId);
    
    const torneo = await obtenerOTorneoActivo();
    const participante = await Participante.findOne({ usuario: userId, torneo: torneo._id });
    
    if (!participante) {
      return res.status(404).json({ success: false, error: "Participante no encontrado" });
    }
    
    if (participante.inscrito) {
      return res.status(400).json({ success: false, error: "Ya estás inscrito" });
    }
    
    if (participante.saldo < torneo.costoInscripcion) {
      return res.status(400).json({ success: false, error: "Saldo insuficiente" });
    }
    
    participante.saldo -= torneo.costoInscripcion;
    participante.inscrito = true;
    participante.transacciones.push({
      monto: torneo.costoInscripcion,
      fecha: new Date(),
      tipo: "Inscripción a torneo",
      metodo: "Saldo billetera"
    });
    
    await participante.save();
    console.log('✅ Inscripción pagada. Nuevo saldo:', participante.saldo);
    
    res.json({ success: true, data: participante });
  } catch (error) {
    console.error('❌ Error en pagarInscripcion:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.obtenerMiParticipante = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('🔍 Buscando participante para userId:', userId);
    
    const torneo = await obtenerOTorneoActivo();
    const participante = await Participante.findOne({ usuario: userId, torneo: torneo._id });
    
    if (participante) {
      console.log('📊 Participante encontrado:', participante.nombre);
      console.log('💰 Saldo actual:', participante.saldo);
      console.log('✅ Inscrito:', participante.inscrito);
    } else {
      console.log('⚠️ No se encontró participante para usuario:', userId);
    }
    
    res.json({ success: true, data: participante });
  } catch (error) {
    console.error('❌ Error en obtenerMiParticipante:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.recargarSaldo = async (req, res) => {
  try {
    const { monto, datosPago } = req.body;
    const userId = req.user.id;
    console.log('💰 Recargando saldo para usuario:', userId, 'Monto:', monto);
    
    const torneo = await obtenerOTorneoActivo();
    const participante = await Participante.findOne({ usuario: userId, torneo: torneo._id });
    
    if (!participante) {
      return res.status(404).json({ success: false, error: "Participante no encontrado" });
    }
    
    if (monto <= 0) {
      return res.status(400).json({ success: false, error: "Monto inválido" });
    }
    
    const saldoAnterior = participante.saldo;
    participante.saldo += monto;
    participante.transacciones.push({
      monto: monto,
      fecha: new Date(),
      tipo: "Recarga",
      metodo: `Tarjeta terminada en ${datosPago?.numeroTarjeta?.slice(-4) || 'XXXX'}`
    });
    
    await participante.save();
    console.log('✅ Saldo actualizado:', saldoAnterior, '→', participante.saldo);
    
    res.json({ success: true, data: participante });
  } catch (error) {
    console.error('❌ Error en recargarSaldo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.obtenerTransacciones = async (req, res) => {
  try {
    const userId = req.user.id;
    const torneo = await obtenerOTorneoActivo();
    const participante = await Participante.findOne({ usuario: userId, torneo: torneo._id });
    
    if (!participante) {
      return res.status(404).json({ success: false, error: "Participante no encontrado" });
    }
    
    res.json({ success: true, data: participante.transacciones || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== DUELOS ==========
exports.buscarRival = async (req, res) => {
  try {
    const userId = req.user.id;
    const torneo = await obtenerOTorneoActivo();
    const participante = await Participante.findOne({ usuario: userId, torneo: torneo._id });
    
    if (!participante || !participante.inscrito) {
      return res.status(400).json({ success: false, error: "No estás inscrito en el torneo" });
    }
    
    const otrosParticipantes = await Participante.find({
      torneo: torneo._id,
      inscrito: true,
      eliminado: false,
      _id: { $ne: participante._id }
    });
    
    if (otrosParticipantes.length === 0) {
      return res.status(404).json({ success: false, error: "No hay rivales disponibles" });
    }
    
    const rival = otrosParticipantes[Math.floor(Math.random() * otrosParticipantes.length)];
    res.json({ success: true, data: rival });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.iniciarDuelo = async (req, res) => {
  try {
    const { rivalId, tipo, grupoId } = req.body;
    const userId = req.user.id;
    const torneo = await obtenerOTorneoActivo();
    const participante = await Participante.findOne({ usuario: userId, torneo: torneo._id });
    const rival = await Participante.findById(rivalId);
    
    if (!participante || !rival) {
      return res.status(404).json({ success: false, error: "Participante no encontrado" });
    }
    
    const dueloActivo = await Duelo.findOne({
      torneo: torneo._id,
      completado: false,
      $or: [
        { participante1: participante._id },
        { participante2: participante._id }
      ]
    });
    
    if (dueloActivo) {
      return res.status(400).json({ success: false, error: "Ya tienes un duelo activo" });
    }
    
    const duelo = await Duelo.create({
      torneo: torneo._id,
      participante1: participante._id,
      participante2: rival._id,
      tipo: tipo || 'clasificacion',
      grupoId: grupoId || null,
      preguntas: []
    });
    
    res.json({ success: true, data: duelo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.responderPregunta = async (req, res) => {
  try {
    const { dueloId, respuestaIndex } = req.body;
    const userId = req.user.id;
    const duelo = await Duelo.findById(dueloId)
      .populate('participante1')
      .populate('participante2');
    
    if (!duelo || duelo.completado) {
      return res.status(400).json({ success: false, error: "Duelo no válido o ya completado" });
    }
    
    const esParticipante1 = duelo.participante1.usuario.toString() === userId;
    const esParticipante2 = duelo.participante2.usuario.toString() === userId;
    
    if (!esParticipante1 && !esParticipante2) {
      return res.status(403).json({ success: false, error: "No eres parte de este duelo" });
    }
    
    const esCorrecta = respuestaIndex === preguntaUnica.correcta;
    const puntos = esCorrecta ? 10 : 0;
    
    if (esParticipante1) {
      duelo.puntajeParticipante1 += puntos;
    } else {
      duelo.puntajeParticipante2 += puntos;
    }
    
    if (duelo.puntajeParticipante1 >= 100) {
      duelo.ganador = duelo.participante1._id;
      duelo.completado = true;
      
      await Participante.findByIdAndUpdate(duelo.participante1._id, {
        $inc: { duelosGanados: 1, puntajeTotal: 10 }
      });
      await Participante.findByIdAndUpdate(duelo.participante2._id, {
        $inc: { duelosPerdidos: 1 }
      });
    } else if (duelo.puntajeParticipante2 >= 100) {
      duelo.ganador = duelo.participante2._id;
      duelo.completado = true;
      
      await Participante.findByIdAndUpdate(duelo.participante2._id, {
        $inc: { duelosGanados: 1, puntajeTotal: 10 }
      });
      await Participante.findByIdAndUpdate(duelo.participante1._id, {
        $inc: { duelosPerdidos: 1 }
      });
    }
    
    await duelo.save();
    
    res.json({
      success: true,
      data: {
        esCorrecta,
        puntajeParticipante1: duelo.puntajeParticipante1,
        puntajeParticipante2: duelo.puntajeParticipante2,
        completado: duelo.completado,
        ganador: duelo.ganador
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.obtenerDueloActivo = async (req, res) => {
  try {
    const userId = req.user.id;
    const torneo = await obtenerOTorneoActivo();
    const participante = await Participante.findOne({ usuario: userId, torneo: torneo._id });
    
    if (!participante) {
      return res.json({ success: true, data: null });
    }
    
    const dueloActivo = await Duelo.findOne({
      torneo: torneo._id,
      completado: false,
      $or: [
        { participante1: participante._id },
        { participante2: participante._id }
      ]
    }).populate('participante1 participante2');
    
    res.json({ success: true, data: dueloActivo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== GRUPOS ==========
exports.generarFaseGrupos = async (req, res) => {
  try {
    const userId = req.user.id;
    const torneo = await obtenerOTorneoActivo();
    const participantes = await Participante.find({
      torneo: torneo._id,
      inscrito: true,
      duelosGanados: { $gte: 3 }
    }).sort({ puntajeTotal: -1 }).limit(32);
    
    const grupos = [];
    for (let i = 0; i < 8; i++) {
      const grupoParticipantes = participantes.slice(i * 4, (i + 1) * 4);
      grupos.push({
        id: i + 1,
        nombre: `Grupo ${String.fromCharCode(65 + i)}`,
        participantes: grupoParticipantes
      });
      
      for (const [idx, p] of grupoParticipantes.entries()) {
        p.grupoId = i + 1;
        p.grupoNombre = `Grupo ${String.fromCharCode(65 + i)}`;
        p.posicionGrupo = idx + 1;
        await p.save();
      }
    }
    
    torneo.estado = 'grupos';
    await torneo.save();
    
    res.json({ success: true, data: grupos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.obtenerGrupos = async (req, res) => {
  try {
    const userId = req.user.id;
    const torneo = await obtenerOTorneoActivo();
    const participantes = await Participante.find({
      torneo: torneo._id,
      grupoId: { $ne: null }
    });
    
    const grupos = [];
    for (let i = 1; i <= 8; i++) {
      const grupoParticipantes = participantes.filter(p => p.grupoId === i);
      grupos.push({
        id: i,
        nombre: `Grupo ${String.fromCharCode(64 + i)}`,
        participantes: grupoParticipantes.sort((a, b) => (b.puntajeTotal || 0) - (a.puntajeTotal || 0))
      });
    }
    
    res.json({ success: true, data: grupos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.obtenerMiGrupo = async (req, res) => {
  try {
    const userId = req.user.id;
    const torneo = await obtenerOTorneoActivo();
    const participante = await Participante.findOne({ usuario: userId, torneo: torneo._id });
    
    if (!participante || !participante.grupoId) {
      return res.json({ success: true, data: null });
    }
    
    const grupoParticipantes = await Participante.find({
      torneo: torneo._id,
      grupoId: participante.grupoId
    });
    
    res.json({
      success: true,
      data: {
        id: participante.grupoId,
        nombre: participante.grupoNombre,
        participantes: grupoParticipantes,
        miParticipante: participante
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== ELIMINATORIA ==========
exports.generarEliminatoria = async (req, res) => {
  try {
    const userId = req.user.id;
    const torneo = await obtenerOTorneoActivo();
    
    const clasificados = await Participante.find({
      torneo: torneo._id,
      clasificadoAEliminatoria: true
    });
    
    const mezclados = clasificados.sort(() => Math.random() - 0.5);
    const mitad = Math.ceil(mezclados.length / 2);
    
    torneo.estado = 'eliminatoria';
    await torneo.save();
    
    res.json({ success: true, data: { llaveA: mezclados.slice(0, mitad), llaveB: mezclados.slice(mitad) } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.obtenerEliminatoria = async (req, res) => {
  try {
    const userId = req.user.id;
    const torneo = await obtenerOTorneoActivo();
    const duelos = await Duelo.find({
      torneo: torneo._id,
      tipo: 'eliminatoria'
    }).populate('participante1 participante2 ganador');
    
    res.json({ success: true, data: duelos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};