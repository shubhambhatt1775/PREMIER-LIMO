const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User');

// Get dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const totalCars = await Car.countDocuments();
        const pendingBookings = await Booking.countDocuments({ status: 'pending' });
        const activeBookings = await Booking.countDocuments({ status: 'approved' });
        const totalCustomers = await User.countDocuments({ role: 'user' });

        // Calculate total revenue from paid bookings
        const revenueResult = await Booking.aggregate([
            { $match: { paid: true } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        res.json({
            totalRevenue: `$${totalRevenue.toLocaleString()}`,
            activeBookings,
            pendingRequests: pendingBookings,
            totalFleet: totalCars,
            totalCustomers
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all customers
router.get('/customers', async (req, res) => {
    try {
        const customers = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
