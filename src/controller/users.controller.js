const mongoose = require('mongoose')
const { userService } = require('../service/index.js')
const { CustomError } = require('../service/errors/CustomError.js')
const { EErrors } = require('../service/errors/enums.js')
const { generateUserErrorInfo } = require('../service/errors/info.js')
const { sendEmail } = require('../utils/sendEmail.js')
const { usersModel } = require('../dao/MONGO/models/users.model.js')

class UserController {
    constructor() {
        this.usersService = userService
    }

    getUsers = async (req, res, next) => {
        try {
            const users = await this.usersService.getUsers();
            
            // Asegúrate de que se envíen los usuarios correctamente en el formato esperado
            if (!users || users.length === 0) {
                return res.status(404).json({ status: 'error', message: 'No users found' });
            }
    
            res.status(200).json({ status: 'success', data: users });
        } catch (error) {
            next(error);
        }
    };
    

    getUser = async (req, res, next) => {
        const { uid } = req.params
        try {
            if (!mongoose.Types.ObjectId.isValid(uid)) {
                CustomError.createError({
                    name: 'InvalidUserError',
                    cause: generateUserErrorInfo({ uid }),
                    message: 'Invalid user ID',
                    code: EErrors.INVALID_TYPES_ERROR,
                })
            }
            const result = await this.usersService.getUser(uid)
            if (!result) {
                CustomError.createError({
                    name: 'UserNotFoundError',
                    cause: `User with ID ${uid} not found`,
                    message: 'User not found',
                    code: EErrors.USER_NOT_FOUND,
                })
            }
            res.send({ status: 'success', data: result })
        } catch (error) {
            next(error)
        }
    }

    createUser = async (req, res, next) => {
        const userData = req.body
        try {
            const requiredFields = ['name', 'email', 'password']
            for (const field of requiredFields) {
                if (!userData[field]) {
                    CustomError.createError({
                        name: 'InvalidUserDataError',
                        cause: generateUserErrorInfo(userData),
                        message: `Missing required field: ${field}`,
                        code: EErrors.INVALID_TYPES_ERROR,
                    })
                }
            }
            const result = await this.usersService.createUser(userData)
            res.status(201).json({ status: 'success', data: result })
        } catch (error) {
            next(error)
        }
    }

    deleteInactiveUsers = async (req, res, next) => {
        const inactivityLimit = 30 * 60 * 1000; // 30 minutos en milisegundos (ajustar a 2 días = 2 * 24 * 60 * 60 * 1000)
        const now = new Date();
    
        try {
            // Buscar usuarios cuya última conexión fue hace más de 30 minutos
            const inactiveUsers = await usersModel.find({
                last_connection: { $lt: new Date(now - inactivityLimit) },
            });
    
            if (inactiveUsers.length === 0) {
                return res.status(200).json({
                    status: 'success',
                    message: 'No hay usuarios inactivos para eliminar.',
                });
            }
    
            // Eliminar los usuarios inactivos
            const deletedUsers = [];
            for (const user of inactiveUsers) {
                await usersModel.findByIdAndDelete(user._id);
                deletedUsers.push(user.email);
            
                productionLogger.info(`Procesando el usuario: ${user.fullname} con email: ${user.email}`);
            
                // Validar que el correo exista y tenga un formato válido antes de intentar enviarlo
                if (user.email && /\S+@\S+\.\S+/.test(user.email)) {
                    await sendEmail({
                        userMail: user.email,
                        subject: 'Cuenta eliminada por inactividad',
                        html: `<p>Hola ${user.fullname}, tu cuenta ha sido eliminada debido a la inactividad. Si deseas más información, contacta con soporte.</p>`,
                    });
                    productionLogger.info(`Correo enviado a: ${user.email}`);
                } else {
                    productionLogger.info(`Usuario con ID ${user._id} no tiene un correo electrónico válido.`);
                }
                
            }
            
    
            res.status(200).json({
                status: 'success',
                message: `Se han eliminado ${deletedUsers.length} usuarios inactivos.`,
                deletedUsers,
            });
        } catch (error) {
            next(error);
        }
    };
    

    toggleUserRole = async (req, res, next) => {
        const { uid } = req.params
        try {
            if (!mongoose.Types.ObjectId.isValid(uid)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID de usuario no válido.',
                })
            }
            const user = await this.usersService.getUser(uid)
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuario no encontrado.',
                })
            }
            // Solo aplicar la validación si el usuario intenta cambiar a premium
            if (user.role !== 'premium') {
                const requiredDocuments = ['Identificacion', 'Comprobante de domicilio', 'Comprobante de estado de cuenta']
                // Eliminar la extensión de los archivos antes de compararlos
                const uploadedDocuments = user.documents.map(doc => doc.name.split('-').pop().split('.').shift())
                const hasAllRequiredDocuments = requiredDocuments.every(doc =>
                    uploadedDocuments.includes(doc)
                )
                if (!hasAllRequiredDocuments) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'El usuario no ha terminado de procesar su documentación. Se requieren: Identificación, Comprobante de domicilio y Comprobante de estado de cuenta.',
                    })
                }
            }
            user.role = user.role === 'user' ? 'premium' : 'user'
            const updatedUser = await user.save()
            res.status(200).json({
                status: 'success',
                data: updatedUser,
            })
        } catch (error) {
            next(error)
        }
    }

    uploadDocuments = async (req, res) => {
        try {
            const { uid } = req.params
            const files = req.files
            if (!files) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Faltan datos o archivos requeridos.',
                })
            }
            const user = await this.usersService.getUser(uid)
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado.' })
            }
            user.documents = user.documents || []
            Object.values(files).forEach((fileArray) => {
                fileArray.forEach((file) => {
                    user.documents.push({
                        name: file.filename,
                        reference: file.destination,
                    })
                })
            })
            const result = await user.save()
            return res.status(200).json({
                status: 'success',
                payload: result,
            })
        } catch (error) {
            productionLogger.info('Error al subir los archivos:', error)
            return res.status(500).json({ error: 'Ocurrió un error en el servidor.' })
        }
    }

    deleteUser = async (req, res, next) => {
        const { uid } = req.params; // Obtenemos el id del usuario desde los parámetros de la URL
    
        try {
            // Verificamos si el UID es válido
            if (!mongoose.Types.ObjectId.isValid(uid)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID de usuario no válido.',
                });
            }
    
            // Buscamos el usuario por su ID
            const user = await this.usersService.getUser(uid);
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuario no encontrado.',
                });
            }
    
            // Eliminamos al usuario
            await this.usersService.deleteUser(uid);
    
            // Respondemos con éxito
            res.status(200).json({
                status: 'success',
                message: `Usuario con ID ${uid} ha sido eliminado exitosamente.`,
            });
        } catch (error) {
            next(error); // Pasamos el error al middleware de manejo de errores
        }
    }
    
}

module.exports = UserController