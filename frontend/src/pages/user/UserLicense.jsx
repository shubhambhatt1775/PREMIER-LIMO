import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Shield, Upload, CheckCircle, Globe, Save, Loader, AlertTriangle, X } from 'lucide-react';
import Cropper from 'react-easy-crop';
import styles from './UserLicense.module.css';
import api from '../../services/api';
import axios from 'axios';
import getCroppedImg from '../../utils/cropUtils';

const UserLicense = () => {
    const [licenseData, setLicenseData] = useState({
        licenseNumber: '',
        expiryDate: '',
        issuingCountry: '',
        frontImage: '',
        backImage: '',
        status: 'pending'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    // Cropper state
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [activeSide, setActiveSide] = useState(null); // 'front' or 'back'

    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchLicense();
    }, []);

    const fetchLicense = async () => {
        try {
            setLoading(true);
            const res = await api.get('/license');
            if (res.data) {
                // Format date for input
                const formattedData = {
                    ...res.data,
                    expiryDate: res.data.expiryDate ? res.data.expiryDate.split('T')[0] : ''
                };
                setLicenseData(formattedData);
            }
        } catch (err) {
            if (err.response?.status !== 404) {
                setError('Failed to fetch license information.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setLicenseData({ ...licenseData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, side) => {
        const file = e.target.files[0];
        if (!file) return;

        setActiveSide(side);
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImageSrc(reader.result);
            setShowCropper(true);
        });
        reader.readAsDataURL(file);
        e.target.value = null;
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const uploadToImageKit = async (fileBlob) => {
        setUploading(true);
        try {
            const [authRes, configRes] = await Promise.all([
                api.get('/imagekit/auth'),
                api.get('/imagekit/config')
            ]);

            const { token, expire, signature } = authRes.data;
            const { publicKey } = configRes.data;

            const uploadFormData = new FormData();
            uploadFormData.append('file', fileBlob);
            uploadFormData.append('fileName', `license-${activeSide}.jpg`);
            uploadFormData.append('publicKey', publicKey);
            uploadFormData.append('signature', signature);
            uploadFormData.append('expire', expire);
            uploadFormData.append('token', token);
            uploadFormData.append('useUniqueFileName', 'true');

            const res = await axios.post('https://upload.imagekit.io/api/v1/files/upload', uploadFormData);

            setLicenseData(prev => ({
                ...prev,
                [activeSide === 'front' ? 'frontImage' : 'backImage']: res.data.url
            }));

            setShowCropper(false);
            setImageSrc(null);
        } catch (err) {
            console.error('Upload failed', err);
            alert('Failed to upload image.');
        } finally {
            setUploading(false);
        }
    };

    const handleCropSave = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            await uploadToImageKit(croppedImageBlob);
        } catch (e) {
            console.error(e);
            alert('Failed to crop image.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            await api.post('/license', licenseData);
            alert('License information updated successfully.');
            fetchLicense(); // Refresh status and data
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update license.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingState}>
                <Loader className="spinner" />
                <p>Loading license information...</p>
            </div>
        );
    }

    return (
        <>
            <motion.div
                className={styles.container}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className={styles.header}>
                    <h1 className="gradient-text">Driving License</h1>
                    <p>Verify your identity by providing your driving license details.</p>
                </div>

                <form className={styles.card} onSubmit={handleSubmit}>
                    {licenseData.status === 'verified' && (
                        <div className={styles.statusBadge}>
                            <CheckCircle size={16} /> Verified Driver
                        </div>
                    )}
                    {licenseData.status === 'pending' && licenseData._id && (
                        <div className={`${styles.statusBadge} ${styles.pending}`}>
                            <Loader size={16} className="spinner" /> Verification Pending
                        </div>
                    )}
                    {licenseData.status === 'rejected' && (
                        <div className={`${styles.statusBadge} ${styles.rejected}`}>
                            <AlertTriangle size={16} /> Verification Rejected
                        </div>
                    )}

                    {error && <div className={styles.errorMsg}>{error}</div>}

                    <div className={styles.formGrid}>
                        <div className={styles.field}>
                            <label>License Number</label>
                            <div className={styles.inputWrapper}>
                                <FileText size={18} />
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={licenseData.licenseNumber}
                                    onChange={handleChange}
                                    placeholder="Enter License Number"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label>Expiration Date</label>
                            <div className={styles.inputWrapper}>
                                <Calendar size={18} />
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={licenseData.expiryDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label>Issuing Country</label>
                            <div className={styles.inputWrapper}>
                                <Globe size={18} />
                                <input
                                    type="text"
                                    name="issuingCountry"
                                    value={licenseData.issuingCountry}
                                    onChange={handleChange}
                                    placeholder="Enter Country"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.uploadSection}>
                        <h3>License Images</h3>
                        <div className={styles.imageGrid}>
                            <div className={styles.imageBox}>
                                {licenseData.frontImage ? (
                                    <img src={licenseData.frontImage} alt="Front Side" />
                                ) : (
                                    <div className={styles.emptyState}>
                                        <div className={styles.emptyIcon}>
                                            <Shield size={32} />
                                        </div>
                                        <span>Upload Front Side</span>
                                    </div>
                                )}
                                <label className={styles.reuploadBtn}>
                                    <Upload size={14} /> {licenseData.frontImage ? 'Update' : 'Upload'} Front
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'front')}
                                    />
                                </label>
                            </div>
                            <div className={styles.imageBox}>
                                {licenseData.backImage ? (
                                    <img src={licenseData.backImage} alt="Back Side" />
                                ) : (
                                    <div className={styles.emptyState}>
                                        <div className={styles.emptyIcon}>
                                            <Shield size={32} />
                                        </div>
                                        <span>Upload Back Side</span>
                                    </div>
                                )}
                                <label className={styles.reuploadBtn}>
                                    <Upload size={14} /> {licenseData.backImage ? 'Update' : 'Upload'} Back
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'back')}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className={styles.footer}>
                            <div className={styles.guidelines}>
                                <h4>Guidelines:</h4>
                                <ul>
                                    <li>Images must be clear and legible</li>
                                    <li>Edges of the card must be visible</li>
                                    <li>File format: JPG, PNG (Max 5MB)</li>
                                </ul>
                            </div>
                            <button type="submit" className={styles.saveBtn} disabled={saving || uploading}>
                                {saving ? (
                                    <><Loader size={18} className="spinner" /> Saving...</>
                                ) : (
                                    <><Save size={18} /> Update License Info</>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </motion.div>

            {/* Cropper Modal */}
            {showCropper && (
                <div className={styles.cropperModalOverlay}>
                    <div className={styles.cropperModal}>
                        <div className={styles.cropperContainer}>
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={16 / 9}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className={styles.cropperControls}>
                            <div className={styles.zoomSliderContainer}>
                                <span className={styles.zoomLabel}>Zoom</span>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className={styles.slider}
                                />
                            </div>
                            <div className={styles.cropperActions}>
                                <button
                                    className={styles.btnCancel}
                                    onClick={() => {
                                        setShowCropper(false);
                                        setImageSrc(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.btnSave}
                                    onClick={handleCropSave}
                                    disabled={uploading}
                                >
                                    {uploading ? 'Processing...' : 'Crop & Upload'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserLicense;

