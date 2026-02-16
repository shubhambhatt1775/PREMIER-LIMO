const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('./models/Car');

dotenv.config();

const cars = [
    {
        name: 'Tesla Model S',
        model: 'Plaid',
        category: 'Luxury',
        pricePerDay: 150,
        image: 'https://images.unsplash.com/photo-1617788138017-80ad42243c2d?auto=format&fit=crop&q=80',
        fuel: 'Electric',
        transmission: 'Automatic',
        seats: 5
    },
    {
        name: 'Porsche 911',
        model: 'Carrera',
        category: 'Sports',
        pricePerDay: 250,
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80',
        fuel: 'Petrol',
        transmission: 'Automatic',
        seats: 2
    },
    {
        name: 'BMW X5',
        model: 'M Competition',
        category: 'SUV',
        pricePerDay: 180,
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80',
        fuel: 'Diesel',
        transmission: 'Automatic',
        seats: 5
    }
];

const seedCars = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        await Car.deleteMany();
        console.log('Old cars removed.');

        await Car.insertMany(cars);
        console.log('Fleet seeded successfully!');

        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedCars();
