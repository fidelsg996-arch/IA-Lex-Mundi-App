import { useRef, useEffect } from "react";
import { Download, RotateCcw, GraduationCap } from "lucide-react";

const APP_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a87e2f7e00de14381bd1aa/c6e83a0ff_generated_image.png";

export default function Certificado({
  nombre,
  materia,
  nivel,
  cursoTitulo,
  duracionHoras,
  puntaje,
  codigo,
  fecha,
  fechaInicio,
  fechaFin,
  onVolver,
  onReset,
  tipo = "certificado",
}) {
  const certRef = useRef(null);
  const firmaDirectoraRef = useRef(null);
  const firmaCoordinadorRef = useRef(null);
  const directoraName = "Dra. Aline Fortune Montesuri";
  const coordinadorName = "Dr. Alejandro Ríos Vargas";

  // Función auxiliar para dibujar una firma en un canvas a partir de dataURL
  const dibujarFirma = (canvasElement, dataURL) => {
    if (!canvasElement || !dataURL) return;
    const ctx = canvasElement.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      // Ajustar tamaño manteniendo proporción
      const scale = Math.min(
        (canvasElement.width - 40) / img.width,
        (canvasElement.height - 20) / img.height
      );
      const width = img.width * scale;
      const height = img.height * scale;
      const x = (canvasElement.width - width) / 2;
      const y = (canvasElement.height - height) / 2;
      ctx.drawImage(img, x, y, width, height);
      console.log(`Firma dibujada en canvas (${dataURL.substring(0, 50)}...)`);
    };
    img.onerror = (err) => console.error("Error al cargar imagen de firma", err);
    img.src = dataURL;
  };

  // Cargar firmas desde sessionStorage (enviadas por el panel) o localStorage (fallback)
  useEffect(() => {
    const cargarFirmas = () => {
      // 1. Priorizar sessionStorage
      const sessionData = sessionStorage.getItem('firmas_certificado');
      if (sessionData) {
        try {
          const { directora, coordinador } = JSON.parse(sessionData);
          if (directora) {
            dibujarFirma(firmaDirectoraRef.current, directora);
            console.log("Firma directora cargada desde sessionStorage");
          }
          if (coordinador) {
            dibujarFirma(firmaCoordinadorRef.current, coordinador);
            console.log("Firma coordinador cargada desde sessionStorage");
          }
          // Limpiar sessionStorage para no reutilizar en otros certificados (opcional)
          // sessionStorage.removeItem('firmas_certificado');
          return;
        } catch(e) { console.warn("Error parseando sessionStorage", e); }
      }
      // 2. Fallback a localStorage
      const directora = localStorage.getItem('firma_Dra. Aline Fortune Montesuri');
      const coordinador = localStorage.getItem('firma_Dr. Alejandro Ríos Vargas');
      if (directora) {
        dibujarFirma(firmaDirectoraRef.current, directora);
        console.log("Firma directora cargada desde localStorage");
      }
      if (coordinador) {
        dibujarFirma(firmaCoordinadorRef.current, coordinador);
        console.log("Firma coordinador cargada desde localStorage");
      }
    };

    cargarFirmas();

    // Escuchar mensajes del panel (por si se envía después de cargar el componente)
    const handleMessage = (event) => {
      if (event.data?.type === 'FIRMAS_CERTIFICADO') {
        const { directora, coordinador } = event.data.firmas;
        if (directora) dibujarFirma(firmaDirectoraRef.current, directora);
        if (coordinador) dibujarFirma(firmaCoordinadorRef.current, coordinador);
        console.log("Firmas recibidas por postMessage");
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const abrirVerificador = () => {
    const url = `https://ialexmundi.cursos/firma.php/${codigo || 'CONST-72O6LK-MNP3NBJ2'}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDescargar = async () => {
    if (!certRef.current) return;
    // Pequeño retardo para asegurar que las imágenes se hayan dibujado
    await new Promise(resolve => setTimeout(resolve, 300));
    import("html2canvas").then(({ default: html2canvas }) => {
      html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      }).then((canvas) => {
        import("jspdf").then(({ jsPDF }) => {
          const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [215.9, 330.2] });
          const imgData = canvas.toDataURL("image/png");
          pdf.addImage(imgData, "PNG", 0, 0, 215.9, 330.2);
          pdf.save(`${tipo === "constancia" ? "Constancia" : "Certificado"}-LexMundi-${codigo}.pdf`);
        });
      });
    });
  };

  const esCertificado = tipo === "certificado";
  const tituloDoc = esCertificado ? "CERTIFICACIÓN OFICIAL" : "CONSTANCIA DE PARTICIPACIÓN";
  const urlFirma = `https://ialexmundi.cursos/firma.php/${codigo || 'CONST-72O6LK-MNP3NBJ2'}`;

  // Generar QR simple
  useEffect(() => {
    const generarQR = () => {
      const qrCanvas = document.getElementById('qr-code');
      if (qrCanvas) {
        const ctx = qrCanvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 80, 80);
        ctx.fillStyle = '#000000';
        const size = 80;
        const blockSize = 4;
        for (let i = 0; i < size; i += blockSize) {
          for (let j = 0; j < size; j += blockSize) {
            if ((i + j) % 10 === 0 || (i * j) % 100 === 0) {
              ctx.fillRect(i, j, blockSize - 1, blockSize - 1);
            }
          }
        }
        ctx.fillRect(0, 0, 20, 20);
        ctx.fillRect(60, 0, 20, 20);
        ctx.fillRect(0, 60, 20, 20);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(4, 4, 12, 12);
        ctx.fillRect(64, 4, 12, 12);
        ctx.fillRect(4, 64, 12, 12);
      }
    };
    generarQR();
  }, []);

  return (
    <div className="space-y-4">
      <div
        ref={certRef}
        style={{
          width: "680px",
          minHeight: "1080px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          fontFamily: "'Times New Roman', Times, serif",
          border: "1px solid #ddd",
          boxSizing: "border-box",
          position: "relative",
          padding: "44px 52px 36px 52px",
        }}
      >
        {/* Franja lateral derecha de seguridad */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "28px",
            backgroundColor: "#f0f0f0",
            borderLeft: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              transform: "rotate(90deg)",
              whiteSpace: "nowrap",
              fontSize: "7px",
              color: "#999",
              letterSpacing: "0.8px",
              fontFamily: "sans-serif",
            }}
          >
            DAC · La autenticidad, validez e integridad de este documento puede ser verificada · Código Seguro de Verificación (CSV)
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "60px",
              right: "2px",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i % 3 === 0 ? "20px" : i % 5 === 0 ? "16px" : "12px",
                  height: "2px",
                  backgroundColor: "#333",
                }}
              />
            ))}
          </div>
        </div>

        {/* Encabezado con logo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "22px",
            paddingRight: "30px",
          }}
        >
          <img
            src={APP_LOGO}
            alt="IA LEX MUNDI"
            style={{
              width: 88,
              height: 88,
              objectFit: "cover",
              borderRadius: "50%",
              border: "3px solid #1a2e5a",
              marginBottom: "10px",
            }}
          />
          <div
            style={{
              fontSize: "15px",
              fontWeight: "bold",
              color: "#1a2e5a",
              letterSpacing: "3px",
              fontFamily: "sans-serif",
            }}
          >
            IA LEX MUNDI
          </div>
          <div
            style={{
              fontSize: "9px",
              color: "#666",
              letterSpacing: "2px",
              fontFamily: "sans-serif",
              marginTop: "2px",
            }}
          >
            INTERNATIONAL LAW PLATFORM
          </div>
        </div>

        {/* Línea separadora doble */}
        <div style={{ paddingRight: "30px", marginBottom: "18px" }}>
          <div style={{ height: "2px", backgroundColor: "#1a2e5a" }} />
          <div style={{ height: "1px", backgroundColor: "#c9aa71", marginTop: "3px" }} />
        </div>

        {/* Tipo de documento */}
        <div
          style={{
            textAlign: "center",
            fontSize: "11px",
            color: "#888",
            letterSpacing: "3px",
            fontFamily: "sans-serif",
            marginBottom: "20px",
            paddingRight: "30px",
            textTransform: "uppercase",
          }}
        >
          {tituloDoc}
        </div>

        {/* Texto introductorio */}
        <div
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "#222",
            lineHeight: "1.8",
            marginBottom: "16px",
            paddingRight: "30px",
          }}
        >
          La Dirección General de Formación Jurídica de<br />
          <strong>IA Lex Mundi International Law Platform</strong>
          <br />
          hace constar que
        </div>

        {/* Nombre del estudiante */}
        <div style={{ textAlign: "center", marginBottom: "6px", paddingRight: "30px" }}>
          <div
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#1a2e5a",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            {nombre}
          </div>
        </div>

        {/* Separador dorado bajo nombre */}
        <div style={{ paddingRight: "30px", marginBottom: "20px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "120px", height: "2px", backgroundColor: "#c9aa71" }} />
        </div>

        {/* Texto cuerpo */}
        <div
          style={{
            fontSize: "12.5px",
            color: "#222",
            lineHeight: "1.85",
            marginBottom: "16px",
            textAlign: "justify",
            paddingRight: "30px",
          }}
        >
          ha participado en los estudios correspondientes al programa educativo aprobado por el Consejo Académico de la
          Plataforma, celebrado en el marco de la formación jurídica continua de{" "}
          <strong>IA Lex Mundi International Law Platform</strong>, por lo que se le expide la presente:
        </div>

        {/* Título del documento y del curso */}
        <div style={{ textAlign: "center", margin: "0 0 16px 0", paddingRight: "30px" }}>
          <div
            style={{
              fontSize: "15px",
              fontWeight: "bold",
              color: "#c0392b",
              textTransform: "uppercase",
              lineHeight: "1.5",
              letterSpacing: "0.5px",
            }}
          >
            CONSTANCIA DE PARTICIPACIÓN EN
          </div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "#c0392b",
              textTransform: "uppercase",
              lineHeight: "1.5",
              marginTop: "6px",
            }}
          >
            {cursoTitulo}
          </div>
        </div>

        {/* Texto con duración y verificación */}
        <div
          style={{
            fontSize: "12.5px",
            color: "#222",
            lineHeight: "1.85",
            marginBottom: "20px",
            textAlign: "justify",
            paddingRight: "30px",
          }}
        >
          Con una duración de {duracionHoras} horas, con valor curricular y supervisado por la Coordinación Académica e
          Identificación Digital Firma Electrónica Universitaria en{" "}
          <span 
            onClick={abrirVerificador}
            style={{ 
              color: "#1a2e5a", 
              wordBreak: "break-all",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: "bold"
            }}
            title="Haz clic para verificar la autenticidad del documento"
          >
            {urlFirma}
          </span>.
        </div>

        {/* Fecha de expedición */}
        <div style={{ textAlign: "center", fontSize: "12.5px", color: "#222", marginBottom: "28px", paddingRight: "30px" }}>
          Ciudad de México; a {fecha}
        </div>

        {/* SECCIÓN DE FIRMAS */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          gap: "30px",
          margin: "20px 30px 20px 0"
        }}>
          {/* Firma de la Directora General */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <canvas
              ref={firmaDirectoraRef}
              width={300}
              height={100}
              style={{
                width: "100%",
                height: "100px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "#fff"
              }}
            />
            <div style={{ 
              fontSize: "11px", 
              color: "#555", 
              fontWeight: "bold",
              marginTop: "8px",
              marginBottom: "2px"
            }}>
              {directoraName}
            </div>
            <div style={{ 
              fontSize: "10px", 
              color: "#c0392b", 
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Dirección General de Formación Jurídica
            </div>
            <div style={{ 
              fontSize: "9px", 
              color: "#555", 
              lineHeight: "1.3",
              marginBottom: "1px"
            }}>
              Créditos ECTS: 6 / horas: 150
            </div>
            <div style={{ 
              fontSize: "8px", 
              color: "#666", 
              lineHeight: "1.2"
            }}>
              R.D.1125/2003 de 5 de septiembre de 2003 (BOE del 18 de Septiembre)
            </div>
          </div>

          {/* Firma del Coordinador Académico */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <canvas
              ref={firmaCoordinadorRef}
              width={300}
              height={100}
              style={{
                width: "100%",
                height: "100px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "#fff"
              }}
            />
            <div style={{ 
              fontSize: "11px", 
              color: "#555", 
              fontWeight: "bold",
              marginTop: "8px",
              marginBottom: "2px"
            }}>
              {coordinadorName}
            </div>
            <div style={{ 
              fontSize: "10px", 
              color: "#c0392b", 
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Coordinación Académica e Identificación Digital
            </div>
            <div style={{ 
              fontSize: "9px", 
              color: "#555", 
              lineHeight: "1.3",
              marginBottom: "1px"
            }}>
              No. de Registro: TP0053585
            </div>
            <div style={{ 
              fontSize: "8px", 
              color: "#666", 
              lineHeight: "1.2"
            }}>
              Este documento está firmado digitalmente
            </div>
          </div>
        </div>

        {/* Pie de página con QR y cadena de verificación */}
        <div style={{ 
          borderTop: "1px solid #333", 
          paddingTop: "12px", 
          marginRight: "30px", 
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "8px", color: "#444", marginBottom: "4px" }}>
              <strong>IA Lex Mundi International Law</strong>
            </div>
            <div style={{ 
              fontSize: "7px", 
              color: "#666", 
              lineHeight: "1.3",
              fontFamily: "monospace",
              wordBreak: "break-all"
            }}>
              Cadena: YkyPHmXPK10XghaTb01y5Dnq+Zej5c3HitmbHne71bZLZd<br />
              Jg9MBk0E+t0U2gDFVquVez8hxm
            </div>
          </div>
          <div style={{ 
            marginLeft: "15px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <canvas 
              id="qr-code"
              width="80" 
              height="80"
              style={{
                width: "80px",
                height: "80px",
                border: "1px solid #ddd"
              }}
            />
            <div style={{ fontSize: "6px", color: "#999", marginTop: "4px", textAlign: "center" }}>
              Verificar autenticidad
            </div>
          </div>
        </div>
        
        {/* Información adicional de verificación */}
        <div style={{ 
          fontSize: "6px", 
          color: "#999", 
          textAlign: "center", 
          marginTop: "8px",
          paddingRight: "30px"
        }}>
          Documento validado digitalmente según la normativa europea eIDAS. Verifique la autenticidad mediante el código QR.
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 max-w-[680px] mx-auto">
        <button onClick={handleDescargar} className="flex-1 gap-2 bg-amber-500 text-white py-2 rounded-lg flex items-center justify-center">
          <Download className="w-4 h-4 mr-2" />
          Descargar PDF
        </button>
        <button onClick={onVolver} className="px-4 py-2 border rounded-lg flex items-center gap-2">
          <GraduationCap className="w-4 h-4" />
          Ver resultado
        </button>
        <button onClick={onReset} className="px-4 py-2 border rounded-lg flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          {tipo === "constancia" ? "Nuevo curso" : "Nuevo quiz"}
        </button>
      </div>
    </div>
  );
}