// src/pages/Legislacion.jsx
import React, { useState } from 'react';

const Legislacion = () => {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
  const [categoriaJurisprudencia, setCategoriaJurisprudencia] = useState('');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [jurisprudencias, setJurisprudencias] = useState([]);
  const [buscandoJurisprudencia, setBuscandoJurisprudencia] = useState(false);
  const [leyesFiltradas, setLeyesFiltradas] = useState([]);
  const [categoriaFederal, setCategoriaFederal] = useState('todas');
  const [busquedaLey, setBusquedaLey] = useState('');

  // Lista de los 32 estados
  const estados = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua',
    'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Estado de México', 'Guanajuato', 'Guerrero',
    'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla',
    'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas',
    'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
  ];

  // Leyes Federales
  const leyesFederales = [
    { nombre: 'Constitución Política de los Estados Unidos Mexicanos', categoria: 'Constitución', url: '#' },
    { nombre: 'Código Civil Federal', categoria: 'Código Civil', url: '#' },
    { nombre: 'Código Penal Federal', categoria: 'Código Penal', url: '#' },
    { nombre: 'Código de Comercio', categoria: 'Ley Mercantil', url: '#' },
    { nombre: 'Código Fiscal de la Federación', categoria: 'Ley Fiscal', url: '#' },
    { nombre: 'Código Nacional de Procedimientos Penales', categoria: 'Código de Procedimientos Penales', url: '#' },
    { nombre: 'Código Federal de Procedimientos Civiles', categoria: 'Código de Procedimientos Civiles', url: '#' },
    { nombre: 'Código Federal de Procedimientos Penales (abrogado referencia)', categoria: 'Código de Procedimientos Penales', url: '#' },
    { nombre: 'Ley Federal del Trabajo', categoria: 'Ley Laboral', url: '#' },
    { nombre: 'Ley del Seguro Social', categoria: 'Ley Laboral', url: '#' },
    { nombre: 'Ley del Instituto del Fondo Nacional de la Vivienda para los Trabajadores (INFONAVIT)', categoria: 'Ley Laboral', url: '#' },
    { nombre: 'Ley Federal de los Trabajadores al Servicio del Estado', categoria: 'Ley Laboral', url: '#' },
    { nombre: 'Ley de Amparo', categoria: 'Ley Administrativa', url: '#' },
    { nombre: 'Ley Federal de Procedimiento Administrativo', categoria: 'Ley Administrativa', url: '#' },
    { nombre: 'Ley Orgánica de la Administración Pública Federal', categoria: 'Ley Administrativa', url: '#' },
    { nombre: 'Ley Federal de Responsabilidades Administrativas de los Servidores Públicos', categoria: 'Ley Administrativa', url: '#' },
    { nombre: 'Ley General de Responsabilidades Administrativas', categoria: 'Ley Administrativa', url: '#' },
    { nombre: 'Ley Federal de Transparencia y Acceso a la Información Pública', categoria: 'Ley Administrativa', url: '#' },
    { nombre: 'Ley General de Transparencia y Acceso a la Información Pública', categoria: 'Ley Administrativa', url: '#' },
    { nombre: 'Ley Federal de Procedimiento Contencioso Administrativo', categoria: 'Ley Administrativa', url: '#' },
    { nombre: 'Ley del Impuesto sobre la Renta (ISR)', categoria: 'Ley Fiscal', url: '#' },
    { nombre: 'Ley del Impuesto al Valor Agregado (IVA)', categoria: 'Ley Fiscal', url: '#' },
    { nombre: 'Ley del Impuesto Especial sobre Producción y Servicios (IEPS)', categoria: 'Ley Fiscal', url: '#' },
    { nombre: 'Ley de Coordinación Fiscal', categoria: 'Ley Fiscal', url: '#' },
    { nombre: 'Ley Federal de Derechos', categoria: 'Ley Fiscal', url: '#' },
    { nombre: 'Ley General de Sociedades Mercantiles', categoria: 'Ley Mercantil', url: '#' },
    { nombre: 'Ley de Instituciones de Crédito', categoria: 'Ley Mercantil', url: '#' },
    { nombre: 'Ley General de Títulos y Operaciones de Crédito', categoria: 'Ley Mercantil', url: '#' },
    { nombre: 'Ley de Concursos Mercantiles', categoria: 'Ley Mercantil', url: '#' },
    { nombre: 'Ley Federal de Protección al Consumidor', categoria: 'Ley Mercantil', url: '#' },
    { nombre: 'Ley Federal de Competencia Económica', categoria: 'Ley Mercantil', url: '#' },
    { nombre: 'Ley General de Salud', categoria: 'Otras leyes', url: '#' },
    { nombre: 'Ley General de los Derechos de Niñas, Niños y Adolescentes', categoria: 'Ley Familiar', url: '#' },
    { nombre: 'Ley General para la Igualdad entre Mujeres y Hombres', categoria: 'Ley Familiar', url: '#' },
    { nombre: 'Ley General de Acceso de las Mujeres a una Vida Libre de Violencia', categoria: 'Ley Familiar', url: '#' },
    { nombre: 'Ley de la Comisión Nacional de los Derechos Humanos', categoria: 'Ley Administrativa', url: '#' },
    { nombre: 'Ley General de Víctimas', categoria: 'Otras leyes', url: '#' },
    { nombre: 'Ley General del Sistema Nacional de Seguridad Pública', categoria: 'Ley Administrativa', url: '#' },
    { nombre: 'Ley Agraria', categoria: 'Otras leyes', url: '#' },
    { nombre: 'Ley General del Equilibrio Ecológico y la Protección al Ambiente (LGEEPA)', categoria: 'Otras leyes', url: '#' },
    { nombre: 'Ley de Aguas Nacionales', categoria: 'Otras leyes', url: '#' },
    { nombre: 'Reglamento del Código Fiscal de la Federación', categoria: 'Reglamentos', url: '#' },
    { nombre: 'Reglamento de la Ley del Seguro Social', categoria: 'Reglamentos', url: '#' },
    { nombre: 'Reglamento Interior del Servicio de Administración Tributaria', categoria: 'Reglamentos', url: '#' },
  ];

  // Categorías para jurisprudencia
  const categoriasJurisprudencia = [
    'Todas las categorías',
    'Laboral',
    'Civil',
    'Penal',
    'Mercantil',
    'Familiar',
    'Administrativo',
    'Constitucional',
    'Fiscal',
    'Amparo',
    'Derechos Humanos',
  ];

  // Simulación de búsqueda de jurisprudencia
  const buscarJurisprudencia = () => {
    if (!terminoBusqueda.trim()) {
      alert('Por favor, ingresa un término de búsqueda.');
      return;
    }

    setBuscandoJurisprudencia(true);
    setTimeout(() => {
      const resultados = generarJurisprudencias(terminoBusqueda, categoriaJurisprudencia);
      setJurisprudencias(resultados);
      setBuscandoJurisprudencia(false);
    }, 1500);
  };

  const generarJurisprudencias = (termino, categoria) => {
    const jurisprudenciasSimuladas = [
      {
        id: 1,
        titulo: `Jurisprudencia sobre ${termino} en materia ${categoria || 'laboral'}`,
        rubro: `${termino.toUpperCase()}. PROCEDENCIA DEL AMPARO`,
        texto: `El artículo 123 constitucional establece que... ${termino} debe ser interpretado de manera favorable al trabajador. La Suprema Corte de Justicia de la Nación determina que cuando exista duda en la aplicación de la ley, se debe favorecer la protección más amplia al trabajador.`,
        fuente: 'Novena Época, Semanario Judicial de la Federación',
        tesis: `2a./J. ${Math.floor(Math.random() * 200)}/${Math.floor(Math.random() * 1000)}`,
        fecha: `${Math.floor(Math.random() * 20) + 2000}`,
        materia: categoria || 'Laboral',
      },
      {
        id: 2,
        titulo: `Reiteración de criterio sobre ${termino}`,
        rubro: `${termino.toUpperCase()}. SUPLENCIA DE LA QUEJA`,
        texto: `La suplencia de la queja opera en favor del trabajador cuando existe deficiencia en la expresión de agravios o conceptos de violación. El órgano jurisdiccional debe suplir las deficiencias para proteger el interés del trabajador.`,
        fuente: 'Décima Época, Gaceta del Semanario Judicial',
        tesis: `1a./J. ${Math.floor(Math.random() * 100)}/${Math.floor(Math.random() * 500)}`,
        fecha: `${Math.floor(Math.random() * 20) + 2010}`,
        materia: categoria || 'Laboral',
      },
      {
        id: 3,
        titulo: `Aplicación de ${termino} en casos análogos`,
        rubro: `${termino.toUpperCase()}. INTERPRETACIÓN CONFORME`,
        texto: `Los jueces deben interpretar las normas de manera conforme a la Constitución y a los tratados internacionales en materia de derechos humanos. ${termino} debe aplicarse bajo el principio pro persona.`,
        fuente: 'Plenos de Circuito, Semanario Judicial',
        tesis: `PC.${Math.floor(Math.random() * 50)}.${categoria || 'L'}`,
        fecha: `${Math.floor(Math.random() * 10) + 2015}`,
        materia: categoria || 'Constitucional',
      },
    ];
    return jurisprudenciasSimuladas;
  };

  // Filtrar leyes por categoría y búsqueda
  React.useEffect(() => {
    let filtradas = [...leyesFederales];
    
    if (categoriaFederal !== 'todas') {
      filtradas = filtradas.filter(ley => ley.categoria === categoriaFederal);
    }
    
    if (busquedaLey) {
      filtradas = filtradas.filter(ley => 
        ley.nombre.toLowerCase().includes(busquedaLey.toLowerCase())
      );
    }
    
    setLeyesFiltradas(filtradas);
  }, [categoriaFederal, busquedaLey]);

  // Categorías para filtro
  const categoriasFiltro = ['todas', 'Constitución', 'Código Civil', 'Código Penal', 'Ley Mercantil', 
    'Ley Fiscal', 'Ley Laboral', 'Ley Administrativa', 'Ley Familiar', 'Reglamentos', 'Otras leyes'];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">📚 Legislación</h1>
      <p className="text-gray-600 mb-6">
        Leyes de los 32 estados + Federal y búsqueda de jurisprudencia
      </p>

      {/* Sección de Legislación por Estado */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📜 Leyes por Estado</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Seleccionar Estado</label>
          <select
            value={estadoSeleccionado}
            onChange={(e) => setEstadoSeleccionado(e.target.value)}
            className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Seleccionar estado</option>
            {estados.map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>

        {estadoSeleccionado && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-semibold mb-2">📌 Legislación de {estadoSeleccionado}</p>
            <p className="text-blue-700 text-sm">
              Se mostrarán aquí las leyes y códigos del estado de {estadoSeleccionado} (simulación).
              En la versión completa, se cargarían: Constitución Política del Estado, 
              Código Civil, Código Penal, Ley Orgánica Municipal, Ley de Justicia Administrativa, etc.
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                <span>Constitución Política del Estado de {estadoSeleccionado}</span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">Ver PDF →</button>
              </div>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                <span>Código Civil del Estado de {estadoSeleccionado}</span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">Ver PDF →</button>
              </div>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                <span>Código Penal del Estado de {estadoSeleccionado}</span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">Ver PDF →</button>
              </div>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                <span>Ley Orgánica Municipal del Estado de {estadoSeleccionado}</span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">Ver PDF →</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sección de Búsqueda de Jurisprudencia */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">⚖️ Búsqueda de Jurisprudencia</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Término de búsqueda</label>
            <input
              type="text"
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              placeholder="Ej: despido injustificado, amparo, responsabilidad civil..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Categoría</label>
            <select
              value={categoriaJurisprudencia}
              onChange={(e) => setCategoriaJurisprudencia(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {categoriasJurisprudencia.map((cat) => (
                <option key={cat} value={cat === 'Todas las categorías' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={buscarJurisprudencia}
          disabled={buscandoJurisprudencia}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {buscandoJurisprudencia ? 'Buscando jurisprudencias...' : '🔍 Buscar Jurisprudencia'}
        </button>

        {/* Resultados de jurisprudencia */}
        {jurisprudencias.length > 0 && (
          <div className="mt-6 space-y-4">
            <p className="text-gray-600 font-semibold">📌 {jurisprudencias.length} documento(s) encontrado(s)</p>
            {jurisprudencias.map((jur) => (
              <div key={jur.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-blue-800">{jur.titulo}</h3>
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{jur.materia}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Rubro: {jur.rubro}</p>
                <p className="text-gray-700 text-sm mb-3">{jur.texto}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <span>📖 Fuente: {jur.fuente}</span>
                  <span>📄 Tesis: {jur.tesis}</span>
                  <span>📅 Época: {jur.fecha}</span>
                </div>
                <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-semibold">
                  Ver tesis completa →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección de Legislación Federal */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-gray-800">🏛️ Legislación Federal</h2>
          <div className="flex gap-2">
            <select
              value={categoriaFederal}
              onChange={(e) => setCategoriaFederal(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categoriasFiltro.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'todas' ? 'Todas las categorías' : cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={busquedaLey}
              onChange={(e) => setBusquedaLey(e.target.value)}
              placeholder="Buscar ley..."
              className="p-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          {leyesFiltradas.length} documento(s) encontrado(s)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {leyesFiltradas.map((ley, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-50 transition rounded-lg">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{ley.nombre}</p>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-1 inline-block">
                  {ley.categoria}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold px-3 py-1">
                  Ver
                </button>
                <button className="text-green-600 hover:text-green-800 text-sm font-semibold px-3 py-1">
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>

        {leyesFiltradas.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron leyes con los criterios de búsqueda.
          </div>
        )}

        {/* Nota informativa */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800">
          <p className="font-semibold mb-1">⚠️ Información importante:</p>
          <p>
            Los documentos están en formato PDF para su consulta. Las leyes mostradas son simulaciones educativas.
            Para acceder a las versiones oficiales, visita los portales del DOF, Cámara de Diputados o los congresos estatales.
            Las jurisprudencias son ejemplos ilustrativos basados en criterios reales de la SCJN.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Legislacion;