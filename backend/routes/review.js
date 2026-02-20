const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

// Create a new review
router.post('/', async (req, res) => {
    try {
        const { bookingId, carId, userId, userName, rating, comment } = req.body;

        // Check if already reviewed
        const existingReview = await Review.findOne({ booking: bookingId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this booking' });
        }

        const review = new Review({
            booking: bookingId,
            car: carId,
            user: userId,
            userName,
            rating,
            comment
        });

        await review.save();

        // Update Car status
        const car = await Car.findById(carId);
        if (car) {
            const totalRating = (car.averageRating * car.totalReviews) + rating;
            car.totalReviews += 1;
            car.averageRating = totalRating / car.totalReviews;
            await car.save();
        }

        res.status(201).json(review);

        // Create notification for admin
        try {
            await Notification.create({
                user: userId,
                type: 'review',
                title: 'New Car Review',
                message: `${userName} gave ${rating} stars to a vehicle.`,
                link: '/admin'
            });
        } catch (notificationError) {
            console.error('Failed to create notification:', notificationError);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get reviews for a car
router.get('/car/:carId', async (req, res) => {
    try {
        const reviews = await Review.find({ car: req.params.carId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Check if a booking has a review
router.get('/check/:bookingId', async (req, res) => {
    try {
        const review = await Review.findOne({ booking: req.params.bookingId });
        res.json({ hasReview: !!review, review });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
