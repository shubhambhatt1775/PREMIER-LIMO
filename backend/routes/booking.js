const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Notification = require('../models/Notification');
const { sendPushNotification, sendPushToAdmins } = require('../utils/pushNotification');

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
    const {
        carId, userId, userName, userEmail, carName,
        startDate, endDate, duration, totalAmount,
        pickupLocation, dropoffLocation
    } = req.body;

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
            pickupLocation,
            dropoffLocation,
            status: 'pending'
        });

        const newBooking = await booking.save();

        // Create notification for admin
        try {
            const title = 'New Booking Request';
            const message = `${userName} requested to book ${carName} for ${duration} days.`;

            await Notification.create({
                user: userId,
                type: 'booking',
                title,
                message,
                link: '/admin'
            });

            // Send Push
            await sendPushToAdmins({
                title,
                body: message,
                icon: '/favicon.ico',
                data: { url: '/admin' }
            });
        } catch (notificationError) {
            console.error('Failed to create notification:', notificationError);
        }

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

        // Notification for user
        try {
            const title = `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`;
            const message = `Your booking for ${booking.carName} has been ${status}.`;

            await Notification.create({
                user: booking.user,
                type: 'booking',
                title,
                message,
                link: '/dashboard/bookings'
            });

            // Send Push to User
            await sendPushNotification(booking.user, {
                title,
                body: message,
                icon: '/favicon.ico',
                data: { url: '/dashboard/bookings' }
            });
        } catch (err) {
            console.error('Error creating user notification:', err);
        }

        res.json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
