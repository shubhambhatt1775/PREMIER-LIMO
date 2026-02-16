const express = require('express');
const router = express.Router();
const { getLicense, upsertLicense } = require('../controllers/licenseController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getLicense);
router.post('/', protect, upsertLicense);

module.exports = router;
