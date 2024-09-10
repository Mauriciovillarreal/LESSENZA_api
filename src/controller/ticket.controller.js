const { ticketService } = require('../service/index.js')
const mongoose = require('mongoose')

class TicketController {
    getTickets = async (req, res) => {
        try {
            const tickets = await ticketService.getTickets()
            res.json(tickets)
        } catch (error) {
            console.error('An error occurred while retrieving the tickets:', error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    getTicketById = async (req, res) => {
        try {
            const { tid } = req.params
            if (!mongoose.Types.ObjectId.isValid(tid)) {
                return res.status(400).json({ error: 'Invalid ticket ID' })
            }
            const ticket = await ticketService.getTicket(tid)
            if (!ticket) {
                return res.status(404).json({ error: 'Ticket not found' })
            }
            res.json(ticket)
        } catch (error) {
            console.error('An error occurred while retrieving the ticket:', error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    createTicket = async (req, res) => {
        try {
            const newTicket = req.body
            const ticket = await ticketService.createTicket(newTicket)
            res.status(201).json(ticket)
        } catch (error) {
            console.error('An error occurred while creating the ticket:', error)
            res.status(500).json({ error: 'Internal server error' })
        }
    }
}

module.exports = TicketController
