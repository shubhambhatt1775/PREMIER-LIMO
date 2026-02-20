const express = require('express');
const router = express.Router();
const Handover = require('../models/Handover');
const Booking = require('../models/Booking');
const RideHistory = require('../models/RideHistory');

// Generate Pickup OTP
router.post('/generate-pickup-otp/:bookingId', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

        let handover = await Handover.findOne({ booking: req.params.bookingId });
        if (!handover) {
            handover = new Handover({
                booking: booking._id,
                user: booking.user,
                car: booking.car,
                pickupOTP: otp,
                status: 'pending_pickup'
            });
        } else {
            handover.pickupOTP = otp;
        }

        await handover.save();
        res.json({ message: 'Pickup OTP generated', otp });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Verify Pickup OTP (Admin Side)
router.post('/verify-pickup-otp/:bookingId', async (req, res) => {
    const { otp } = req.body;
    try {
        const handover = await Handover.findOne({ booking: req.params.bookingId });
        if (!handover) return res.status(404).json({ message: 'Handover record not found' });

        if (handover.pickupOTP === otp) {
            handover.pickupVerified = true;
            handover.pickupTime = new Date();
            handover.status = 'picked_up';
            handover.pickupOTP = null; // Clear OTP after verification
            await handover.save();

            // Update booking status if needed
            // await Booking.findByIdAndUpdate(req.params.bookingId, { status: 'picked_up' });

            res.json({ message: 'Pickup verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Generate Dropoff OTP
router.post('/generate-dropoff-otp/:bookingId', async (req, res) => {
    try {
        const handover = await Handover.findOne({ booking: req.params.bookingId });
        if (!handover || handover.status !== 'picked_up') {
            return res.status(400).json({ message: 'Car must be picked up before dropoff' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        handover.dropoffOTP = otp;
        handover.status = 'pending_dropoff';
        await handover.save();

        res.json({ message: 'Dropoff OTP generated', otp });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Verify Dropoff OTP (Admin Side)
router.post('/verify-dropoff-otp/:bookingId', async (req, res) => {
    const { otp } = req.body;
    try {
        const handover = await Handover.findOne({ booking: req.params.bookingId });
        if (!handover) return res.status(404).json({ message: 'Handover record not found' });

        if (handover.dropoffOTP === otp) {
            handover.dropoffVerified = true;
            handover.dropoffTime = new Date();
            handover.status = 'dropped_off';
            handover.dropoffOTP = null;
            await handover.save();

            // Mark booking as completed
            const booking = await Booking.findByIdAndUpdate(req.params.bookingId, { status: 'completed' });

            // Create Ride History entry
            const history = new RideHistory({
                booking: booking._id,
                user: booking.user,
                car: booking.car,
                carName: booking.carName,
                userName: booking.userName,
                userEmail: booking.userEmail,
                pickupTime: handover.pickupTime,
                dropoffTime: handover.dropoffTime,
                totalAmount: booking.totalAmount,
                duration: booking.duration,
                pickupLocation: booking.pickupLocation,
                dropoffLocation: booking.dropoffLocation
            });
            await history.save();

            res.json({ message: 'Dropoff verified successfully and booking completed' });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get handover status for a booking
router.get('/status/:bookingId', async (req, res) => {
    try {
        const handover = await Handover.findOne({ booking: req.params.bookingId });
        res.json(handover || { status: 'none' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get ride history for a user
router.get('/history/user/:userId', async (req, res) => {
    try {
        const history = await RideHistory.find({ user: req.params.userId }).sort({ completedAt: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all ride history (Admin)
router.get('/history/admin', async (req, res) => {
    try {
        const history = await RideHistory.find().sort({ completedAt: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
