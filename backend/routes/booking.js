const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Notification = require('../models/Notification');
const Availability = require('../models/Availability');
const Refund = require('../models/Refund');
const { cache } = require('../utils/cache');
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
        // Check for existing overlapping bookings
        const overlaps = await Availability.find({
            car: carId,
            $or: [
                { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
            ]
        });

        if (overlaps.length > 0) {
            return res.status(400).json({
                message: 'Vehicle is already booked for these dates by another approved request.'
            });
        }

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
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // If approving, check availability again (to prevent race conditions)
        if (status === 'approved') {
            const overlaps = await Availability.find({
                car: booking.car,
                $or: [
                    { startDate: { $lte: booking.endDate }, endDate: { $gte: booking.startDate } }
                ]
            });

            if (overlaps.length > 0) {
                return res.status(400).json({
                    message: 'Cannot approve: This vehicle has a scheduling conflict with another approved booking.'
                });
            }

            // Create official availability record
            await Availability.create({
                car: booking.car,
                booking: booking._id,
                startDate: booking.startDate,
                endDate: booking.endDate,
                type: 'booking'
            });
        }

        // If denying/cancelling, remove availability record if it exists
        if (['denied', 'cancelled'].includes(status)) {
            await Availability.findOneAndDelete({ booking: booking._id });
        }

        booking.status = status;
        await booking.save();

        // Invalidate Admin Stats & Analytics Cache
        cache.del(['admin:stats', 'admin:analytics']);
        console.log('🗑️ Cache Purged: Admin Dashboard Data');

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

// Get booked dates for a specific car
router.get('/car/:carId/booked-dates', async (req, res) => {
    try {
        const bookings = await Availability.find({ car: req.params.carId });
        res.json(bookings.map(b => ({
            start: b.startDate,
            end: b.endDate
        })));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// User cancellation with partial refund policy
router.post('/:id/cancel', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        const now = new Date();
        const pickupDate = new Date(booking.startDate);
        const hoursUntilPickup = (pickupDate - now) / (1000 * 60 * 60);

        let refundPercentage = 0;
        let refundAmount = 0;

        if (hoursUntilPickup > 48) {
            refundPercentage = 100;
            refundAmount = booking.totalAmount;
        } else if (hoursUntilPickup >= 24) {
            refundPercentage = 80;
            refundAmount = booking.totalAmount * 0.8;
        } else {
            return res.status(400).json({
                message: 'Cancellation is not allowed within 24 hours of pickup time.'
            });
        }

        // Update booking status
        booking.status = 'cancelled';
        await booking.save();

        // Restore availability
        await Availability.findOneAndDelete({ booking: booking._id });

        // Store refund data
        const refund = new Refund({
            booking: booking._id,
            user: booking.user,
            carName: booking.carName,
            totalAmount: booking.totalAmount,
            refundAmount,
            refundPercentage,
            reason: 'User Cancellation (Automatic Policy)'
        });
        await refund.save();

        // Invalidate Admin Stats & Analytics Cache
        cache.del(['admin:stats', 'admin:analytics']);
        console.log('🗑️ Cache Purged: Admin Dashboard Data (Cancellation)');

        // Notify Admin
        try {
            const adminTitle = 'Booking Cancelled (Refund Issued)';
            const adminMsg = `${booking.userName} cancelled booking for ${booking.carName}. Refund: $${refundAmount.toFixed(2)} (${refundPercentage}%)`;

            await Notification.create({
                user: booking.user,
                type: 'booking',
                title: adminTitle,
                message: adminMsg,
                link: '/admin'
            });

            await sendPushToAdmins({
                title: adminTitle,
                body: adminMsg,
                icon: '/favicon.ico',
                data: { url: '/admin' }
            });
        } catch (err) {
            console.error('Admin notification error:', err);
        }

        res.json({
            message: 'Booking cancelled successfully',
            refundAmount,
            refundPercentage,
            booking
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
