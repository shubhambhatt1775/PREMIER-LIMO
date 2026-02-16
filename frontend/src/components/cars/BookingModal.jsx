import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, CreditCard, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import styles from './BookingModal.module.css';

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

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
            setDays(diffDays);
            setTotalPrice(diffDays * car.pricePerDay);
        }
    }, [startDate, endDate, car.pricePerDay]);

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
                totalAmount: totalPrice
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

                            <div className={styles.formGroup}>
                                <label>
                                    <Calendar size={18} />
                                    Pick-up Date
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
                                    <Calendar size={18} />
                                    Return Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    min={startDate || new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.summary}>
                                <div className={styles.summaryRow}>
                                    <span>Duration</span>
                                    <span>{days} days</span>
                                </div>
                                <div className={[styles.summaryRow, styles.total].join(' ')}>
                                    <span>Total Price</span>
                                    <span>${totalPrice}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Request Booking'}
                                {!loading && <ChevronRight size={20} />}
                            </button>
                        </form>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default BookingModal;
