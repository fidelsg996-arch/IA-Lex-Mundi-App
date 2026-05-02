import { useState, useEffect } from 'react';
import { obtenerTodasSolicitudes, actualizarEstadoSolicitud } from '../../services/retiroService';

const SolicitudesRetiro = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    const data = await obtenerTodasSolicitudes();
    setSolicitudes(data);
    setCargando(false);
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    await actualizarEstadoSolicitud(id, nuevoEstado);
    await cargarSolicitudes();
  };

  if (cargando) return <div className="text-center p-8">Cargando...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">💰 Solicitudes de Retiro</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-xl shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Usuario</th>
              <th className="p-3 text-left">Monto</th>
              <th className="p-3 text-left">CLABE</th>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((sol) => (
              <tr key={sol.id} className="border-t">
                <td className="p-3">{sol.usuarioNombre}</td>
                <td className="p-3 font-bold">${sol.monto?.toLocaleString()}</td>
                <td className="p-3 font-mono text-sm">{sol.clabe}</td>
                <td className="p-3 text-sm">{new Date(sol.fecha?.toDate()).toLocaleDateString()}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    sol.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    sol.estado === 'aprobado' ? 'bg-green-100 text-green-800' :
                    sol.estado === 'rechazado' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {sol.estado}
                  </span>
                </td>
                <td className="p-3">
                  {sol.estado === 'pendiente' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => cambiarEstado(sol.id, 'aprobado')}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => cambiarEstado(sol.id, 'rechazado')}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SolicitudesRetiro;