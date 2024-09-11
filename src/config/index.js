const dotenv = require('dotenv')
const program = require('../utils/commander.js')

const { mode } = program.opts()

dotenv.config({
    path: mode === 'production' ? './.env.production' : './.env.development'
})
  
exports.objetConfig = {
    port: process.env.PORT || 8080,
    mongo_url: process.env.MONGO_URL,
    cookie_parser_secret: process.env.COOKIE_PARSER_SECRET,
    session_secret: process.env.SESSION_SECRET,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    gmail_pass: process.env.GMAIL_PASS,
    gmail_user: process.env.GMAIL_USER

}

exports.connectDB = () => {
    const MongoSingleton = require('../utils/MongoSingleton.js')
    MongoSingleton.getInstance()
}
