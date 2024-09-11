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
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 60 * 60 * 1000 * 24
    }),
    secret: session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',  // Activa solo en producción
      sameSite: 'None',  // Permite solicitudes cross-site
      httpOnly: true,  // Protege las cookies en el cliente
    }
  }));

  initPassport();
  app.use(passport.initialize());
  app.use(passport.session());
};

module.exports = { initSession }