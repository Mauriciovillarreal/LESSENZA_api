const express = require('express')
const router = express.Router()
const generateProductsMocks = require('../../utils/generateProductsMoks.controller.js')

router.get('/', (req, res) => {
    let products = []
    for (let i = 0; i < 100; i++) {
        products.push(generateProductsMocks())
    }

    res.send({
        status: 'success',
        payload: products
    })
})

module.exports = router
