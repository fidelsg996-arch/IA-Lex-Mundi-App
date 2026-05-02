// modules/expedientes/index.js
import ExpedientesList from './components/ExpedientesList';
import ExpedienteForm from './components/ExpedienteForm';
import ExpedienteDetail from './components/ExpedienteDetail';
import { expedienteService } from './services/expedienteService';

// Configuración del módulo
export const expedientesModule = {
  name: 'Expedientes',
  icon: '📁',
  path: '/expedientes',
  component: ExpedientesList,
  formComponent: ExpedienteForm,
  detailComponent: ExpedienteDetail,
  service: expedienteService,
  menuOrder: 2,
  permissions: ['user', 'admin']
};

// Exportar componentes individuales
export { ExpedientesList, ExpedienteForm, ExpedienteDetail, expedienteService };
export default expedientesModule;