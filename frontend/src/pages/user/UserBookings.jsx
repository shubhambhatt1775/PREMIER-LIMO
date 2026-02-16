import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, CreditCard, Clock, CheckCircle, Car as CarIcon, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import styles from './UserBookings.module.css';

const UserBookings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user._id) {
            fetchUserBookings();
        }
    }, [user]);

    const fetchUserBookings = async () => {
        try {
            const res = await api.get(`/bookings/user/${user._id}`);
            // Ensure we only show bookings where the email matches the current user
            const myBookings = res.data.filter(b => b.userEmail === user.email);
            setBookings(myBookings);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.dashboardContent}>
            <header className={styles.header}>
                <h1 className="gradient-text">My Bookings</h1>
                <p>Track your rental requests and download invoices.</p>
            </header>

            <div className={styles.bookingGrid}>
                {loading ? (
                    <p className={styles.loading}>Loading your bookings...</p>
                ) : bookings.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}><CarIcon size={48} /></div>
                        <h3>No bookings yet</h3>
                        <p>You haven't made any bookings properly yet.</p>
                        <button className="btn-primary" onClick={() => navigate('/cars')}>Browse Fleet</button>
                    </div>
                ) : (
                    bookings.map(booking => (
                        <motion.div
                            key={booking._id}
                            className={styles.bookingCard}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={styles.bookingHeader}>
                                <div className={styles.carInfo}>
                                    <CarIcon size={24} className={styles.carIcon} />
                                    <div>
                                        <h3>{booking.carName}</h3>
                                        <span className={styles.bookingId}>ID: {booking._id.slice(-6)}</span>
                                    </div>
                                </div>
                                <span className={`${styles.status} ${styles[booking.status]}`}>
                                    {booking.status}
                                </span>
                            </div>

                            <div className={styles.bookingDetails}>
                                <div className={styles.detail}>
                                    <Clock size={16} />
                                    <span>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
                                </div>
                                <div className={styles.detail}>
                                    <CreditCard size={16} />
                                    <span>${booking.totalAmount}</span>
                                </div>
                            </div>

                            <div className={styles.actions}>
                                {booking.status === 'approved' && !booking.paid && (
                                    <button
                                        className={styles.payBtn}
                                        onClick={() => navigate('/payment', { state: { booking } })}
                                    >
                                        Pay Now
                                    </button>
                                )}
                                {booking.paid && (
                                    <button
                                        className={styles.invoiceBtn}
                                        onClick={() => navigate(`/invoice/${booking._id}`)}
                                    >
                                        <Download size={18} />
                                        Invoice
                                    </button>
                                )}
                                {booking.status === 'pending' && (
                                    <div className={styles.waitingMsg}>
                                        <AlertCircle size={14} />
                                        <span>Awaiting approval</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserBookings;
