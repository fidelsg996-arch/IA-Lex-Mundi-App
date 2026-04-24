// ai-assistant.js - Servidor de asistente IA
const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de rutas
const PROJECT_PATH = 'C:\\IA Lex Mundi\\frontend\\src';
const BACKEND_PATH = 'C:\\IA Lex Mundi\\backend\\src';

// Mapa de comandos disponibles
const COMMANDS = {
  // Crear nuevos módulos
  createModule: async (params) => {
    const { moduleName, description, fields } = params;
    const modulePath = path.join(PROJECT_PATH, 'modules', moduleName);
    
    // Crear estructura del módulo
    await fs.ensureDir(modulePath);
    await fs.ensureDir(path.join(modulePath, 'components'));
    await fs.ensureDir(path.join(modulePath, 'services'));
    await fs.ensureDir(path.join(modulePath, 'styles'));
    await fs.ensureDir(path.join(modulePath, 'pages'));
    
    // Crear servicio
    const serviceContent = `
// services/${moduleName}Service.js
import { httpService } from '../../../core/services/httpService';

class ${capitalize(moduleName)}Service {
  async getAll() {
    return httpService.get('/${moduleName}');
  }

  async getById(id) {
    return httpService.get('/${moduleName}/' + id);
  }

  async create(data) {
    return httpService.post('/${moduleName}', data);
  }

  async update(id, data) {
    return httpService.put('/${moduleName}/' + id, data);
  }

  async delete(id) {
    return httpService.delete('/${moduleName}/' + id);
  }
}

export const ${moduleName}Service = new ${capitalize(moduleName)}Service();
`;
    
    await fs.writeFile(path.join(modulePath, 'services', `${moduleName}Service.js`), serviceContent);
    
    // Crear componente principal
    const componentContent = `
// components/${capitalize(moduleName)}List.js
import React, { useState, useEffect } from 'react';
import { ${moduleName}Service } from '../services/${moduleName}Service';
import './${capitalize(moduleName)}Styles.css';

const ${capitalize(moduleName)}List = ({ onEdit, onView }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await ${moduleName}Service.getAll();
      setItems(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este elemento?')) {
      await ${moduleName}Service.delete(id);
      loadItems();
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="${moduleName}-container">
      <h2>📋 ${capitalize(moduleName)}</h2>
      <button onClick={() => onEdit(null)}>+ Nuevo</button>
      <div className="items-grid">
        {items.map(item => (
          <div key={item._id} className="item-card">
            <h3>{item.titulo || item.nombre}</h3>
            <button onClick={() => onView(item._id)}>Ver</button>
            <button onClick={() => onEdit(item)}>Editar</button>
            <button onClick={() => handleDelete(item._id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ${capitalize(moduleName)}List;
`;
    
    await fs.writeFile(path.join(modulePath, 'components', `${capitalize(moduleName)}List.js`), componentContent);
    
    return {
      success: true,
      message: `Módulo "${moduleName}" creado exitosamente`,
      path: modulePath,
      files: ['service', 'component', 'styles']
    };
  },
  
  // Agregar campo a formulario existente
  addFieldToForm: async (params) => {
    const { moduleName, fieldName, fieldType, label, required } = params;
    const formPath = path.join(PROJECT_PATH, 'modules', moduleName, 'components', `${capitalize(moduleName)}Form.js`);
    
    if (!await fs.pathExists(formPath)) {
      return { success: false, message: `No se encontró el formulario de ${moduleName}` };
    }
    
    let content = await fs.readFile(formPath, 'utf8');
    
    // Buscar el lugar para insertar el campo
    const fieldCode = `
            <div className="form-group">
              <label>${label}</label>
              <input
                type="${fieldType}"
                name="${fieldName}"
                value={formData.${fieldName}}
                onChange={handleChange}
                ${required ? 'required' : ''}
              />
            </div>`;
    
    // Insertar antes del último div del formulario
    content = content.replace(/<\/div>\s*<div className="modal-footer">/, fieldCode + '\n          </div>\n          <div className="modal-footer">');
    
    await fs.writeFile(formPath, content);
    
    return {
      success: true,
      message: `Campo "${label}" agregado al formulario de ${moduleName}`
    };
  },
  
  // Agregar columna a tabla
  addColumnToList: async (params) => {
    const { moduleName, columnName, fieldName } = params;
    const listPath = path.join(PROJECT_PATH, 'modules', moduleName, 'components', `${capitalize(moduleName)}List.js`);
    
    let content = await fs.readFile(listPath, 'utf8');
    
    const columnCode = `<p><strong>${columnName}:</strong> {item.${fieldName}}</p>`;
    
    // Insertar en el cuerpo de la tarjeta
    content = content.replace(/<div className="item-body">/, `<div className="item-body">\n              ${columnCode}`);
    
    await fs.writeFile(listPath, content);
    
    return {
      success: true,
      message: `Columna "${columnName}" agregada a la lista de ${moduleName}`
    };
  },
  
  // Modificar estilos
  modifyStyles: async (params) => {
    const { moduleName, cssRules } = params;
    const stylesPath = path.join(PROJECT_PATH, 'modules', moduleName, 'styles', `${capitalize(moduleName)}Styles.css`);
    
    let content = await fs.readFile(stylesPath, 'utf8') || '';
    content += `\n\n/* Modificación automática */\n${cssRules}`;
    
    await fs.writeFile(stylesPath, content);
    
    return {
      success: true,
      message: `Estilos actualizados para ${moduleName}`
    };
  },
  
  // Agregar endpoint al backend
  addBackendEndpoint: async (params) => {
    const { endpointName, collectionName, fields } = params;
    const routesPath = path.join(BACKEND_PATH, 'routes', `${endpointName}.js`);
    
    // Crear modelo
    const modelContent = `
const mongoose = require('mongoose');

const ${endpointName}Schema = new mongoose.Schema({
  ${fields.map(f => `${f.name}: { type: ${f.type}, ${f.required ? 'required: true' : ''} }`).join(',\n  ')}
}, { timestamps: true });

module.exports = mongoose.model('${capitalize(collectionName)}', ${endpointName}Schema);
`;
    
    await fs.writeFile(path.join(BACKEND_PATH, 'models', `${capitalize(collectionName)}.js`), modelContent);
    
    // Crear rutas
    const routesContent = `
const express = require('express');
const router = express.Router();
const ${capitalize(collectionName)} = require('../models/${capitalize(collectionName)}');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
  try {
    const items = await ${capitalize(collectionName)}.find({ usuario: req.user._id });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const item = new ${capitalize(collectionName)}({ ...req.body, usuario: req.user._id });
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
`;
    
    await fs.writeFile(routesPath, routesContent);
    
    // Registrar en index.js
    const indexPath = path.join(BACKEND_PATH, 'index.js');
    let indexContent = await fs.readFile(indexPath, 'utf8');
    
    const registerLine = `app.use('/api/${endpointName}', verifyToken, require('./routes/${endpointName}'));`;
    if (!indexContent.includes(registerLine)) {
      // Buscar lugar para insertar
      const insertAfter = "// =========================\n// 🔐 RUTAS PROTEGIDAS (LOGIN)\n// =========================";
      indexContent = indexContent.replace(insertAfter, insertAfter + `\napp.use('/api/${endpointName}', verifyToken, require('./routes/${endpointName}'));`);
      await fs.writeFile(indexPath, indexContent);
    }
    
    return {
      success: true,
      message: `Endpoint /api/${endpointName} creado en el backend`
    };
  },
  
  // Agregar al menú
  addToMenu: async (params) => {
    const { moduleName, icon, name } = params;
    const appPath = path.join(PROJECT_PATH, 'App.js');
    let content = await fs.readFile(appPath, 'utf8');
    
    const menuItem = `    {
      id: '${moduleName}',
      name: '${name}',
      icon: '${icon}',
      component: ${capitalize(moduleName)}List,
      module: ${moduleName}Module
    },`;
    
    // Insertar antes del último elemento del menú
    content = content.replace(/const MENU_ITEMS = \[([\s\S]*?)\];/, (match, menuContent) => {
      return `const MENU_ITEMS = [${menuContent}${menuItem}\n];`;
    });
    
    // Agregar import
    const importLine = `import ${moduleName}Module, { ${capitalize(moduleName)}List } from './modules/${moduleName}';`;
    if (!content.includes(importLine)) {
      content = content.replace(/\/\/ Importar módulos/, `// Importar módulos\n${importLine}`);
    }
    
    await fs.writeFile(appPath, content);
    
    return {
      success: true,
      message: `"${name}" agregado al menú principal`
    };
  }
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Endpoint para procesar comandos en lenguaje natural
app.post('/api/command', async (req, res) => {
  const { command } = req.body;
  console.log('📝 Comando recibido:', command);
  
  // Analizar comando con regex
  let result;
  
  // Detectar creación de módulo
  if (command.match(/crear (nuevo )?modulo/i) || command.match(/create (new )?module/i)) {
    const moduleMatch = command.match(/(?:modulo|module)\s+(\w+)/i);
    const moduleName = moduleMatch ? moduleMatch[1].toLowerCase() : 'nuevo';
    result = await COMMANDS.createModule({ moduleName, description: command });
  }
  
  // Detectar agregar campo
  else if (command.match(/agregar (un )?campo/i) || command.match(/add (a )?field/i)) {
    const fieldMatch = command.match(/campo\s+(\w+)\s+(?:de tipo|type)\s+(\w+)/i);
    const moduleMatch = command.match(/en (?:el )?modulo\s+(\w+)/i);
    
    if (fieldMatch && moduleMatch) {
      result = await COMMANDS.addFieldToForm({
        moduleName: moduleMatch[1],
        fieldName: fieldMatch[1],
        fieldType: fieldMatch[2],
        label: fieldMatch[1],
        required: command.includes('requerido') || command.includes('required')
      });
    }
  }
  
  // Detectar agregar columna
  else if (command.match(/agregar (una )?columna/i) || command.match(/add (a )?column/i)) {
    const columnMatch = command.match(/columna\s+(\w+)\s+para\s+(\w+)/i);
    if (columnMatch) {
      result = await COMMANDS.addColumnToList({
        moduleName: columnMatch[2],
        columnName: columnMatch[1],
        fieldName: columnMatch[1].toLowerCase()
      });
    }
  }
  
  // Detectar agregar endpoint
  else if (command.match(/crear (un )?endpoint/i) || command.match(/create (an )?endpoint/i)) {
    const endpointMatch = command.match(/(?:endpoint|api)\s+(\w+)/i);
    if (endpointMatch) {
      result = await COMMANDS.addBackendEndpoint({
        endpointName: endpointMatch[1],
        collectionName: endpointMatch[1],
        fields: [{ name: 'nombre', type: 'String', required: true }]
      });
    }
  }
  
  // Detectar agregar al menú
  else if (command.match(/agregar al menu/i) || command.match(/add to menu/i)) {
    const moduleMatch = command.match(/modulo\s+(\w+)/i);
    const nameMatch = command.match(/como\s+["']?([^"']+)["']?/i);
    if (moduleMatch) {
      result = await COMMANDS.addToMenu({
        moduleName: moduleMatch[1],
        name: nameMatch ? nameMatch[1] : moduleMatch[1],
        icon: '📄'
      });
    }
  }
  
  // Si no se reconoce
  else {
    result = {
      success: false,
      message: 'Comando no reconocido. Ejemplos:\n' +
        '- "Crear modulo contratos"\n' +
        '- "Agregar campo telefono de tipo text en modulo expedientes"\n' +
        '- "Agregar columna prioridad para expedientes"\n' +
        '- "Crear endpoint clientes"\n' +
        '- "Agregar modulo facturas al menu como Facturación"'
    };
  }
  
  res.json(result);
});

// Endpoint para reconstruir el proyecto después de cambios
app.post('/api/rebuild', async (req, res) => {
  try {
    console.log('🔄 Reconstruyendo frontend...');
    await execPromise('cd C:\\IA Lex Mundi\\frontend && npm run build', { shell: true });
    res.json({ success: true, message: 'Proyecto reconstruido' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║     🤖 ASISTENTE IA PARA MODIFICAR TU APP                ║
  ║     Servidor corriendo en puerto ${PORT}                     ║
  ║     API: http://localhost:${PORT}/api/command             ║
  ╚═══════════════════════════════════════════════════════════╝
  `);
});