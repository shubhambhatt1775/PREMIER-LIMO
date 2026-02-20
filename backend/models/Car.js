const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide car name'],
        trim: true
    },
    model: {
        type: String,
        required: [true, 'Please provide car model']
    },
    category: {
        type: String,
        required: [true, 'Please provide category'],
        enum: ['Luxury', 'Sports', 'SUV', 'Sedan', 'Coupe']
    },
    pricePerDay: {
        type: Number,
        required: [true, 'Please provide price per day']
    },
    image: {
        type: String,
        required: [true, 'Please provide image URL']
    },
    fuel: {
        type: String,
        required: true,
        enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid']
    },
    transmission: {
        type: String,
        required: true,
        enum: ['Automatic', 'Manual']
    },
    availability: {
        type: Boolean,
        default: true
    },
    seats: {
        type: Number,
        default: 2
    },
    averageRating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Car', carSchema);
