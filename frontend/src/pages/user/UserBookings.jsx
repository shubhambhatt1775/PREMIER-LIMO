import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, CreditCard, Clock, CheckCircle, Car as CarIcon, AlertCircle, Key, Check, X, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import styles from './UserBookings.module.css';

const UserBookings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [handoverData, setHandoverData] = useState(null);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [generatingOTP, setGeneratingOTP] = useState(false);
    const [activeTab, setActiveTab] = useState('active');
    const [history, setHistory] = useState([]);
    const [manualHistory, setManualHistory] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewBooking, setReviewBooking] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        if (user && user._id) {
            fetchUserBookings();
            fetchHistory();
        }
    }, [user]);

    const fetchUserBookings = async () => {
        try {
            const res = await api.get(`/bookings/user/${user._id}`);
            // Active bookings are those not completed
            const active = res.data.filter(b => b.status !== 'completed');
            setBookings(active);

            // Also include completed bookings that might not be in the RideHistory collection yet
            const manualHistory = res.data.filter(b => b.status === 'completed');
            setManualHistory(manualHistory);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await api.get(`/handover/history/user/${user._id}`);
            setHistory(res.data);
        } catch (err) {
            console.error('Error fetching history:', err);
        }
    };

    const handleHandoverAction = async (booking) => {
        setSelectedBooking(booking);
        setShowOTPModal(true);
        fetchHandoverStatus(booking._id);
    };

    const fetchHandoverStatus = async (bookingId) => {
        try {
            const res = await api.get(`/handover/status/${bookingId}`);
            setHandoverData(res.data);
        } catch (err) {
            console.error('Error fetching handover status:', err);
        }
    };

    const generateOTP = async (type) => {
        setGeneratingOTP(true);
        try {
            const endpoint = type === 'pickup'
                ? `/handover/generate-pickup-otp/${selectedBooking._id}`
                : `/handover/generate-dropoff-otp/${selectedBooking._id}`;
            const res = await api.post(endpoint);
            setHandoverData(prev => ({ ...prev, [type === 'pickup' ? 'pickupOTP' : 'dropoffOTP']: res.data.otp }));
            fetchHandoverStatus(selectedBooking._id);
        } catch (err) {
            alert(err.response?.data?.message || 'Error generating OTP');
        } finally {
            setGeneratingOTP(false);
        }
    };

    const submitReview = async () => {
        setSubmittingReview(true);
        try {
            await api.post('/reviews', {
                bookingId: reviewBooking.booking || reviewBooking._id,
                carId: reviewBooking.car,
                userId: user._id,
                userName: user.name,
                rating,
                comment
            });
            alert('Thank you for your review!');
            setShowReviewModal(false);
            setComment('');
            setRating(5);
        } catch (err) {
            alert(err.response?.data?.message || 'Error submitting review');
        } finally {
            setSubmittingReview(false);
        }
    };

    return (
        <div className={styles.dashboardContent}>
            <header className={styles.header}>
                <h1 className="gradient-text">My Bookings</h1>
                <p>Track your rental requests and download invoices.</p>
            </header>

            <div className={styles.tabContainer}>
                <button
                    className={`${styles.tab} ${activeTab === 'active' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    Active Bookings ({bookings.length})
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'history' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    Ride History ({history.length + manualHistory.length})
                </button>
            </div>

            <div className={styles.bookingGrid}>
                {loading ? (
                    <p className={styles.loading}>Loading...</p>
                ) : activeTab === 'active' ? (
                    bookings.length === 0 ? (
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
                                    {booking.pickupLocation && (
                                        <div className={styles.detail}>
                                            <MapPin size={16} />
                                            <span>Pick-up: {booking.pickupLocation.address}</span>
                                        </div>
                                    )}
                                    {booking.dropoffLocation && (
                                        <div className={styles.detail}>
                                            <MapPin size={16} />
                                            <span>Drop-off: {booking.dropoffLocation.address}</span>
                                        </div>
                                    )}
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
                                        <>
                                            <button
                                                className={styles.invoiceBtn}
                                                onClick={() => navigate(`/invoice/${booking._id}`)}
                                            >
                                                <Download size={18} />
                                                Invoice
                                            </button>
                                            <button
                                                className={styles.handoverBtn}
                                                onClick={() => handleHandoverAction(booking)}
                                            >
                                                <Key size={18} />
                                                Handover
                                            </button>
                                        </>
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
                    )
                ) : (
                    (history.length === 0 && manualHistory.length === 0) ? (
                        <div className={styles.emptyState}>
                            <h3>No ride history</h3>
                            <p>You haven't completed any rides yet.</p>
                        </div>
                    ) : (
                        [...history, ...manualHistory].map(item => {
                            const isManual = !item.completedAt; // Bookings don't have completedAt, RideHistory records do
                            return (
                                <motion.div
                                    key={item._id}
                                    className={`${styles.bookingCard} ${styles.historyCard}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className={styles.bookingHeader}>
                                        <div className={styles.carInfo}>
                                            <CheckCircle size={24} color="#22c55e" />
                                            <div>
                                                <h3>{item.carName}</h3>
                                                <span className={styles.completedBadge}>
                                                    Completed on {new Date(item.completedAt || item.updatedAt || item.startDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={styles.historyId}>Ref: {item._id.slice(-6).toUpperCase()}</span>
                                    </div>
                                    <div className={styles.bookingDetails}>
                                        <div className={styles.detail}>
                                            <Clock size={16} />
                                            <span>Duration: {item.duration} days</span>
                                        </div>
                                        <div className={styles.detail}>
                                            <CreditCard size={16} />
                                            <span>Total: ${item.totalAmount}</span>
                                        </div>
                                        {item.pickupLocation && (
                                            <div className={styles.detail}>
                                                <MapPin size={16} />
                                                <span>Pick-up: {item.pickupLocation.address}</span>
                                            </div>
                                        )}
                                        {item.dropoffLocation && (
                                            <div className={styles.detail}>
                                                <MapPin size={16} />
                                                <span>Drop-off: {item.dropoffLocation.address}</span>
                                            </div>
                                        )}
                                    </div>
                                    {!isManual ? (
                                        <div className={styles.historyTimes}>
                                            <p><strong>Picked Up:</strong> {new Date(item.pickupTime).toLocaleString()}</p>
                                            <p><strong>Returned:</strong> {new Date(item.dropoffTime).toLocaleString()}</p>
                                        </div>
                                    ) : (
                                        <div className={styles.historyTimes}>
                                            <p><em>Booking completed manually.</em></p>
                                        </div>
                                    )}
                                    <button
                                        className={styles.rateBtn}
                                        onClick={() => {
                                            setReviewBooking(item);
                                            setShowReviewModal(true);
                                        }}
                                    >
                                        Rate Experience
                                    </button>
                                </motion.div>
                            );
                        })
                    )
                )}
            </div>

            {/* Review Modal */}
            {showReviewModal && (
                <div className={styles.modalOverlay} onClick={() => setShowReviewModal(false)}>
                    <motion.div
                        className={styles.modalContent}
                        onClick={e => e.stopPropagation()}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <div className={styles.modalHeader}>
                            <h2>Rate Your Experience</h2>
                            <button className={styles.closeBtn} onClick={() => setShowReviewModal(false)}><X size={24} /></button>
                        </div>

                        <div className={styles.reviewBody}>
                            <h3>How was your ride with the {reviewBooking?.carName}?</h3>

                            <div className={styles.starRating}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={star <= rating ? styles.starActive : styles.starInactive}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>

                            <textarea
                                className={styles.reviewText}
                                placeholder="Share your experience (optional)..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />

                            <button
                                className="btn-primary"
                                style={{ width: '100%', marginTop: '1rem' }}
                                onClick={submitReview}
                                disabled={submittingReview}
                            >
                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* OTP Modal */}
            {showOTPModal && (
                <div className={styles.modalOverlay} onClick={() => setShowOTPModal(false)}>
                    <motion.div
                        className={styles.modalContent}
                        onClick={e => e.stopPropagation()}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <div className={styles.modalHeader}>
                            <h2>Car Handover Details</h2>
                            <button className={styles.closeBtn} onClick={() => setShowOTPModal(false)}><X size={24} /></button>
                        </div>

                        <div className={styles.handoverSections}>
                            {/* Pickup Section */}
                            <div className={styles.handoverBox}>
                                <h3><CarIcon size={20} /> Pickup Handover</h3>
                                {handoverData?.pickupVerified ? (
                                    <div className={styles.verifiedBadge}>
                                        <CheckCircle size={20} />
                                        <span>Verified on {new Date(handoverData.pickupTime).toLocaleString()}</span>
                                    </div>
                                ) : (
                                    <div className={styles.otpAction}>
                                        {handoverData?.pickupOTP ? (
                                            <div className={styles.otpDisplay}>
                                                <span className={styles.otpLabel}>Give this OTP to Admin:</span>
                                                <div className={styles.otpValue}>{handoverData.pickupOTP}</div>
                                            </div>
                                        ) : (
                                            <button
                                                className="btn-primary"
                                                onClick={() => generateOTP('pickup')}
                                                disabled={generatingOTP}
                                            >
                                                Generate Pickup OTP
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Dropoff Section */}
                            <div className={styles.handoverBox}>
                                <h3><Download size={20} /> Dropoff/Return</h3>
                                {!handoverData?.pickupVerified ? (
                                    <p className={styles.infoText}>Available after car pickup.</p>
                                ) : handoverData?.dropoffVerified ? (
                                    <div className={styles.verifiedBadge}>
                                        <CheckCircle size={20} />
                                        <span>Returned on {new Date(handoverData.dropoffTime).toLocaleString()}</span>
                                    </div>
                                ) : (
                                    <div className={styles.otpAction}>
                                        {handoverData?.dropoffOTP ? (
                                            <div className={styles.otpDisplay}>
                                                <span className={styles.otpLabel}>Give this OTP to Admin:</span>
                                                <div className={styles.otpValue}>{handoverData.dropoffOTP}</div>
                                            </div>
                                        ) : (
                                            <button
                                                className="btn-primary"
                                                onClick={() => generateOTP('dropoff')}
                                                disabled={generatingOTP}
                                            >
                                                Generate Dropoff OTP
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default UserBookings;
