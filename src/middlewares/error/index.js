const EErrors = require('../../service/errors/enums.js')

const errorHandler = () => (error, req, res, next) => {
    console.error('ERROR', error.message)
    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            return res.status(400).send({ status: 'error', error: error.name, message: error.message })
        case EErrors.ROUTING_ERROR:
            return res.status(404).send({ status: 'error', error: error.name, message: error.message })
        case EErrors.PRODUCT_NOT_FOUND:
            return res.status(404).send({ status: 'error', error: error.name, message: error.message })
        case EErrors.CART_OPERATION_ERROR:
            return res.status(500).send({ status: 'error', error: error.name, message: error.message })
        default:
            return res.status(500).send({ status: 'error', error: 'Unhandled error', message: error.message })
    }
    next()
}

module.exports = errorHandler
