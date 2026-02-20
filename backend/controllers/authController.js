const User = require('../models/User');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const { sendPushToAdmins } = require('../utils/pushNotification');

// @desc    Register new user
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (user) {
            // Create notification for admin
            try {
                const title = 'New Customer Registered';
                const message = `${user.name} (${user.email}) just joined Premier Limo.`;

                await Notification.create({
                    user: user._id,
                    type: 'user',
                    title,
                    message,
                    link: '/admin'
                });

                // Send Push Notification
                await sendPushToAdmins({
                    title,
                    body: message,
                    icon: '/favicon.ico',
                    data: { url: '/admin' }
                });
            } catch (notificationError) {
                console.error('Failed to create notification:', notificationError);
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            user.image = req.body.image || user.image;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                address: updatedUser.address,
                image: updatedUser.image,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Google Login
// @route   POST /api/auth/google
exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { name, email, picture, sub: googleId } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            // Update user with googleId if they don't have it
            if (!user.googleId) {
                user.googleId = googleId;
                if (!user.image) user.image = picture;
                await user.save();
            }
        } else {
            // Register new user
            user = await User.create({
                name,
                email,
                googleId,
                image: picture
            });

            // Admin notification
            try {
                await Notification.create({
                    user: user._id,
                    type: 'user',
                    title: 'New Customer (Google)',
                    message: `${user.name} registered via Google.`,
                    link: '/admin'
                });
            } catch (err) {
                console.error('Notification error:', err);
            }
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(401).json({ message: 'Google authentication failed' });
    }
};

// @desc    Facebook Login
// @route   POST /api/auth/facebook
exports.facebookLogin = async (req, res) => {
    try {
        const { accessToken, userID } = req.body;
        const url = `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture.type(large)`;

        const response = await axios.get(url);
        const { id, name, email, picture } = response.data;

        if (id !== userID) {
            return res.status(401).json({ message: 'Facebook ID mismatch' });
        }

        let user = await User.findOne({ email });
        const facebookImage = picture?.data?.url || '';

        if (user) {
            if (!user.facebookId) {
                user.facebookId = id;
                if (!user.image) user.image = facebookImage;
                await user.save();
            }
        } else {
            user = await User.create({
                name,
                email,
                facebookId: id,
                image: facebookImage
            });

            // Admin notification
            try {
                await Notification.create({
                    user: user._id,
                    type: 'user',
                    title: 'New Customer (Facebook)',
                    message: `${user.name} registered via Facebook.`,
                    link: '/admin'
                });
            } catch (err) {
                console.error('Notification error:', err);
            }
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(401).json({ message: 'Facebook authentication failed' });
    }
};

// @desc    Subscribe to push notifications
// @route   POST /api/auth/subscribe
// @access  Private
exports.subscribeToPush = async (req, res) => {
    try {
        const { subscription } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if subscription already exists
        const exists = user.pushSubscriptions.find(sub => sub.endpoint === subscription.endpoint);
        if (!exists) {
            user.pushSubscriptions.push(subscription);
            await user.save();
        }

        res.status(200).json({ message: 'Subscribed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
