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
      secure: false,
      sameSite: 'None' // Esto permite que las cookies se envíen en entornos cross-origin
     } 
  }))

  initPassport()
  app.use(passport.initialize())
  app.use(passport.session())

  app.use((req, res, next) => {
    next()
  })
}

module.exports = { initSession }