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
      secure: true,  // Set to false if you're not using HTTPS in development
      httpOnly: true,
      sameSite: 'Lax',  // or 'Strict' depending on your use case
    }
  }));

  initPassport();

  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    if (req.session) {
      req.session.regenerate((err) => {
        if (err) {
          console.error(err);
        } else {
          res.cookie('sessionID', req.sessionID, {
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
          });
        }
      });
    }
    next();
  });
};


module.exports = { initSession }