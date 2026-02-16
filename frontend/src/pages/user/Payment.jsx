import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ShieldCheck, ChevronRight, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import styles from './Payment.module.css';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { booking } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });

    useEffect(() => {
        if (!booking) {
            navigate('/dashboard');
        }
    }, [booking, navigate]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Simulate payment processing...
            await new Promise(resolve => setTimeout(resolve, 2000));

            const paymentData = {
                bookingId: booking._id,
                userId: user._id,
                amount: booking.totalAmount,
                paymentMethod: 'Credit Card',
                transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase()
            };

            await api.post('/payments', paymentData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 4000);
        } catch (err) {
            setError('Payment failed. Please check your card details and try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!booking) return null;

    return (
        <div className={styles.paymentPage}>
            <div className="container">
                <div className={styles.paymentGrid}>
                    <div className={styles.summarySection}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={styles.card}
                        >
                            <h2 className={styles.sectionTitle}>Booking Summary</h2>
                            <div className={styles.carDetails}>
                                <div className={styles.label}>Vehicle</div>
                                <div className={styles.value}>{booking.carName}</div>
                            </div>
                            <div className={styles.dateRow}>
                                <div>
                                    <div className={styles.label}>From</div>
                                    <div className={styles.value}>{new Date(booking.startDate).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <div className={styles.label}>To</div>
                                    <div className={styles.value}>{new Date(booking.endDate).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div className={styles.divider}></div>
                            <div className={styles.totalRow}>
                                <span>Total Amount</span>
                                <span className={styles.totalAmount}>${booking.totalAmount}</span>
                            </div>

                            <div className={styles.guarantee}>
                                <ShieldCheck size={20} color="#00ff88" />
                                <span>Secure encrypted payment</span>
                            </div>
                        </motion.div>
                    </div>

                    <div className={styles.formSection}>
                        <AnimatePresence mode="wait">
                            {success ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={styles.successCard}
                                >
                                    <div className={styles.successIcon}>
                                        <CheckCircle2 size={80} color="#00ff88" />
                                    </div>
                                    <h2>Payment Successful!</h2>
                                    <p>Your booking for <strong>{booking.carName}</strong> is now confirmed.</p>
                                    <p className={styles.redirectMsg}>Redirecting to your dashboard...</p>
                                    <button className={styles.primaryBtn} onClick={() => navigate('/dashboard')}>
                                        Return to Dashboard
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={styles.paymentCard}
                                >
                                    <div className={styles.formHeader}>
                                        <CreditCard size={24} />
                                        <h2>Payment Information</h2>
                                    </div>

                                    {error && (
                                        <div className={styles.errorMsg}>
                                            <AlertCircle size={18} />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handlePayment} className={styles.form}>
                                        <div className={styles.formGroup}>
                                            <label>Cardholder Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="JOHN DOE"
                                                value={cardData.name}
                                                onChange={e => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Card Number</label>
                                            <div className={styles.inputIconWrapper}>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="0000 0000 0000 0000"
                                                    maxLength="19"
                                                    value={cardData.number}
                                                    onChange={e => setCardData({ ...cardData, number: e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim() })}
                                                />
                                                <Lock size={16} className={styles.inputIcon} />
                                            </div>
                                        </div>
                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Expiry Date</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="MM / YY"
                                                    maxLength="5"
                                                    value={cardData.expiry}
                                                    onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>CVV</label>
                                                <input
                                                    type="password"
                                                    required
                                                    placeholder="***"
                                                    maxLength="3"
                                                    value={cardData.cvv}
                                                    onChange={e => setCardData({ ...cardData, cvv: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className={styles.submitBtn}
                                            disabled={loading}
                                        >
                                            {loading ? 'Processing...' : `Pay $${booking.totalAmount}`}
                                            {!loading && <ChevronRight size={20} />}
                                        </button>

                                        <p className={styles.disclaimer}>
                                            By clicking "Pay", you agree to our terms and conditions.
                                            All transactions are secure and encrypted.
                                        </p>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
