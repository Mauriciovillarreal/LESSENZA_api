const ProductDao = require('../dao/MONGO/productsDao.Mongo.js')
const ProductsRepository = require('../repositories/product.repository.js')
const CartsDao = require('../dao/MONGO/cartDao.Mongo.js')
const CartsRepository = require('../repositories/cart.repository.js')
const TicketDao = require('../dao/MONGO/ticketDao.mongo.js')
const TicketRepository = require('../repositories/ticket.repository.js')
const UserDao = require('../dao/MONGO/usersDao.Mongo.js')
const UsersRepository = require('../repositories/user.repository.js')

const productService = new ProductsRepository(new ProductDao())
const cartService = new CartsRepository(new CartsDao())
const userService = new UsersRepository(new UserDao())
const ticketDao = new TicketDao() 
const ticketService = new TicketRepository(ticketDao)

module.exports = {
    productService,
    cartService,
    userService,
    ticketService,
    usersModel: require('../dao/MONGO/models/users.model.js')
}
