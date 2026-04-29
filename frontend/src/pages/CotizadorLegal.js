// src/pages/CotizadorLegal.jsx
import { useState, useEffect } from 'react';
import { usePersistencia } from '../hooks/usePersistencia';

// Catálogo base de servicios legales
const serviciosBase = [
  { id: 'consulta', nombre: 'Consulta jurídica inicial', tipo: 'fijo', valor: 2500, unidad: 'por sesión' },
  { id: 'contrato_simple', nombre: 'Redacción de contrato simple', tipo: 'fijo', valor: 3500, unidad: 'por documento' },
  { id: 'contrato_complejo', nombre: 'Redacción de contrato complejo', tipo: 'fijo', valor: 7500, unidad: 'por documento' },
  { id: 'demanda', nombre: 'Elaboración de demanda', tipo: 'fijo', valor: 8000, unidad: 'por pieza' },
  { id: 'contestacion', nombre: 'Contestación de demanda', tipo: 'fijo', valor: 7000, unidad: 'por pieza' },
  { id: 'audiencia', nombre: 'Representación en audiencia', tipo: 'hora', valor: 1500, unidad: 'por hora' },
  { id: 'gestion', nombre: 'Gestoría administrativa', tipo: 'hora', valor: 800, unidad: 'por hora' },
  { id: 'porcentaje_civil', nombre: 'Honorario por porcentaje (civil/mercantil)', tipo: 'porcentaje', valor: 10, unidad: '% del monto' },
  { id: 'porcentaje_laboral', nombre: 'Honorario por porcentaje (laboral)', tipo: 'porcentaje', valor: 15, unidad: '% del monto' }
];

// Materias judiciales con costos sugeridos
const materiasJudiciales = [
  { id: 'constitucional', nombre: 'Constitución y Garantías (Amparo)', costo: 12000 },
  { id: 'penal', nombre: 'Penal', costo: 15000 },
  { id: 'civil', nombre: 'Civil', costo: 10000 },
  { id: 'mercantil', nombre: 'Mercantil', costo: 11000 },
  { id: 'laboral', nombre: 'Laboral', costo: 9000 },
  { id: 'administrativo', nombre: 'Administrativo (Contencioso)', costo: 13000 },
  { id: 'familiar', nombre: 'Familiar', costo: 8500 },
  { id: 'agrario', nombre: 'Agrario', costo: 14000 }
];

// Gastos adicionales
const gastosComunes = [
  { id: 'copias', nombre: 'Copias certificadas', costo: 500 },
  { id: 'notificaciones', nombre: 'Notificaciones', costo: 800 },
  { id: 'peritajes', nombre: 'Peritajes', costo: 3500 },
  { id: 'viajes', nombre: 'Gastos de viaje', costo: 2000 }
];

const CotizadorLegal = () => {
  // Usar persistencia para el historial de cotizaciones
  const { datos: historialData, guardarDatos: guardarHistorial, cargando: cargandoHistorial } = usePersistencia('cotizador_historial', []);
  const { datos: despachoData, guardarDatos: guardarDespacho } = usePersistencia('cotizador_despacho', {
    nombre: '',
    cedula: '',
    direccion: '',
    email: '',
    telefono: '',
    regimen: 'Persona Física'
  });
  const { datos: clienteData, guardarDatos: guardarCliente } = usePersistencia('cotizador_cliente', {
    nombre: '',
    rfc: '',
    correo: '',
    telefono: '',
    direccion: ''
  });

  const [despacho, setDespacho] = useState({
    nombre: '',
    cedula: '',
    direccion: '',
    email: '',
    telefono: '',
    regimen: 'Persona Física'
  });
  const [cliente, setCliente] = useState({
    nombre: '',
    rfc: '',
    correo: '',
    telefono: '',
    direccion: ''
  });
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [montoCaso, setMontoCaso] = useState(0);
  const [gastosSeleccionados, setGastosSeleccionados] = useState([]);
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);
  const [incluirIVA, setIncluirIVA] = useState(true);
  const [notas, setNotas] = useState('');
  const [resultados, setResultados] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [filtroHistorial, setFiltroHistorial] = useState('');
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');

  // Sincronizar datos con Firestore
  useEffect(() => {
    if (despachoData && !cargandoHistorial) {
      setDespacho(despachoData);
    }
    if (clienteData && !cargandoHistorial) {
      setCliente(clienteData);
    }
    if (historialData && !cargandoHistorial) {
      setHistorial(historialData);
    }
  }, [despachoData, clienteData, historialData, cargandoHistorial]);

  // Guardar cambios en Firestore
  useEffect(() => {
    if (despacho.nombre || despacho.cedula) {
      guardarDespacho(despacho);
    }
  }, [despacho]);

  useEffect(() => {
    if (cliente.nombre || cliente.rfc) {
      guardarCliente(cliente);
    }
  }, [cliente]);

  const guardarEnHistorial = async (cotizacion) => {
    const nuevoHistorial = [cotizacion, ...historial].slice(0, 20);
    setHistorial(nuevoHistorial);
    await guardarHistorial(nuevoHistorial);
  };

  const calcularHonorarios = () => {
    let total = 0;
    const desgloseHonorarios = [];
    serviciosSeleccionados.forEach(serv => {
      const servicioBase = serviciosBase.find(s => s.id === serv.id);
      let monto = serv.precioPersonalizado || (servicioBase ? servicioBase.valor : 0);
      if (servicioBase && servicioBase.tipo === 'porcentaje') {
        monto = (servicioBase.valor / 100) * montoCaso;
      }
      const cantidad = serv.cantidad || 1;
      const totalItem = monto * cantidad;
      total += totalItem;
      desgloseHonorarios.push({
        id: serv.id,
        nombre: serv.nombre || (servicioBase ? servicioBase.nombre : 'Servicio'),
        cantidad,
        unitario: monto,
        monto: totalItem,
        detalle: servicioBase ? (servicioBase.tipo === 'hora' ? `${cantidad} hora(s) a $${monto}/hora` : 
                  servicioBase.tipo === 'porcentaje' ? `${servicioBase.valor}% sobre $${montoCaso.toFixed(2)}` : 'tarifa fija') : ''
      });
    });
    return { total, desglose: desgloseHonorarios };
  };

  const calcularGastos = () => {
    let total = 0;
    const desgloseGastos = [];
    gastosSeleccionados.forEach(gastoId => {
      const gasto = gastosComunes.find(g => g.id === gastoId);
      if (gasto) {
        total += gasto.costo;
        desgloseGastos.push({ nombre: gasto.nombre, monto: gasto.costo });
      }
    });
    return { total, desglose: desgloseGastos };
  };

  const recalcular = () => {
    const honorarios = calcularHonorarios();
    const gastos = calcularGastos();
    const subtotal = honorarios.total + gastos.total;
    const descuento = (descuentoPorcentaje / 100) * subtotal;
    const subtotalConDescuento = subtotal - descuento;
    const iva = incluirIVA ? subtotalConDescuento * 0.16 : 0;
    const total = subtotalConDescuento + iva;

    setResultados({
      honorarios: honorarios.total,
      desgloseHonorarios: honorarios.desglose,
      gastos: gastos.total,
      desgloseGastos: gastos.desglose,
      subtotal,
      descuento,
      subtotalConDescuento,
      iva,
      total,
      folio: `COT-${Date.now().toString().slice(-8)}`
    });
  };

  useEffect(() => {
    recalcular();
  }, [serviciosSeleccionados, montoCaso, gastosSeleccionados, descuentoPorcentaje, incluirIVA]);

  const toggleServicio = (servicioBase, cantidad = 1) => {
    const existe = serviciosSeleccionados.find(s => s.id === servicioBase.id);
    if (existe) {
      setServiciosSeleccionados(serviciosSeleccionados.filter(s => s.id !== servicioBase.id));
    } else {
      setServiciosSeleccionados([...serviciosSeleccionados, { 
        id: servicioBase.id, 
        nombre: servicioBase.nombre,
        tipo: servicioBase.tipo, 
        cantidad, 
        precioPersonalizado: servicioBase.valor 
      }]);
    }
  };

  const actualizarCantidadServicio = (id, cantidad) => {
    setServiciosSeleccionados(serviciosSeleccionados.map(s => s.id === id ? { ...s, cantidad: parseInt(cantidad) || 1 } : s));
  };

  const actualizarPrecioServicio = (id, nuevoPrecio) => {
    setServiciosSeleccionados(serviciosSeleccionados.map(s => s.id === id ? { ...s, precioPersonalizado: parseFloat(nuevoPrecio) || 0 } : s));
  };

  const agregarMateria = () => {
    if (!materiaSeleccionada) return;
    const materia = materiasJudiciales.find(m => m.id === materiaSeleccionada);
    if (!materia) return;
    const existe = serviciosSeleccionados.some(s => s.id === materia.id);
    if (!existe) {
      setServiciosSeleccionados([...serviciosSeleccionados, { 
        id: materia.id, 
        nombre: materia.nombre, 
        tipo: 'fijo', 
        cantidad: 1, 
        precioPersonalizado: materia.costo 
      }]);
    }
    setMateriaSeleccionada('');
  };

  const toggleGasto = (gastoId) => {
    if (gastosSeleccionados.includes(gastoId)) {
      setGastosSeleccionados(gastosSeleccionados.filter(g => g !== gastoId));
    } else {
      setGastosSeleccionados([...gastosSeleccionados, gastoId]);
    }
  };

  const generarFacturaPDF = () => {
    if (!resultados) return;
    const ventana = window.open('', '_blank');
    const fechaEmision = new Date().toLocaleString();
    const folio = resultados.folio;
    const qrPlaceholder = `https://verificar.lexmundi.com/cotizacion/${folio}`;
    const contenido = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Factura Digital - Cotización Legal</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Times New Roman', Times, serif;
            background: #e6e9ef;
            padding: 40px 20px;
          }
          .invoice {
            max-width: 1100px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 4px;
            overflow: hidden;
          }
          .header {
            background: #1a2a3a;
            color: white;
            padding: 20px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
          }
          .logo h1 { font-size: 28px; letter-spacing: 2px; margin-bottom: 5px; }
          .logo p { font-size: 12px; opacity: 0.8; }
          .folio { text-align: right; }
          .folio .label { font-size: 11px; opacity: 0.7; }
          .folio .number { font-size: 22px; font-weight: bold; letter-spacing: 1px; }
          .info-section {
            display: flex;
            padding: 20px 30px;
            border-bottom: 1px solid #ddd;
            background: #f9fafb;
          }
          .from, .to { flex: 1; }
          .from h3, .to h3 { font-size: 14px; color: #1a2a3a; margin-bottom: 8px; border-left: 3px solid #b8860b; padding-left: 8px; }
          .from p, .to p { font-size: 12px; line-height: 1.4; margin: 4px 0; color: #333; }
          .details {
            display: flex;
            justify-content: space-between;
            padding: 15px 30px;
            background: #fff;
            border-bottom: 1px solid #eee;
            font-size: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 30px;
            width: calc(100% - 60px);
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
            font-size: 12px;
          }
          th { background: #f2f2f2; font-weight: bold; }
          .totals {
            margin: 20px 30px 30px auto;
            width: 300px;
            text-align: right;
            border-top: 2px solid #ddd;
            padding-top: 15px;
          }
          .totals p { margin: 6px 0; font-size: 12px; }
          .totals .grand { font-size: 18px; font-weight: bold; color: #b8860b; }
          .footer {
            background: #f4f4f4;
            padding: 20px 30px;
            font-size: 10px;
            color: #555;
            border-top: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
          }
          .qr {
            text-align: center;
            width: 100px;
          }
          .qr-code {
            background: #fff;
            padding: 5px;
            border: 1px solid #ccc;
            display: inline-block;
          }
          .qr-code svg { width: 80px; height: 80px; }
          .terms { flex: 1; padding-right: 20px; }
          .acceptance { margin-top: 15px; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div class="logo">
              <h1>${despacho.nombre || 'Despacho Jurídico'}</h1>
              <p>${despacho.cedula ? `Céd. ${despacho.cedula}` : ''} | ${despacho.regimen || ''}</p>
              <p>${despacho.direccion || ''} | ${despacho.telefono || ''} | ${despacho.email || ''}</p>
            </div>
            <div class="folio">
              <div class="label">FOLIO / COTIZACIÓN</div>
              <div class="number">${folio}</div>
              <div style="font-size:10px; margin-top:5px;">Fecha: ${fechaEmision}</div>
            </div>
          </div>
          
          <div class="info-section">
            <div class="from">
              <h3>DESPACHO</h3>
              <p><strong>${despacho.nombre || 'IA Lex Mundi'}</strong></p>
              <p>Cédula: ${despacho.cedula || 'No especificada'}</p>
              <p>Dirección: ${despacho.direccion || 'No especificada'}</p>
              <p>Email: ${despacho.email || 'No especificado'}</p>
              <p>Teléfono: ${despacho.telefono || 'No especificado'}</p>
            </div>
            <div class="to">
              <h3>CLIENTE</h3>
              <p><strong>${cliente.nombre || 'No especificado'}</strong></p>
              <p>RFC: ${cliente.rfc || 'No especificado'}</p>
              <p>Dirección: ${cliente.direccion || 'No especificada'}</p>
              <p>Email: ${cliente.correo || 'No especificado'}</p>
              <p>Teléfono: ${cliente.telefono || 'No especificado'}</p>
            </div>
          </div>
          
          <div class="details">
            <span><strong>Forma de pago:</strong> Transferencia bancaria / Cheque certificado</span>
            <span><strong>Vigencia:</strong> 30 días naturales</span>
            <span><strong>Moneda:</strong> MXN</span>
          </div>
          
          <table>
            <thead>
              <tr><th>Cantidad</th><th>Concepto</th><th>Precio Unitario</th><th>Importe</th></tr>
            </thead>
            <tbody>
              ${resultados.desgloseHonorarios.map(h => `
                <tr>
                  <td>${h.cantidad}</td>
                  <td>${h.nombre}<br><small>${h.detalle}</small></td>
                  <td>$${h.unitario.toFixed(2)}</td>
                  <td>$${h.monto.toFixed(2)}</td>
                </tr>
              `).join('')}
              ${resultados.desgloseGastos.map(g => `
                <tr>
                  <td>1</td>
                  <td>${g.nombre}</td>
                  <td>$${g.monto.toFixed(2)}</td>
                  <td>$${g.monto.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <p>Subtotal: $${resultados.subtotal.toFixed(2)}</p>
            ${descuentoPorcentaje > 0 ? `<p>Descuento (${descuentoPorcentaje}%): -$${resultados.descuento.toFixed(2)}</p>` : ''}
            <p>Subtotal con descuento: $${resultados.subtotalConDescuento.toFixed(2)}</p>
            ${incluirIVA ? `<p>IVA (16%): $${resultados.iva.toFixed(2)}</p>` : ''}
            <p class="grand">TOTAL: $${resultados.total.toFixed(2)}</p>
          </div>
          
          <div class="footer">
            <div class="terms">
              <p><strong>Términos y condiciones:</strong> Esta cotización es válida por 30 días. Los precios no incluyen costas judiciales ni gastos extraordinarios. Se requiere anticipo del 50% para iniciar actuaciones.</p>
              <p><strong>Confidencialidad:</strong> La información contenida es privada y confidencial. Queda prohibida su reproducción sin autorización.</p>
              <p class="acceptance">Aceptación: ____________________  Fecha: __________</p>
              <p>Este documento es una cotización, no una factura fiscal. El comprobante fiscal se emitirá al momento del pago.</p>
            </div>
            <div class="qr">
              <div class="qr-code">
                <svg viewBox="0 0 100 100" width="80" height="80">
                  <rect width="100" height="100" fill="white"/>
                  <rect x="10" y="10" width="20" height="20" fill="black"/>
                  <rect x="40" y="10" width="20" height="20" fill="black"/>
                  <rect x="70" y="10" width="20" height="20" fill="black"/>
                  <rect x="10" y="40" width="20" height="20" fill="black"/>
                  <rect x="40" y="40" width="20" height="20" fill="black"/>
                  <rect x="70" y="40" width="20" height="20" fill="black"/>
                  <rect x="10" y="70" width="20" height="20" fill="black"/>
                  <rect x="40" y="70" width="20" height="20" fill="black"/>
                  <rect x="70" y="70" width="20" height="20" fill="black"/>
                  <rect x="25" y="25" width="10" height="10" fill="white"/>
                  <rect x="55" y="25" width="10" height="10" fill="white"/>
                  <rect x="25" y="55" width="10" height="10" fill="white"/>
                  <rect x="55" y="55" width="10" height="10" fill="white"/>
                </svg>
              </div>
              <p style="font-size:8px; margin-top:5px;">Verificar en: <br>${qrPlaceholder.substring(0,25)}...</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    ventana.document.write(contenido);
    ventana.document.close();
    ventana.print();
  };

  const guardarCotizacion = async () => {
    if (!resultados) return;
    const cotizacion = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      folio: resultados.folio,
      despacho,
      cliente,
      servicios: serviciosSeleccionados,
      montoCaso,
      gastos: gastosSeleccionados,
      descuentoPorcentaje,
      incluirIVA,
      notas,
      resultados
    };
    await guardarEnHistorial(cotizacion);
    alert('✅ Cotización guardada en el historial');
  };

  const cargarDelHistorial = (item) => {
    setDespacho(item.despacho);
    setCliente(item.cliente);
    setServiciosSeleccionados(item.servicios);
    setMontoCaso(item.montoCaso);
    setGastosSeleccionados(item.gastos);
    setDescuentoPorcentaje(item.descuentoPorcentaje);
    setIncluirIVA(item.incluirIVA);
    setNotas(item.notas);
    setResultados(item.resultados);
    setMostrarHistorial(false);
  };

  const eliminarDelHistorial = async (index) => {
    if (window.confirm('¿Eliminar esta cotización del historial?')) {
      const nuevo = [...historial];
      nuevo.splice(index, 1);
      setHistorial(nuevo);
      await guardarHistorial(nuevo);
    }
  };

  const borrarHistorialCompleto = async () => {
    if (window.confirm('¿Borrar todo el historial de cotizaciones?')) {
      setHistorial([]);
      await guardarHistorial([]);
    }
  };

  const historialFiltrado = historial.filter(item =>
    item.cliente.nombre?.toLowerCase().includes(filtroHistorial.toLowerCase()) ||
    item.despacho.nombre?.toLowerCase().includes(filtroHistorial.toLowerCase())
  );

  if (cargandoHistorial) return <div className="text-center py-20">Cargando cotizador...</div>;

  return (
    <div className="px-4">
      {/* Portada */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-700"></div>
        <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop" alt="Cotizador legal" className="w-full h-32 object-cover opacity-30" />
        <div className="relative z-10 p-4 text-white">
          <div className="flex items-center gap-3 mb-1">
            <span className="material-symbols-outlined text-4xl text-amber-400">receipt_long</span>
            <h1 className="text-2xl font-black">Cotizador Legal</h1>
          </div>
          <p className="text-gray-200 text-sm">Honorarios, gastos y cotizaciones profesionales con fundamento en aranceles y práctica forense</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Datos del Despacho</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="Nombre del abogado / despacho" value={despacho.nombre} onChange={e => setDespacho({...despacho, nombre: e.target.value})} className="border rounded p-2" />
              <input type="text" placeholder="Cédula profesional" value={despacho.cedula} onChange={e => setDespacho({...despacho, cedula: e.target.value})} className="border rounded p-2" />
              <input type="text" placeholder="Dirección" value={despacho.direccion} onChange={e => setDespacho({...despacho, direccion: e.target.value})} className="border rounded p-2" />
              <input type="email" placeholder="Email" value={despacho.email} onChange={e => setDespacho({...despacho, email: e.target.value})} className="border rounded p-2" />
              <input type="tel" placeholder="Teléfono" value={despacho.telefono} onChange={e => setDespacho({...despacho, telefono: e.target.value})} className="border rounded p-2" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Datos del Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="Nombre o razón social" value={cliente.nombre} onChange={e => setCliente({...cliente, nombre: e.target.value})} className="border rounded p-2" />
              <input type="text" placeholder="RFC" value={cliente.rfc} onChange={e => setCliente({...cliente, rfc: e.target.value})} className="border rounded p-2" />
              <input type="text" placeholder="Dirección" value={cliente.direccion} onChange={e => setCliente({...cliente, direccion: e.target.value})} className="border rounded p-2" />
              <input type="email" placeholder="Correo electrónico" value={cliente.correo} onChange={e => setCliente({...cliente, correo: e.target.value})} className="border rounded p-2" />
              <input type="tel" placeholder="Teléfono" value={cliente.telefono} onChange={e => setCliente({...cliente, telefono: e.target.value})} className="border rounded p-2" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Servicios Legales</h2>
            <div className="space-y-2">
              {serviciosBase.map(serv => (
                <div key={serv.id} className="flex flex-wrap items-center gap-3 border-b pb-2">
                  <label className="flex-1 font-medium">{serv.nombre} ({serv.unidad})</label>
                  <button onClick={() => toggleServicio(serv)} className={`px-3 py-1 rounded text-sm ${serviciosSeleccionados.some(s => s.id === serv.id) ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                    {serviciosSeleccionados.some(s => s.id === serv.id) ? 'Quitar' : 'Agregar'}
                  </button>
                  {serviciosSeleccionados.some(s => s.id === serv.id) && (
                    <input type="number" min="1" step="1" value={serviciosSeleccionados.find(s => s.id === serv.id)?.cantidad || 1} onChange={e => actualizarCantidadServicio(serv.id, e.target.value)} className="w-20 border rounded p-1 text-center" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3">
              <label className="block font-medium">Monto del caso (para servicios por porcentaje)</label>
              <input type="number" step="1000" value={montoCaso} onChange={e => setMontoCaso(parseFloat(e.target.value) || 0)} className="border rounded p-2 w-full mt-1" />
            </div>
            <div className="mt-3">
              <label className="block font-medium">Materia / Tipo de Procedimiento Judicial</label>
              <div className="flex gap-2">
                <select value={materiaSeleccionada} onChange={e => setMateriaSeleccionada(e.target.value)} className="border rounded p-2 flex-1">
                  <option value="">-- Seleccione una materia --</option>
                  {materiasJudiciales.map(mat => <option key={mat.id} value={mat.id}>{mat.nombre} ($${mat.costo.toFixed(2)})</option>)}
                </select>
                <button onClick={agregarMateria} className="bg-blue-500 text-white px-4 py-2 rounded">Agregar</button>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Gastos Adicionales</h2>
            <div className="grid grid-cols-2 gap-2">
              {gastosComunes.map(gasto => (
                <label key={gasto.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={gastosSeleccionados.includes(gasto.id)} onChange={() => toggleGasto(gasto.id)} />
                  {gasto.nombre} (${gasto.costo})
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Ajustes</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label>Descuento (%)</label>
                <input type="number" step="1" min="0" max="100" value={descuentoPorcentaje} onChange={e => setDescuentoPorcentaje(parseFloat(e.target.value) || 0)} className="border rounded p-2 w-full" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="iva" checked={incluirIVA} onChange={e => setIncluirIVA(e.target.checked)} />
                <label htmlFor="iva">Incluir IVA (16%)</label>
              </div>
            </div>
            <div className="mt-3">
              <label>Notas adicionales</label>
              <textarea rows="2" value={notas} onChange={e => setNotas(e.target.value)} className="border rounded p-2 w-full" placeholder="Ej. Vigencia de la cotización, términos de pago, etc."></textarea>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={guardarCotizacion} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Guardar en Historial</button>
            <button onClick={generarFacturaPDF} className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">Generar PDF (Factura)</button>
          </div>
        </div>

        {/* Resumen de cotización con precios editables */}
        {resultados && (
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen de Cotización</h2>
            <div className="space-y-3">
              {resultados.desgloseHonorarios.map((item, idx) => (
                <div key={idx} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.nombre}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="100"
                        value={item.unitario}
                        onChange={(e) => {
                          const nuevoPrecio = parseFloat(e.target.value);
                          const servicioExistente = serviciosSeleccionados.find(s => s.id === item.id);
                          if (servicioExistente) {
                            actualizarPrecioServicio(item.id, nuevoPrecio);
                          }
                        }}
                        className="w-28 border rounded p-1 text-right text-sm"
                      />
                      <span className="text-sm">x {item.cantidad}</span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">Importe: ${item.monto.toFixed(2)}</div>
                </div>
              ))}
              {resultados.desgloseGastos.map((g, idx) => (
                <div key={`gasto-${idx}`} className="border-b pb-2 flex justify-between">
                  <span>{g.nombre}</span>
                  <span>${g.monto.toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-2">
                <div className="flex justify-between"><span>Subtotal:</span><span>${resultados.subtotal.toFixed(2)}</span></div>
                {descuentoPorcentaje > 0 && <div className="flex justify-between"><span>Descuento ({descuentoPorcentaje}%):</span><span>-${resultados.descuento.toFixed(2)}</span></div>}
                <div className="flex justify-between"><span>Subtotal con descuento:</span><span>${resultados.subtotalConDescuento.toFixed(2)}</span></div>
                {incluirIVA && <div className="flex justify-between"><span>IVA (16%):</span><span>${resultados.iva.toFixed(2)}</span></div>}
                <div className="flex justify-between text-xl font-bold text-amber-600 pt-2 border-t mt-2"><span>Total:</span><span>${resultados.total.toFixed(2)}</span></div>
                <div className="text-xs text-gray-500 mt-2">Folio: {resultados.folio}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Historial */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => setMostrarHistorial(!mostrarHistorial)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
            {mostrarHistorial ? 'Ocultar Historial' : 'Mostrar Historial'}
          </button>
          {historial.length > 0 && (
            <button onClick={borrarHistorialCompleto} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Borrar todo</button>
          )}
        </div>
        {mostrarHistorial && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <input type="text" placeholder="Filtrar por cliente o despacho" value={filtroHistorial} onChange={e => setFiltroHistorial(e.target.value)} className="border rounded p-2 w-full mb-3" />
            {historialFiltrado.length === 0 && <p className="text-gray-500 text-center py-4">Sin cotizaciones guardadas</p>}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {historialFiltrado.map((item, idx) => (
                <div key={item.id || idx} className="border p-2 rounded flex justify-between items-center">
                  <div>
                    <p>{new Date(item.fecha).toLocaleString()} - <strong>{item.cliente.nombre || 'Cliente'}</strong> | Total: ${item.resultados.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Folio: {item.folio}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => cargarDelHistorial(item)} className="bg-amber-500 text-white px-2 py-1 rounded text-sm">Cargar</button>
                    <button onClick={() => eliminarDelHistorial(idx)} className="bg-red-500 text-white px-2 py-1 rounded text-sm">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CotizadorLegal;