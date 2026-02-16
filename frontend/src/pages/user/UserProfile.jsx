import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Save, Camera, Loader, X, ZoomIn } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { useAuth } from '../../context/AuthContext';
import styles from './UserProfile.module.css';
import api from '../../services/api';
import axios from 'axios';
import getCroppedImg from '../../utils/cropUtils';

const UserProfile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Cropper state
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '123 Main St, New York, NY',
        image: user?.image || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImageSrc(reader.result);
            setShowCropper(true);
        });
        reader.readAsDataURL(file);

        // Clear input so same file can be selected again
        e.target.value = null;
    };

    const uploadToImageKit = async (fileBlob) => {
        setUploading(true);
        try {
            // 1. Get auth params from backend
            const [authRes, configRes] = await Promise.all([
                api.get('/imagekit/auth'),
                api.get('/imagekit/config')
            ]);

            const { token, expire, signature } = authRes.data;
            const { publicKey } = configRes.data;

            // 2. Upload to ImageKit
            const uploadFormData = new FormData();
            uploadFormData.append('file', fileBlob);
            uploadFormData.append('fileName', 'profile-pic.jpg'); // ImageKit handles unique names
            uploadFormData.append('publicKey', publicKey);
            uploadFormData.append('tags', 'profile_picture');
            uploadFormData.append('useUniqueFileName', 'true');
            uploadFormData.append('signature', signature);
            uploadFormData.append('expire', expire);
            uploadFormData.append('token', token);

            const res = await axios.post('https://upload.imagekit.io/api/v1/files/upload', uploadFormData);

            // 3. Update form data with new image URL
            const newImageUrl = res.data.url;
            setFormData(prev => ({ ...prev, image: newImageUrl }));

            // 4. If not manually editing, save the profile immediately to persist the image
            if (!isEditing) {
                await handleSaveProfile({ ...formData, image: newImageUrl });
            }

            // Close cropper
            setShowCropper(false);
            setImageSrc(null);

        } catch (err) {
            console.error('Image upload failed', err);
            alert('Failed to upload image. Please try again.');
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
            alert('Something went wrong cropping the image');
        }
    };

    const handleSaveProfile = async (dataToSave) => {
        try {
            const res = await api.put('/auth/profile', dataToSave);
            updateUser(res.data);
            setIsEditing(false);
        } catch (err) {
            console.error('Profile update failed', err);
            alert('Failed to update profile.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleSaveProfile(formData);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            <motion.div
                className={styles.profileContainer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className={styles.header}>
                    <h1 className="gradient-text">My Profile</h1>
                    <p>Manage your personal information and preferences.</p>
                </div>

                <div className={styles.content}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatarWrapper}>
                            <div className={styles.avatar} style={formData.image ? { backgroundImage: `url(${formData.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                                {!formData.image && (user?.name?.[0] || 'U')}
                            </div>
                            {uploading && (
                                <div className={styles.avatarOverlay}>
                                    <Loader className={styles.spinner} />
                                </div>
                            )}
                            <div className={styles.cameraIcon} onClick={triggerFileInput}>
                                <Camera size={16} />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <h3>{user?.name || 'User Name'}</h3>
                        <p className={styles.role}>{user?.role === 'admin' ? 'Administrator' : 'Premium Member'}</p>
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label><User size={16} /> Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label><Mail size={16} /> Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className={styles.disabledInput}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label><Phone size={16} /> Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label><MapPin size={16} /> Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className={styles.actions}>
                            {isEditing ? (
                                <>
                                    <button type="button" className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
                                    <button type="submit" className={styles.saveBtn}><Save size={18} /> Save Changes</button>
                                </>
                            ) : (
                                <button type="button" className={styles.editBtn} onClick={() => setIsEditing(true)}>Edit Profile</button>
                            )}
                        </div>
                    </form>
                </div>
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
                                aspect={1}
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
                                    aria-labelledby="Zoom"
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
                                    {uploading ? 'Start Uploading...' : 'Crop & Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserProfile;
