const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    *name: needs to be a String, received ${product.name}
    *price: needs to be a Number, received ${product.price}
    *stock: needs to be a Number, received ${product.stock}`
}

const generateCartErrorInfo = (cart) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    *productId: needs to be a String, received ${cart.productId}
    *quantity: needs to be a Number, received ${cart.quantity}`
}

module.exports = { generateProductErrorInfo , generateCartErrorInfo }
