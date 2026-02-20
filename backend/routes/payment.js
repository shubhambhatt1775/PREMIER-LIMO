const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

// Get all payments (for admin)
router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find().populate('booking').sort({ createdAt: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Create a new payment
// @route   POST /api/payments
router.post('/', async (req, res) => {
    try {
        const { bookingId, userId, amount, paymentMethod, transactionId } = req.body;

        // Create payment record
        const payment = await Payment.create({
            booking: bookingId,
            user: userId,
            amount,
            paymentMethod,
            transactionId,
            status: 'completed'
        });

        // Update booking to paid: true
        await Booking.findByIdAndUpdate(bookingId, {
            paid: true
        });

        res.status(201).json(payment);

        // Create notification for admin
        try {
            await Notification.create({
                user: userId,
                type: 'payment',
                title: 'New Payment Received',
                message: `$${amount} payment received via ${paymentMethod} for booking.`,
                link: '/admin'
            });
        } catch (notificationError) {
            console.error('Failed to create notification:', notificationError);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get user payments
// @route   GET /api/payments/user/:userId
router.get('/user/:userId', async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.params.userId }).populate('booking');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
