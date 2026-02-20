const Message = require('../models/Message');
const User = require('../models/User');

// Get messages between two users
exports.getMessages = async (req, res) => {
    try {
        const { userId, otherId } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: otherId },
                { sender: otherId, receiver: userId }
            ]
        }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Send a new message
exports.sendMessage = async (req, res) => {
    try {
        const { sender, receiver, text } = req.body;
        const newMessage = new Message({
            sender,
            receiver,
            text
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get list of users who have messaged the admin
exports.getChatUsers = async (req, res) => {
    try {
        const adminId = req.params.adminId;
        const messages = await Message.find({
            $or: [{ receiver: adminId }, { sender: adminId }]
        }).sort({ timestamp: -1 });

        const userIds = new Set();
        messages.forEach(msg => {
            if (msg.sender && msg.sender.toString() !== adminId) userIds.add(msg.sender.toString());
            if (msg.receiver && msg.receiver.toString() !== adminId) userIds.add(msg.receiver.toString());
        });

        const users = await User.find({ _id: { $in: Array.from(userIds) } }, 'name email image');

        const chatList = await Promise.all(users.map(async (user) => {
            const lastMsg = await Message.findOne({
                $or: [
                    { sender: user._id, receiver: adminId },
                    { sender: adminId, receiver: user._id }
                ]
            }).sort({ timestamp: -1 });

            const unreadCount = await Message.countDocuments({
                sender: user._id,
                receiver: adminId,
                isRead: false
            });

            return {
                ...user.toObject(),
                lastMessage: lastMsg ? lastMsg.text : '',
                lastMessageTime: lastMsg ? lastMsg.timestamp : null,
                unreadCount
            };
        }));

        res.status(200).json(chatList.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0)));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        await Message.updateMany(
            { sender: senderId, receiver: receiverId, isRead: false },
            { $set: { isRead: true } }
        );
        res.status(200).json({ message: 'Messages marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get admin details
exports.getAdmin = async (req, res) => {
    try {
        const admin = await User.findOne({ role: 'admin' }, '_id name email image');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
