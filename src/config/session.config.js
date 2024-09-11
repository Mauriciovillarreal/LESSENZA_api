const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')
const { initPassport } = require('../../src/config/passport.config.js')
const { objetConfig } = require('../config/index.js')

const { session_secret } = objetConfig

const initSession = (app, mongoUrl) => {
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
    resave: true,
    saveUninitialized: true,
    cookie: { 
      secure: process.env.NODE_ENV === 'production', // Solo usar secure en producción
      domain: process.env.NODE_ENV === 'production' ? 'lessenza.onrender.com' : undefined, // Definir dominio solo en producción
      httpOnly: true, // Para mejorar la seguridad
      maxAge: 60 * 60 * 1000 * 24 // 24 horas para la duración de la cookie
    }
  }));

  initPassport();
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    next();
  });
};

module.exports = { initSession };
