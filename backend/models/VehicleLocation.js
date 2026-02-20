const mongoose = require('mongoose');

const vehicleLocationSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        unique: true // One entry per booking, we'll update it for 'live' feel, or we can make it a history log. 
        // User said "live tracking", but also "admin dashboard can track live location of handoverd cars".
        // Let's keep only the LATEST location here to make it simple, or history if we want a trail.
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('VehicleLocation', vehicleLocationSchema);
