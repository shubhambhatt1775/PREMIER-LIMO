const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        default: null
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ['booking', 'maintenance', 'blocked'],
        default: 'booking'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster overlapping queries
availabilitySchema.index({ car: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Availability', availabilitySchema);
