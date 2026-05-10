import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToolsProvider } from './context/ToolsContext';
import { BilleteraProvider } from './context/BilleteraContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './Layout';
import Login from './Login';
import LandingPage from './LandingPage';
import Registrarse from './pages/Registrarse';
import PanelPrincipal from './pages/PanelPrincipal';
import Expedientes from './pages/Expedientes';
import AgendaLaboral from './pages/AgendaLaboral';
import CalculadoraLaboral from './pages/CalculadoraLaboral';
import CotizadorLegal from './pages/CotizadorLegal';
import AnalisisIA from './pages/AnalisisIA';
import GestorJuridico from './pages/GestorJuridico';
import GuiaTramites from './pages/GuiaTramites';
import Legislacion from './pages/Legislacion';
import QuizLegal from './pages/QuizLegal';
import Libros from './pages/Libros/Libros';
import Cursos from './pages/Cursos';
import CursoDetalle from './pages/Cursos/CursoDetalle';
import Diplomados from './pages/Diplomados';
import Torneos from './pages/Torneos';
import ReclamarPremio from './pages/ReclamarPremio';
import Herramientas from './pages/Herramientas';
import DescargarAndroid from './pages/DescargarAndroid';
import SuscripcionFree from './pages/SuscripcionFree';
import SuscripcionPro from './pages/SuscripcionPro';
import SuscripcionPremium from './pages/SuscripcionPremium';
import AvisoLegal from './pages/AvisoLegal';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import TerminosUso from './pages/TerminosUso';
import Contacto from './pages/Contacto';
import MiSuscripcion from './pages/MiSuscripcion';
import MiBilletera from './pages/MiBilletera';
import AdminPanel from './pages/AdminPanel';
import AdminFirmas from './components/AdminFirmas';
import PreguntasAdmin from './pages/Admin/PreguntasAdmin';  // ✅ NUEVA IMPORTACIÓN

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToolsProvider>
          <BilleteraProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/acceso" element={<Login />} />
              <Route path="/registrarse" element={<Registrarse />} />
              
              <Route element={<Layout />}>
                <Route path="/panel-principal" element={<PanelPrincipal />} />
                <Route path="/expedientes" element={<Expedientes />} />
                <Route path="/agenda-laboral" element={<AgendaLaboral />} />
                <Route path="/calculadora-laboral" element={<CalculadoraLaboral />} />
                <Route path="/cotizador-legal" element={<CotizadorLegal />} />
                <Route path="/analisis-ia" element={<AnalisisIA />} />
                <Route path="/gestor-juridico" element={<GestorJuridico />} />
                <Route path="/guia-tramites" element={<GuiaTramites />} />
                <Route path="/legislacion" element={<Legislacion />} />
                <Route path="/quiz-legal" element={<QuizLegal />} />
                <Route path="/libros" element={<Libros />} />
                
                <Route path="/cursos" element={<Cursos />} />
                <Route path="/cursos/nuevo" element={<CursoDetalle />} />
                <Route path="/cursos/:id" element={<CursoDetalle />} />
                <Route path="/cursos/:id/editar" element={<CursoDetalle />} />
                
                <Route path="/diplomados" element={<Diplomados />} />
                <Route path="/torneos" element={<Torneos />} />
                <Route path="/reclamar-premio" element={<ReclamarPremio />} />
                <Route path="/mi-suscripcion" element={<MiSuscripcion />} />
                <Route path="/mi-billetera" element={<MiBilletera />} />
                <Route path="/herramientas" element={<Herramientas />} />
                <Route path="/descargar-android" element={<DescargarAndroid />} />
                <Route path="/suscripcion/free" element={<SuscripcionFree />} />
                <Route path="/suscripcion/pro" element={<SuscripcionPro />} />
                <Route path="/suscripcion/premium" element={<SuscripcionPremium />} />
                <Route path="/aviso-legal" element={<AvisoLegal />} />
                <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
                <Route path="/terminos-uso" element={<TerminosUso />} />
                <Route path="/contacto" element={<Contacto />} />
              </Route>

              <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
              <Route path="/admin/preguntas" element={<ProtectedRoute><PreguntasAdmin /></ProtectedRoute>} />  {/* ✅ NUEVA RUTA */}
              <Route path="/admin/firmas-secreto-2024" element={<AdminFirmas />} />
            </Routes>
          </BilleteraProvider>
        </ToolsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;