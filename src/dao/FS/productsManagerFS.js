// const fs = require(`node:fs`)
// const path = './Products.json'

// class ProductManager {
//     constructor(path) {
//         this.path = path
//     }

//     getProducts = async () => {
//         try {
//             const dataJson = await fs.promises.readFile(this.path, 'utf-8')
           
//             return JSON.parse(dataJson)
//         } catch (error) {
//             return []
//         }
//     }

//     addProduct = async producto => {
//         try {
//             const productos = await this.getProducts()
//             if (productos.length === 0) {
//                 producto.id = 1
//             } else {
//                 producto.id = productos.length + 1

//             }
//             productos.push(producto)
//             await fs.promises.writeFile(this.path, JSON.stringify(productos, null, '\t'), 'utf-8')
//             return producto
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     getProductById = async id => {
//         try {
//             const productos = await this.getProducts()
//             const searchedProduct = await productos.find((products) =>
//                 products.id === id)
//             if (!searchedProduct) {
//                 console.log("No encontrado")
//             } else {
//                 console.log(searchedProduct)
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     updateProduct = async id => {
//         try {
//             const productos = await this.getProducts()
//             const searchedProduct = await productos.find((produc) =>
//                 produc.id === id)
//             if (!searchedProduct) {
//                 console.log("No encontrado")
//             } else {
//                 searchedProduct.title = 'se cambio el title'
//                 searchedProduct.description = 'se cambio la description'
//                 searchedProduct.price = 500
//                 console.log(searchedProduct, '\nSe cambio exitosamente')
//                 await fs.promises.writeFile(this.path, JSON.stringify(productos, null, '\t'), 'utf-8')
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     delateProducts = async id => {
//         try {
//             const productos = await this.getProducts()
//             const value = productos.findIndex(product => product.id === id)
//             if (value !== -1) {
//                 productos.splice(value, 1)
//                 await fs.promises.writeFile(this.path, JSON.stringify(productos, null, '\t'), 'utf-8')
//             } else {
//                 console.log(`No se encontró ningún producto con id ${id}.`)
//             }
//             console.log(productos)

//         } catch (error) {
//             console.log(error)
//         }
//     }
// }

// module.exports = {
//     ProductManager
// }

