import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Shield, Upload, CheckCircle } from 'lucide-react';
import styles from './UserLicense.module.css';

const UserLicense = () => {
    const [licenseData, setLicenseData] = useState({
        number: 'DL-1234-5678-90',
        expiry: '2028-12-31',
        frontImage: null,
        backImage: null,
        status: 'verified' // verified, pending, rejected
    });

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className={styles.header}>
                <h1 className="gradient-text">Driving License</h1>
                <p>Manage your driving credentials for rentals.</p>
            </div>

            <div className={styles.card}>
                <div className={styles.statusBadge}>
                    <CheckCircle size={16} /> Verified Driver
                </div>

                <div className={styles.formGrid}>
                    <div className={styles.field}>
                        <label>License Number</label>
                        <div className={styles.inputWrapper}>
                            <FileText size={18} />
                            <input type="text" value={licenseData.number} disabled />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Expiration Date</label>
                        <div className={styles.inputWrapper}>
                            <Calendar size={18} />
                            <input type="date" value={licenseData.expiry} disabled />
                        </div>
                    </div>
                </div>

                <div className={styles.uploadSection}>
                    <h3>License Images</h3>
                    <div className={styles.imageGrid}>
                        <div className={styles.imageBox}>
                            <img src="https://placehold.co/400x250/e2e8f0/64748b?text=Front+Side" alt="Front Side" />
                            <button className={styles.reuploadBtn}><Upload size={14} /> Update Front</button>
                        </div>
                        <div className={styles.imageBox}>
                            <img src="https://placehold.co/400x250/e2e8f0/64748b?text=Back+Side" alt="Back Side" />
                            <button className={styles.reuploadBtn}><Upload size={14} /> Update Back</button>
                        </div>
                    </div>
                    <p className={styles.note}>
                        <Shield size={14} /> Your data is encrypted and securely stored.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default UserLicense;
