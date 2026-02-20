import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, CreditCard, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../../services/api';
import styles from './BookingModal.module.css';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapEvents = ({ setPosition, position }) => {
    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;
            setPosition({ ...position, lat, lng, address: 'Fetching address...' });

            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
                const data = await response.json();
                if (data && data.display_name) {
                    setPosition({ ...position, lat, lng, address: data.display_name });
                } else {
                    setPosition({ ...position, lat, lng, address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}` });
                }
            } catch (error) {
                console.error("Geocoding error:", error);
                setPosition({ ...position, lat, lng, address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}` });
            }
        },
    });
    return null;
};

const RecenterMap = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([position.lat, position.lng]);
    }, [position.lat, position.lng]);
    return null;
};

const LocationPicker = ({ position, setPosition, label }) => {

    return (
        <div className={styles.mapWrapper}>
            <p className={styles.mapLabel}>{label}</p>
            <MapContainer center={[position.lat, position.lng]} zoom={15} style={{ height: '180px', width: '100%', borderRadius: '12px' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[position.lat, position.lng]} />
                <MapEvents setPosition={setPosition} position={position} />
                <RecenterMap position={position} />
            </MapContainer>
            <div className={styles.coords}>
                <span>Lat: {position.lat.toFixed(4)}</span>
                <span>Lng: {position.lng.toFixed(4)}</span>
            </div>
            <input
                type="text"
                placeholder="Enter area/address name"
                value={position.address}
                onChange={(e) => setPosition({ ...position, address: e.target.value })}
                className={styles.addressInput}
                required
            />
        </div>
    );
};

const BookingModal = ({ car, onClose }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [days, setDays] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [bookedDates, setBookedDates] = useState([]);

    // Default to Ahmedabad, Gujarat, India
    const [pickupLocation, setPickupLocation] = useState({ address: '', lat: 23.0225, lng: 72.5714 });
    const [dropoffLocation, setDropoffLocation] = useState({ address: '', lat: 23.0338, lng: 72.5850 });

    useEffect(() => {
        const fetchBookedDates = async () => {
            try {
                const response = await api.get(`/bookings/car/${car._id}/booked-dates`);
                setBookedDates(response.data);
            } catch (err) {
                console.error('Error fetching booked dates:', err);
            }
        };
        fetchBookedDates();
    }, [car._id]);

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
            setDays(diffDays);
            setTotalPrice(diffDays * car.pricePerDay);

            // Check for overlap immediately
            const hasOverlap = bookedDates.some(range => {
                const bookedStart = new Date(range.start);
                const bookedEnd = new Date(range.end);
                return start <= bookedEnd && end >= bookedStart;
            });

            if (hasOverlap) {
                setError('Vehicle is already booked for these dates by another approved request.');
            } else if (start >= end) {
                setError('End date must be after start date.');
            } else {
                setError(null);
            }
        }
    }, [startDate, endDate, car.pricePerDay, bookedDates]);

    const handleBooking = async (e) => {
        e.preventDefault();
        setError(null);

        if (!user) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        if (!startDate || !endDate) {
            setError('Please select both start and end dates.');
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            setError('End date must be after start date.');
            return;
        }

        const hasOverlap = bookedDates.some(range => {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const bookedStart = new Date(range.start);
            const bookedEnd = new Date(range.end);
            return start <= bookedEnd && end >= bookedStart;
        });

        if (hasOverlap) {
            setError('Vehicle is already booked for these dates by another approved request.');
            return;
        }

        setLoading(true);
        try {
            const bookingData = {
                carId: car._id,
                userId: user._id,
                userName: user.name,
                userEmail: user.email,
                carName: car.name,
                startDate,
                endDate,
                duration: days,
                totalAmount: totalPrice,
                pickupLocation,
                dropoffLocation
            };

            await api.post('/bookings', bookingData);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create booking request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.overlay}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className={styles.modal}
                onClick={e => e.stopPropagation()}
            >
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={24} />
                </button>

                {success ? (
                    <div className={styles.successContent}>
                        <div className={styles.successIcon}>
                            <CheckCircle2 size={64} color="#00ff88" />
                        </div>
                        <h2>Booking Requested!</h2>
                        <p>Your request for the <strong>{car.name}</strong> has been submitted. We will review it and get back to you soon.</p>
                        <button className={styles.primaryBtn} onClick={onClose}>
                            Close
                        </button>
                    </div>
                ) : (
                    <div className={styles.modalContent}>
                        <div className={styles.carInfo}>
                            <div className={styles.imageWrapper}>
                                <img src={car.image} alt={car.name} />
                            </div>
                            <div className={styles.details}>
                                <span className={styles.category}>{car.category}</span>
                                <h2>{car.name}</h2>
                                <p className={styles.price}>${car.pricePerDay} <span>/ day</span></p>

                                <div className={styles.specs}>
                                    <div className={styles.spec}>
                                        <Clock size={16} />
                                        <span>{car.transmission}</span>
                                    </div>
                                    <div className={styles.spec}>
                                        <CreditCard size={16} />
                                        <span>{car.fuel}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form className={styles.bookingForm} onSubmit={handleBooking}>
                            <h3>Reservation Details</h3>

                            {error && (
                                <div className={styles.errorMsg}>
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className={styles.datesGrid}>
                                <div className={styles.formGroup}>
                                    <label>
                                        <Calendar size={16} />
                                        Pick-up
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>
                                        <Calendar size={16} />
                                        Return
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        min={startDate || new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.locationSection}>
                                <LocationPicker
                                    label="Pick-up Location"
                                    position={pickupLocation}
                                    setPosition={setPickupLocation}
                                />
                                <LocationPicker
                                    label="Drop-off Location"
                                    position={dropoffLocation}
                                    setPosition={setDropoffLocation}
                                />
                            </div>

                            {bookedDates.length > 0 && (
                                <div className={styles.bookedDatesSection}>
                                    <label className={styles.bookedLabel}>
                                        <AlertCircle size={14} />
                                        Currently Reserved Dates:
                                    </label>
                                    <div className={styles.bookedDatesList}>
                                        {bookedDates.map((range, idx) => (
                                            <span key={idx} className={styles.bookedDateTag}>
                                                {new Date(range.start).toLocaleDateString()} - {new Date(range.end).toLocaleDateString()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className={styles.summary}>
                                <div className={styles.summaryRow}>
                                    <span>Duration</span>
                                    <span>{days} days</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Total Price</span>
                                    <span className={styles.total}>${totalPrice}</span>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className={styles.submitBtn}
                                        disabled={loading}
                                    >
                                        {loading ? '...' : 'Request'}
                                        {!loading && <ChevronRight size={18} />}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default BookingModal;
