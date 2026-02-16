const express = require('express');
const router = express.Router();
const ImageKit = require('imagekit');
const dotenv = require('dotenv');

dotenv.config();

console.log('ImageKit Config Check:', {
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY ? 'Present' : 'Missing',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY ? 'Present' : 'Missing',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT ? 'Present' : 'Missing'
});

const imagekit = new ImageKit({
    publicKey: (process.env.IMAGEKIT_PUBLIC_KEY || '').trim(),
    privateKey: (process.env.IMAGEKIT_PRIVATE_KEY || '').trim(),
    urlEndpoint: (process.env.IMAGEKIT_URL_ENDPOINT || '').trim()
});

// @desc    Get ImageKit Authentication Parameters
router.get('/auth', (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    console.log('Generated Auth Params:', result);
    res.send(result);
});


// @desc    Get ImageKit Config (Public)
router.get('/config', (req, res) => {
    res.json({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
});

module.exports = router;

