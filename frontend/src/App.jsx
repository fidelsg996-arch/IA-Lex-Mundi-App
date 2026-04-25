import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PanelPrincipal from './pages/PanelPrincipal';
import Diplomados from './pages/Diplomados';
import Torneos from './pages/Torneos';
import Cursos from './pages/Cursos';
import MiSuscripcion from './pages/MiSuscripcion';
import Libros from './pages/Libros';
import Legislacion from './pages/Legislacion';
import MiBilletera from './pages/MiBilletera';
import Expedientes from './pages/Expedientes';
import CalculadoraLaboral from './pages/CalculadoraLaboral';
import CotizadorLegal from './pages/CotizadorLegal';
import GestorJuridico from './pages/GestorJuridico';
import GuiaTramites from './pages/GuiaTramites';
import AgendaLaboral from './pages/AgendaLaboral';
import AnalisisIA from './pages/AnalisisIA';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PanelPrincipal />} />
        <Route path="/diplomados" element={<Diplomados />} />
        <Route path="/torneos" element={<Torneos />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/mi-suscripcion" element={<MiSuscripcion />} />
        <Route path="/libros" element={<Libros />} />
        <Route path="/legislacion" element={<Legislacion />} />
        <Route path="/mi-billetera" element={<MiBilletera />} />
        <Route path="/expedientes" element={<Expedientes />} />
        <Route path="/calculadora-laboral" element={<CalculadoraLaboral />} />
        <Route path="/cotizador-legal" element={<CotizadorLegal />} />
        <Route path="/gestor-juridico" element={<GestorJuridico />} />
        <Route path="/guia-tramites" element={<GuiaTramites />} />
        <Route path="/agenda-laboral" element={<AgendaLaboral />} />
        <Route path="/analizador-ia" element={<AnalisisIA />} />
      </Routes>
    </Router>
  );
}

export default App;
