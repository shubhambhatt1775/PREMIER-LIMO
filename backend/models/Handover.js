const mongoose = require('mongoose');

const handoverSchema = new mongoose.Schema({
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
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    pickupOTP: {
        type: String,
        default: null
    },
    pickupVerified: {
        type: Boolean,
        default: false
    },
    pickupTime: {
        type: Date,
        default: null
    },
    dropoffOTP: {
        type: String,
        default: null
    },
    dropoffVerified: {
        type: Boolean,
        default: false
    },
    dropoffTime: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['pending_pickup', 'picked_up', 'pending_dropoff', 'dropped_off'],
        default: 'pending_pickup'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Handover', handoverSchema);
