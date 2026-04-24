// src/pages/GuiaTramites.jsx
import React, { useState } from 'react';

const GuiaTramites = () => {
  const [institucion, setInstitucion] = useState('');
  const [tipoTramite, setTipoTramite] = useState('');
  const [detallesAdicionales, setDetallesAdicionales] = useState('');
  const [generando, setGenerando] = useState(false);
  const [guia, setGuia] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);

  // Lista de instituciones
  const instituciones = [
    'IMSS — Instituto Mexicano del Seguro Social',
    'ISSSTE — Instituto de Seguridad y Servicios Sociales de los Trabajadores del Estado',
    'SAT — Servicio de Administración Tributaria',
    'RENAPO — Registro Nacional de Población',
    'SEP — Secretaría de Educación Pública',
    'SRE — Secretaría de Relaciones Exteriores',
    'INFONAVIT — Instituto del Fondo Nacional de la Vivienda para los Trabajadores',
    'CONAGUA — Comisión Nacional del Agua',
    'PROFECO — Procuraduría Federal del Consumidor',
    'CONDUSEF — Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros',
    'TJA — Tribunal de Justicia Administrativa',
    'CNDH — Comisión Nacional de los Derechos Humanos',
    'FGR — Fiscalía General de la República',
    'SCJN — Suprema Corte de Justicia de la Nación',
    'TEPJF — Tribunal Electoral del Poder Judicial de la Federación',
    'Corte IDH — Corte Interamericana de Derechos Humanos',
    'ONU — Organización de las Naciones Unidas',
    'OIT — Organización Internacional del Trabajo',
    'Gobierno Municipal',
    'Gobierno Estatal',
  ];

  // Tipos de trámite por institución
  const tiposTramitePorInstitucion = {
    'IMSS — Instituto Mexicano del Seguro Social': [
      'Reclamación de prestaciones',
      'Inscripción al seguro social',
      'Solicitud de incapacidades',
      'Atención médica',
      'Devolución de cuotas',
      'Corrección de datos personales',
      'Solicitud de pensión por invalidez',
      'Solicitud de pensión por viudez',
      'Reactivación de número de seguridad social',
      'Queja por negativa de servicio médico',
    ],
    'SAT — Servicio de Administración Tributaria': [
      'Obtención de RFC',
      'Firma electrónica (e.firma)',
      'Declaración anual',
      'Solicitud de devolución de saldo a favor',
      'Corrección de datos fiscales',
      'Facturación electrónica',
      'Recurso de revocación',
      'Solicitud de opinión de cumplimiento',
    ],
    'INFONAVIT — Instituto del Fondo Nacional de la Vivienda para los Trabajadores': [
      'Solicitud de crédito hipotecario',
      'Retiro de subcuenta de vivienda',
      'Devolución de pagos',
      'Corrección de datos',
      'Reclamación de saldo',
      'Apoyo de pago de hipoteca',
    ],
    'PROFECO — Procuraduría Federal del Consumidor': [
      'Queja por incumplimiento de garantía',
      'Reclamación por producto defectuoso',
      'Conciliación con proveedor',
      'Denuncia por publicidad engañosa',
      'Asesoría en compras',
    ],
    'Gobierno Municipal': [
      'Licencia de funcionamiento',
      'Pago de predial',
      'Registro civil',
      'Licencia de construcción',
      'Permiso de uso de suelo',
      'Certificado de no adeudo',
      'Reclamación de daños en vía pública',
    ],
  };

  // Generar guía paso a paso según institución y tipo de trámite
  const generarGuiaPasoAPaso = (institucionSeleccionada, tramiteSeleccionado, detalles) => {
    const guias = {
      'IMSS — Instituto Mexicano del Seguro Social': {
        'Reclamación de prestaciones': {
          titulo: 'Guía para Reclamación de Prestaciones ante el IMSS',
          pasos: [
            {
              paso: 1,
              titulo: 'Recopilación de documentos',
              descripcion: 'Reúne toda la documentación necesaria: identificación oficial (INE, pasaporte), Número de Seguridad Social (NSS), comprobante de domicilio, constancia de semanas cotizadas, documentación que acredite el derecho a la prestación (acta de nacimiento, acta de matrimonio, certificado médico, etc.).',
              documentos: ['INE o pasaporte', 'Comprobante de domicilio', 'Número de Seguridad Social', 'Constancia de semanas cotizadas', 'Documentación específica del caso'],
              tiempo: '3-5 días hábiles',
            },
            {
              paso: 2,
              titulo: 'Presentación de solicitud',
              descripcion: 'Acude a la Subdelegación del IMSS que te corresponda según tu domicilio. Solicita el formato de "Solicitud de Prestaciones" (Formato IMSS-01). Llena el formato con tus datos y describe detalladamente la prestación que reclamas.',
              documentos: ['Formato IMSS-01 debidamente llenado', 'Copia de todos los documentos', 'Identificación oficial vigente'],
              tiempo: '1 día hábil',
            },
            {
              paso: 3,
              titulo: 'Adjuntar documentación probatoria',
              descripcion: 'Anexa toda la documentación que respalde tu reclamación. Si es por pensión, incluye acta de nacimiento de beneficiarios. Si es por incapacidad, incluye certificados médicos. Asegúrate de llevar originales y copias para cotejo.',
              documentos: ['Documentación original', '2 copias de cada documento', 'Identificación de beneficiarios'],
              tiempo: 'El mismo día',
            },
            {
              paso: 4,
              titulo: 'Recibir acuse de recepción',
              descripcion: 'El personal del IMSS debe sellar y fechar tu solicitud, entregándote un acuse de recepción. Este documento es fundamental para dar seguimiento. Verifica que todos tus datos estén correctos en el acuse.',
              documentos: ['Acuse de recepción sellado', 'Identificación oficial'],
              tiempo: 'Inmediato',
            },
            {
              paso: 5,
              titulo: 'Seguimiento del trámite',
              descripcion: 'El IMSS tiene un plazo de 45 días hábiles para resolver tu solicitud (Artículo 132 de la Ley del Seguro Social). Puedes dar seguimiento en línea a través del portal "IMSS Digital" o acudiendo a la Subdelegación.',
              documentos: ['Número de folio del acuse', 'Identificación oficial'],
              tiempo: '45 días hábiles (plazo legal)',
            },
            {
              paso: 6,
              titulo: 'Respuesta y notificación',
              descripcion: 'El IMSS notificará su resolución por escrito. Si es favorable, se procederá al pago de la prestación. Si es desfavorable, puedes interponer un recurso de inconformidad ante el propio IMSS o acudir al Tribunal Federal de Justicia Administrativa.',
              documentos: ['Resolución del IMSS', 'Acuse de recepción original'],
              tiempo: '15 días hábiles adicionales para notificación',
            },
          ],
          fundamento: 'Artículos 132, 133, 134 y 135 de la Ley del Seguro Social',
          consejos: [
            'Solicita por escrito la respuesta si exceden el plazo legal',
            'Conserva todos los acuses y documentos originales',
            'Si requieres asesoría, acude a la Procuraduría de la Defensa del Trabajo',
            'Puedes realizar el trámite en línea si tienes tu Firma Electrónica',
          ],
        },
        'Reactivación de número de seguridad social': {
          titulo: 'Guía para Reactivación de Número de Seguridad Social (NSS)',
          pasos: [
            {
              paso: 1,
              titulo: 'Verificar situación del NSS',
              descripcion: 'Consulta en línea en el portal "IMSS Digital" la situación actual de tu Número de Seguridad Social. Necesitarás tu CURP y datos personales.',
              documentos: ['CURP', 'Identificación oficial', 'Comprobante de domicilio'],
              tiempo: 'Inmediato (consulta en línea)',
            },
            {
              paso: 2,
              titulo: 'Reunir documentación comprobatoria',
              descripcion: 'Reúne documentos que acrediten tu identidad y relación laboral: identificación oficial vigente, comprobante de domicilio, constancia de semanas cotizadas (si la tienes), y cualquier documento que demuestre tu situación.',
              documentos: ['INE o pasaporte', 'Comprobante de domicilio reciente', 'CURP actualizada', 'Constancia de semanas cotizadas (opcional)'],
              tiempo: '2 días hábiles',
            },
            {
              paso: 3,
              titulo: 'Acudir a Subdelegación del IMSS',
              descripcion: 'Presenta la documentación en la Subdelegación del IMSS correspondiente a tu domicilio. Solicita el servicio de "Reactivación de NSS" en el módulo de Afiliación y Vigencia.',
              documentos: ['Original y copias de toda la documentación', 'Formato de solicitud (se proporciona en ventanilla)'],
              tiempo: '1 día hábil',
            },
            {
              paso: 4,
              titulo: 'Llenar formato de reactivación',
              descripcion: 'Completa el formato de "Solicitud de Asignación o Reactivación de NSS". Proporciona tus datos personales, historial laboral y explica el motivo de la reactivación.',
              documentos: ['Identificación oficial', 'CURP', 'Comprobante de domicilio'],
              tiempo: '30-45 minutos',
            },
            {
              paso: 5,
              titulo: 'Recibir comprobante de reactivación',
              descripcion: 'El personal del IMSS procesará tu solicitud y te entregará un comprobante con tu NSS reactivado. Verifica que los datos sean correctos y guarda este documento.',
              documentos: ['Comprobante de reactivación', 'NSS reactivado'],
              tiempo: 'Inmediato a 3 días hábiles',
            },
          ],
          fundamento: 'Ley del Seguro Social, Reglamento de Afiliación',
          consejos: [
            'Si trabajas actualmente, solicita a tu patrón que registre tu NSS reactivado',
            'Conserva el comprobante de reactivación para futuros trámites',
            'Si tienes problemas, acude a la Unidad de Atención al Asegurado del IMSS',
          ],
        },
        'Solicitud de incapacidades': {
          titulo: 'Guía para Solicitud de Incapacidades ante el IMSS',
          pasos: [
            {
              paso: 1,
              titulo: 'Obtener certificado médico',
              descripcion: 'Acude a tu médico familiar en la clínica del IMSS que te corresponda. Solicita el certificado de incapacidad, que debe especificar el diagnóstico, tiempo estimado de incapacidad y tratamiento.',
              documentos: ['Identificación oficial', 'Número de Seguridad Social', 'Historial clínico'],
              tiempo: 'El mismo día de la consulta',
            },
            {
              paso: 2,
              titulo: 'Presentar certificado en ventanilla',
              descripcion: 'Lleva el certificado médico a la ventanilla de "Prestaciones Médicas" en tu clínica del IMSS. El personal registrará la incapacidad en el sistema.',
              documentos: ['Certificado médico original', 'Identificación oficial', 'NSS'],
              tiempo: '30 minutos',
            },
            {
              paso: 3,
              titulo: 'Obtener formato de incapacidad oficial',
              descripcion: 'El IMSS emitirá el formato oficial de incapacidad (ST-3). Este documento debe incluir el periodo de incapacidad, diagnóstico y firma del médico.',
              documentos: ['Formato ST-3', 'Identificación oficial'],
              tiempo: 'Inmediato',
            },
            {
              paso: 4,
              titulo: 'Entregar incapacidad al patrón',
              descripcion: 'Presenta el formato ST-3 a tu empleador dentro de los 3 días siguientes a su emisión. Esto es fundamental para el pago de la incapacidad.',
              documentos: ['Formato ST-3 original', 'Copia para tu archivo'],
              tiempo: 'Máximo 3 días hábiles',
            },
          ],
          fundamento: 'Ley del Seguro Social, Reglamento de Prestaciones Médicas',
          consejos: [
            'Solicita copia certificada de todas las incapacidades',
            'Si la incapacidad se prolonga, acude a tu médico para la reevaluación',
            'Conserva los formatos ST-3 para cualquier reclamación futura',
          ],
        },
      },
      'SAT — Servicio de Administración Tributaria': {
        'Obtención de RFC': {
          titulo: 'Guía para Obtención de RFC',
          pasos: [
            {
              paso: 1,
              titulo: 'Reunir documentación',
              descripcion: 'Prepara tu acta de nacimiento, CURP, identificación oficial (INE, pasaporte), y comprobante de domicilio no mayor a 3 meses.',
              documentos: ['Acta de nacimiento', 'CURP', 'Identificación oficial', 'Comprobante de domicilio'],
              tiempo: '1 día hábil',
            },
            {
              paso: 2,
              titulo: 'Agendar cita en línea',
              descripcion: 'Ingresa al portal del SAT, sección "Citas". Selecciona el trámite "Inscripción al RFC" y elige fecha y hora disponible.',
              documentos: ['CURP', 'Correo electrónico', 'Teléfono de contacto'],
              tiempo: '10 minutos',
            },
            {
              paso: 3,
              titulo: 'Acudir a la cita',
              descripcion: 'Asiste a la oficina del SAT en la fecha y hora agendada. Lleva toda la documentación en original y copia.',
              documentos: ['Todos los documentos originales', '2 copias de cada documento', 'Comprobante de cita impreso'],
              tiempo: '1-2 horas',
            },
            {
              paso: 4,
              titulo: 'Recibir RFC y e.firma',
              descripcion: 'El SAT procesará tu solicitud y te entregará tu RFC y, si lo solicitaste, tu e.firma en un USB.',
              documentos: ['RFC impreso', 'USB con e.firma', 'Contraseña'],
              tiempo: 'Inmediato a 3 días hábiles',
            },
          ],
          fundamento: 'Código Fiscal de la Federación',
          consejos: [
            'Guarda tu RFC y contraseña en lugar seguro',
            'Si eres persona moral, necesitas acta constitutiva',
            'Renueva tu e.firma cada 4 años',
          ],
        },
      },
    };

    // Guía genérica para instituciones no específicas
    const guiaGenerica = {
      titulo: `Guía para ${tramiteSeleccionado || 'Trámite'} ante ${institucionSeleccionada}`,
      pasos: [
        {
          paso: 1,
          titulo: 'Identificar la dependencia correcta',
          descripcion: `Localiza la oficina de ${institucionSeleccionada} que corresponde a tu domicilio o al tipo de trámite que necesitas realizar.`,
          documentos: ['Identificación oficial', 'Comprobante de domicilio'],
          tiempo: '1 día hábil',
        },
        {
          paso: 2,
          titulo: 'Reunir documentación básica',
          descripcion: 'Prepara identificación oficial vigente, comprobante de domicilio reciente (no mayor a 3 meses), CURP, y cualquier documento específico del trámite.',
          documentos: ['INE o pasaporte', 'Comprobante de domicilio', 'CURP', 'Documentación específica del caso'],
          tiempo: '2-3 días hábiles',
        },
        {
          paso: 3,
          titulo: 'Solicitar cita (si aplica)',
          descripcion: 'Verifica si la institución requiere cita previa. Generalmente se solicita en línea a través del portal oficial.',
          documentos: ['Identificación oficial', 'Correo electrónico', 'Teléfono de contacto'],
          tiempo: '15-30 minutos',
        },
        {
          paso: 4,
          titulo: 'Presentar solicitud',
          descripcion: `Acude a las oficinas de ${institucionSeleccionada} en el horario de atención. Presenta tu documentación y solicita el formato correspondiente.`,
          documentos: ['Documentación completa', 'Originales y copias', 'Identificación oficial'],
          tiempo: '2-4 horas',
        },
        {
          paso: 5,
          titulo: 'Dar seguimiento',
          descripcion: 'Conserva tu acuse de recepción y da seguimiento al trámite en línea o acudiendo a la institución.',
          documentos: ['Acuse de recepción', 'Número de folio'],
          tiempo: 'Variable según el trámite',
        },
      ],
      fundamento: 'Legislación aplicable según la institución',
      consejos: [
        'Siempre lleva copias de todos los documentos',
        'Llega con anticipación a tu cita',
        'Conserva todos los acuses de recepción',
        'Si tienes dudas, acude al módulo de información',
      ],
    };

    // Buscar guía específica o usar genérica
    if (guias[institucionSeleccionada] && guias[institucionSeleccionada][tramiteSeleccionado]) {
      let guiaEspecifica = guias[institucionSeleccionada][tramiteSeleccionado];
      
      // Personalizar según detalles adicionales
      if (detalles && detalles.toLowerCase().includes('reactivar')) {
        guiaEspecifica = guias['IMSS — Instituto Mexicano del Seguro Social']['Reactivación de número de seguridad social'];
      }
      
      return guiaEspecifica;
    }
    
    return guiaGenerica;
  };

  const generarGuia = () => {
    if (!institucion) {
      alert('❌ Por favor, selecciona la institución.');
      return;
    }
    if (!tipoTramite) {
      alert('❌ Por favor, selecciona el tipo de trámite.');
      return;
    }

    setGenerando(true);
    setGuia(null);
    let tiempo = 30;
    setTiempoRestante(tiempo);

    const interval = setInterval(() => {
      tiempo -= 1;
      setTiempoRestante(tiempo);
      if (tiempo <= 0) clearInterval(interval);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      const guiaGenerada = generarGuiaPasoAPaso(institucion, tipoTramite, detallesAdicionales);
      setGuia(guiaGenerada);
      setGenerando(false);
      setTiempoRestante(0);
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">📋 Guía de Trámites Paso a Paso</h1>
      <p className="text-gray-600 mb-6">
        Guía paso a paso para trámites ante instituciones federales, estatales y municipales, 
        tribunales internacionales y organismos multilaterales.
      </p>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Selector de Institución */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              🏛️ Selector de Institución
            </label>
            <select
              value={institucion}
              onChange={(e) => {
                setInstitucion(e.target.value);
                setTipoTramite('');
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Seleccionar institución</option>
              {instituciones.map((inst) => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
          </div>

          {/* Tipo de trámite */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              📄 Tipo de trámite
            </label>
            <select
              value={tipoTramite}
              onChange={(e) => setTipoTramite(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={!institucion}
            >
              <option value="">Seleccionar tipo de trámite</option>
              {institucion && tiposTramitePorInstitucion[institucion]?.map((tramite) => (
                <option key={tramite} value={tramite}>{tramite}</option>
              ))}
              {institucion && !tiposTramitePorInstitucion[institucion] && (
                <>
                  <option value="Consulta general">Consulta general</option>
                  <option value="Solicitud de información">Solicitud de información</option>
                  <option value="Queja o reclamación">Queja o reclamación</option>
                  <option value="Certificación de documentos">Certificación de documentos</option>
                  <option value="Renovación de documentos">Renovación de documentos</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Recuadro para detalles adicionales */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            📝 Detalles adicionales (opcional)
          </label>
          <textarea
            rows="4"
            value={detallesAdicionales}
            onChange={(e) => setDetallesAdicionales(e.target.value)}
            placeholder="Ejemplo: 'Mi cliente fue dado de baja en el IMSS hace 2 años sin haberlo solicitado, necesita reactivar su número de seguridad social para recibir atención médica...'"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Describe detalles específicos de tu caso para una guía más personalizada.
          </p>
        </div>

        {/* Botón Generar */}
        <button
          onClick={generarGuia}
          disabled={generando || !institucion || !tipoTramite}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generando ? 'Generando guía paso a paso...' : '🚀 Generar guía paso a paso'}
        </button>

        {/* Barra de progreso */}
        {generando && (
          <div className="mt-4 text-center text-gray-600">
            <p>⏳ Analizando y generando guía... Tiempo estimado: {tiempoRestante} segundos</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${((30 - tiempoRestante) / 30) * 100}%` }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Resultado: Guía generada */}
      {guia && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">{guia.titulo}</h2>
            <p className="text-green-100">📚 {guia.fundamento}</p>
          </div>

          <div className="p-6">
            {/* Pasos */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📌</span> Pasos a seguir
              </h3>
              <div className="space-y-4">
                {guia.pasos.map((paso) => (
                  <div key={paso.paso} className="border-l-4 border-green-500 bg-gray-50 rounded-r-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                        {paso.paso}
                      </div>
                      <h4 className="font-bold text-gray-800 text-lg">{paso.titulo}</h4>
                    </div>
                    <p className="text-gray-700 mb-3">{paso.descripcion}</p>
                    
                    {paso.documentos && paso.documentos.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-2">
                        <p className="font-semibold text-blue-800 mb-1">📄 Documentos necesarios:</p>
                        <ul className="list-disc list-inside text-blue-700 text-sm">
                          {paso.documentos.map((doc, idx) => (
                            <li key={idx}>{doc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <p className="font-semibold text-yellow-800 mb-1">⏱️ Tiempo estimado:</p>
                      <p className="text-yellow-700 text-sm">{paso.tiempo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consejos adicionales */}
            {guia.consejos && guia.consejos.length > 0 && (
              <div className="bg-amber-50 rounded-lg p-5 mb-6">
                <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">💡</span> Consejos adicionales
                </h3>
                <ul className="space-y-2">
                  {guia.consejos.map((consejo, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-amber-700">
                      <span className="text-amber-500">✓</span>
                      <span>{consejo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nota legal */}
            <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
              <p className="font-semibold mb-1">⚠️ Nota importante:</p>
              <p>
                Esta guía es una simulación basada en información general. Los tiempos y requisitos pueden variar 
                según la institución y la ubicación geográfica. Se recomienda verificar la información actualizada 
                en el sitio web oficial de la institución correspondiente.
              </p>
            </div>

            {/* Botón para descargar guía */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => {
                  const guiaTexto = `
${guia.titulo}
${'='.repeat(guia.titulo.length)}

Fundamento legal: ${guia.fundamento}

PASOS A SEGUIR:
${guia.pasos.map(p => `
${p.paso}. ${p.titulo}
${p.descripcion}
Documentos: ${p.documentos?.join(', ') || 'No especificados'}
Tiempo estimado: ${p.tiempo}
`).join('\n')}

Consejos adicionales:
${guia.consejos?.map(c => `- ${c}`).join('\n')}

Nota: Esta guía es informativa. Consulta con un abogado para asesoría legal específica.
                  `;
                  const blob = new Blob([guiaTexto], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `guia_${institucion.replace(/\s/g, '_')}_${tipoTramite.replace(/\s/g, '_')}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                📥 Descargar guía (TXT)
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
              >
                🖨️ Imprimir guía
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuiaTramites;