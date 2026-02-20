import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';
import styles from './Payment.module.css';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [paymentData, setPaymentData] = useState(null);

    const sessionId = searchParams.get('session_id');
    const bookingId = searchParams.get('bookingId');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                if (!sessionId || !bookingId) {
                    setStatus('error');
                    return;
                }

                const { data } = await api.post('/payments/verify', {
                    sessionId,
                    bookingId
                });

                if (data.success) {
                    setPaymentData(data.payment);
                    setStatus('success');
                    // Automatically redirect after 5 seconds
                    setTimeout(() => {
                        navigate('/dashboard/bookings');
                    }, 5000);
                } else {
                    setStatus('error');
                }
            } catch (err) {
                console.error('Verification error:', err);
                setStatus('error');
            }
        };

        verifyPayment();
    }, [sessionId, bookingId, navigate]);

    return (
        <div className={styles.paymentPage}>
            <div className="container">
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    {status === 'verifying' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={styles.successCard}
                        >
                            <Loader2 size={60} className="animate-spin" color="#00ff88" style={{ margin: '0 auto 2rem' }} />
                            <h2>Verifying Payment</h2>
                            <p>Please wait while we confirm your transaction with Stripe...</p>
                        </motion.div>
                    )}

                    {status === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={styles.successCard}
                        >
                            <CheckCircle2 size={80} color="#00ff88" style={{ margin: '0 auto 2rem' }} />
                            <h2>Payment Confirmed!</h2>
                            <p>Thank you! Your payment has been processed successfully.</p>
                            <p>Booking ID: <strong>{bookingId}</strong></p>
                            <div className={styles.redirectMsg}>
                                Redirecting to your bookings in 5 seconds...
                            </div>
                            <button
                                className={styles.primaryBtn}
                                onClick={() => navigate('/dashboard/bookings')}
                            >
                                Go to My Bookings
                            </button>
                        </motion.div>
                    )}

                    {status === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={styles.successCard}
                            style={{ borderColor: 'rgba(255, 71, 71, 0.2)' }}
                        >
                            <XCircle size={80} color="#ff4747" style={{ margin: '0 auto 2rem' }} />
                            <h2 style={{ color: '#ff4747' }}>Payment Verification Failed</h2>
                            <p>We couldn't verify your payment. If you were charged, please contact support.</p>
                            <button
                                className={styles.primaryBtn}
                                onClick={() => navigate('/dashboard/bookings')}
                                style={{ backgroundColor: '#ff4747', color: 'white' }}
                            >
                                Return to Dashboard
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
