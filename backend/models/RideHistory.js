const mongoose = require('mongoose');

const rideHistorySchema = new mongoose.Schema({
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
    carName: String,
    userName: String,
    userEmail: String,
    pickupTime: Date,
    dropoffTime: Date,
    totalAmount: Number,
    duration: Number,
    pickupLocation: {
        address: String,
        lat: Number,
        lng: Number
    },
    dropoffLocation: {
        address: String,
        lat: Number,
        lng: Number
    },
    status: {
        type: String,
        default: 'completed'
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RideHistory', rideHistorySchema);
