const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create a Stripe Checkout Session
// @route   POST /api/payments/create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { bookingId, amount, carName } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Rental: ${carName}`,
                            description: `Booking ID: ${bookingId}`,
                        },
                        unit_amount: amount * 100, // Stripe uses cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&bookingId=${bookingId}`,
            cancel_url: `${process.env.FRONTEND_URL}/dashboard/bookings`,
            metadata: {
                bookingId,
            },
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Verify Stripe Payment
// @route   POST /api/payments/verify
router.post('/verify', async (req, res) => {
    try {
        const { sessionId, bookingId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const booking = await Booking.findById(bookingId);
            if (!booking) return res.status(404).json({ message: 'Booking not found' });

            if (booking.paid) return res.json({ message: 'Already paid' });

            // Update booking
            booking.paid = true;
            await booking.save();

            // Create payment record
            const payment = await Payment.create({
                booking: bookingId,
                user: booking.user,
                amount: session.amount_total / 100,
                paymentMethod: 'Stripe',
                transactionId: session.payment_intent,
                status: 'completed'
            });

            // Notify Admin
            try {
                await Notification.create({
                    user: booking.user,
                    type: 'payment',
                    title: 'Payment Confirmed',
                    message: `$${session.amount_total / 100} received for ${booking.carName}.`,
                    link: '/admin'
                });
            } catch (err) {
                console.error('Notification error:', err);
            }

            res.json({ success: true, payment });
        } else {
            res.status(400).json({ success: false, message: 'Payment not completed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

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
