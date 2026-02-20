const webpush = require('web-push');
const User = require('../models/User');

webpush.setVapidDetails(
    process.env.MAILTO,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

const sendPushNotification = async (userId, payload) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log(`[Push] User ${userId} not found`);
            return;
        }

        if (!user.pushSubscriptions || user.pushSubscriptions.length === 0) {
            console.log(`[Push] User ${user.email} has no active subscriptions`);
            return;
        }

        console.log(`[Push] Sending to ${user.email} (${user.pushSubscriptions.length} devices)`);

        const notifications = user.pushSubscriptions.map(subscription => {
            return webpush.sendNotification(subscription, JSON.stringify(payload))
                .catch(async (err) => {
                    if (err.statusCode === 404 || err.statusCode === 410) {
                        // Subscription has expired
                        await User.findByIdAndUpdate(userId, {
                            $pull: { pushSubscriptions: { endpoint: subscription.endpoint } }
                        });
                    }
                    console.error('Error sending push notification:', err);
                });
        });

        await Promise.all(notifications);
    } catch (error) {
        console.error('Error in sendPushNotification utility:', error);
    }
};

const sendPushToAdmins = async (payload) => {
    try {
        const admins = await User.find({ role: 'admin' });
        const adminPushPromises = admins.map(admin => sendPushNotification(admin._id, payload));
        await Promise.all(adminPushPromises);
    } catch (error) {
        console.error('Error sending push to admins:', error);
    }
};

module.exports = {
    sendPushNotification,
    sendPushToAdmins
};
