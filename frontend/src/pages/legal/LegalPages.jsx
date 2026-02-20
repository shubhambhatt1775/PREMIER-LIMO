import React from 'react';
import { motion } from 'framer-motion';
import Footer from '../../components/common/Footer';
import styles from './Legal.module.css';

const LegalPage = ({ title, content }) => {
    return (
        <div className={styles.legalPage}>
            <div className="container">
                <motion.section
                    className={styles.hero}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1>{title}</h1>
                    <div className={styles.lastUpdated}>Last Updated: February 2026</div>
                </motion.section>

                <motion.section
                    className={styles.content}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {content}
                </motion.section>
            </div>
            <Footer />
        </div>
    );
};

export const Terms = () => (
    <LegalPage
        title="Terms of Service"
        content={
            <>
                <h3>1. Acceptance of Terms</h3>
                <p>By accessing and using PREMIER LIMO, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>

                <h3>2. Rental Agreement</h3>
                <p>Every rental is subject to a specific rental agreement signed at the time of vehicle pickup. The Renter must meet all eligibility requirements including age and valid documentation.</p>

                <h3>3. Use of Vehicles</h3>
                <p>Vehicles must be driven responsibly and only by authorized drivers. Illegal usage, off-roading, or racing is strictly prohibited.</p>

                <h3>4. Payments and Cancellations</h3>
                <p>Bookings are confirmed upon payment. Cancellation policies vary by vehicle category and lead time. Please refer to your booking confirmation for details.</p>
            </>
        }
    />
);

export const Privacy = () => (
    <LegalPage
        title="Privacy Policy"
        content={
            <>
                <h3>1. Information We Collect</h3>
                <p>We collect personal information such as name, email, phone number, and driving license details to provide our rental services.</p>

                <h3>2. How We Use Data</h3>
                <p>Data is used for booking management, identity verification, and communication regarding your rentals. We do not sell your data to third parties.</p>

                <h3>3. Security</h3>
                <p>We implement industry-standard security measures to protect your personal information during transmission and storage.</p>

                <h3>4. Cookies</h3>
                <p>Our website uses cookies to enhance user experience and analyze traffic patterns.</p>
            </>
        }
    />
);

export const LegalNotice = () => (
    <LegalPage
        title="Legal Notice"
        content={
            <>
                <p>PREMIER LIMO is a registered trademark of Premier Luxury Transportation Pvt. Ltd.</p>
                <p>Registered Office: S.G. Highway, Ahmedabad, Gujarat 380054, India.</p>
                <p>Corporate Identity Number: U12345GJ2024PTC678910</p>
                <p>GSTIN: 24AAAAA0000A1Z5</p>
            </>
        }
    />
);

export const Accessibility = () => (
    <LegalPage
        title="Accessibility Statement"
        content={
            <>
                <p>PREMIER LIMO is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>
                <p>If you encounter any difficulty accessing our website, please contact our support team at accessibility@premierlimo.in.</p>
            </>
        }
    />
);
