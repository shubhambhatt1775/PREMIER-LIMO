const DrivingLicense = require('../models/DrivingLicense');
const User = require('../models/User');

// @desc    Get user driving license
// @route   GET /api/license
// @access  Private
exports.getLicense = async (req, res) => {
    try {
        const license = await DrivingLicense.findOne({ userId: req.user._id });
        if (!license) {
            return res.status(404).json({ message: 'Driving license not found' });
        }
        res.json(license);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create or update driving license
// @route   POST /api/license
// @access  Private
exports.upsertLicense = async (req, res) => {
    try {
        const { licenseNumber, expiryDate, issuingCountry, frontImage, backImage } = req.body;

        let license = await DrivingLicense.findOne({ userId: req.user._id });

        if (license) {
            // Update
            license.licenseNumber = licenseNumber || license.licenseNumber;
            license.expiryDate = expiryDate || license.expiryDate;
            license.issuingCountry = issuingCountry || license.issuingCountry;
            license.frontImage = frontImage || license.frontImage;
            license.backImage = backImage || license.backImage;
            license.status = 'pending'; // Reset to pending if updated

            await license.save();
        } else {
            // Create
            license = await DrivingLicense.create({
                userId: req.user._id,
                licenseNumber,
                expiryDate,
                issuingCountry,
                frontImage,
                backImage
            });

            // Link to User model
            await User.findByIdAndUpdate(req.user._id, { drivingLicense: license._id });
        }

        res.status(200).json(license);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
