const express = require('express')
const SessionController = require('../../controller/session.controller.js')
const passwordController = require('../../controller/password.controller.js')

const sessionsRouter = express.Router()

const {
  githubAuth,
  githubCallback,
  getCurrentUser,
  login,
  register,
  logout,
} = SessionController

const {
  forgotPassword,
  resetPassword,
  generateNewResetLink
} = passwordController

sessionsRouter.get('/github', githubAuth)
sessionsRouter.get('/githubcallback', githubCallback)
sessionsRouter.get('/current', getCurrentUser)
sessionsRouter.post('/login', login)
sessionsRouter.post('/register', register)
sessionsRouter.get('/logout', logout)
sessionsRouter.post('/forgot-password', forgotPassword)
sessionsRouter.post('/reset-password', resetPassword)
sessionsRouter.post('/generate-new-reset-link', generateNewResetLink)

module.exports = sessionsRouter
