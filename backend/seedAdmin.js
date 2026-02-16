const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const adminEmail = 'admin@luxdrive.com';
        const adminPassword = 'adminpassword123'; // You should change this later!

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin already exists!');
            process.exit();
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Create admin user
        const admin = await User.create({
            name: 'System Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Admin account created successfully!');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);

        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
