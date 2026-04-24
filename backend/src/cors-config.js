const cors = require('cors');

// Configuración CORS para desarrollo
const corsOptions = {
    origin: [
        'http://localhost:3001',
        'http://127.0.0.1:3001',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Aplicar CORS
app.use(cors(corsOptions));

// Para peticiones OPTIONS (preflight)
app.options('*', cors(corsOptions));
