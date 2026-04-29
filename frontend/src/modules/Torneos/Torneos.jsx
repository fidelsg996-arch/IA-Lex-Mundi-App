// src/modules/Torneos/Torneos.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBilletera } from '../../context/BilleteraContext';
import { useTorneoData } from './hooks/useTorneoData';
import Billetera from './components/Billetera';
import ModalRecarga from './components/ModalRecarga';
import ModalHistorial from './components/ModalHistorial';
import AdminPanel from './components/AdminPanel';
import RegistroPhase from './phases/RegistroPhase';
import ClasificacionPhase from './phases/ClasificacionPhase';
import GruposPhase from './phases/GruposPhase';
import EliminatoriasPhase from './phases/EliminatoriasPhase';
import { ADMIN_PASSWORD } from './utils/constantes';

const Torneos = () => {
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();
  const billetera = useBilletera();
  const { saldo, transacciones, recargarSaldo, realizarPago } = billetera;
  const { torneos, torneoActivo, librosDisponibles, guardarTorneo, eliminarTorneo, activarTorneo } = useTorneoData();

  const [modoAdmin, setModoAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const [ronda, setRonda] = useState('registroTorneo');
  const [usuario, setUsuario] = useState(null);
  const [victorias, setVictorias] = useState(0);
  const [derrotas, setDerrotas] = useState(0);
  const [buscandoRival, setBuscandoRival] = useState(false);
  const [mostrandoPago, setMostrandoPago] = useState(false);
  const [mostrarModalRecarga, setMostrarModalRecarga] = useState(false);
  const [mostrarModalHistorial, setMostrarModalHistorial] = useState(false);
  
  // Datos de fase de grupos
  const [clasificadosGrupos, setClasificadosGrupos] = useState(null);
  const [puntosGrupo, setPuntosGrupo] = useState(0);
  const [argumentosFavor, setArgumentosFavor] = useState(0);
  const [argumentosContra, setArgumentosContra] = useState(0);
  const [campeon, setCampeon] = useState(null);

  // Cargar usuario guardado
  useEffect(() => {
    const userStorage = localStorage.getItem('torneo_usuario');
    if (userStorage) {
      const userData = JSON.parse(userStorage);
      setUsuario(userData);
      if (userData.inscrito) {
        setRonda('clasificacion');
      } else {
        setRonda('registroTorneo');
        if (userData.nombre) setMostrandoPago(true);
      }
    }
  }, []);

  const registrarUsuario = (nombre, especialidad, avatar) => {
    const nuevoUsuario = {
      id: Date.now(),
      nombre,
      especialidad,
      avatar,
      email: `${nombre.replace(/\s/g, '').toLowerCase()}@torneo.com`,
      inscrito: false,
      duelosGanados: 0,
      duelosPerdidos: 0
    };
    localStorage.setItem('torneo_usuario', JSON.stringify(nuevoUsuario));
    setUsuario(nuevoUsuario);
    setMostrandoPago(true);
    alert("✅ Usuario registrado correctamente");
  };

  const pagarInscripcion = () => {
    if (!usuario) {
      alert("❌ No hay usuario registrado");
      return;
    }
    if (saldo < torneoActivo?.costoInscripcion) {
      alert(`❌ Saldo insuficiente. Necesitas $${torneoActivo?.costoInscripcion} MXN.`);
      setMostrarModalRecarga(true);
      return;
    }
    setTimeout(() => {
      const exito = realizarPago(torneoActivo.costoInscripcion, `Inscripción al torneo ${torneoActivo.nombre}`);
      if (exito) {
        usuario.inscrito = true;
        localStorage.setItem('torneo_usuario', JSON.stringify(usuario));
        setRonda("clasificacion");
        setMostrandoPago(false);
        alert("✅ Inscripción pagada. ¡Buena suerte!");
      } else {
        alert("❌ Error al procesar el pago");
      }
    }, 500);
  };

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
      localStorage.setItem('torneo_rival_temporal', JSON.stringify(rivalAleatorio));
      setRonda("duelo");
    }, 2000);
  };

  const handleGuardarTorneo = (formData, editando) => {
    guardarTorneo(formData, editando);
    alert(`✅ Torneo "${formData.nombre}" guardado correctamente`);
  };

  const handleEliminarTorneo = (id) => {
    if (window.confirm('¿Eliminar este torneo permanentemente? Esta acción no se puede deshacer.')) {
      eliminarTorneo(id);
      alert('✅ Torneo eliminado');
    }
  };

  const handleActivarTorneo = (torneo) => {
    activarTorneo(torneo);
    alert(`✅ Torneo "${torneo.nombre}" activado`);
  };

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

  const handleFinalizarGrupos = (clasificados, puntos, afavor, encontra) => {
    setClasificadosGrupos(clasificados);
    setPuntosGrupo(puntos);
    setArgumentosFavor(afavor);
    setArgumentosContra(encontra);
    setRonda("eliminatorias");
  };

  const handleFinalizarTorneo = (ganador) => {
    setCampeon(ganador);
    setRonda("campeon");
  };

  // Botón flotante de administrador (visible en todas las pantallas excepto admin panel y login)
  const mostrarBotonAdmin = !showAdminLogin && !showAdminPanel && ronda !== 'campeon';

  // Componente de botón flotante
  const BotonAdminFlotante = () => {
    if (!mostrarBotonAdmin) return null;
    return (
      <button
        onClick={() => setShowAdminLogin(true)}
        className="fixed bottom-4 right-4 bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-600 transition z-50"
        title="Panel de Administración"
      >
        <span className="text-xl">⚙️</span>
      </button>
    );
  };

  // Modal de login admin
  if (showAdminLogin) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-sm w-full p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Acceso Administrador</h2>
          <input
            type="password"
            placeholder="Contraseña"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="w-full p-3 border rounded-xl mb-3"
            onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
          />
          {adminError && <p className="text-red-500 text-sm mb-3">{adminError}</p>}
          <div className="flex gap-3">
            <button onClick={() => setShowAdminLogin(false)} className="flex-1 bg-gray-200 py-2 rounded-xl">
              Cancelar
            </button>
            <button onClick={handleAdminLogin} className="flex-1 bg-amber-500 text-white py-2 rounded-xl">
              Entrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Panel de administración
  if (showAdminPanel && modoAdmin) {
    return (
      <>
        <AdminPanel
          torneos={torneos}
          torneoActivo={torneoActivo}
          onGuardarTorneo={handleGuardarTorneo}
          onEliminarTorneo={handleEliminarTorneo}
          onActivarTorneo={handleActivarTorneo}
          onCerrar={() => setShowAdminPanel(false)}
          librosDisponibles={librosDisponibles}
        />
        <BotonAdminFlotante />
      </>
    );
  }

  // Fase de registro
  if (ronda === 'registroTorneo') {
    return (
      <>
        {mostrarModalRecarga && (
          <ModalRecarga saldo={saldo} onRecargar={recargarSaldo} onClose={() => setMostrarModalRecarga(false)} />
        )}
        {mostrarModalHistorial && (
          <ModalHistorial transacciones={transacciones} onClose={() => setMostrarModalHistorial(false)} />
        )}
        <RegistroPhase
          torneoActivo={torneoActivo}
          onRegistrar={registrarUsuario}
          onPagar={pagarInscripcion}
          onCancelar={() => {
            setMostrandoPago(false);
            setRonda("registroTorneo");
          }}
          mostrandoPago={mostrandoPago}
          usuarioExistente={usuario}
          saldo={saldo}
        />
        <BotonAdminFlotante />
      </>
    );
  }

  // Fase de clasificación
  if (ronda === 'clasificacion') {
    return (
      <>
        <div className="flex justify-end p-4">
          <Billetera
            saldo={saldo}
            usuario={usuario}
            onRecargar={() => setMostrarModalRecarga(true)}
            onVerHistorial={() => setMostrarModalHistorial(true)}
            onAdminClick={() => setShowAdminLogin(true)}
            modoAdmin={modoAdmin}
            onToggleAdminPanel={() => setShowAdminPanel(!showAdminPanel)}
            mostrarAdmin={true}
          />
        </div>
        {mostrarModalRecarga && (
          <ModalRecarga saldo={saldo} onRecargar={recargarSaldo} onClose={() => setMostrarModalRecarga(false)} />
        )}
        {mostrarModalHistorial && (
          <ModalHistorial transacciones={transacciones} onClose={() => setMostrarModalHistorial(false)} />
        )}
        <ClasificacionPhase
          torneoActivo={torneoActivo}
          usuario={usuario}
          victorias={victorias}
          derrotas={derrotas}
          onBuscarRival={iniciarBusquedaRival}
          cargando={buscandoRival}
        />
        <BotonAdminFlotante />
      </>
    );
  }

  // Duelo (fase intermedia)
  if (ronda === 'duelo') {
    setTimeout(() => {
      const nuevasVictorias = victorias + 1;
      setVictorias(nuevasVictorias);
      localStorage.removeItem('torneo_rival_temporal');
      if (nuevasVictorias >= 3) {
        setRonda("grupos");
      } else {
        setRonda("clasificacion");
      }
    }, 3000);
    
    return (
      <>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold">⚖️ DUELO EN CURSO ⚖️</h2>
            <p className="text-gray-600 mt-2">Procesando resultados del duelo...</p>
          </div>
        </div>
        <BotonAdminFlotante />
      </>
    );
  }

  // Fase de grupos
  if (ronda === 'grupos') {
    return (
      <>
        <div className="flex justify-end p-4">
          <Billetera
            saldo={saldo}
            usuario={usuario}
            onRecargar={() => setMostrarModalRecarga(true)}
            onVerHistorial={() => setMostrarModalHistorial(true)}
            onAdminClick={() => setShowAdminLogin(true)}
            modoAdmin={modoAdmin}
            onToggleAdminPanel={() => setShowAdminPanel(!showAdminPanel)}
            mostrarAdmin={true}
          />
        </div>
        <GruposPhase
          torneoActivo={torneoActivo}
          usuario={usuario}
          onFinalizarGrupos={handleFinalizarGrupos}
        />
        <BotonAdminFlotante />
      </>
    );
  }

  // Fase eliminatorias
  if (ronda === 'eliminatorias') {
    return (
      <>
        <div className="flex justify-end p-4">
          <Billetera
            saldo={saldo}
            usuario={usuario}
            onRecargar={() => setMostrarModalRecarga(true)}
            onVerHistorial={() => setMostrarModalHistorial(true)}
            onAdminClick={() => setShowAdminLogin(true)}
            modoAdmin={modoAdmin}
            onToggleAdminPanel={() => setShowAdminPanel(!showAdminPanel)}
            mostrarAdmin={true}
          />
        </div>
        <EliminatoriasPhase
          torneoActivo={torneoActivo}
          usuario={usuario}
          clasificados={clasificadosGrupos}
          puntosGrupo={puntosGrupo}
          argumentosFavor={argumentosFavor}
          argumentosContra={argumentosContra}
          onFinalizarTorneo={handleFinalizarTorneo}
        />
        <BotonAdminFlotante />
      </>
    );
  }

  // Pantalla de campeón
  if (ronda === 'campeon' && campeon) {
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
          {torneoActivo?.premio?.tipo !== "libro" && premioMonto > 0 && (
            <div className="bg-green-100 rounded-xl p-4 my-4">
              <p className="text-2xl font-bold text-green-700">💰 ${premioMonto.toLocaleString()} MXN</p>
              <p className="text-sm text-green-600">Premio en efectivo</p>
            </div>
          )}
          {premioDescripcion && torneoActivo?.premio?.tipo !== "dinero" && (
            <div className="bg-blue-100 rounded-xl p-4 my-4">
              <p className="text-xl font-bold text-blue-700">📚 {premioDescripcion}</p>
              <p className="text-sm text-blue-600">Premio académico</p>
            </div>
          )}
          <button onClick={() => window.location.reload()} className="mt-6 bg-blue-500 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition">
            Salir
          </button>
        </div>
      </div>
    );
  }

  // Eliminado
  if (ronda === 'eliminado') {
    const costoReinscripcion = torneoActivo?.costoInscripcion || 10;
    
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 text-center max-w-md">
            <span className="text-6xl">⚖️💀</span>
            <h1 className="text-3xl font-bold text-red-600 mt-4">ELIMINADO DEL TORNEO</h1>
            <p className="text-gray-600 mt-2">{usuario?.nombre || "Litigante"}, no lograste avanzar en el torneo</p>
            <div className="p-4 bg-gray-100 rounded-lg mt-4">
              <p>Victorias: {victorias} | Derrotas: {derrotas}</p>
            </div>
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <p className="font-bold text-red-700">Debes pagar nuevamente la inscripción para volver a participar</p>
              <p className="text-2xl font-bold text-red-600 mt-2">${costoReinscripcion} MXN</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => window.location.reload()} className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-bold hover:bg-gray-600 transition">
                Salir
              </button>
              <button
                onClick={() => {
                  if (usuario) {
                    usuario.inscrito = false;
                    localStorage.setItem('torneo_usuario', JSON.stringify(usuario));
                    setVictorias(0);
                    setDerrotas(0);
                    setRonda("registroTorneo");
                    setMostrandoPago(true);
                  }
                }}
                className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition"
              >
                Pagar ${costoReinscripcion} y Reintentar
              </button>
            </div>
          </div>
        </div>
        <BotonAdminFlotante />
      </>
    );
  }

  return null;
};

export default Torneos;