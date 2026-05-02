// src/pages/GestorJuridico.jsx
import React, { useState } from 'react';

const GestorJuridico = () => {
  const [materia, setMateria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [analizando, setAnalizando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);

  // Estados para el Analizador de Contratos
  const [tipoContrato, setTipoContrato] = useState('');
  const [fuenteContrato, setFuenteContrato] = useState('');
  const [textoContrato, setTextoContrato] = useState('');
  const [analizandoContrato, setAnalizandoContrato] = useState(false);
  const [resultadoContrato, setResultadoContrato] = useState(null);
  const [tiempoRestanteContrato, setTiempoRestanteContrato] = useState(0);
  const [archivoSubido, setArchivoSubido] = useState(null);

  // Lista de materias jurídicas
  const materias = [
    'Laboral',
    'Civil',
    'Penal',
    'Mercantil',
    'Familiar',
    'Administrativo',
    'Constitucional',
    'Propiedad Intelectual',
    'Derecho Digital',
    'Internacional',
  ];

  // Lista de tipos de contrato
  const tiposContrato = [
    'Contrato Laboral',
    'Contrato de Arrendamiento',
    'Contrato de Compraventa',
    'Contrato de Prestación de Servicios',
    'Contrato de Sociedad',
    'Convenio de Divorcio',
    'Contrato de Seguro',
    'Contrato de Franquicia',
    'Contrato de Confidencialidad',
    'Contrato de Licencia',
    'Convenio de Pago',
    'Otro',
  ];

  // Lista de fuentes del contrato
  const fuentesContrato = [
    'Redactado por un abogado',
    'Plantilla genérica de internet',
    'Proporcionado por la otra parte',
    'Redactado por mí mismo',
    'Proporcionado por una institución',
    'No especifica',
  ];

  // Simulación de IA: analiza el texto y detecta el trámite
  const analizarConIA = (texto, materiaSeleccionada) => {
    const textoLower = texto.toLowerCase();
    let tramite = '';
    let accion = '';
    let fundamento = '';

    // Detección básica por palabras clave (laboral principalmente)
    if (textoLower.includes('despido') || textoLower.includes('liquidación') || textoLower.includes('finiquito')) {
      tramite = 'Reclamación por despido injustificado';
      accion = 'Promover demanda por despido injustificado ante la Junta de Conciliación y Arbitraje (JCA). Plazo: 60 días hábiles desde el despido.';
      fundamento = 'Artículos 47, 48 y 49 de la Ley Federal del Trabajo (LFT).';
    } 
    else if (textoLower.includes('accidente') || textoLower.includes('riesgo de trabajo')) {
      tramite = 'Dictamen de riesgo de trabajo';
      accion = 'Solicitar dictamen al IMSS, si es negado, demandar ante la JCA. Plazo: 1 año.';
      fundamento = 'Artículo 487 LFT.';
    }
    else if (textoLower.includes('incapacidad') || textoLower.includes('pensión')) {
      tramite = 'Incapacidad permanente o pensión por invalidez';
      accion = 'Acudir al IMSS para calificación de incapacidad. Si es rechazada, juicio laboral.';
      fundamento = 'Ley del Seguro Social.';
    }
    else if (textoLower.includes('salario') || textoLower.includes('horas extras')) {
      tramite = 'Reclamación de salarios caídos y horas extras';
      accion = 'Demanda laboral por pago de salarios caídos (Art. 48 LFT) y horas extras no pagadas.';
      fundamento = 'Artículos 66, 67 y 68 LFT.';
    }
    else if (textoLower.includes('acoso') || textoLower.includes('hostigamiento')) {
      tramite = 'Acoso laboral / mobbing';
      accion = 'Denuncia ante la Procuraduría de la Defensa del Trabajo y demanda por daño moral.';
      fundamento = 'Artículo 3 Bis LFT y jurisprudencia.';
    }
    else if (textoLower.includes('contrato') || textoLower.includes('incumplimiento')) {
      tramite = 'Incumplimiento de contrato laboral';
      accion = 'Demanda por incumplimiento de obligaciones del patrón (Art. 51 LFT).';
      fundamento = 'Artículos 51 y 52 LFT.';
    }
    else {
      tramite = 'Consulta general laboral';
      accion = 'Revisar documentación y acudir a la Procuraduría de la Defensa del Trabajo para asesoría.';
      fundamento = 'Derecho a la asesoría gratuita (Art. 123 Constitucional).';
    }

    // Ajuste por materia seleccionada (simulado)
    if (materiaSeleccionada === 'Civil') {
      tramite = 'Asesoría civil relacionada con el caso';
      accion = 'Se recomienda acudir con un abogado civilista para revisar el caso.';
      fundamento = 'Código Civil Federal.';
    } else if (materiaSeleccionada === 'Penal') {
      tramite = 'Posible denuncia penal';
      accion = 'Acudir al Ministerio Público a presentar querella.';
      fundamento = 'Código Nacional de Procedimientos Penales.';
    } else if (materiaSeleccionada === 'Mercantil') {
      tramite = 'Asesoría mercantil';
      accion = 'Revisar títulos de crédito o contratos mercantiles.';
      fundamento = 'Código de Comercio.';
    }

    return { tramite, accion, fundamento };
  };

  // Analizador de contratos con IA
  const analizarContratoConIA = (texto, tipo, fuente) => {
    const textoLower = texto.toLowerCase();
    const riesgos = [];
    const clausulasAbusivas = [];
    const recomendaciones = [];
    let nivelRiesgo = 'BAJO';
    let porcentajeRiesgo = 0;

    // Detección de cláusulas abusivas y riesgos según tipo de contrato
    if (tipo === 'Contrato Laboral') {
      if (textoLower.includes('renunciar a derechos')) {
        clausulasAbusivas.push('❌ Cláusula de renuncia de derechos laborales (NULA por Ley Federal del Trabajo Art. 33)');
        riesgos.push('Renuncia a derechos irrenunciables');
      }
      if (textoLower.includes('periodo de prueba') && textoLower.includes('meses') && !textoLower.includes('3 meses')) {
        clausulasAbusivas.push('⚠️ Periodo de prueba superior a 3 meses (viola Art. 39-A LFT)');
        riesgos.push('Periodo de prueba extendido');
      }
      if (textoLower.includes('jornada') && (textoLower.includes('12') || textoLower.includes('14'))) {
        clausulasAbusivas.push('⚠️ Jornada laboral excesiva sin pago de horas extras');
        riesgos.push('Jornada laboral irregular');
      }
      if (textoLower.includes('confidencialidad') && !textoLower.includes('terminación')) {
        riesgos.push('Cláusula de confidencialidad sin límite de tiempo');
        recomendaciones.push('Agregar límite temporal a la confidencialidad (máx 2 años post-terminación)');
      }
      if (!textoLower.includes('seguro social') && !textoLower.includes('imss')) {
        clausulasAbusivas.push('❌ Omisión de obligación de registro ante el IMSS (viola LSS Art. 15)');
        riesgos.push('Falta de seguridad social');
      }
    } 
    else if (tipo === 'Contrato de Arrendamiento') {
      if (textoLower.includes('aumento') && (textoLower.includes('inflación') || textoLower.includes('ipc'))) {
        clausulasAbusivas.push('⚠️ Aumento de renta atado a inflación sin tope máximo');
        riesgos.push('Aumento de renta desmedido');
      }
      if (textoLower.includes('depósito') && !textoLower.includes('devolución')) {
        clausulasAbusivas.push('⚠️ Depósito sin especificar condiciones de devolución');
        riesgos.push('Depósito en garantía mal definido');
      }
      if (textoLower.includes('mantenimiento') && textoLower.includes('inquilino')) {
        riesgos.push('Traslado de responsabilidades de mantenimiento al inquilino');
        recomendaciones.push('Especificar claramente qué mantenimientos corresponden al arrendador');
      }
      if (!textoLower.includes('terminación') && !textoLower.includes('rescindir')) {
        riesgos.push('Falta de cláusula de terminación anticipada');
        recomendaciones.push('Incluir cláusula de terminación anticipada con plazos justos');
      }
    }
    else if (tipo === 'Contrato de Compraventa') {
      if (textoLower.includes('vicios ocultos') && textoLower.includes('renuncia')) {
        clausulasAbusivas.push('❌ Renuncia a garantía por vicios ocultos (viola Código Civil)');
        riesgos.push('Renuncia a derechos por vicios ocultos');
      }
      if (textoLower.includes('entrega') && !textoLower.includes('plazo')) {
        riesgos.push('Plazo de entrega no especificado');
        recomendaciones.push('Definir fecha exacta de entrega y penalizaciones por incumplimiento');
      }
      if (textoLower.includes('garantía') && !textoLower.includes('meses')) {
        riesgos.push('Garantía sin duración definida');
        recomendaciones.push('Especificar duración de la garantía (mínimo 6 meses recomendado)');
      }
    }
    else if (tipo === 'Contrato de Prestación de Servicios') {
      if (textoLower.includes('alcance') && textoLower.includes('cambios')) {
        clausulasAbusivas.push('⚠️ Cambios en alcance sin procedimiento definido');
        riesgos.push('Scope creep sin control');
      }
      if (!textoLower.includes('propiedad intelectual') && !textoLower.includes('cesión')) {
        riesgos.push('Falta de cláusula de propiedad intelectual');
        recomendaciones.push('Incluir cláusula que defina quién es dueño de los derechos de autor del trabajo');
      }
      if (textoLower.includes('penalización') && !textoLower.includes('días')) {
        clausulasAbusivas.push('⚠️ Penalización sin límite temporal o monto');
        riesgos.push('Penalizaciones desproporcionadas');
      }
    }

    // Detección de cláusulas genéricamente abusivas
    if (textoLower.includes('irrevocable') && textoLower.includes('renuncia')) {
      clausulasAbusivas.push('❌ Renuncia irrevocable de derechos (POSIBLEMENTE NULA)');
    }
    if (textoLower.includes('indemnización') && (textoLower.includes('ilimitada') || textoLower.includes('sin límite'))) {
      clausulasAbusivas.push('⚠️ Indemnización sin límite (riesgo de responsabilidad excesiva)');
    }
    if (textoLower.includes('modificación') && textoLower.includes('unilateral')) {
      clausulasAbusivas.push('⚠️ Modificación unilateral del contrato (DESEQUILIBRIO CONTRACTUAL)');
    }
    if (!textoLower.includes('jurisdicción') && !textoLower.includes('competencia')) {
      riesgos.push('Falta de cláusula de jurisdicción aplicable');
      recomendaciones.push('Definir qué tribunales serán competentes en caso de controversia');
    }
    if (textoLower.includes('arbitraje') && !textoLower.includes('neutro')) {
      riesgos.push('Arbitraje sin especificar reglas o centro arbitral');
      recomendaciones.push('Especificar centro arbitral y reglas aplicables');
    }

    // Calcular nivel de riesgo
    const totalRiesgos = riesgos.length + clausulasAbusivas.length;
    if (totalRiesgos >= 5) {
      nivelRiesgo = 'CRÍTICO';
      porcentajeRiesgo = 85;
    } else if (totalRiesgos >= 3) {
      nivelRiesgo = 'ALTO';
      porcentajeRiesgo = 65;
    } else if (totalRiesgos >= 1) {
      nivelRiesgo = 'MEDIO';
      porcentajeRiesgo = 40;
    } else {
      nivelRiesgo = 'BAJO';
      porcentajeRiesgo = 15;
    }

    // Análisis de la fuente del contrato
    let fuenteAnalisis = '';
    if (fuente === 'Plantilla genérica de internet') {
      fuenteAnalisis = '⚠️ ALERTA: Las plantillas genéricas suelen contener cláusulas desactualizadas o desfavorables.';
    } else if (fuente === 'Proporcionado por la otra parte') {
      fuenteAnalisis = '⚠️ PRECAUCIÓN: Contrato redactado por la contraparte. Revisar con especial atención cláusulas unilaterales.';
    } else if (fuente === 'Redactado por mí mismo') {
      fuenteAnalisis = '✓ Recomendación: Validar con un abogado especialista para evitar omisiones.';
    } else if (fuente === 'Redactado por un abogado') {
      fuenteAnalisis = '✓ Contrato con respaldo profesional.';
    }

    return {
      riesgos,
      clausulasAbusivas,
      recomendaciones,
      nivelRiesgo,
      porcentajeRiesgo,
      fuenteAnalisis,
      totalClausulas: texto.split('\n').length,
      caracteres: texto.length,
      palabras: texto.split(/\s+/).length,
    };
  };

  const iniciarAnalisis = () => {
    if (!descripcion.trim()) {
      alert('Por favor, describe la situación jurídica.');
      return;
    }
    setAnalizando(true);
    setResultado(null);
    let tiempo = 60;
    setTiempoRestante(tiempo);

    const interval = setInterval(() => {
      tiempo -= 1;
      setTiempoRestante(tiempo);
      if (tiempo <= 0) clearInterval(interval);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      const analisis = analizarConIA(descripcion, materia);
      setResultado(analisis);
      setAnalizando(false);
      setTiempoRestante(0);
    }, 3000);
  };

  const iniciarAnalisisContrato = () => {
    if (!textoContrato.trim()) {
      alert('Por favor, pega o sube el contenido del contrato a analizar.');
      return;
    }
    if (!tipoContrato) {
      alert('Por favor, selecciona el tipo de contrato o convenio.');
      return;
    }
    
    setAnalizandoContrato(true);
    setResultadoContrato(null);
    let tiempo = 60;
    setTiempoRestanteContrato(tiempo);

    const interval = setInterval(() => {
      tiempo -= 1;
      setTiempoRestanteContrato(tiempo);
      if (tiempo <= 0) clearInterval(interval);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      const analisis = analizarContratoConIA(textoContrato, tipoContrato, fuenteContrato);
      setResultadoContrato(analisis);
      setAnalizandoContrato(false);
      setTiempoRestanteContrato(0);
    }, 3000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoSubido(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setTextoContrato(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const getColorRiesgo = (nivel) => {
    switch(nivel) {
      case 'CRÍTICO': return 'text-red-700 bg-red-100';
      case 'ALTO': return 'text-orange-700 bg-orange-100';
      case 'MEDIO': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-green-700 bg-green-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestor Jurídico</h1>
      <p className="text-gray-600 mb-6">
        Herramientas de análisis legal con IA para asesoría jurídica
      </p>

      {/* TABS */}
      <div className="flex gap-4 mb-6 border-b">
        <button className="px-6 py-3 text-blue-600 border-b-2 border-blue-600 font-semibold">
          📋 Análisis de Casos
        </button>
        <button className="px-6 py-3 text-gray-600 hover:text-blue-600 font-semibold">
          📄 Analizador de Contratos
        </button>
      </div>

      {/* SECCIÓN 1: ANÁLISIS DE CASOS */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Análisis de Casos Jurídicos</h2>
        <p className="text-gray-600 mb-4">Describe la situación de tu cliente y nuestra IA identificará la acción legal correcta.</p>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Materia jurídica (opcional)</label>
          <select
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Seleccionar materia (opcional)</option>
            {materias.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Describe la situación de tu cliente</label>
          <textarea
            rows="6"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ejemplo: 'Mi cliente trabajó 5 años en una empresa, lo despidieron sin causa justificada y no le pagaron su liquidación. El despido fue hace 3 meses y nunca firmó nada...'"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          onClick={iniciarAnalisis}
          disabled={analizando}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analizando ? 'Analizando...' : 'Detectar trámite (IA)'}
        </button>

        {analizando && (
          <div className="mt-4 text-center text-gray-600">
            <p>⏳ Analizando tu caso... Tiempo estimado: {tiempoRestante} segundos</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${((60 - tiempoRestante) / 60) * 100}%` }}></div>
            </div>
          </div>
        )}

        {resultado && (
          <div className="mt-6 bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
            <h2 className="text-xl font-bold text-green-800 mb-3">Resultado del análisis</h2>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-700">📌 Trámite detectado:</p>
                <p className="text-gray-800">{resultado.tramite}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">⚖️ Acción legal recomendada:</p>
                <p className="text-gray-800">{resultado.accion}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">📚 Fundamento legal:</p>
                <p className="text-gray-800">{resultado.fundamento}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>⚠️ Este análisis es una simulación basada en palabras clave. Consulta con un abogado para una opinión legal real.</p>
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN 2: ANALIZADOR DE CONTRATOS */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📄 Analizador de Contratos/Convenios</h2>
        <p className="text-gray-600 mb-4">
          Detecta riesgos, cláusulas abusivas e irregularidades legales en contratos o convenios.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Tipo de contrato o convenio</label>
            <select
              value={tipoContrato}
              onChange={(e) => setTipoContrato(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Seleccionar tipo</option>
              {tiposContrato.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Fuente del contrato o convenio</label>
            <select
              value={fuenteContrato}
              onChange={(e) => setFuenteContrato(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Seleccionar fuente</option>
              {fuentesContrato.map((fuente) => (
                <option key={fuente} value={fuente}>{fuente}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Texto del contrato o convenio</label>
          <textarea
            rows="8"
            value={textoContrato}
            onChange={(e) => setTextoContrato(e.target.value)}
            placeholder="Pega aquí el contenido completo del contrato a analizar..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
          />
        </div>

        <div className="flex gap-4 mb-4">
          <label className="flex-1 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-3 rounded-lg font-semibold transition border-2 border-dashed border-gray-300">
            📎 Subir archivo
            <input
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 py-3 rounded-lg font-semibold transition">
            🎤 Transcribir Texto
          </button>
        </div>

        {archivoSubido && (
          <div className="mb-4 text-sm text-green-600">
            ✓ Archivo cargado: {archivoSubido.name}
          </div>
        )}

        <button
          onClick={iniciarAnalisisContrato}
          disabled={analizandoContrato}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analizandoContrato ? 'Analizando contrato...' : '🔍 Analizar Contrato (IA)'}
        </button>

        {analizandoContrato && (
          <div className="mt-4 text-center text-gray-600">
            <p>⏳ Analizando cláusulas del contrato... Tiempo estimado: {tiempoRestanteContrato} segundos</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${((60 - tiempoRestanteContrato) / 60) * 100}%` }}></div>
            </div>
          </div>
        )}

        {resultadoContrato && (
          <div className="mt-6 rounded-lg overflow-hidden">
            {/* Nivel de Riesgo */}
            <div className={`p-4 ${getColorRiesgo(resultadoContrato.nivelRiesgo)}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">Nivel de Riesgo: {resultadoContrato.nivelRiesgo}</p>
                  <p className="text-sm">Riesgo detectado: {resultadoContrato.porcentajeRiesgo}%</p>
                </div>
                <div className="text-3xl">
                  {resultadoContrato.nivelRiesgo === 'CRÍTICO' && '🔴'}
                  {resultadoContrato.nivelRiesgo === 'ALTO' && '🟠'}
                  {resultadoContrato.nivelRiesgo === 'MEDIO' && '🟡'}
                  {resultadoContrato.nivelRiesgo === 'BAJO' && '🟢'}
                </div>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2 mt-2">
                <div className="bg-current h-2 rounded-full" style={{ width: `${resultadoContrato.porcentajeRiesgo}%` }}></div>
              </div>
            </div>

            {/* Estadísticas del documento */}
            <div className="bg-gray-50 p-4 border-b">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-700">{resultadoContrato.palabras}</p>
                  <p className="text-xs text-gray-500">Palabras</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-700">{resultadoContrato.totalClausulas}</p>
                  <p className="text-xs text-gray-500">Cláusulas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-700">{resultadoContrato.caracteres}</p>
                  <p className="text-xs text-gray-500">Caracteres</p>
                </div>
              </div>
            </div>

            {/* Fuente del contrato */}
            {resultadoContrato.fuenteAnalisis && (
              <div className="bg-blue-50 p-4 border-b">
                <p className="text-blue-800">{resultadoContrato.fuenteAnalisis}</p>
              </div>
            )}

            {/* Cláusulas Abusivas */}
            {resultadoContrato.clausulasAbusivas.length > 0 && (
              <div className="bg-red-50 p-4 border-b">
                <h3 className="font-bold text-red-800 mb-2">🚨 CLÁUSULAS ABUSIVAS DETECTADAS</h3>
                <ul className="space-y-2">
                  {resultadoContrato.clausulasAbusivas.map((clausula, idx) => (
                    <li key={idx} className="text-red-700 text-sm">{clausula}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Riesgos */}
            {resultadoContrato.riesgos.length > 0 && (
              <div className="bg-orange-50 p-4 border-b">
                <h3 className="font-bold text-orange-800 mb-2">⚠️ RIESGOS IDENTIFICADOS</h3>
                <ul className="space-y-2">
                  {resultadoContrato.riesgos.map((riesgo, idx) => (
                    <li key={idx} className="text-orange-700 text-sm">{riesgo}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recomendaciones */}
            {resultadoContrato.recomendaciones.length > 0 && (
              <div className="bg-green-50 p-4 border-b">
                <h3 className="font-bold text-green-800 mb-2">✓ RECOMENDACIONES</h3>
                <ul className="space-y-2">
                  {resultadoContrato.recomendaciones.map((recomendacion, idx) => (
                    <li key={idx} className="text-green-700 text-sm">{recomendacion}</li>
                  ))}
                </ul>
              </div>
            )}

            {resultadoContrato.clausulasAbusivas.length === 0 && resultadoContrato.riesgos.length === 0 && (
              <div className="bg-green-50 p-4">
                <p className="text-green-800 text-center font-semibold">✓ No se detectaron cláusulas abusivas ni riesgos significativos.</p>
              </div>
            )}

            <div className="bg-gray-50 p-4 text-sm text-gray-500">
              <p>⚠️ Este análisis es una simulación basada en detección de patrones. Se recomienda consultar con un abogado especialista para una revisión legal exhaustiva.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestorJuridico;