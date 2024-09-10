const TicketDaoMongo = require('../dao/MONGO/ticketDao.mongo.js')

class TicketRepository {
    constructor() {
        this.ticketDao = new TicketDaoMongo()
    }

    getTickets = async () => await this.ticketDao.getAll()
    getTicket = async (tid) => await this.ticketDao.get(tid)
    createTicket = async (ticketData) => await this.ticketDao.create(ticketData)
}

module.exports = TicketRepository