import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ShieldCheck, ChevronRight, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import styles from './Payment.module.css';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { booking } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

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
            const { data } = await api.post('/payments/create-checkout-session', {
                bookingId: booking._id,
                amount: booking.totalAmount,
                carName: booking.carName
            });

            if (data.url) {
                window.location.href = data.url;
            } else {
                setError('Failed to create payment session. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed. Please try again.');
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

                                    <div className={styles.stripeInfo}>
                                        <p>You will be redirected to <strong>Stripe Secure Checkout</strong> to complete your payment.</p>
                                        <ul className={styles.features}>
                                            <li><ShieldCheck size={16} /> PCI Compliant & Secure</li>
                                            <li><ShieldCheck size={16} /> All major cards supported</li>
                                            <li><ShieldCheck size={16} /> Instant confirmation</li>
                                        </ul>
                                    </div>

                                    <button
                                        onClick={handlePayment}
                                        className={styles.submitBtn}
                                        disabled={loading}
                                    >
                                        {loading ? 'Initializing Stripe...' : `Checkout with Stripe`}
                                        {!loading && <ChevronRight size={20} />}
                                    </button>

                                    <div className={styles.stripeBranding}>
                                        <Lock size={12} />
                                        <span>Powered by Stripe</span>
                                    </div>

                                    <p className={styles.disclaimer}>
                                        By clicking "Checkout with Stripe", you agree to our terms and conditions.
                                        Your payment information is processed securely by Stripe.
                                    </p>
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
