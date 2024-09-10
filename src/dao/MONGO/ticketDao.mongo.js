const ticketModel = require("./models/ticket.model")

class TicketDaoMongo {
    constructor() {
        this.model = ticketModel
    }

    async getAll () {
        return await this.model.find()
    }

    async get (tid) {
        return await this.model.findById(tid)
    }

    async create(ticketData) {
        try {
            const ticket = new ticketModel(ticketData)
            return await ticket.save()
        } catch (error) {
            console.error('Error while creating ticket:', error)
            throw error
        }
    }
}

module.exports = TicketDaoMongo
