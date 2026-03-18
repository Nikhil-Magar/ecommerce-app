const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // optional — guest checkout supported
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: { type: Number, required: true },
    totalNPR: { type: Number },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: { type: String, default: 'eSewa' },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'failed'],
      default: 'unpaid',
    },
    transactionId: { type: String },
    esewaRefId: { type: String },
    customerInfo: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      postalCode: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
