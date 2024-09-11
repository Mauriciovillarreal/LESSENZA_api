const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')
const { initPassport } = require('../../src/config/passport.config.js')
const { objetConfig } = require('../config/index.js')

const { session_secret } = objetConfig

const initSession = (app, mongoUrl) => {
  console.log('Initializing session with MongoDB URL:', mongoUrl);  // Verifica la URL de MongoDB

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
      secure: false,  // Mantén esto en false si no tienes HTTPS en desarrollo
      sameSite: 'None',  // Alternativa para desarrollo
      httpOnly: false
    }
    
  }));

  console.log('Session middleware initialized with cookie settings:', {
    secure: false,
    sameSite: 'None',
    httpOnly: true
  });
  
  initPassport();
  console.log('Passport initialized');

  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    console.log('Session Data:', req.session);  // Verifica los datos de la sesión en cada solicitud
    next();
  });
};


module.exports = { initSession }