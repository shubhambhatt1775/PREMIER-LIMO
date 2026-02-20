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

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = server;

