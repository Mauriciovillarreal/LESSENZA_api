const { Schema, model } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const productsSchema = new Schema({
    brands: String,
    name: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: String,
    owner: {
        type: String,
        default: 'admin'
    }
})

productsSchema.plugin(mongoosePaginate)

const productsModel = model('products', productsSchema)

module.exports = {
    productsModel
}
