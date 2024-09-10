const express = require('express');
const router = express.Router();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');
const path = require('path');

const docsPath = path.join(__dirname, '../docs/**/*.yaml');

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'API Documentation',
            description: 'API Documentation',
            version: '1.0.0'
        }
    },
    apis: [docsPath]
};

const specs = swaggerJsDoc(swaggerOptions);

router.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
router.use('/api/products', require('./api/products.route.js'));
router.use('/api/carts', require('./api/carts.routes.js'));
router.use('/api/users', require('./api/users.routes.js'));
router.use('/api/sessions', require('./api/session.routes.js'));
router.use('/api/tickets', require('./api/tickets.routes.js'));
router.use('/api/mockingproducts', require('./api/mockingproducts.route.js'));
router.use('/loggerTest', require('./api/loggerTest.js'));

module.exports = router;
