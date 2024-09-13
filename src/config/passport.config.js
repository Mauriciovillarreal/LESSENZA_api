const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GitHubStrategy = require('passport-github2').Strategy
const UsersManagerMongo = require('../dao/MONGO/usersDao.Mongo.js')
const CartsManagerMongo = require('../dao/MONGO/cartDao.Mongo.js')
const { createHash, IsValidPassword } = require('../utils/bcrypt.js')
const { objetConfig } = require('../config/index.js')
const UserDto = require('../dto/user.dto.js')
const mongoose = require('mongoose')
const { productionLogger } = require('../utils/logger.js')
const { sendEmail } = require('../utils/sendEmail.js')
const { usersModel } = require('../service/index.js')

const { adminEmail, adminPassword } = objetConfig

const userService = new UsersManagerMongo()
const cartService = new CartsManagerMongo()

const initPassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name } = req.body
        try {
            let userFound = await userService.getUsersBy({ email: username })
            if (userFound) {
                productionLogger.info('El usuario ya existe')
                return done(null, false)
            }

            const newCart = await cartService.create()

            const userDto = new UserDto({
                first_name,
                last_name,
                email: username,
                password: createHash(password),
                cart: newCart._id
            })

            let result = await userService.create(userDto)

            const html = `<h1>Bienvenido ${result.first_name} ${result.last_name}</h1>`

            sendEmail({ userMail: result.email, subject: `Se a creado correctamente el usuario ${result.email}`, html })

            return done(null, result)
        } catch (error) {
            console.error('Error during registration:', error)
            return done(null, false, { message: 'Error al registrar: no se pudo crear el carrito' })
        }
    }))

    const hardcodedUser = {
        _id: new mongoose.Types.ObjectId(),
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        first_name: 'Admin',
        last_name: 'Coder',
        fullname: 'Admin Coder'
    }

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                if (username === adminEmail) {
                    if (password === adminPassword) {
                        return done(null, hardcodedUser)
                    } else {
                        productionLogger.info("Contraseña incorrecta para la cuenta hardcodeada")
                        return done(null, false)
                    }
                }
                const user = await userService.getUsersBy({ email: username })
                if (!user) {
                    productionLogger.info("Usuario no encontrado")
                    return done(null, false)
                }

                if (!IsValidPassword(password, { password: user.password })) {
                    productionLogger.info("Contraseña incorrecta")
                    return done(null, false)
                }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv23liwkJwoCQAftU16K',
            clientSecret: 'ba52dd01c3e23dc46d9b8fdc2f1b69f77830c064',
            callbackURL: 'https://lessenza.onrender.com/api/sessions/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userService.getUsersBy({ email: profile._json.email })
                if (!user) {
                    const cart = await cartService.create()
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: profile._json.name,
                        email: profile._json.email,
                        cart: cart._id
                    }
                    let result = await userService.create(newUser)
                    done(null, result)
                } else {
                    if (!user.cart) {
                        const cart = await cartService.create()
                        user.cart = cart._id
                        await userService.update(user._id, { cart: cart._id })
                    }
                    done(null, user)
                }
            } catch (err) {
                return done(err)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        console.log('Serializando usuario: ', user);  // Para verificar qué usuario se está serializando
        done(null, user._id);  // Almacena el ID del usuario en la sesión
    });

    // Deserialización del usuario
    passport.deserializeUser(async (id, done) => {
        try {
            console.log('Deserializando usuario con ID:', id);  // Añade logs para verificar si se ejecuta correctamente
            const user = await usersModel.findById(id);  // Recupera el usuario de la base de datos
            if (user) {
                console.log('Usuario encontrado durante deserialización:', user);
                done(null, user);  // Si encuentra el usuario, lo pasa a `req.user`
            } else {
                done(null, false);  // Si no encuentra el usuario, pasa `false`
            }
        } catch (error) {
            console.error('Error deserializando usuario:', error);
            done(error, false);  // En caso de error, pasa el error
        }
    });

}

module.exports = { initPassport }
