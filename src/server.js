const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { initSession } = require('./config/session.config.js');
const { initSocket } = require('./config/socket.config.js');
const errorHandler = require('./middlewares/error/index.js');
const { addLogger, productionLogger } = require('./utils/logger.js');
const routerApp = require('./routes/index.js');
const { connectDB, objetConfig } = require('./config/index.js');
const path = require('path'); // Importa path para servir archivos estáticos

const { port, mongo_url, cookie_parser_secret } = objetConfig;

const app = express();
const httpServer = app.listen(port, (error) => {
  if (error) productionLogger.info(error);
  productionLogger.info('Server listening on port ' + port);
});

// Conectar a la base de datos
connectDB();

// Middlewares para analizar el cuerpo de la solicitud y manejo de cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(cookie_parser_secret));

// Habilitar CORS para la aplicación de React
app.use(
  cors({
    origin: 'https://lessenza.onrender.com', // Cambia por el dominio de tu aplicación de React
    credentials: true,
  })
);

// Inicializar sesión
initSession(app, mongo_url);

// Middleware para agregar el logger
app.use(addLogger);

// Tus rutas del backend (API)
app.use(routerApp);

// Servir archivos estáticos generados por React (en la carpeta dist o build)
app.use(express.static(path.join(__dirname, 'dist'))); // Ajusta según tu configuración

// Redirige todas las rutas no manejadas por el backend hacia index.html de React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Middleware para manejar errores
app.use(errorHandler());

// Inicializar WebSocket
initSocket(httpServer);
