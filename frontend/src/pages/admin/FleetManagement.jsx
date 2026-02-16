import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, X, Upload } from 'lucide-react';
import api from '../../services/api';
import axios from 'axios';
import styles from './AdminDashboard.module.css';

const FleetManagement = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '', model: '', category: 'Luxury',
        pricePerDay: '', fuel: 'Petrol', transmission: 'Automatic',
        image: '', seats: 4
    });

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const res = await api.get('/cars');
            setCars(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const filteredCars = cars.filter(car =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const uploadImage = async () => {
        if (!imageFile) return null;

        setUploading(true);
        try {
            const [authRes, configRes] = await Promise.all([
                api.get('/imagekit/auth'),
                api.get('/imagekit/config')
            ]);

            const { token, expire, signature } = authRes.data;
            const { publicKey } = configRes.data;

            const uploadFormData = new FormData();
            uploadFormData.append('file', imageFile);
            uploadFormData.append('fileName', imageFile.name);
            uploadFormData.append('publicKey', publicKey.trim());
            uploadFormData.append('tags', 'fleet');
            uploadFormData.append('useUniqueFileName', 'true');
            uploadFormData.append('signature', signature);
            uploadFormData.append('expire', expire);
            uploadFormData.append('token', token);

            const res = await axios.post('https://upload.imagekit.io/api/v1/files/upload', uploadFormData);
            return res.data.url;
        } catch (err) {
            console.error('ImageKit upload error detail:', err.response?.data || err.message);
            alert(`Image upload failed: ${err.response?.data?.message || 'Check ImageKit credentials in .env'}`);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this vehicle?')) {
            try {
                await api.delete(`/cars/${id}`);
                fetchCars();
            } catch (err) {
                alert('Error deleting car');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = formData.image;
        if (imageFile) {
            imageUrl = await uploadImage();
            if (!imageUrl) return;
        }

        try {
            await api.post('/cars', { ...formData, image: imageUrl });
            setShowModal(false);
            setFormData({
                name: '', model: '', category: 'Luxury',
                pricePerDay: '', fuel: 'Petrol', transmission: 'Automatic',
                image: '', seats: 4
            });
            setImageFile(null);
            fetchCars();
        } catch (err) {
            alert('Error adding car to database');
        }
    };

    return (
        <div className={styles.fleetContainer}>
            <div className={styles.sectionHeader}>
                <div>
                    <h4>Fleet Management</h4>
                    <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Manage your luxury vehicle inventory.</p>
                </div>
                <button className={styles.primaryBtn} onClick={() => setShowModal(true)}>
                    <Plus size={18} /> Add Vehicle
                </button>
            </div>

            {/* Filter Bar */}
            <div className={styles.filterBar}>
                <div className={styles.searchWrapper}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search vehicles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.filterActions}>
                    <button className={styles.filterBtn}><Filter size={18} /> Filter</button>
                </div>
            </div>

            {/* Fleet Table */}
            <div className={styles.section}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Vehicle</th>
                            <th>Category</th>
                            <th>Features</th>
                            <th>Daily Rate</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading fleet...</td></tr>
                        ) : filteredCars.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No vehicles found matching your search.</td></tr>
                        ) : (
                            filteredCars.map((car) => (
                                <tr key={car._id}>
                                    <td>
                                        <div className={styles.carCell}>
                                            <img src={car.image} alt={car.name} className={styles.carThumb} />
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{car.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{car.model}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className={styles.categoryBadge}>{car.category}</span></td>
                                    <td>
                                        <div className={styles.featureList}>
                                            <span>{car.fuel}</span>
                                            <span>•</span>
                                            <span>{car.transmission}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 700 }}>${car.pricePerDay}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${car.availability ? styles.approved : styles.denied}`}>
                                            {car.availability ? 'Available' : 'Booked'}
                                        </span>
                                    </td>
                                    <td className={styles.actions}>
                                        <button className={styles.actionBtn}><Edit2 size={16} /></button>
                                        <button className={`${styles.actionBtn} ${styles.deny}`} onClick={() => handleDelete(car._id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Car Modal */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>Add New Vehicle</h3>
                            <button onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className={styles.modalForm}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Vehicle Name</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Model</label>
                                    <input type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Category</label>
                                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                        <option>Luxury</option>
                                        <option>Sports</option>
                                        <option>SUV</option>
                                        <option>Sedan</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Daily Price ($)</label>
                                    <input type="number" value={formData.pricePerDay} onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Fuel Type</label>
                                    <select value={formData.fuel} onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}>
                                        <option>Petrol</option>
                                        <option>Diesel</option>
                                        <option>Electric</option>
                                        <option>Hybrid</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Transmission</label>
                                    <select value={formData.transmission} onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}>
                                        <option>Automatic</option>
                                        <option>Manual</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                                <label>Vehicle Image</label>
                                <div className={styles.fileUploadWrapper}>
                                    <input
                                        type="file"
                                        id="carImage"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className={styles.fileInput}
                                    />
                                    <label htmlFor="carImage" className={styles.fileLabel}>
                                        <Upload size={18} />
                                        {imageFile ? imageFile.name : 'Click to upload vehicle photo'}
                                    </label>
                                </div>
                            </div>
                            <button type="submit" className={styles.submitBtn} disabled={uploading}>
                                {uploading ? 'Uploading Image...' : 'Save Vehicle'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FleetManagement;
