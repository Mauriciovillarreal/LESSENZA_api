const { productsModel } = require('./models/products.model')

class ProductsDaoMongo {
    constructor() {
        this.model = productsModel
    }

    async getAll() {
        return await this.model.find()
    }

    async get(pid) {
        return await this.model.findById(pid)
    }

    async create(newProduct) {
        return await this.model.create(newProduct)
    }

    async update(pid, updateProduct) {
        return await this.model.findByIdAndUpdate(pid, updateProduct, { new: true })
    }

    async delete(pid) {
        return await this.model.findByIdAndDelete(pid)
    }

}

module.exports = ProductsDaoMongo
