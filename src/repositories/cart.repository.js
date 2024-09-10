class CartsRepository {
    constructor(CartDao) {
        this.CartDao = CartDao
    }

    getCarts = async () => await this.CartDao.getAll()
    getCart = async cId => await this.CartDao.get(cId)
    createCart = async () => await this.CartDao.create()
    deleteCart = async cId => await this.CartDao.delete(cId)
    deleteProduct = async (cId, pId) => await this.CartDao.deleteProduct(cId, pId)
    updateProductQuantity = async (cartId, productId, quantity) => await this.CartDao.updateProductQuantity(cartId, productId, quantity)
    addProductToCart = async (cartId, productId) => await this.CartDao.addProductToCart(cartId, productId)
    updateCart = async (cartId, updateData) => await this.CartDao.updateCart(cartId, updateData)
}

module.exports = CartsRepository