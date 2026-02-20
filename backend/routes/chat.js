const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/messages/:userId/:otherId', chatController.getMessages);
router.post('/send', chatController.sendMessage);
router.get('/users/:adminId', chatController.getChatUsers);
router.put('/mark-read', chatController.markAsRead);
router.get('/admin', chatController.getAdmin);

module.exports = router;
