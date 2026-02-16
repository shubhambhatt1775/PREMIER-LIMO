const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');

// Get all bookings (for admin)
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get bookings for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single booking
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new booking
router.post('/', async (req, res) => {
    const { carId, userId, userName, userEmail, carName, startDate, endDate, duration, totalAmount } = req.body;

    try {
        const booking = new Booking({
            car: carId,
            user: userId,
            userName,
            userEmail,
            carName,
            startDate,
            endDate,
            duration,
            totalAmount,
            status: 'pending'
        });

        const newBooking = await booking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // If approved, we might want to mark the car as unavailable, 
        // but often availability is date-dependent. 
        // For simple logic, we'll just update status.

        res.json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
