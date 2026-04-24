import React, { useState, useEffect } from 'react';

const AdminFirmas = () => {
  const [previewAline, setPreviewAline] = useState(null);
  const [previewAlejandro, setPreviewAlejandro] = useState(null);

  // Cargar firmas existentes al iniciar
  useEffect(() => {
    const firmaAline = localStorage.getItem('firma_Dra. Aline Fortune Montesuri');
    const firmaAlejandro = localStorage.getItem('firma_Dr. Alejandro Ríos Vargas');
    if (firmaAline) setPreviewAline(firmaAline);
    if (firmaAlejandro) setPreviewAlejandro(firmaAlejandro);
  }, []);

  // Subir imagen y guardar en localStorage
  const handleSubirImagen = (nombre, setPreview) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataURL = ev.target.result;
      localStorage.setItem(`firma_${nombre}`, dataURL);
      setPreview(dataURL);
      alert(`✅ Firma de ${nombre} guardada correctamente`);
      console.log(`Guardado: firma_${nombre}`, dataURL.substring(0, 100) + '...');
    };
    reader.readAsDataURL(file);
  };

  // Limpiar firma
  const limpiarFirma = (nombre, setPreview) => () => {
    localStorage.removeItem(`firma_${nombre}`);
    setPreview(null);
    alert(`Firma de ${nombre} eliminada`);
  };

  // Enviar firmas al certificado (usando sessionStorage y postMessage)
  const enviarFirmasAlCertificado = () => {
    const firmas = {
      directora: localStorage.getItem('firma_Dra. Aline Fortune Montesuri'),
      coordinador: localStorage.getItem('firma_Dr. Alejandro Ríos Vargas')
    };
    // Guardar en sessionStorage para que lo lea el certificado
    sessionStorage.setItem('firmas_certificado', JSON.stringify(firmas));
    // Enviar mensaje a cualquier pestaña que escuche
    window.postMessage({ type: 'FIRMAS_CERTIFICADO', firmas }, '*');
    alert('✅ Firmas enviadas al certificado. Ahora genera el PDF.');
    console.log('Firmas enviadas:', firmas);
  };

  // Exportar firmas a archivo JSON
  const exportarFirmas = () => {
    const data = {
      'Dra. Aline Fortune Montesuri': localStorage.getItem('firma_Dra. Aline Fortune Montesuri'),
      'Dr. Alejandro Ríos Vargas': localStorage.getItem('firma_Dr. Alejandro Ríos Vargas')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'firmas_backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Importar firmas desde archivo JSON
  const importarFirmas = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data['Dra. Aline Fortune Montesuri']) {
          localStorage.setItem('firma_Dra. Aline Fortune Montesuri', data['Dra. Aline Fortune Montesuri']);
          setPreviewAline(data['Dra. Aline Fortune Montesuri']);
        }
        if (data['Dr. Alejandro Ríos Vargas']) {
          localStorage.setItem('firma_Dr. Alejandro Ríos Vargas', data['Dr. Alejandro Ríos Vargas']);
          setPreviewAlejandro(data['Dr. Alejandro Ríos Vargas']);
        }
        alert('✅ Importación exitosa');
      } catch (err) {
        alert('❌ Error al importar: archivo no válido');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Panel de Administración - Firmas Autógrafas</h1>
      <p>Sube una imagen JPG o PNG para cada directivo. Se guardarán automáticamente.</p>

      {/* Firma Dra. Aline */}
      <div style={{ border: '1px solid #ccc', marginBottom: 20, padding: 15, borderRadius: 8 }}>
        <h3>Dra. Aline Fortune Montesuri</h3>
        <p>Dirección General de Formación Jurídica</p>
        {previewAline && (
          <img src={previewAline} alt="Firma" style={{ maxWidth: 300, maxHeight: 100, border: '1px solid #aaa', marginBottom: 10 }} />
        )}
        <div>
          <input type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleSubirImagen('Dra. Aline Fortune Montesuri', setPreviewAline)} />
          <button onClick={limpiarFirma('Dra. Aline Fortune Montesuri', setPreviewAline)} style={{ marginLeft: 10 }}>Limpiar</button>
        </div>
      </div>

      {/* Firma Dr. Alejandro */}
      <div style={{ border: '1px solid #ccc', marginBottom: 20, padding: 15, borderRadius: 8 }}>
        <h3>Dr. Alejandro Ríos Vargas</h3>
        <p>Coordinación Académica e Identificación Digital</p>
        {previewAlejandro && (
          <img src={previewAlejandro} alt="Firma" style={{ maxWidth: 300, maxHeight: 100, border: '1px solid #aaa', marginBottom: 10 }} />
        )}
        <div>
          <input type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleSubirImagen('Dr. Alejandro Ríos Vargas', setPreviewAlejandro)} />
          <button onClick={limpiarFirma('Dr. Alejandro Ríos Vargas', setPreviewAlejandro)} style={{ marginLeft: 10 }}>Limpiar</button>
        </div>
      </div>

      {/* Botones de respaldo y envío */}
      <div style={{ marginTop: 20 }}>
        <button onClick={exportarFirmas}>Exportar firmas a archivo</button>
        <input type="file" accept="application/json" onChange={importarFirmas} style={{ marginLeft: 10 }} />
        <button onClick={enviarFirmasAlCertificado} style={{ marginLeft: 10, backgroundColor: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4 }}>
          📤 Enviar firmas al certificado
        </button>
      </div>
      <p style={{ fontSize: 12, color: '#666', marginTop: 20 }}>
        Las firmas se guardan en localStorage. Usa el botón <strong>"Enviar firmas al certificado"</strong> antes de generar el PDF.
      </p>
    </div>
  );
};

export default AdminFirmas;