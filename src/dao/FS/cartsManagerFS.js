// const fs = require(`node:fs`)
// const path = './Carts.json'

// class CartManager {
//     constructor(path) {
//         this.path = path
//     }

//     getCarts = async () => {
//         try {
//             const dataJson = await fs.promises.readFile(this.path, 'utf-8')
//             return JSON.parse(dataJson)
//         } catch (error) {
//             return []
//         }
//     }
// }

// module.exports = {
//     CartManager
// }