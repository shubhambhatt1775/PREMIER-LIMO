const express = require('express');
const router = express.Router();
const { signup, login, updateProfile, googleLogin, facebookLogin, subscribeToPush } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/facebook', facebookLogin);
router.post('/subscribe', protect, subscribeToPush);
router.put('/profile', protect, updateProfile);

module.exports = router;
