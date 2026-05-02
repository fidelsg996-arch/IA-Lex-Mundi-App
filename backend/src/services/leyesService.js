const axios = require('axios');
const cheerio = require('cheerio');
const pdfParse = require('pdf-parse');
const Ley = require('../models/Ley');

// Fuentes oficiales de leyes mexicanas
const FUENTES = {
    camaraDiputados: 'https://www.diputados.gob.mx/LeyesBiblio/pdf/',
    dof: 'https://www.dof.gob.mx/'
};

// Mapeo de leyes disponibles
const LEYES_DISPONIBLES = [
    { id: 'codigo_civil_federal', nombre: 'Código Civil Federal', archivo: 'CCF.pdf', fuente: 'camaraDiputados' },
    { id: 'codigo_penal_federal', nombre: 'Código Penal Federal', archivo: 'CPF.pdf', fuente: 'camaraDiputados' },
    { id: 'ley_federal_trabajo', nombre: 'Ley Federal del Trabajo', archivo: 'LFT.pdf', fuente: 'camaraDiputados' },
    { id: 'ley_amparo', nombre: 'Ley de Amparo', archivo: 'LA.pdf', fuente: 'camaraDiputados' },
    { id: 'codigo_comercio', nombre: 'Código de Comercio', archivo: 'CCO.pdf', fuente: 'camaraDiputados' },
    { id: 'ley_federal_proteccion_datos', nombre: 'Ley Federal de Protección de Datos', archivo: 'LFPDPPP.pdf', fuente: 'camaraDiputados' },
    { id: 'ley_general_sociedades_mercantiles', nombre: 'Ley General de Sociedades Mercantiles', archivo: 'LGSM.pdf', fuente: 'camaraDiputados' },
    { id: 'ley_propiedad_industrial', nombre: 'Ley de Propiedad Industrial', archivo: 'LPI.pdf', fuente: 'camaraDiputados' }
];

class LeyesService {
    
    // Obtener una ley específica (con caché)
    async obtenerLey(leyId, forceRefresh = false) {
        try {
            // Buscar en la base de datos primero
            let ley = await Ley.findOne({ leyId });
            
            // Si existe y no se fuerza actualización, devolver desde caché
            if (ley && !forceRefresh) {
                const diasDesdeActualizacion = (Date.now() - ley.updatedAt) / (1000 * 60 * 60 * 24);
                // Actualizar si tiene más de 30 días
                if (diasDesdeActualizacion < 30) {
                    console.log(`📖 Ley ${leyId} servida desde caché (${Math.floor(diasDesdeActualizacion)} días)`);
                    return ley;
                }
                console.log(`🔄 Ley ${leyId} necesita actualización (${Math.floor(diasDesdeActualizacion)} días)`);
            }
            
            // Obtener datos de la ley
            const leyInfo = LEYES_DISPONIBLES.find(l => l.id === leyId);
            if (!leyInfo) {
                throw new Error(`Ley no encontrada: ${leyId}`);
            }
            
            // Descargar y procesar la ley
            console.log(`📥 Descargando ley: ${leyInfo.nombre}...`);
            const contenido = await this._descargarLey(leyInfo);
            
            // Guardar en base de datos
            if (ley) {
                ley.contenido = contenido;
                ley.updatedAt = new Date();
                await ley.save();
            } else {
                ley = new Ley({
                    leyId: leyInfo.id,
                    nombre: leyInfo.nombre,
                    contenido: contenido,
                    fuente: leyInfo.fuente,
                    fechaActualizacion: new Date()
                });
                await ley.save();
            }
            
            console.log(`✅ Ley ${leyInfo.nombre} actualizada correctamente`);
            return ley;
            
        } catch (error) {
            console.error(`Error al obtener ley ${leyId}:`, error.message);
            
            // Si falla, devolver lo que haya en caché aunque esté viejo
            const leyCache = await Ley.findOne({ leyId });
            if (leyCache) {
                console.log(`⚠️ Usando versión en caché de ${leyId} (falló actualización)`);
                return leyCache;
            }
            
            throw error;
        }
    }
    
    // Obtener todas las leyes disponibles
    async obtenerTodasLeyes() {
        const leyes = [];
        for (const leyInfo of LEYES_DISPONIBLES) {
            try {
                const ley = await this.obtenerLey(leyInfo.id);
                leyes.push({
                    id: ley.leyId,
                    nombre: ley.nombre,
                    resumen: this._generarResumen(ley.contenido),
                    fechaActualizacion: ley.fechaActualizacion,
                    palabras: this._contarPalabras(ley.contenido)
                });
            } catch (error) {
                console.error(`Error al obtener ${leyInfo.id}:`, error.message);
                leyes.push({
                    id: leyInfo.id,
                    nombre: leyInfo.nombre,
                    error: 'No disponible temporalmente'
                });
            }
        }
        return leyes;
    }
    
    // Obtener artículos específicos de una ley
    async obtenerArticulos(leyId, articulos = []) {
        const ley = await this.obtenerLey(leyId);
        if (!ley) return [];
        
        const lineas = ley.contenido.split('\n');
        const resultados = [];
        
        for (const numArticulo of articulos) {
            const patron = new RegExp(`Artículo\\s+${numArticulo}\\s*\\.`, 'i');
            let contenidoArticulo = '';
            let encontrado = false;
            let i = 0;
            
            for (i = 0; i < lineas.length; i++) {
                if (patron.test(lineas[i])) {
                    encontrado = true;
                    contenidoArticulo = lineas[i] + '\n';
                    // Capturar siguientes líneas hasta encontrar otro artículo
                    for (let j = i + 1; j < lineas.length; j++) {
                        if (/Artículo\s+\d+\s*\./i.test(lineas[j])) break;
                        contenidoArticulo += lineas[j] + '\n';
                        if (contenidoArticulo.length > 5000) break;
                    }
                    break;
                }
            }
            
            if (encontrado) {
                resultados.push({
                    numero: numArticulo,
                    contenido: contenidoArticulo.trim()
                });
            }
        }
        
        return resultados;
    }
    
    // Descargar ley desde fuente oficial
    async _descargarLey(leyInfo) {
        const url = FUENTES[leyInfo.fuente] + leyInfo.archivo;
        
        try {
            const response = await axios({
                method: 'get',
                url: url,
                responseType: 'arraybuffer',
                timeout: 30000, // 30 segundos
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; IA-Lex-Mundi/1.0)'
                }
            });
            
            // Procesar PDF a texto
            const data = await pdfParse(response.data);
            
            // Limpiar y formatear el texto
            let texto = data.text
                .replace(/\r\n/g, '\n')
                .replace(/\n{3,}/g, '\n\n')
                .trim();
            
            return texto;
            
        } catch (error) {
            console.error(`Error descargando ${leyInfo.nombre}:`, error.message);
            throw new Error(`No se pudo descargar la ley: ${leyInfo.nombre}`);
        }
    }
    
    _generarResumen(contenido) {
        const lineas = contenido.split('\n').filter(l => l.trim().length > 0);
        const primerosArticulos = lineas.slice(0, 10).join('\n');
        return primerosArticulos.substring(0, 500) + '...';
    }
    
    _contarPalabras(contenido) {
        return contenido.split(/\s+/).length;
    }
    
    // Actualizar todas las leyes (para cron job)
    async actualizarTodasLeyes() {
        console.log('🔄 Iniciando actualización masiva de leyes...');
        const resultados = [];
        
        for (const leyInfo of LEYES_DISPONIBLES) {
            try {
                const ley = await this.obtenerLey(leyInfo.id, true);
                resultados.push({
                    id: leyInfo.id,
                    nombre: leyInfo.nombre,
                    exito: true,
                    palabras: this._contarPalabras(ley.contenido)
                });
                console.log(`✅ Actualizada: ${leyInfo.nombre}`);
                // Esperar 2 segundos entre descargas para no saturar el servidor
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                resultados.push({
                    id: leyInfo.id,
                    nombre: leyInfo.nombre,
                    exito: false,
                    error: error.message
                });
                console.error(`❌ Error en ${leyInfo.nombre}:`, error.message);
            }
        }
        
        console.log('📊 Actualización masiva completada');
        return resultados;
    }
}

module.exports = new LeyesService();
