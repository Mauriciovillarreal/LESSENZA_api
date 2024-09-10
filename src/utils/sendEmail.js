const { createTransport } = require("nodemailer")
const { objetConfig } = require("../config")

const { gmail_pass, gmail_user} = objetConfig

const transport = createTransport ({
    service: "gmail",
    port : 587,
    auth: {
        user: gmail_user,
        pass: gmail_pass
    }
})

exports.sendEmail = async ({ userMail, subject, html}) => {
    return await transport.sendMail ({
        from: "L'essenza Store <lessenza@lessenza.com>",
        to: userMail,
        subject: subject ,
        html
    })
}