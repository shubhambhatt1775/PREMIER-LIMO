const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Car = require('./models/Car');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedBookings = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding bookings...');

        // Clear existing bookings
        await Booking.deleteMany({});

        // Get some cars and users
        const cars = await Car.find();
        const users = await User.find();

        if (cars.length === 0 || users.length === 0) {
            console.log('No cars or users found. Seed them first!');
            process.exit(1);
        }

        const exampleBookings = [
            {
                car: cars[0]._id,
                user: users[0]._id,
                userName: users[0].name || 'John Doe',
                userEmail: users[0].email,
                carName: cars[0].name,
                startDate: new Date('2024-03-20'),
                endDate: new Date('2024-03-23'),
                duration: 3,
                totalAmount: cars[0].pricePerDay * 3,
                status: 'pending'
            },
            {
                car: cars[1]._id,
                user: users[0]._id,
                userName: 'Jane Smith',
                userEmail: 'jane@example.com',
                carName: cars[1].name,
                startDate: new Date('2024-03-22'),
                endDate: new Date('2024-03-23'),
                duration: 1,
                totalAmount: cars[1].pricePerDay,
                status: 'approved'
            },
            {
                car: cars.length > 2 ? cars[2]._id : cars[0]._id,
                user: users[0]._id,
                userName: 'Mike Ross',
                userEmail: 'mike@example.com',
                carName: cars.length > 2 ? cars[2].name : cars[0].name,
                startDate: new Date('2024-03-25'),
                endDate: new Date('2024-03-30'),
                duration: 5,
                totalAmount: (cars.length > 2 ? cars[2].pricePerDay : cars[0].pricePerDay) * 5,
                status: 'pending'
            }
        ];

        await Booking.insertMany(exampleBookings);
        console.log('Successfully seeded bookings!');
        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedBookings();
