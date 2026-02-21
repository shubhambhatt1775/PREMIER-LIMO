const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"].filter(Boolean),
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['polling', 'websocket']
});


// Basic Route
app.get('/', (req, res) => {
    res.send('LuxDrive Backend API is running...');
});

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'active',
        message: 'Premier Limo API is healthy',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date()
    });
});

// Import Routes
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/car');
const imagekitRoutes = require('./routes/imagekit');
const bookingRoutes = require('./routes/booking');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');
const licenseRoutes = require('./routes/license');
const handoverRoutes = require('./routes/handover');
const reviewRoutes = require('./routes/review');
const notificationRoutes = require('./routes/notification');
const chatRoutes = require('./routes/chat');

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/imagekit', imagekitRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/license', licenseRoutes);
app.use('/api/handover', handoverRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io Logic
const VehicleLocation = require('./models/VehicleLocation');

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    // Join admin room
    socket.on('joinAdmin', () => {
        socket.join('admins');
        console.log('Admin joined admins room');
    });

    socket.on('sendMessage', (data) => {
        const { sender, receiver, text } = data;
        // Broadcast to receiver's room
        io.to(receiver).emit('receiveMessage', data);
        // Also send back to sender's room for synchronization across multiple tabs if needed
        io.to(sender).emit('receiveMessage', data);
    });

    // Location Tracking
    socket.on('updateLocation', async (data) => {
        const { bookingId, carId, userId, latitude, longitude, carName, userName } = data;

        try {
            // Update or Create the live location in DB
            await VehicleLocation.findOneAndUpdate(
                { booking: bookingId },
                {
                    car: carId,
                    user: userId,
                    latitude,
                    longitude,
                    lastUpdated: new Date()
                },
                { upsert: true, new: true }
            );

            // Broadcast to all admins
            io.to('admins').emit('locationUpdate', {
                bookingId,
                carId,
                userId,
                latitude,
                longitude,
                carName,
                userName,
                timestamp: new Date()
            });
        } catch (err) {
            console.error('Error updating location:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Database Connection Logic for Serverless
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        throw err;
    }
};

// Health Check Route
app.get('/api/health', async (req, res) => {
    try {
        await connectDB();
        res.status(200).json({
            status: 'active',
            message: 'Premier Limo API is healthy',
            database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
            uri_present: !!process.env.MONGODB_URI,
            node_env: process.env.NODE_ENV,
            timestamp: new Date()
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: err.message,
            uri_present: !!process.env.MONGODB_URI
        });
    }
});

// Apply DB connection to all routes
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ message: "Database connection failed", error: err.message });
    }
});

// Import Routes
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/car');
const imagekitRoutes = require('./routes/imagekit');
const bookingRoutes = require('./routes/booking');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');
const licenseRoutes = require('./routes/license');
const handoverRoutes = require('./routes/handover');
const reviewRoutes = require('./routes/review');
const notificationRoutes = require('./routes/notification');
const chatRoutes = require('./routes/chat');

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/imagekit', imagekitRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/license', licenseRoutes);
app.use('/api/handover', handoverRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io Logic
const VehicleLocation = require('./models/VehicleLocation');

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    // ... (rest of socket logic remains same)
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    server.listen(PORT, () => {
        console.log(`Local Server is running on port ${PORT}`);
    });
}

// Export the app for Vercel
module.exports = app;

