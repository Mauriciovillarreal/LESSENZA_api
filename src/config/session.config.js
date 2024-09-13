const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const { initPassport } = require('../../src/config/passport.config.js');
const { objetConfig } = require('../config/index.js');

const { session_secret } = objetConfig;

const initSession = (app, mongoUrl) => {
  console.log('Inicializando sesión con MongoDB en:', mongoUrl);  // Log para verificar la URL de MongoDB

  // Configuración de la sesión
  app.use(session({
    store: MongoStore.create({
      mongoUrl,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      ttl: 60 * 60 * 1000 * 24 // 24 horas
    }),
    secret: session_secret,
    resave: false,  // No vuelve a guardar la sesión si no hay cambios
    saveUninitialized: false,  // No guarda sesiones vacías
    cookie: {
      secure: false,  // Cambiar a true si usas HTTPS en producción
      sameSite: 'Strict',
      domain: 'lessenza.onrender.com'  // El dominio debe coincidir
    }
  }));

  // Inicialización de Passport
  console.log('Inicializando Passport');
  initPassport();  // Inicialización de la estrategia Passport

  // Middleware para depurar cada solicitud y revisar el estado de la sesión
  app.use((req, res, next) => {
    console.log('Revisando sesión: ', req.session);  // Verifica la sesión
    console.log('Revisando usuario autenticado: ', req.user);  // Verifica el usuario autenticado
    next();
  });

  // Inicializar Passport y las sesiones de Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Middleware adicional si es necesario
  app.use((req, res, next) => {
    console.log('Sesión guardada:', req.session);  // Verifica si la sesión está guardando datos
    next();
  });

};

module.exports = { initSession };
