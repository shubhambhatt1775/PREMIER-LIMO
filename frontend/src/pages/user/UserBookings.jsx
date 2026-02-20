import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Download, CreditCard, Clock, CheckCircle, Car as CarIcon, AlertCircle, Key, Check, X, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import styles from './UserBookings.module.css';

const UserBookings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [activeTab, setActiveTab] = useState('active');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewBooking, setReviewBooking] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelBooking, setCancelBooking] = useState(null);

    // Queries for Bookings and History
    const { data: bookingsRes, isLoading: bookingsLoading } = useQuery({
        queryKey: ['user-bookings', user?._id],
        queryFn: () => api.get(`/bookings/user/${user._id}`),
        enabled: !!user?._id,
        refetchInterval: 30000, // Poll for approval status every 30s
    });

    const { data: historyRes, isLoading: historyLoading } = useQuery({
        queryKey: ['user-history', user?._id],
        queryFn: () => api.get(`/handover/history/user/${user._id}`),
        enabled: !!user?._id,
    });

    // Sub-query for Handover Status in Modal
    const { data: handoverRes } = useQuery({
        queryKey: ['handover-status', selectedBooking?._id],
        queryFn: () => api.get(`/handover/status/${selectedBooking._id}`),
        enabled: !!selectedBooking?._id && showOTPModal,
        refetchInterval: 10000, // Faster polling while modal is open to see admin verification
    });

    // Mutations
    const generateOTPMutation = useMutation({
        mutationFn: ({ type, id }) => {
            const endpoint = type === 'pickup'
                ? `/handover/generate-pickup-otp/${id}`
                : `/handover/generate-dropoff-otp/${id}`;
            return api.post(endpoint);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['handover-status', variables.id]);
        },
        onError: (err) => alert(err.response?.data?.message || 'Error generating OTP'),
    });

    const submitReviewMutation = useMutation({
        mutationFn: (reviewData) => api.post('/reviews', reviewData),
        onSuccess: () => {
            alert('Thank you for your review!');
            setShowReviewModal(false);
            setComment('');
            setRating(5);
        },
        onError: (err) => alert(err.response?.data?.message || 'Error submitting review'),
    });

    const cancelBookingMutation = useMutation({
        mutationFn: (id) => api.post(`/bookings/${id}/cancel`),
        onSuccess: (res) => {
            alert(`Booking cancelled. Refund of $${res.data.refundAmount.toFixed(2)} (${res.data.refundPercentage}%) has been processed.`);
            setShowCancelModal(false);
            setCancelBooking(null);
            queryClient.invalidateQueries(['user-bookings']);
            queryClient.invalidateQueries(['admin-stats']);
        },
        onError: (err) => alert(err.response?.data?.message || 'Error cancelling booking'),
    });

    // Data Processing
    const allBookings = bookingsRes?.data || [];
    const bookings = allBookings.filter(b => b.status !== 'completed');
    const manualHistory = allBookings.filter(b => b.status === 'completed');
    const history = historyRes?.data || [];
    const loading = bookingsLoading || historyLoading;

    const handleHandoverAction = (booking) => {
        setSelectedBooking(booking);
        setShowOTPModal(true);
    };

    const generateOTP = (type) => {
        generateOTPMutation.mutate({ type, id: selectedBooking._id });
    };

    const submitReview = () => {
        submitReviewMutation.mutate({
            bookingId: reviewBooking.booking || reviewBooking._id,
            carId: reviewBooking.car,
            userId: user._id,
            userName: user.name,
            rating,
            comment
        });
    };

    const calculateRefundInfo = (booking) => {
        if (!booking) return null;
        const now = new Date();
        const pickupDate = new Date(booking.startDate);
        const hoursUntilPickup = (pickupDate - now) / (1000 * 60 * 60);

        if (hoursUntilPickup > 48) return { percentage: 100, amount: booking.totalAmount };
        if (hoursUntilPickup >= 24) return { percentage: 80, amount: booking.totalAmount * 0.8 };
        return null;
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
                                        <div className={styles.pendingActions}>
                                            <div className={styles.waitingMsg}>
                                                <AlertCircle size={14} />
                                                <span>Awaiting approval</span>
                                            </div>
                                            <button
                                                className={styles.cancelLink}
                                                onClick={() => {
                                                    setCancelBooking(booking);
                                                    setShowCancelModal(true);
                                                }}
                                            >
                                                Cancel Request
                                            </button>
                                        </div>
                                    )}
                                    {booking.status === 'approved' && (
                                        <button
                                            className={styles.cancelLink}
                                            disabled={new Date(booking.startDate) - new Date() < 24 * 60 * 60 * 1000}
                                            onClick={() => {
                                                setCancelBooking(booking);
                                                setShowCancelModal(true);
                                            }}
                                        >
                                            {new Date(booking.startDate) - new Date() < 24 * 60 * 60 * 1000
                                                ? 'Cancellation Locked'
                                                : 'Cancel Booking'
                                            }
                                        </button>
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
                                disabled={submitReviewMutation.isLoading}
                            >
                                {submitReviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
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
                                {handoverRes?.data?.pickupVerified ? (
                                    <div className={styles.verifiedBadge}>
                                        <CheckCircle size={20} />
                                        <span>Verified on {new Date(handoverRes.data.pickupTime).toLocaleString()}</span>
                                    </div>
                                ) : (
                                    <div className={styles.otpAction}>
                                        {handoverRes?.data?.pickupOTP ? (
                                            <div className={styles.otpDisplay}>
                                                <span className={styles.otpLabel}>Give this OTP to Admin:</span>
                                                <div className={styles.otpValue}>{handoverRes.data.pickupOTP}</div>
                                            </div>
                                        ) : (
                                            <button
                                                className="btn-primary"
                                                onClick={() => generateOTP('pickup')}
                                                disabled={generateOTPMutation.isLoading}
                                            >
                                                {generateOTPMutation.isLoading ? 'Generating...' : 'Generate Pickup OTP'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Dropoff Section */}
                            <div className={styles.handoverBox}>
                                <h3><Download size={20} /> Dropoff/Return</h3>
                                {!handoverRes?.data?.pickupVerified ? (
                                    <p className={styles.infoText}>Available after car pickup.</p>
                                ) : handoverRes?.data?.dropoffVerified ? (
                                    <div className={styles.verifiedBadge}>
                                        <CheckCircle size={20} />
                                        <span>Returned on {new Date(handoverRes.data.dropoffTime).toLocaleString()}</span>
                                    </div>
                                ) : (
                                    <div className={styles.otpAction}>
                                        {handoverRes?.data?.dropoffOTP ? (
                                            <div className={styles.otpDisplay}>
                                                <span className={styles.otpLabel}>Give this OTP to Admin:</span>
                                                <div className={styles.otpValue}>{handoverRes.data.dropoffOTP}</div>
                                            </div>
                                        ) : (
                                            <button
                                                className="btn-primary"
                                                onClick={() => generateOTP('dropoff')}
                                                disabled={generateOTPMutation.isLoading}
                                            >
                                                {generateOTPMutation.isLoading ? 'Generating...' : 'Generate Dropoff OTP'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Cancellation Modal */}
            {showCancelModal && (
                <div className={styles.modalOverlay} onClick={() => setShowCancelModal(false)}>
                    <motion.div
                        className={styles.modalContent}
                        onClick={e => e.stopPropagation()}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <div className={styles.modalHeader}>
                            <h2>Cancel Booking</h2>
                            <button className={styles.closeBtn} onClick={() => setShowCancelModal(false)}><X size={24} /></button>
                        </div>

                        <div className={styles.reviewBody}>
                            <p>Are you sure you want to cancel your booking for <strong>{cancelBooking?.carName}</strong>?</p>

                            <div className={styles.policyBox}>
                                <h4>Refund Policy</h4>
                                {(() => {
                                    const refund = calculateRefundInfo(cancelBooking);
                                    if (!refund) return (
                                        <p className={styles.errorText}>
                                            <AlertCircle size={16} />
                                            Cancellation is no longer allowed (less than 24h until pickup).
                                        </p>
                                    );
                                    return (
                                        <div className={styles.refundDetails}>
                                            <p>Eligible Refund: <strong>{refund.percentage}%</strong></p>
                                            <p>Refund Amount: <strong className={styles.amount}>${refund.amount.toFixed(2)}</strong></p>
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className={styles.modalActions}>
                                <button className="btn-secondary" onClick={() => setShowCancelModal(false)}>Keep Booking</button>
                                <button
                                    className={styles.confirmCancelBtn}
                                    onClick={() => cancelBookingMutation.mutate(cancelBooking._id)}
                                    disabled={cancelBookingMutation.isLoading || !calculateRefundInfo(cancelBooking)}
                                >
                                    {cancelBookingMutation.isLoading ? 'Processing...' : 'Confirm Cancellation'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default UserBookings;
