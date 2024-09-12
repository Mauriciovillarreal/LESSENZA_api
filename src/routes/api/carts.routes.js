const { Router } = require('express')
const CartController = require('../../controller/carts.controller.js')
const { authUser, authAdmin , authPremium } = require('../../middlewares/auth.middleware.js')

const router = Router()
const {
  getCarts,
  createCart,
  addProductToCart,
  createTicket,
  deleteCart,
  deleteProduct,
  updateProductQuantity,
  getCartById
} = new CartController()

router.get('/', getCarts)
router.get('/:cid', getCartById)
router.post('/', createCart)
router.post('/:cid/product/:pid', addProductToCart)
router.post('/:cid/purchase', [ authUser ] , createTicket)
router.delete('/:cid', deleteCart)
router.delete('/:cid/products/:pid', deleteProduct)
router.put('/:cid/products/:pid', updateProductQuantity)

module.exports = router
