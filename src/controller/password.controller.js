const UsersDaoMongo = require('../dao/MONGO/usersDao.Mongo.js')
const { sendEmail } = require('../utils/sendEmail')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const { productionLogger } = require('../utils/logger.js')

class PasswordController {
    constructor() {
        this.userService = new UsersDaoMongo()
    }

    forgotPassword = async (req, res) => {
        const { email } = req.body
        try {
            const user = await this.userService.getUsersBy({ email })
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            const token = crypto.randomBytes(20).toString('hex')
            const expires = Date.now() + 3600000 // 1 hour

            await this.userService.update(user._id, { resetPasswordToken: token, resetPasswordExpires: expires })

            const resetUrl = `https://lessenza.vercel.appreset-password/${token}`

            const html = `
                <div style="text-align: center">
                    <h1>L'ESSENZA</h1>
                    <p>Click the following link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>
                </div>
            `

            await sendEmail({ userMail: user.email, subject: 'Password Reset', html })

            res.json({ message: 'Password reset email sent' })
        } catch (error) {
            productionLogger.error(error)
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    resetPassword = async (req, res) => {
        const { token, newPassword } = req.body
        try {
            const user = await this.userService.getUsersBy({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            })

            if (!user) {
                return res.status(400).json({ message: 'Password reset token is invalid or has expired' })
            }

            if (bcrypt.compareSync(newPassword, user.password)) {
                return res.status(400).json({ message: 'New password cannot be the same as the old password' })
            }

            const hashedPassword = bcrypt.hashSync(newPassword, 10)

            await this.userService.update(user._id, {
                password: hashedPassword,
                resetPasswordToken: undefined,
                resetPasswordExpires: undefined
            })

            res.json({ message: 'Password has been reset' })
        } catch (error) {
            productionLogger.error(error)
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    generateNewResetLink = async (req, res) => {
        const { email } = req.body
        try {
            const user = await this.userService.getUsersBy({ email })
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            const token = crypto.randomBytes(20).toString('hex')
            const expires = Date.now() + 3600000 // 1 hour

            await this.userService.update(user._id, { resetPasswordToken: token, resetPasswordExpires: expires })

            const resetUrl = `https://lessenza.vercel.appreset-password/${token}`

            const html = `<p>Click the following link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`

            await sendEmail({ userMail: user.email, subject: 'Password Reset', html })

            res.json({ message: 'New password reset email sent' })
        } catch (error) {
            productionLogger.error(error)
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }
}

module.exports = new PasswordController()
