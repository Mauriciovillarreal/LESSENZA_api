const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')
const { initPassport } = require('../../src/config/passport.config.js')
const { objetConfig } = require('../config/index.js')

const { session_secret } = objetConfig

const initSession = (app, mongoUrl) => {
  const isProduction = process.env.NODE_ENV === 'production';
  app.use(session({
    store: MongoStore.create({
      mongoUrl,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      ttl: 60 * 60 * 1000 * 24  // 24 horas
    }),
    secret: session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: isProduction,  // Solo usar secure en producción
      sameSite: isProduction ? 'None' : 'Lax',  // SameSite=Lax para desarrollo, None para producción
    }
  }));

  initPassport()
  app.use(passport.initialize())
  app.use(passport.session())

  app.use((req, res, next) => {
    next()
  })
}

module.exports = { initSession }