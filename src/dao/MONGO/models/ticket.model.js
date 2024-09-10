const { Schema, model } = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const ticketSchema = new Schema({
  code: {
    type: String,
    unique: true,
    default: () => uuidv4()
  },
  purchase_datetime: {
    type: Date,
    default: Date.now
  },
  products: [
    {
      productId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Product' 
      },
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  amount: {
    type: Number,
    required: true
  },
  purchaser: {
    type: String
  }
})

const ticketModel = model('Ticket', ticketSchema)

module.exports = ticketModel
