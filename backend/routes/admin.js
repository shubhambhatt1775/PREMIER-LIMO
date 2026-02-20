const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User');
const DrivingLicense = require('../models/DrivingLicense');
const VehicleLocation = require('../models/VehicleLocation');
const Handover = require('../models/Handover');
const Refund = require('../models/Refund');
const { cache, TTL } = require('../utils/cache');
const { protect, admin } = require('../middleware/authMiddleware');

// Get dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const cachedStats = cache.get('admin:stats');
        if (cachedStats) {
            console.log('⚡ Cache Hit: Admin Stats');
            return res.json(cachedStats);
        }

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
        const onRoadCount = await Handover.countDocuments({ status: 'picked_up' });

        const stats = {
            totalRevenue: `$${totalRevenue.toLocaleString()}`,
            activeBookings,
            pendingRequests: pendingBookings,
            totalFleet: totalCars,
            totalCustomers,
            onRoad: onRoadCount
        };

        cache.set('admin:stats', stats, TTL.SHORT);
        console.log('💾 Cache Miss: Admin Stats (Stored)');
        res.json(stats);
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

// Get all licenses
router.get('/licenses', async (req, res) => {
    try {
        const licenses = await DrivingLicense.find()
            .populate('userId', 'name email image')
            .sort({ createdAt: -1 });
        res.json(licenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update license status
router.patch('/licenses/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['verified', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const license = await DrivingLicense.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('userId', 'name email');

        if (!license) {
            return res.status(404).json({ message: 'License not found' });
        }

        res.json(license);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all live vehicle locations
router.get('/live-locations', async (req, res) => {
    try {
        const locations = await VehicleLocation.find()
            .populate('booking', 'carName userName')
            .populate('car', 'name image')
            .populate('user', 'name email');
        res.json(locations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get advanced analytics
router.get('/analytics', async (req, res) => {
    try {
        const cachedAnalytics = cache.get('admin:analytics');
        if (cachedAnalytics) {
            console.log('⚡ Cache Hit: Advanced Analytics');
            return res.json(cachedAnalytics);
        }

        // 1. Monthly Revenue
        const monthlyRevenue = await Booking.aggregate([
            { $match: { paid: true } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    revenue: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id": 1 } },
            { $limit: 12 }
        ]);

        // 2. Most Booked Cars (Top 5)
        const mostBookedCars = await Booking.aggregate([
            {
                $group: {
                    _id: "$carName",
                    bookings: { $sum: 1 }
                }
            },
            { $sort: { bookings: -1 } },
            { $limit: 5 }
        ]);

        // 3. Booking Trends (Total requests per month)
        const bookingTrends = await Booking.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } },
            { $limit: 12 }
        ]);

        // 4. Revenue per Category (Pie Chart)
        const revenueByCategory = await Booking.aggregate([
            { $match: { paid: true } },
            {
                $lookup: {
                    from: 'cars',
                    localField: 'car',
                    foreignField: '_id',
                    as: 'carDetails'
                }
            },
            { $unwind: '$carDetails' },
            {
                $group: {
                    _id: '$carDetails.category',
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $project: { name: '$_id', value: '$revenue', _id: 0 } }
        ]);

        // 5. Daily Bookings (for activity chart)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const dailyBookings = await Booking.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 6. Customer Growth
        const customerGrowth = await User.aggregate([
            { $match: { role: 'user' } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } },
            { $limit: 12 }
        ]);

        // 7. Booking Cancellation Rate
        const bookingStats = await Booking.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    cancelled: {
                        $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
                    }
                }
            }
        ]);

        const cancellationData = bookingStats.length > 0 ? [
            { name: 'Completed/Active', value: bookingStats[0].total - bookingStats[0].cancelled },
            { name: 'Cancelled', value: bookingStats[0].cancelled }
        ] : [];

        // 8. Total Refunds
        const refundStats = await Refund.aggregate([
            { $group: { _id: null, total: { $sum: "$refundAmount" } } }
        ]);

        const totalRefunds = refundStats.length > 0 ? refundStats[0].total : 0;

        const analyticsData = {
            monthlyRevenue: monthlyRevenue.map(item => ({ month: item._id, revenue: item.revenue })),
            mostBookedCars: mostBookedCars.map(item => ({ name: item._id, bookings: item.bookings })),
            bookingTrends: bookingTrends.map(item => ({ month: item._id, count: item.count })),
            revenueByCategory,
            dailyBookings: dailyBookings.map(item => ({ date: item._id, count: item.count })),
            customerGrowth: customerGrowth.map(item => ({ month: item._id, count: item.count })),
            cancellationData,
            totalRefunds
        };

        cache.set('admin:analytics', analyticsData, TTL.SHORT);
        console.log('💾 Cache Miss: Advanced Analytics (Stored)');
        res.json(analyticsData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
