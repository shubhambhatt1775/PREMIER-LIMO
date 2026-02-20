import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    Check, X, Clock, DollarSign, Users, Car,
    LayoutDashboard, Briefcase, Calendar, Settings,
    Bell, Search, ChevronRight, LogOut, CreditCard, Key, CheckCircle, MapPin, FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from './AdminDashboard.module.css';

import FleetManagement from './FleetManagement';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeSection, setActiveSection] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showHandoverModal, setShowHandoverModal] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    // Queries for Real-time Data
    const { data: statsRes, isLoading: statsLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: () => api.get('/admin/stats'),
        refetchInterval: 30000, // Refresh stats every 30 seconds
    });

    const { data: bookingsRes, isLoading: bookingsLoading } = useQuery({
        queryKey: ['bookings'],
        queryFn: () => api.get('/bookings'),
        refetchInterval: 60000, // Refresh bookings every minute
    });

    const { data: customersRes, isLoading: customersLoading } = useQuery({
        queryKey: ['admin-customers'],
        queryFn: () => api.get('/admin/customers'),
        enabled: activeSection === 'customers',
    });

    const { data: paymentsRes, isLoading: paymentsLoading } = useQuery({
        queryKey: ['payments'],
        queryFn: () => api.get('/payments'),
        enabled: activeSection === 'payments',
    });

    const { data: historyRes, isLoading: historyLoading } = useQuery({
        queryKey: ['admin-history'],
        queryFn: () => api.get('/handover/history/admin'),
        enabled: activeSection === 'history',
    });

    const { data: licensesRes, isLoading: licensesLoading } = useQuery({
        queryKey: ['admin-licenses'],
        queryFn: () => api.get('/admin/licenses'),
        enabled: activeSection === 'licenses',
    });

    // Mutations for UI and Data Updates
    const updateBookingStatus = useMutation({
        mutationFn: ({ id, status }) => api.patch(`/bookings/${id}/status`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries(['bookings']);
            queryClient.invalidateQueries(['admin-stats']);
        },
        onError: (err) => alert(err.response?.data?.message || 'Failed to update booking status'),
    });

    const updateLicenseStatus = useMutation({
        mutationFn: ({ id, status }) => api.patch(`/admin/licenses/${id}/status`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-licenses']);
            alert('License status updated!');
        },
        onError: (err) => alert(err.response?.data?.message || 'Error updating license status'),
    });

    const verifyOTPMutation = useMutation({
        mutationFn: ({ type, id, otp }) => {
            const endpoint = type === 'pickup'
                ? `/handover/verify-pickup-otp/${id}`
                : `/handover/verify-dropoff-otp/${id}`;
            return api.post(endpoint, { otp });
        },
        onSuccess: (_, variables) => {
            setOtpInput('');
            queryClient.invalidateQueries(['handover-status', variables.id]);
            queryClient.invalidateQueries(['bookings']);
            queryClient.invalidateQueries(['admin-stats']);
            alert(`${variables.type === 'pickup' ? 'Pickup' : 'Dropoff'} verified!`);
        },
        onError: (err) => alert(err.response?.data?.message || 'Error verifying OTP'),
    });

    // Sub-query for Handover Status
    const { data: handoverRes } = useQuery({
        queryKey: ['handover-status', selectedBooking?._id],
        queryFn: () => api.get(`/handover/status/${selectedBooking._id}`),
        enabled: !!selectedBooking?._id && showHandoverModal,
    });

    const handleAction = (id, newStatus) => {
        updateBookingStatus.mutate({ id, status: newStatus });
    };

    const handleManageHandover = (booking) => {
        setSelectedBooking(booking);
        setShowHandoverModal(true);
    };

    const verifyOTP = (type) => {
        verifyOTPMutation.mutate({ type, id: selectedBooking._id, otp: otpInput });
    };

    const handleLicenseStatus = (id, status) => {
        updateLicenseStatus.mutate({ id, status });
    };

    // Derived Data
    const statsData = statsRes?.data || {
        totalRevenue: '$0',
        activeBookings: '0',
        pendingRequests: '0',
        totalFleet: '0',
        totalCustomers: '0'
    };

    const requests = bookingsRes?.data || [];
    const customers = customersRes?.data || [];
    const payments = paymentsRes?.data || [];
    const rideHistory = historyRes?.data || [];
    const licenses = licensesRes?.data || [];
    const loading = statsLoading || bookingsLoading; // Initial load indicators

    const stats = [
        { label: 'Total Revenue', value: statsData.totalRevenue, icon: <DollarSign size={20} />, class: styles.iconGreen },
        { label: 'Active Bookings', value: statsData.activeBookings.toString(), icon: <Briefcase size={20} />, class: styles.iconBlue },
        { label: 'Pending Requests', value: statsData.pendingRequests.toString(), icon: <Clock size={20} />, class: styles.iconOrange },
        { label: 'Total Customers', value: statsData.totalCustomers.toString(), icon: <Users size={20} />, class: styles.iconPurple },
    ];

    const filteredCustomers = customers.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.adminWrapper}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarLogo}>PREMIER LIMO <span>ADMIN</span></div>
                <nav className={styles.sidebarNav}>
                    <div
                        className={`${styles.navItem} ${activeSection === 'overview' ? styles.navActive : ''}`}
                        onClick={() => setActiveSection('overview')}
                    >
                        <LayoutDashboard size={20} /> Dashboard
                    </div>
                    <div
                        className={`${styles.navItem} ${activeSection === 'fleet' ? styles.navActive : ''}`}
                        onClick={() => setActiveSection('fleet')}
                    >
                        <Car size={20} /> Fleet Management
                    </div>
                    <div
                        className={`${styles.navItem} ${activeSection === 'reservations' ? styles.navActive : ''}`}
                        onClick={() => setActiveSection('reservations')}
                    >
                        <Calendar size={20} /> Reservations
                    </div>
                    <div
                        className={`${styles.navItem} ${activeSection === 'customers' ? styles.navActive : ''}`}
                        onClick={() => setActiveSection('customers')}
                    >
                        <Users size={20} /> Customers
                    </div>
                    <div
                        className={`${styles.navItem} ${activeSection === 'payments' ? styles.navActive : ''}`}
                        onClick={() => setActiveSection('payments')}
                    >
                        <CreditCard size={20} /> Payments
                    </div>
                    <div
                        className={`${styles.navItem} ${activeSection === 'history' ? styles.navActive : ''}`}
                        onClick={() => setActiveSection('history')}
                    >
                        <Clock size={20} /> Ride History
                    </div>
                    <div
                        className={`${styles.navItem} ${activeSection === 'licenses' ? styles.navActive : ''}`}
                        onClick={() => setActiveSection('licenses')}
                    >
                        <FileText size={20} /> Licenses
                    </div>
                    <div className={styles.navItem}>
                        <Settings size={20} /> Settings
                    </div>
                </nav>

                <div className={styles.sidebarFooter}>
                    <button className={styles.logoutBtn} onClick={() => { logout(); navigate('/'); }}>
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {activeSection === 'overview' && (
                    <>
                        <div className={styles.topBar}>
                            <h1>Dashboard Overview</h1>
                            <div className={styles.topBarActions}>
                                <button className={styles.actionBtn}><Bell size={20} /></button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className={styles.statsGrid}>
                            {stats.map((stat, idx) => (
                                <div key={idx} className={styles.statCard}>
                                    <div className={styles.statInfo}>
                                        <span>{stat.label}</span>
                                        <h3>{stat.value}</h3>
                                    </div>
                                    <div className={`${styles.statIcon} ${stat.class}`}>
                                        {stat.icon}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Requests Section */}
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h4>Recent Booking Requests</h4>
                                <button className={styles.viewAllBtn} onClick={() => setActiveSection('reservations')}>View All <ChevronRight size={16} /></button>
                            </div>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Vehicle</th>
                                        <th>Date</th>
                                        <th>Duration</th>
                                        <th>Amount</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading requests...</td></tr>
                                    ) : requests.length === 0 ? (
                                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No recent requests found.</td></tr>
                                    ) : (
                                        requests.slice(0, 5).map((req) => (
                                            <tr key={req._id}>
                                                <td>
                                                    <div className={styles.userCell}>
                                                        <div className={styles.userAvatar}>{(req.userName || 'U').charAt(0)}</div>
                                                        <div>
                                                            <div style={{ fontWeight: 600 }}>{req.userName}</div>
                                                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{req.userEmail}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{req.carName}</td>
                                                <td>{new Date(req.startDate).toLocaleDateString()}</td>
                                                <td>{req.duration} days</td>
                                                <td>${req.totalAmount}</td>
                                                <td style={{ fontSize: '0.75rem' }}>
                                                    <div title={req.pickupLocation?.address} style={{ color: '#6b7280' }}><strong>P:</strong> {req.pickupLocation?.address?.substring(0, 12) || 'N/A'}</div>
                                                    <div title={req.dropoffLocation?.address} style={{ color: '#6b7280' }}><strong>D:</strong> {req.dropoffLocation?.address?.substring(0, 12) || 'N/A'}</div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <span className={`${styles.statusBadge} ${styles[req.status]}`}>
                                                            {req.status}
                                                        </span>
                                                        {req.paid && (
                                                            <span className={`${styles.statusBadge} ${styles.approved}`} style={{ fontSize: '0.65rem' }}>
                                                                PAID
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className={styles.actions}>
                                                    {req.status === 'pending' ? (
                                                        <>
                                                            <button
                                                                className={`${styles.actionBtn} ${styles.approve}`}
                                                                onClick={() => handleAction(req._id, 'approved')}
                                                                title="Approve"
                                                            >
                                                                <Check size={16} />
                                                            </button>
                                                            <button
                                                                className={`${styles.actionBtn} ${styles.deny}`}
                                                                onClick={() => handleAction(req._id, 'denied')}
                                                                title="Deny"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </>
                                                    ) : req.paid ? (
                                                        <button
                                                            className={`${styles.actionBtn} ${styles.handover}`}
                                                            onClick={() => handleManageHandover(req)}
                                                            title="Manage Handover"
                                                        >
                                                            <Key size={16} />
                                                        </button>
                                                    ) : (
                                                        <button className={styles.actionBtn} disabled style={{ opacity: 0.5 }}>
                                                            No actions
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeSection === 'fleet' && <FleetManagement />}

                {activeSection === 'reservations' && (
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>All Reservations</h3>
                        </div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Vehicle</th>
                                    <th>Dates</th>
                                    <th>Pickup Location</th>
                                    <th>Drop-off Location</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((req) => (
                                    <tr key={req._id}>
                                        <td>{req.userName}</td>
                                        <td>{req.carName}</td>
                                        <td>{new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}</td>
                                        <td>{req.pickupLocation?.address || 'N/A'}</td>
                                        <td>{req.dropoffLocation?.address || 'N/A'}</td>
                                        <td>${req.totalAmount}</td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span className={`${styles.statusBadge} ${styles[req.status]}`}>
                                                    {req.status}
                                                </span>
                                                {req.paid && (
                                                    <span className={`${styles.statusBadge} ${styles.approved}`} style={{ fontSize: '0.65rem' }}>
                                                        PAID
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeSection === 'customers' && (
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>Customer List</h3>
                            <div className={styles.searchWrapper}>
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Email Address</th>
                                    <th>Joined Date</th>
                                    <th>Total Bookings</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading customers...</td></tr>
                                ) : filteredCustomers.length === 0 ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No customers found.</td></tr>
                                ) : (
                                    filteredCustomers.map((cust) => (
                                        <tr key={cust._id}>
                                            <td>
                                                <div className={styles.userCell}>
                                                    <div className={styles.userAvatar}>{cust.name?.charAt(0) || 'U'}</div>
                                                    <div style={{ fontWeight: 600 }}>{cust.name || 'N/A'}</div>
                                                </div>
                                            </td>
                                            <td>{cust.email}</td>
                                            <td>{new Date(cust.createdAt).toLocaleDateString()}</td>
                                            <td>{requests.filter(r => r.userEmail === cust.email).length}</td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${styles.approved}`}>
                                                    Active
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeSection === 'payments' && (
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>Transaction History</h3>
                        </div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Customer</th>
                                    <th>Car</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading payments...</td></tr>
                                ) : payments.length === 0 ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No payments found.</td></tr>
                                ) : (
                                    payments.map((p) => (
                                        <tr key={p._id}>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.transactionId}</td>
                                            <td>{p.booking?.userName || 'N/A'}</td>
                                            <td>{p.booking?.carName || 'N/A'}</td>
                                            <td style={{ fontWeight: 700 }}>${p.amount}</td>
                                            <td>{p.paymentMethod}</td>
                                            <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeSection === 'history' && (
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>Ride History</h3>
                        </div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Ref ID</th>
                                    <th>Customer</th>
                                    <th>Vehicle</th>
                                    <th>Duration</th>
                                    <th>Amount</th>
                                    <th>Pickup</th>
                                    <th>Dropoff</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading history...</td></tr>
                                ) : rideHistory.length === 0 ? (
                                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No ride history yet.</td></tr>
                                ) : (
                                    rideHistory.map(item => (
                                        <tr key={item._id}>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{item._id.slice(-6).toUpperCase()}</td>
                                            <td>{item.userName}</td>
                                            <td>{item.carName}</td>
                                            <td>{item.duration} days</td>
                                            <td>${item.totalAmount}</td>
                                            <td>
                                                <div style={{ fontSize: '0.9rem' }}>{item.pickupTime ? new Date(item.pickupTime).toLocaleString() : 'N/A'}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Loc: {item.pickupLocation?.address || 'N/A'}</div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.9rem' }}>{item.dropoffTime ? new Date(item.dropoffTime).toLocaleString() : 'N/A'}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Loc: {item.dropoffLocation?.address || 'N/A'}</div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeSection === 'licenses' && (
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>License Verifications</h3>
                            <div className={styles.searchWrapper}>
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name or license #..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>License Details</th>
                                    <th>Documents</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading licenses...</td></tr>
                                ) : licenses.length === 0 ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No license records found.</td></tr>
                                ) : (
                                    licenses
                                        .filter(l =>
                                            l.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            l.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((l) => (
                                            <tr key={l._id}>
                                                <td>
                                                    <div className={styles.userCell}>
                                                        <div className={styles.userAvatar}>
                                                            {l.userId?.image ? <img src={l.userId.image} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : (l.userId?.name?.charAt(0) || 'U')}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600 }}>{l.userId?.name || 'Unknown'}</div>
                                                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{l.userId?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 600 }}>{l.licenseNumber}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Exp: {new Date(l.expiryDate).toLocaleDateString()}</div>
                                                    <div style={{ fontSize: '0.81rem' }}>{l.issuingCountry}</div>
                                                </td>
                                                <td>
                                                    <div className={styles.licenseGrid}>
                                                        <div className={styles.licenseImgWrapper}>
                                                            <label>Front</label>
                                                            {l.frontImage ? (
                                                                <img
                                                                    src={l.frontImage}
                                                                    className={styles.licenseImg}
                                                                    alt="Front"
                                                                    onClick={() => setSelectedImage(l.frontImage)}
                                                                />
                                                            ) : <div className={styles.licenseImg} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>N/A</div>}
                                                        </div>
                                                        <div className={styles.licenseImgWrapper}>
                                                            <label>Back</label>
                                                            {l.backImage ? (
                                                                <img
                                                                    src={l.backImage}
                                                                    className={styles.licenseImg}
                                                                    alt="Back"
                                                                    onClick={() => setSelectedImage(l.backImage)}
                                                                />
                                                            ) : <div className={styles.licenseImg} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>N/A</div>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`${styles.statusBadge} ${styles[l.status]}`}>
                                                        {l.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className={styles.verifyActions}>
                                                        <button
                                                            className={`${styles.verifyBtnConfirm} ${styles.btnApprove}`}
                                                            onClick={() => handleLicenseStatus(l._id, 'verified')}
                                                            title="Approve License"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
                                                            className={`${styles.verifyBtnConfirm} ${styles.btnReject}`}
                                                            onClick={() => handleLicenseStatus(l._id, 'rejected')}
                                                            title="Reject License"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Handover Modal */}
            {showHandoverModal && (
                <div className={styles.modalOverlay} onClick={() => setShowHandoverModal(false)}>
                    <motion.div
                        className={styles.modalContent}
                        onClick={e => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className={styles.modalHeader}>
                            <h3>Handover Verification - {selectedBooking?.carName}</h3>
                            <button className={styles.closeBtn} onClick={() => setShowHandoverModal(false)}><X size={20} /></button>
                        </div>

                        <div className={styles.handoverInfo}>
                            <p><strong>Customer:</strong> {selectedBooking?.userName}</p>
                            <p><strong>Status:</strong> <span className={styles.statusBadge}>{handoverRes?.data?.status || 'None'}</span></p>
                        </div>

                        <div className={styles.handoverSections}>
                            {/* Pickup Verification */}
                            <div className={styles.handoverBox}>
                                <h4>Pickup Verification</h4>
                                {handoverRes?.data?.pickupVerified ? (
                                    <div className={styles.verifiedInfo}>
                                        <CheckCircle size={18} color="#22c55e" />
                                        <span>Verified: {new Date(handoverRes.data.pickupTime).toLocaleString()}</span>
                                    </div>
                                ) : (
                                    <div className={styles.verifyAction}>
                                        <input
                                            type="text"
                                            placeholder="Enter Pickup OTP"
                                            value={otpInput}
                                            onChange={(e) => setOtpInput(e.target.value)}
                                            className={styles.otpInput}
                                        />
                                        <button
                                            className={styles.verifyBtn}
                                            onClick={() => verifyOTP('pickup')}
                                            disabled={verifyOTPMutation.isLoading || !otpInput}
                                        >
                                            {verifyOTPMutation.isLoading ? 'Verifying...' : 'Verify Pickup'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Dropoff Verification */}
                            <div className={styles.handoverBox}>
                                <h4>Dropoff Verification</h4>
                                {!handoverRes?.data?.pickupVerified ? (
                                    <p className={styles.mutedText}>Waiting for pickup verification...</p>
                                ) : handoverRes?.data?.dropoffVerified ? (
                                    <div className={styles.verifiedInfo}>
                                        <CheckCircle size={18} color="#22c55e" />
                                        <span>Verified: {new Date(handoverRes.data.dropoffTime).toLocaleString()}</span>
                                    </div>
                                ) : (
                                    <div className={styles.verifyAction}>
                                        <input
                                            type="text"
                                            placeholder="Enter Dropoff OTP"
                                            value={otpInput}
                                            onChange={(e) => setOtpInput(e.target.value)}
                                            className={styles.otpInput}
                                        />
                                        <button
                                            className={styles.verifyBtn}
                                            onClick={() => verifyOTP('dropoff')}
                                            disabled={verifyOTPMutation.isLoading || !otpInput}
                                        >
                                            {verifyOTPMutation.isLoading ? 'Verifying...' : 'Verify Dropoff'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
            {/* Image Modal */}
            {selectedImage && (
                <div className={styles.modalOverlay} onClick={() => setSelectedImage(null)}>
                    <motion.div
                        className={styles.imageModal}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h3>License Document</h3>
                            <button onClick={() => setSelectedImage(null)} className={styles.closeBtn}>
                                <X size={24} />
                            </button>
                        </div>
                        <img src={selectedImage} alt="License Full" className={styles.fullImg} />
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
