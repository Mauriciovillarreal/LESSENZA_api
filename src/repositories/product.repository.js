class ProductsRepository {
    constructor(ProductDao) {
        this.ProductDao = ProductDao
    }

    getProducts = async () => await this.ProductDao.getAll()
    getProduct = async pid => await this.ProductDao.get(pid)
    createProduct = async newProduct => await this.ProductDao.create(newProduct)
    updateProduct = async (pid, updateProduct) => await this.ProductDao.update(pid, updateProduct, { new: true })
    deleteProduct = async pid => await this.ProductDao.delete(pid)
    updateProductStock = async (pid, quantityChange) => {
        const product = await this.ProductDao.get(pid)
        if (!product) {
            throw new Error('Product not found')
        }
        const newStock = product.stock + quantityChange
        if (newStock < 0) {
            throw new Error('Insufficient stock')
        }
        return await this.ProductDao.update(pid, { stock: newStock }, { new: true })
    }

}

module.exports = ProductsRepository
