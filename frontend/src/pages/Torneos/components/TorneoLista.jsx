import { useState, useEffect } from 'react';
import { getTorneos, crearTorneo } from '../services/torneoStorage';
import { toast } from './Toast';

const Button = ({ children, onClick }) => (
  <button onClick={onClick} className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600">
    {children}
  </button>
);

export default function TorneoLista({ user, onVerTorneo }) {
  const [torneos, setTorneos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [materia, setMateria] = useState('LABORAL');
  const [maxJugadores, setMaxJugadores] = useState(8);
  const [premio, setPremio] = useState('');
  const [creando, setCreando] = useState(false);

  const cargar = () => setTorneos(getTorneos());

  useEffect(() => {
    cargar();
  }, []);

  const handleCrear = () => {
    if (!nombre.trim()) return toast.error('Nombre requerido');
    setCreando(true);
    try {
      crearTorneo(nombre, materia, maxJugadores, premio, user?.email || 'admin@test.com', user?.name || 'Admin');
      toast.success('Torneo creado');
      setMostrarModal(false);
      setNombre('');
      setPremio('');
      cargar();
    } catch (error) {
      toast.error('Error');
    } finally {
      setCreando(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Torneos</h2>
        <Button onClick={() => setMostrarModal(true)}>Crear torneo</Button>
      </div>
      {torneos.length === 0 ? (
        <div className="text-center text-gray-500">No hay torneos</div>
      ) : (
        <div className="space-y-2">
          {torneos.map(t => (
            <div key={t.id} className="border p-3 rounded flex justify-between items-center">
              <div>
                <div className="font-bold">{t.nombre}</div>
                <div className="text-sm text-gray-500">{t.materia} · {t.max_jugadores} jugadores</div>
              </div>
              <Button onClick={() => onVerTorneo(t)}>Ver</Button>
            </div>
          ))}
        </div>
      )}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded w-96">
            <h3 className="text-xl mb-3">Crear torneo</h3>
            <input type="text" placeholder="Nombre" className="w-full border p-2 mb-2" value={nombre} onChange={e => setNombre(e.target.value)} />
            <select className="w-full border p-2 mb-2" value={materia} onChange={e => setMateria(e.target.value)}>
              <option>LABORAL</option><option>CIVIL</option><option>PENAL</option>
            </select>
            <select className="w-full border p-2 mb-2" value={maxJugadores} onChange={e => setMaxJugadores(Number(e.target.value))}>
              <option value={4}>4</option><option value={8}>8</option><option value={16}>16</option>
            </select>
            <input type="text" placeholder="Premio" className="w-full border p-2 mb-2" value={premio} onChange={e => setPremio(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={handleCrear} disabled={creando} className="bg-amber-500 text-white px-4 py-2 rounded flex-1">{creando ? 'Creando...' : 'Crear'}</button>
              <button onClick={() => setMostrarModal(false)} className="border px-4 py-2 rounded flex-1">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}