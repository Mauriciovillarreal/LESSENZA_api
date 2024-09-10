const { Router } = require('express')

const router = Router()

router.get('/',  (req, res) => {
    req.logger.fatal('Nivel fatal')
    req.logger.error('Nivel error')
    req.logger.warning('Nivel warning')
    req.logger.info('Nivel info')
    req.logger.http('Nivel http')
    req.logger.debug('Nivel debug')
    res.send('Prueba de logger completada')
})

module.exports = router