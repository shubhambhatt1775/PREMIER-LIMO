const mongoose = require('mongoose');

const drivingLicenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    licenseNumber: {
        type: String,
        required: [true, 'Please provide a license number'],
        unique: true,
        trim: true
    },
    expiryDate: {
        type: Date,
        required: [true, 'Please provide an expiry date']
    },
    issuingCountry: {
        type: String,
        required: [true, 'Please provide the issuing country'],
        trim: true
    },
    frontImage: {
        type: String,
        default: ''
    },
    backImage: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DrivingLicense', drivingLicenseSchema);
