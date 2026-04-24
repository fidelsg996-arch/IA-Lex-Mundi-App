// Configuración CORS para desarrollo
const corsOptions = {
    origin: function(origin, callback) {
        // Permitir solicitudes sin origen (como Postman) y desde los orígenes permitidos
        const allowedOrigins = [
            'http://localhost:3001',
            'http://127.0.0.1:3001',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            undefined  // Para Postman y herramientas similares
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Origen bloqueado por CORS:', origin);
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ]
};

// Aplicar CORS antes que cualquier otra ruta
app.use(cors(corsOptions));

// Manejar explícitamente las peticiones OPTIONS (preflight)
app.options('*', cors(corsOptions));
