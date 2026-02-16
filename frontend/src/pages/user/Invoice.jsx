import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Printer, ChevronLeft, Car, FileText } from 'lucide-react';
import api from '../../services/api';
import styles from './Invoice.module.css';

const Invoice = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await api.get(`/bookings/${bookingId}`);
                setBooking(res.data);
            } catch (err) {
                console.error('Error fetching invoice data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className={styles.loading}>Generating your invoice...</div>;
    if (!booking) return <div className={styles.error}>Invoice not found.</div>;

    const invoiceNum = `INV-${booking._id.slice(-6).toUpperCase()}`;
    const taxRate = 0.15; // 15% VAT
    const subtotal = booking.totalAmount / (1 + taxRate);
    const tax = booking.totalAmount - subtotal;

    return (
        <div className={styles.invoicePage}>
            <div className="container">
                <div className={styles.actions}>
                    <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
                        <ChevronLeft size={20} /> Back to Dashboard
                    </button>
                    <div className={styles.rightActions}>
                        <button className={styles.printBtn} onClick={handlePrint}>
                            <Printer size={20} /> Print Invoice
                        </button>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.invoiceCard}
                    id="invoice-content"
                >
                    <div className={styles.invoiceHeader}>
                        <div className={styles.brand}>
                            <div className={styles.logo}>
                                <Car size={32} color="#00ff88" />
                                <span>PREMIER LIMO</span>
                            </div>
                            <p>Premium Luxury Limo Services</p>
                        </div>
                        <div className={styles.invoiceMeta}>
                            <h1>INVOICE</h1>
                            <div className={styles.metaRow}>
                                <span className={styles.label}>Invoice #</span>
                                <span className={styles.value}>{invoiceNum}</span>
                            </div>
                            <div className={styles.metaRow}>
                                <span className={styles.label}>Date</span>
                                <span className={styles.value}>{new Date(booking.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className={styles.metaRow}>
                                <span className={styles.label}>Status</span>
                                <span className={`${styles.status} ${booking.paid ? styles.paid : ''}`}>
                                    {booking.paid ? 'PAID' : 'UNPAID'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.billingSection}>
                        <div className={styles.billTo}>
                            <h3>Bill To:</h3>
                            <p className={styles.customerName}>{booking.userName}</p>
                            <p>{booking.userEmail}</p>
                        </div>
                        <div className={styles.billFrom}>
                            <h3>From:</h3>
                            <p>Premier Limo Rental Co.</p>
                            <p>123 Luxury Avenue</p>
                            <p>Beverly Hills, CA 90210</p>
                            <p>contact@premierlimo.com</p>
                        </div>
                    </div>

                    <table className={styles.itemTable}>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Qty / Days</th>
                                <th>Rate</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className={styles.carInfo}>
                                        <p className={styles.itemName}>{booking.carName} Rental</p>
                                        <p className={styles.itemDates}>
                                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </td>
                                <td>{booking.duration} Days</td>
                                <td>${(booking.totalAmount / booking.duration).toFixed(2)}</td>
                                <td>${booking.totalAmount.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className={styles.summarySection}>
                        <div className={styles.notes}>
                            <h3>Notes:</h3>
                            <p>Thank you for choosing Premier Limo. Please return the vehicle with a full tank of fuel. Insurance coverage is included in the total amount.</p>
                        </div>
                        <div className={styles.totals}>
                            <div className={styles.totalRow}>
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span>Tax (15% VAT)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                                <span>Grand Total</span>
                                <span>${booking.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.invoiceFooter}>
                        <p>This is a computer-generated document. No signature is required.</p>
                        <div className={styles.footerLinks}>
                            <span>www.premierlimo.com</span>
                            <span>•</span>
                            <span>Terms & Conditions Apply</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Invoice;
