const { createTransport } = require("nodemailer");
const { objetConfig } = require("../config");

const { gmail_pass, gmail_user } = objetConfig;

// Imprimir las credenciales para verificar si están siendo leídas correctamente
console.log('Usuario:', gmail_user);
console.log('Contraseña:', gmail_pass);

const transport = createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: gmail_user,
        pass: gmail_pass
    },
    logger: true,  // Habilita logs detallados
    debug: true    // Muestra mensajes de depuración
});


exports.sendEmail = async ({ userMail, subject, html }) => {
    try {
        return await transport.sendMail({
            from: "L'essenza Store <lessenza@lessenza.com>",
            to: userMail,
            subject: subject,
            html
        });
    } catch (error) {
        console.error('Error enviando correo:', error);
        throw new Error('Error al enviar el correo');
    }
};
