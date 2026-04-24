// src/pages/CalculadoraLaboral.js (versión final con borrado de historial)
import { useState, useEffect } from 'react';

// Salarios mínimos 2026
const SALARIOS_MINIMOS = {
  general: 315.04,
  frontera: 440.87
};

// Tabla completa de profesiones (61 oficios) con salarios por zona
const profesiones = [
  { id: 1, nombre: "Albañilería, oficial de", salarioGeneral: 363.44, salarioFrontera: 440.87 },
  { id: 2, nombre: "Boticas, farmacias y droguería, dependiente(a) de mostrador en", salarioGeneral: 321.26, salarioFrontera: 440.87 },
  { id: 3, nombre: "Buldózer y/o traxcavo, operador(a) de", salarioGeneral: 380.74, salarioFrontera: 440.87 },
  { id: 4, nombre: "Cajero(a) de máquina registradora", salarioGeneral: 326.84, salarioFrontera: 440.87 },
  { id: 5, nombre: "Cantinero(a) preparador de bebidas", salarioGeneral: 333.52, salarioFrontera: 440.87 },
  { id: 6, nombre: "Carpintero(a) de obra negra", salarioGeneral: 363.44, salarioFrontera: 440.87 },
  { id: 7, nombre: "Carpintero(a) en la fabricación y reparación de muebles, oficial", salarioGeneral: 357.45, salarioFrontera: 440.87 },
  { id: 8, nombre: "Cocinero(a), mayor(a) en restaurantes, fondas y demás establecimientos de preparación y venta de alimentos", salarioGeneral: 368.05, salarioFrontera: 440.87 },
  { id: 9, nombre: "Colchones, oficial en fabricación y reparación de", salarioGeneral: 336.83, salarioFrontera: 440.87 },
  { id: 10, nombre: "Colocador(a) de mosaicos y azulejos, oficial", salarioGeneral: 356.19, salarioFrontera: 440.87 },
  { id: 11, nombre: "Construcción de edificios y casas habitación, yesero(a) en", salarioGeneral: 339.20, salarioFrontera: 440.87 },
  { id: 12, nombre: "Cortador(a) en talleres y fábricas de manufactura de calzado, oficial", salarioGeneral: 330.31, salarioFrontera: 440.87 },
  { id: 13, nombre: "Costurero(a) en confección de ropa en talleres o fábricas", salarioGeneral: 326.38, salarioFrontera: 440.87 },
  { id: 14, nombre: "Costurero(a) en confección de ropa en trabajo a domicilio", salarioGeneral: 334.94, salarioFrontera: 440.87 },
  { id: 15, nombre: "Chofer acomodador(a) de automóviles en estacionamientos", salarioGeneral: 341.42, salarioFrontera: 440.87 },
  { id: 16, nombre: "Chofer de camión de carga en general", salarioGeneral: 370.90, salarioFrontera: 440.87 },
  { id: 17, nombre: "Chofer de camioneta de carga en general", salarioGeneral: 360.39, salarioFrontera: 440.87 },
  { id: 18, nombre: "Chofer operador(a) de vehículos con grúa", salarioGeneral: 346.67, salarioFrontera: 440.87 },
  { id: 19, nombre: "Draga, operador(a) de", salarioGeneral: 384.25, salarioFrontera: 440.87 },
  { id: 20, nombre: "Ebanista en fabricación y reparación de muebles, oficial", salarioGeneral: 362.61, salarioFrontera: 440.87 },
  { id: 21, nombre: "Electricista instalador(a) y reparador(a) de instalaciones eléctricas, oficial", salarioGeneral: 356.19, salarioFrontera: 440.87 },
  { id: 22, nombre: "Electricista en la reparación de automóviles y camiones, oficial", salarioGeneral: 359.63, salarioFrontera: 440.87 },
  { id: 23, nombre: "Electricista reparador(a) de motores y/o generadores en talleres de servicio, oficial", salarioGeneral: 346.67, salarioFrontera: 440.87 },
  { id: 24, nombre: "Empleado(a) de góndola, anaquel o sección en tienda de autoservicio", salarioGeneral: 320.32, salarioFrontera: 440.87 },
  { id: 25, nombre: "Encargado(a) de bodega y/o almacén", salarioGeneral: 331.76, salarioFrontera: 440.87 },
  { id: 26, nombre: "Ferreterías y tlapalerías, dependiente(a) en", salarioGeneral: 338.38, salarioFrontera: 440.87 },
  { id: 27, nombre: "Fogonero(a) de calderas de vapor", salarioGeneral: 349.22, salarioFrontera: 440.87 },
  { id: 28, nombre: "Gasolinero(a), oficial", salarioGeneral: 326.38, salarioFrontera: 440.87 },
  { id: 29, nombre: "Herrería, oficial de", salarioGeneral: 351.59, salarioFrontera: 440.87 },
  { id: 30, nombre: "Hojalatero(a) en la reparación de automóviles y camiones, oficial", salarioGeneral: 357.45, salarioFrontera: 440.87 },
  { id: 31, nombre: "Jornalero(a) agrícola y/o trabajador(a) del campo", salarioGeneral: 356.16, salarioFrontera: 440.87 },
  { id: 32, nombre: "Lubricador(a) de automóviles, camiones y otros vehículos de motor", salarioGeneral: 328.83, salarioFrontera: 440.87 },
  { id: 33, nombre: "Manejador(a) en granja avícola", salarioGeneral: 316.85, salarioFrontera: 440.87 },
  { id: 34, nombre: "Maquinaria agrícola, operador(a) de", salarioGeneral: 365.24, salarioFrontera: 440.87 },
  { id: 35, nombre: "Máquinas para madera en general, oficial operador(a) de", salarioGeneral: 349.22, salarioFrontera: 440.87 },
  { id: 36, nombre: "Mecánico(a) en reparación de automóviles y camiones, oficial", salarioGeneral: 375.35, salarioFrontera: 440.87 },
  { id: 37, nombre: "Montador(a) en talleres y fábricas de calzado, oficial", salarioGeneral: 330.31, salarioFrontera: 440.87 },
  { id: 38, nombre: "Peluquero(a) y cultor(a) de belleza", salarioGeneral: 341.42, salarioFrontera: 440.87 },
  { id: 39, nombre: "Pintor(a) de automóviles y camiones, oficial", salarioGeneral: 351.59, salarioFrontera: 440.87 },
  { id: 40, nombre: "Pintor(a) de casas, edificios y construcciones en general, oficial", salarioGeneral: 349.22, salarioFrontera: 440.87 },
  { id: 41, nombre: "Planchador(a) a máquina en tintorerías, lavandería y establecimientos similares", salarioGeneral: 326.84, salarioFrontera: 440.87 },
  { id: 42, nombre: "Plomero(a) en instalaciones sanitarias, oficial", salarioGeneral: 349.84, salarioFrontera: 440.87 },
  { id: 43, nombre: "Radiotécnico(a) reparador(a) de aparatos eléctricos y electrónicos, oficial", salarioGeneral: 362.61, salarioFrontera: 440.87 },
  { id: 44, nombre: "Recamarero(a) en hoteles, moteles y otros establecimientos de hospedaje", salarioGeneral: 320.32, salarioFrontera: 440.87 },
  { id: 45, nombre: "Refaccionaria de automóviles y camiones, dependiente(a) de mostrador en", salarioGeneral: 331.76, salarioFrontera: 440.87 },
  { id: 46, nombre: "Reparador(a) de aparatos eléctricos para el hogar, oficial", salarioGeneral: 345.36, salarioFrontera: 440.87 },
  { id: 47, nombre: "Reportero(a) en prensa diaria impresa", salarioGeneral: 705.46, salarioFrontera: 705.46 },
  { id: 48, nombre: "Reportero(a) gráfico(a) en prensa diaria impresa", salarioGeneral: 705.46, salarioFrontera: 705.46 },
  { id: 49, nombre: "Repostero(a) o pastelero(a)", salarioGeneral: 363.44, salarioFrontera: 440.87 },
  { id: 50, nombre: "Sastrería en trabajo a domicilio, oficial de", salarioGeneral: 365.24, salarioFrontera: 440.87 },
  { id: 51, nombre: "Secretario(a) auxiliar", salarioGeneral: 374.60, salarioFrontera: 440.87 },
  { id: 52, nombre: "Soldador(a) con soplete o con arco eléctrico", salarioGeneral: 359.63, salarioFrontera: 440.87 },
  { id: 53, nombre: "Tablajero(a) y/o carnicero(a) en mostrador", salarioGeneral: 341.42, salarioFrontera: 440.87 },
  { id: 54, nombre: "Tapicero(a) de vestiduras de automóviles, oficial", salarioGeneral: 346.67, salarioFrontera: 440.87 },
  { id: 55, nombre: "Tapicero(a) en reparación de muebles, oficial", salarioGeneral: 346.67, salarioFrontera: 440.87 },
  { id: 56, nombre: "Trabajador(a) del hogar", salarioGeneral: 342.47, salarioFrontera: 440.87 },
  { id: 57, nombre: "Trabajador(a) social, técnico(a) en", salarioGeneral: 405.82, salarioFrontera: 440.87 },
  { id: 58, nombre: "Vaquero(a) ordeñador a máquina", salarioGeneral: 320.32, salarioFrontera: 440.87 },
  { id: 59, nombre: "Velador(a)", salarioGeneral: 326.38, salarioFrontera: 440.87 },
  { id: 60, nombre: "Vendedor(a) de piso de aparatos de uso doméstico", salarioGeneral: 334.94, salarioFrontera: 440.87 },
  { id: 61, nombre: "Zapatero(a) en talleres de reparación de calzado, oficial", salarioGeneral: 330.31, salarioFrontera: 440.87 }
];

// Referencias a artículos de la LFT
const articulosLFT = {
  indemnizacion: "Artículos 47, 48, 49, 50, 51 y 52 (Despido injustificado): 90 días de salario + 20 días por año + prima de antigüedad (12 días por año)",
  primaAntiguedad: "Artículo 162 (Prima de antigüedad): 12 días de salario por cada año de servicios, con tope de dos salarios mínimos",
  aguinaldo: "Artículo 87 (Aguinaldo): 15 días de salario mínimo anual, proporcional al tiempo trabajado",
  vacaciones: "Artículo 76 (Vacaciones): 6 días el primer año, aumentando 2 días por cada año subsecuente",
  primaVacacional: "Artículo 80 (Prima vacacional): 25% sobre el salario correspondiente al período de vacaciones",
  finiquito: "Artículos 47, 48, 49, 50 y 52: Indemnización por despido injustificado, incluyendo partes proporcionales"
};

const CalculadoraLaboral = () => {
  const [datosCliente, setDatosCliente] = useState({
    nombre: '',
    cedula: '',
    despacho: ''
  });
  const [trabajador, setTrabajador] = useState({
    nombre: '',
    rfc: '',
    puesto: '',
    profesionId: '',
    zona: 'general',
    salarioDiario: '',
    fechaIngreso: '',
    fechaBaja: '',
    causaBaja: 'despido injustificado'
  });
  const [salarioProfesionMostrado, setSalarioProfesionMostrado] = useState(null);
  const [resultados, setResultados] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  // Cargar historial
  useEffect(() => {
    const stored = localStorage.getItem('calculadora_laboral_historial');
    if (stored) setHistorial(JSON.parse(stored));
  }, []);

  const guardarEnHistorial = (calculo) => {
    const nuevoHistorial = [calculo, ...historial].slice(0, 20);
    setHistorial(nuevoHistorial);
    localStorage.setItem('calculadora_laboral_historial', JSON.stringify(nuevoHistorial));
  };

  const getSalarioMinimo = () => {
    return trabajador.zona === 'general' ? SALARIOS_MINIMOS.general : SALARIOS_MINIMOS.frontera;
  };

  const getSalarioProfesion = () => {
    if (!trabajador.profesionId) return null;
    const prof = profesiones.find(p => p.id === parseInt(trabajador.profesionId));
    if (!prof) return null;
    return trabajador.zona === 'general' ? prof.salarioGeneral : prof.salarioFrontera;
  };

  useEffect(() => {
    if (trabajador.profesionId) {
      const salario = getSalarioProfesion();
      setSalarioProfesionMostrado(salario);
      setTrabajador(prev => ({ ...prev, salarioDiario: salario.toString() }));
    } else {
      setSalarioProfesionMostrado(null);
    }
  }, [trabajador.profesionId, trabajador.zona]);

  const calcularSalarioDiarioIntegrado = (salarioDiario) => {
    const aguinaldo = 15;
    const primaVacacional = 0.25;
    const diasVacacion = 6;
    const factor = (365 + aguinaldo + (diasVacacion * primaVacacional)) / 365;
    return salarioDiario * factor;
  };

  const calcularIndemnizacion = (salarioDiario, añosTrabajados) => {
    const topeDobleSalario = getSalarioMinimo() * 2;
    const salarioTopado = Math.min(salarioDiario, topeDobleSalario);
    const indemnizacion90 = salarioTopado * 90;
    const indemnizacion20PorAño = salarioTopado * 20 * añosTrabajados;
    const primaAntiguedad = (salarioTopado * 12) * añosTrabajados;
    return {
      total: indemnizacion90 + indemnizacion20PorAño + primaAntiguedad,
      desglose: {
        '90 días (Art. 48)': indemnizacion90,
        '20 días por año (Art. 48)': indemnizacion20PorAño,
        'Prima de antigüedad 12 días/año (Art. 162)': primaAntiguedad
      }
    };
  };

  const calcularFiniquito = (salarioDiario, fechaIngreso, fechaBaja) => {
    const ingreso = new Date(fechaIngreso);
    const baja = new Date(fechaBaja);
    const diasTrabajadosEnAnio = Math.ceil((baja - new Date(baja.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24));
    const aguinaldoProporcional = (salarioDiario * 15) * (diasTrabajadosEnAnio / 365);
    const vacacionesProporcionales = (salarioDiario * 6) * (diasTrabajadosEnAnio / 365);
    const primaVacacionalProporcional = vacacionesProporcionales * 0.25;
    return {
      total: aguinaldoProporcional + vacacionesProporcionales + primaVacacionalProporcional,
      desglose: {
        'Aguinaldo proporcional (Art. 87)': aguinaldoProporcional,
        'Vacaciones proporcionales (Art. 76)': vacacionesProporcionales,
        'Prima vacacional proporcional (Art. 80)': primaVacacionalProporcional
      }
    };
  };

  const handleCalcular = () => {
    let salarioDiario = trabajador.salarioDiario ? parseFloat(trabajador.salarioDiario) : null;
    if (!salarioDiario && trabajador.profesionId) {
      salarioDiario = getSalarioProfesion();
    }
    if (!salarioDiario || isNaN(salarioDiario)) {
      alert('Debes ingresar un salario diario válido o seleccionar una profesión');
      return;
    }
    if (!trabajador.fechaIngreso || !trabajador.fechaBaja) {
      alert('Debes ingresar fechas de ingreso y baja');
      return;
    }

    const ingreso = new Date(trabajador.fechaIngreso);
    const baja = new Date(trabajador.fechaBaja);
    const añosTrabajados = (baja - ingreso) / (1000 * 60 * 60 * 24 * 365.25);
    const indemnizacion = calcularIndemnizacion(salarioDiario, añosTrabajados);
    const finiquito = calcularFiniquito(salarioDiario, trabajador.fechaIngreso, trabajador.fechaBaja);
    const salarioIntegrado = calcularSalarioDiarioIntegrado(salarioDiario);

    const calculo = {
      fecha: new Date().toISOString(),
      trabajador: { ...trabajador, salarioDiario },
      datosCliente,
      resultados: {
        salarioDiario,
        salarioIntegrado,
        añosTrabajados: añosTrabajados.toFixed(2),
        indemnizacion: indemnizacion.total,
        indemnizacionDesglose: indemnizacion.desglose,
        finiquito: finiquito.total,
        finiquitoDesglose: finiquito.desglose,
        total: indemnizacion.total + finiquito.total
      }
    };
    setResultados(calculo.resultados);
    guardarEnHistorial(calculo);
  };

  const cargarDelHistorial = (item) => {
    setTrabajador(item.trabajador);
    setDatosCliente(item.datosCliente);
    setResultados(item.resultados);
    setMostrarHistorial(false);
  };

  // Funciones para eliminar historial
  const eliminarDelHistorial = (index) => {
    if (window.confirm('¿Eliminar este cálculo del historial?')) {
      const nuevoHistorial = [...historial];
      nuevoHistorial.splice(index, 1);
      setHistorial(nuevoHistorial);
      localStorage.setItem('calculadora_laboral_historial', JSON.stringify(nuevoHistorial));
    }
  };

  const borrarHistorialCompleto = () => {
    if (window.confirm('¿Eliminar TODOS los cálculos del historial? Esta acción no se puede deshacer.')) {
      setHistorial([]);
      localStorage.setItem('calculadora_laboral_historial', JSON.stringify([]));
    }
  };

  const imprimirPDF = () => {
    const ventana = window.open('', '_blank');
    const fechaEmision = new Date().toLocaleString();
    const nombreAbogado = datosCliente.nombre || 'No especificado';
    const cedula = datosCliente.cedula || 'No especificada';
    const despacho = datosCliente.despacho || 'No especificado';
    const articulosTexto = `
      <h3>Fundamento legal aplicable (Ley Federal del Trabajo)</h3>
      <ul>
        <li><strong>Indemnización constitucional:</strong> ${articulosLFT.indemnizacion}</li>
        <li><strong>Prima de antigüedad:</strong> ${articulosLFT.primaAntiguedad}</li>
        <li><strong>Aguinaldo:</strong> ${articulosLFT.aguinaldo}</li>
        <li><strong>Vacaciones:</strong> ${articulosLFT.vacaciones}</li>
        <li><strong>Prima vacacional:</strong> ${articulosLFT.primaVacacional}</li>
        <li><strong>Finiquito:</strong> ${articulosLFT.finiquito}</li>
      </ul>
    `;

    const contenido = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Liquidación Laboral</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #b45309; }
          h2 { color: #2c3e50; border-bottom: 1px solid #ccc; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total { font-weight: bold; font-size: 1.2em; }
          .footer { margin-top: 40px; font-size: 12px; text-align: center; border-top: 1px solid #ccc; padding-top: 20px; }
          .articulos { background-color: #f9f9f9; padding: 10px; margin-top: 20px; border-left: 4px solid #b45309; }
        </style>
      </head>
      <body>
        <h1>Dictamen de Liquidación Laboral</h1>
        <h2>Datos del Cliente (Abogado)</h2>
        <p><strong>Nombre:</strong> ${nombreAbogado}</p>
        <p><strong>Cédula Profesional:</strong> ${cedula}</p>
        <p><strong>Despacho:</strong> ${despacho}</p>
        
        <h2>Datos del Trabajador</h2>
        <p><strong>Nombre:</strong> ${trabajador.nombre || 'No especificado'}</p>
        <p><strong>RFC:</strong> ${trabajador.rfc || 'No especificado'}</p>
        <p><strong>Puesto:</strong> ${trabajador.puesto || 'No especificado'}</p>
        <p><strong>Zona:</strong> ${trabajador.zona === 'general' ? 'General' : 'Frontera Norte'}</p>
        <p><strong>Salario Diario:</strong> $${resultados?.salarioDiario?.toFixed(2) || '0.00'}</p>
        <p><strong>Salario Diario Integrado:</strong> $${resultados?.salarioIntegrado?.toFixed(2) || '0.00'}</p>
        <p><strong>Años trabajados:</strong> ${resultados?.añosTrabajados || '0'}</p>
        
        <h2>Cálculo de Indemnización</h2>
        <table>
          <tr><th>Concepto</th><th>Monto</th></tr>
          ${resultados ? Object.entries(resultados.indemnizacionDesglose).map(([k,v]) => `<tr><td>${k}</td><td>$${v.toFixed(2)}</td></tr>`).join('') : ''}
          <tr class="total"><td>Total Indemnización</td><td>$${resultados?.indemnizacion?.toFixed(2) || '0.00'}</td></tr>
        </table>
        
        <h2>Cálculo de Finiquito</h2>
        <table>
          <tr><th>Concepto</th><th>Monto</th></tr>
          ${resultados ? Object.entries(resultados.finiquitoDesglose).map(([k,v]) => `<tr><td>${k}</td><td>$${v.toFixed(2)}</td></tr>`).join('') : ''}
          <tr class="total"><td>Total Finiquito</td><td>$${resultados?.finiquito?.toFixed(2) || '0.00'}</td></tr>
        </table>
        
        <h2>Total a Pagar</h2>
        <p class="total">$${resultados?.total?.toFixed(2) || '0.00'}</p>
        
        <div class="articulos">${articulosTexto}</div>
        
        <div class="footer">
          <p>El presente dictamen ha sido elaborado por el profesional del derecho que suscribe, bajo su estricta responsabilidad y conforme a la legislación aplicable.</p>
          <p>Los cálculos se basan en la Ley Federal del Trabajo vigente y los salarios mínimos oficiales publicados para el año 2026.</p>
          <p>Fecha de emisión: ${fechaEmision}</p>
          <p>${nombreAbogado} - Cédula Profesional ${cedula} - ${despacho}</p>
        </div>
      </body>
      </html>
    `;
    ventana.document.write(contenido);
    ventana.document.close();
    ventana.print();
  };

  return (
    <div className="px-4">
      {/* Portada */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-700"></div>
        <img 
          src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop" 
          alt="Calculadora laboral"
          className="w-full h-32 object-cover opacity-30"
        />
        <div className="relative z-10 p-4 text-white">
          <div className="flex items-center gap-3 mb-1">
            <span className="material-symbols-outlined text-4xl text-amber-400">calculate</span>
            <h1 className="text-2xl font-black">Calculadora Laboral</h1>
          </div>
          <p className="text-gray-200 text-sm">Indemnizaciones, finiquitos y salarios profesionales con fundamento en la LFT</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Formulario */}
        <div className="flex-1 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Datos del Cliente (Abogado)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input type="text" placeholder="Nombre del abogado" value={datosCliente.nombre} onChange={e => setDatosCliente({...datosCliente, nombre: e.target.value})} className="border rounded p-2" />
            <input type="text" placeholder="Cédula profesional" value={datosCliente.cedula} onChange={e => setDatosCliente({...datosCliente, cedula: e.target.value})} className="border rounded p-2" />
            <input type="text" placeholder="Despacho" value={datosCliente.despacho} onChange={e => setDatosCliente({...datosCliente, despacho: e.target.value})} className="border rounded p-2" />
          </div>

          <h2 className="text-xl font-bold mb-4 text-gray-800">Datos del Trabajador</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nombre completo" value={trabajador.nombre} onChange={e => setTrabajador({...trabajador, nombre: e.target.value})} className="border rounded p-2" />
            <input type="text" placeholder="RFC" value={trabajador.rfc} onChange={e => setTrabajador({...trabajador, rfc: e.target.value})} className="border rounded p-2" />
            <input type="text" placeholder="Puesto" value={trabajador.puesto} onChange={e => setTrabajador({...trabajador, puesto: e.target.value})} className="border rounded p-2" />
            <select value={trabajador.zona} onChange={e => setTrabajador({...trabajador, zona: e.target.value})} className="border rounded p-2">
              <option value="general">Zona General</option>
              <option value="frontera">Zona Libre Frontera Norte</option>
            </select>
            <div>
              <select value={trabajador.profesionId} onChange={e => setTrabajador({...trabajador, profesionId: e.target.value, salarioDiario: ''})} className="border rounded p-2 w-full">
                <option value="">-- Seleccionar profesión (opcional) --</option>
                {profesiones.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
              {salarioProfesionMostrado && (
                <p className="text-xs text-green-600 mt-1">Salario según profesión: ${salarioProfesionMostrado.toFixed(2)} MXN diarios</p>
              )}
            </div>
            <input type="number" step="0.01" placeholder="Salario diario (MXN)" value={trabajador.salarioDiario} onChange={e => setTrabajador({...trabajador, salarioDiario: e.target.value, profesionId: ''})} className="border rounded p-2" />
            <input type="date" value={trabajador.fechaIngreso} onChange={e => setTrabajador({...trabajador, fechaIngreso: e.target.value})} className="border rounded p-2" />
            <input type="date" value={trabajador.fechaBaja} onChange={e => setTrabajador({...trabajador, fechaBaja: e.target.value})} className="border rounded p-2" />
          </div>
          <button onClick={handleCalcular} className="mt-6 bg-amber-500 text-white py-2 px-4 rounded-lg w-full hover:bg-amber-600">Calcular Liquidación</button>
        </div>

        {/* Resultados */}
        {resultados && (
          <div className="lg:w-96 bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Resultados</h2>
              <button onClick={imprimirPDF} className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">📄 Imprimir PDF</button>
            </div>
            <div className="space-y-3">
              <div className="border-b pb-2">
                <p><strong>Salario diario:</strong> ${resultados.salarioDiario.toFixed(2)}</p>
                <p><strong>Salario integrado:</strong> ${resultados.salarioIntegrado.toFixed(2)}</p>
                <p><strong>Años trabajados:</strong> {resultados.añosTrabajados}</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-bold">Indemnización: ${resultados.indemnizacion.toFixed(2)}</p>
                <ul className="text-sm text-gray-600 pl-4">
                  {Object.entries(resultados.indemnizacionDesglose).map(([k,v]) => <li key={k}>{k}: ${v.toFixed(2)}</li>)}
                </ul>
              </div>
              <div className="border-b pb-2">
                <p className="font-bold">Finiquito: ${resultados.finiquito.toFixed(2)}</p>
                <ul className="text-sm text-gray-600 pl-4">
                  {Object.entries(resultados.finiquitoDesglose).map(([k,v]) => <li key={k}>{k}: ${v.toFixed(2)}</li>)}
                </ul>
              </div>
              <div className="pt-2">
                <p className="text-2xl font-bold text-amber-600">Total a pagar: ${resultados.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Historial con opciones de borrado */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => setMostrarHistorial(!mostrarHistorial)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
            {mostrarHistorial ? 'Ocultar Historial' : 'Mostrar Historial'}
          </button>
          {historial.length > 0 && (
            <button onClick={borrarHistorialCompleto} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
              Borrar todo el historial
            </button>
          )}
        </div>
        {mostrarHistorial && (
          <div className="mt-4 bg-white rounded-xl shadow-md p-4">
            <h3 className="font-bold mb-2">Últimos cálculos</h3>
            {historial.length === 0 && <p className="text-gray-500 text-center py-4">Sin historial</p>}
            <div className="space-y-2">
              {historial.map((item, idx) => (
                <div key={idx} className="border p-2 rounded flex justify-between items-center">
                  <div className="flex-1">
                    <p>{new Date(item.fecha).toLocaleString()} - {item.trabajador.nombre || 'Anónimo'}</p>
                    <p className="text-sm">Total: ${item.resultados.total.toFixed(2)}</p>
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

export default CalculadoraLaboral;