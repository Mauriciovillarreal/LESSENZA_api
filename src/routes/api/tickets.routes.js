const { Router } = require('express')
const TicketController = require('../../controller/ticket.controller.js')

const router = Router()
const {
  getTickets,
  getTicketById,
  createTicket,
} = new TicketController()

router.get('/', getTickets)
router.get('/:tid', getTicketById)
router.post('/', createTicket) 

module.exports = router
