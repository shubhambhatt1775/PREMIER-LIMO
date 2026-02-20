const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    carName: String,
    totalAmount: Number,
    refundAmount: Number,
    refundPercentage: Number,
    reason: {
        type: String,
        default: 'User Cancellation'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Refund', refundSchema);
