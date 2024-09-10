const { connect } = require('mongoose')
const { objetConfig } = require('../config/index.js')
const { productionLogger } = require('./logger.js')

const { mongo_url } = objetConfig

class MongoSingleton {
    static #instance
    constructor() {
        connect(mongo_url)
    }

    static getInstance() {
        if (this.#instance) {
            productionLogger.info('BD ya esta conectada')
            return this.#instance
        }
        this.#instance = new MongoSingleton()
        productionLogger.info('BD conectada')
        return this.#instance
    }
}

module.exports = MongoSingleton