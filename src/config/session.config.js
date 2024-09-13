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
      ttl: 60 * 60 * 1000 * 24
    }),
    secret: session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,  // true en producción con HTTPS
      sameSite: 'Strict',  // O 'Lax' dependiendo del flujo
      domain: 'lessenza.onrender.com'  
    }
  }));

  initPassport();

  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    console.log('Sesión guardada:', req.session);  // Verifica si la sesión contiene la información correcta
    next();
  });
  
};


module.exports = { initSession }