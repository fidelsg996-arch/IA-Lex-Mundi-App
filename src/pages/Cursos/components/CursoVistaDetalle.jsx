// src/pages/Cursos/components/CursoVistaDetalle.jsx
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import CursoExamenParcial from './CursoExamenParcial';
import CursoExamenFinal from './CursoExamenFinal';
import CertificadoGenerator from './CertificadoGenerator';

const CursoVistaDetalle = ({ curso, idDocumento, onVolver }) => {
  const { user } = useAuth();
  const [inscrito, setInscrito] = useState(false);
  const [moduloSeleccionado, setModuloSeleccionado] = useState(0);
  const [leccionSeleccionada, setLeccionSeleccionada] = useState(0);
  const [leccionesCompletadas, setLeccionesCompletadas] = useState([]);
  const [progreso, setProgreso] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [examenActivo, setExamenActivo] = useState(null);
  const [examenFinalActivo, setExamenFinalActivo] = useState(false);
  const [examenFinalCompletado, setExamenFinalCompletado] = useState(false);
  const [examenCompletado, setExamenCompletado] = useState({});

  const totalLecciones = useMemo(() => {
    if (!curso?.modulos) return 0;
    return curso.modulos.reduce((total, mod) => total + (mod.leccionesLista?.length || mod.lecciones?.length || 0), 0);
  }, [curso]);

  useEffect(() => {
    if (user) {
      verificarInscripcion();
      cargarProgreso();
    } else {
      setCargando(false);
    }
  }, [user]);

  useEffect(() => {
    if (curso && inscrito) {
      verificarModuloCompletado(moduloSeleccionado);
    }
  }, [leccionesCompletadas, moduloSeleccionado]);

  useEffect(() => {
    if (curso && inscrito && !examenFinalCompletado && !examenFinalActivo && totalLecciones > 0) {
      const todosModulosCompletados = curso.modulos?.every((_, idx) => examenCompletado[idx]);
      const todasLeccionesCompletadas = leccionesCompletadas.length === totalLecciones;
      if (todosModulosCompletados && todasLeccionesCompletadas) {
        setExamenFinalActivo(true);
      }
    }
  }, [curso, inscrito, examenCompletado, leccionesCompletadas]);

  const verificarInscripcion = async () => {
    try {
      const userRef = doc(db, 'usuarios', user.uid);
      const userDoc = await getDoc(userRef);
      const misCursos = userDoc.data()?.misCursos || [];
      const estaInscrito = misCursos.some(c => c.id === idDocumento);
      setInscrito(estaInscrito);
    } catch (error) {
      console.error('Error:', error);
    }
    setCargando(false);
  };

  const cargarProgreso = async () => {
    try {
      const progresoRef = doc(db, 'progreso_cursos', `${user.uid}_${idDocumento}`);
      const progresoDoc = await getDoc(progresoRef);
      if (progresoDoc.exists()) {
        const data = progresoDoc.data();
        setLeccionesCompletadas(data.leccionesCompletadas || []);
        setProgreso(data.progreso || 0);
        setExamenCompletado(data.examenesCompletados || {});
        setExamenFinalCompletado(data.examenFinalCompletado || false);
      }
    } catch (error) {
      console.error('Error cargando progreso:', error);
    }
  };

  const guardarProgreso = async (nuevasCompletadas, nuevoProgreso, examenesCompletados = null, examenFinal = null) => {
    try {
      const progresoRef = doc(db, 'progreso_cursos', `${user.uid}_${idDocumento}`);
      const data = {
        leccionesCompletadas: nuevasCompletadas,
        progreso: nuevoProgreso,
        ultimoAcceso: new Date().toISOString()
      };
      if (examenesCompletados) data.examenesCompletados = examenesCompletados;
      if (examenFinal !== undefined) data.examenFinalCompletado = examenFinal;
      await updateDoc(progresoRef, data);
    } catch (error) {
      console.error('Error guardando progreso:', error);
    }
  };

  const inscribirse = async () => {
    if (!user) {
      alert('Debes iniciar sesión');
      return;
    }
    try {
      const userRef = doc(db, 'usuarios', user.uid);
      await updateDoc(userRef, {
        misCursos: arrayUnion({
          id: idDocumento,
          titulo: curso?.titulo,
          fechaInscripcion: new Date().toISOString(),
          progreso: 0
        })
      });
      setInscrito(true);
      alert('✅ Te has inscrito correctamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al inscribirte');
    }
  };

  const cancelarInscripcion = async () => {
    if (!window.confirm('¿Cancelar inscripción?')) return;
    try {
      const userRef = doc(db, 'usuarios', user.uid);
      const userDoc = await getDoc(userRef);
      const misCursos = userDoc.data()?.misCursos || [];
      const cursoAEliminar = misCursos.find(c => c.id === idDocumento);
      if (cursoAEliminar) {
        await updateDoc(userRef, {
          misCursos: arrayRemove(cursoAEliminar)
        });
      }
      setInscrito(false);
      alert('❌ Inscripción cancelada');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const marcarLeccion = async (moduloIdx, leccionIdx, leccionId) => {
    const leccionKey = `${moduloIdx}_${leccionId || leccionIdx}`;
    let nuevasCompletadas = [...leccionesCompletadas];
    if (nuevasCompletadas.includes(leccionKey)) {
      nuevasCompletadas = nuevasCompletadas.filter(id => id !== leccionKey);
    } else {
      nuevasCompletadas.push(leccionKey);
    }
    const nuevoProgreso = totalLecciones > 0 ? (nuevasCompletadas.length / totalLecciones) * 100 : 0;
    setLeccionesCompletadas(nuevasCompletadas);
    setProgreso(nuevoProgreso);
    await guardarProgreso(nuevasCompletadas, nuevoProgreso);
  };

  const verificarModuloCompletado = (moduloIdx) => {
    const modulo = curso.modulos[moduloIdx];
    const totalLeccionesModulo = modulo.leccionesLista?.length || modulo.lecciones?.length || 0;
    const leccionesCompletadasModulo = leccionesCompletadas.filter(lc => lc.startsWith(`${moduloIdx}_`)).length;
    if (totalLeccionesModulo > 0 && leccionesCompletadasModulo === totalLeccionesModulo && !examenCompletado[moduloIdx]) {
      setExamenActivo(moduloIdx);
    }
  };

  const obtenerLecciones = () => {
    if (!curso?.modulos) return [];
    const modulo = curso.modulos[moduloSeleccionado];
    return modulo?.leccionesLista || modulo?.lecciones || [];
  };

  const lecciones = obtenerLecciones();
  const leccionActual = lecciones[leccionSeleccionada];

  if (cargando) return <div className="text-center py-20">Cargando...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header del curso */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-6 text-white mb-6">
        <h1 className="text-3xl font-bold">{curso.titulo}</h1>
        {curso.subtitulo && <p className="text-blue-200 mt-1">{curso.subtitulo}</p>}
        <div className="flex flex-wrap gap-4 mt-4">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">⏱️ {curso.duracion || 'N/E'}</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">📊 {curso.nivel || 'Intermedio'}</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
            {curso.esGratis || curso.precio === 0 ? '🎁 GRATIS' : `💰 $${curso.precio} MXN`}
          </span>
          {inscrito && (
            <span className="bg-green-500 px-3 py-1 rounded-full text-sm">✅ Inscrito - {Math.round(progreso)}% completado</span>
          )}
        </div>
        <p className="mt-4 text-blue-100">{curso.descripcion}</p>
        
        {!inscrito && (curso.esGratis || curso.precio === 0) && (
          <button onClick={inscribirse} className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition">
            📝 Inscribirme Gratis
          </button>
        )}
      </div>

      {inscrito ? (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 bg-white rounded-xl shadow-md p-4 h-fit sticky top-4">
            <h2 className="font-bold text-lg mb-3">📚 Contenido del curso</h2>
            <div className="space-y-2">
              {curso.modulos?.map((modulo, idx) => {
                const totalLeccionesModulo = modulo.leccionesLista?.length || modulo.lecciones?.length || 0;
                const completadas = leccionesCompletadas.filter(lc => lc.startsWith(`${idx}_`)).length;
                const moduloCompletado = totalLeccionesModulo > 0 && completadas === totalLeccionesModulo;
                const examenAprobado = examenCompletado[idx];
                
                return (
                  <div key={idx} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => { setModuloSeleccionado(idx); setLeccionSeleccionada(0); }}
                      className={`w-full text-left px-3 py-2 font-semibold flex justify-between ${moduloSeleccionado === idx ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                    >
                      <span>{modulo.titulo}</span>
                      <span>
                        {moduloCompletado && examenAprobado && '✅'}
                        {moduloCompletado && !examenAprobado && '📝'}
                      </span>
                    </button>
                    {moduloSeleccionado === idx && (
                      <div className="divide-y">
                        {(modulo.leccionesLista || modulo.lecciones || []).map((lec, lecIdx) => {
                          const completada = leccionesCompletadas.includes(`${idx}_${lec.id || lecIdx}`);
                          return (
                            <button key={lecIdx} onClick={() => setLeccionSeleccionada(lecIdx)} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${leccionSeleccionada === lecIdx ? 'bg-blue-50 text-blue-700' : ''}`}>
                              <span>{completada ? '✅' : '📖'}</span>
                              <span className={completada ? 'line-through text-gray-400' : ''}>{lec.titulo}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm mb-1">
                <span>Progreso</span><span>{Math.round(progreso)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progreso}%` }} />
              </div>
              <button onClick={cancelarInscripcion} className="mt-3 text-red-500 text-sm w-full text-center hover:text-red-700">Cancelar inscripción</button>
              {examenFinalCompletado && <CertificadoGenerator curso={curso} usuario={user} />}
            </div>
          </div>

          {/* Contenido */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
            {leccionActual ? (
              <>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{leccionActual.titulo}</h2>
                  <button onClick={() => marcarLeccion(moduloSeleccionado, leccionSeleccionada, leccionActual.id || leccionSeleccionada)} className={`px-4 py-2 rounded-lg ${leccionesCompletadas.includes(`${moduloSeleccionado}_${leccionActual.id || leccionSeleccionada}`) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    {leccionesCompletadas.includes(`${moduloSeleccionado}_${leccionActual.id || leccionSeleccionada}`) ? '✅ Completada' : '📌 Marcar'}
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="whitespace-pre-wrap">{leccionActual.contenido}</p>
                </div>
                {leccionActual.ejemplo && <div className="bg-blue-50 p-4 rounded-lg mb-4"><strong>💡 Ejemplo:</strong> {leccionActual.ejemplo}</div>}
                {leccionActual.caso && <div className="bg-amber-50 p-4 rounded-lg mb-4"><strong>⚖️ Caso:</strong> {leccionActual.caso}</div>}
                {leccionActual.video && (
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe src={leccionActual.video.replace('watch?v=', 'embed/')} className="w-full h-full" allowFullScreen title={leccionActual.titulo} />
                  </div>
                )}
                <div className="flex justify-between mt-6 pt-4 border-t">
                  <button onClick={() => { if (leccionSeleccionada > 0) setLeccionSeleccionada(leccionSeleccionada - 1); else if (moduloSeleccionado > 0) { setModuloSeleccionado(moduloSeleccionado - 1); setLeccionSeleccionada(0); } }} className="px-4 py-2 bg-gray-200 rounded-lg">← Anterior</button>
                  <button onClick={() => { if (leccionSeleccionada < lecciones.length - 1) setLeccionSeleccionada(leccionSeleccionada + 1); else if (moduloSeleccionado < curso.modulos.length - 1) { setModuloSeleccionado(moduloSeleccionado + 1); setLeccionSeleccionada(0); } }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Siguiente →</button>
                </div>
              </>
            ) : (
              <p className="text-center py-12 text-gray-500">Selecciona una lección para comenzar</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-600">Inscríbete para acceder al contenido del curso</p>
        </div>
      )}

      <button onClick={onVolver} className="mt-6 bg-gray-200 px-4 py-2 rounded-lg">← Volver a cursos</button>

      {/* Modales de examen */}
      {examenActivo !== null && (
        <CursoExamenParcial 
          modulo={examenActivo} 
          curso={curso} 
          onClose={() => setExamenActivo(null)} 
          onAprobar={() => {
            const nuevosExamenes = { ...examenCompletado, [examenActivo]: true };
            setExamenCompletado(nuevosExamenes);
            guardarProgreso(leccionesCompletadas, progreso, nuevosExamenes);
            setExamenActivo(null);
          }} 
        />
      )}

      {examenFinalActivo && (
        <CursoExamenFinal 
          curso={curso} 
          onClose={() => setExamenFinalActivo(false)} 
          onCompletar={() => {
            setExamenFinalCompletado(true);
            setExamenFinalActivo(false);
            guardarProgreso(leccionesCompletadas, progreso, examenCompletado, true);
          }} 
        />
      )}
    </div>
  );
};

export default CursoVistaDetalle;