const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { initSession } = require('./config/session.config.js')
const { initSocket } = require('./config/socket.config.js')
const errorHandler = require('./middlewares/error/index.js')
const { addLogger, productionLogger } = require('./utils/logger.js')
const routerApp = require('./routes/index.js')
const { connectDB, objetConfig } = require('./config/index.js')

const { port, mongo_url, cookie_parser_secret } = objetConfig

const app = express()
const httpServer = app.listen(port, error => {
  if (error) productionLogger.info(error)
  productionLogger.info('Server listening on port ' + port)
})

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(cookie_parser_secret))
app.use(cors({
  origin: 'https://lessenza.onrender.com',
  credentials: true,
}));

initSession(app, mongo_url)

app.use(addLogger)

app.use(routerApp)
app.use(errorHandler())

initSocket(httpServer)
