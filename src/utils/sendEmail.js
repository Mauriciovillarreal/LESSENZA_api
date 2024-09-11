const { createTransport } = require("nodemailer")
const { objetConfig } = require("../config")

const { gmail_pass, gmail_user} = objetConfig

const transport = createTransport({
    service: "gmail",
    port: 587,
    secure: false, // Usar false para STARTTLS en el puerto 587
    auth: {
        user: gmail_user,
        pass: gmail_pass
    }
});


exports.sendEmail = async ({ userMail, subject, html }) => {
    try {
      return await transport.sendMail({
        from: "L'essenza Store <lessenza@lessenza.com>",
        to: userMail,
        subject: subject,
        html: html
      });
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw new Error('Error al enviar el correo');
    }
  };
  