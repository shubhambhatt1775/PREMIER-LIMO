import React from 'react';
import { Check } from 'lucide-react';
import Footer from '../../components/common/Footer';
import styles from './Services.module.css';

const CorporateTravel = () => {
    return (
        <div className={styles.servicePage}>
            {/* Hero Section */}
            <section className={styles.hero} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1920")' }}>
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>Corporate Travel</h1>
                    <p className={styles.subtitle}>Elevate your business transportation with our executive fleet.</p>
                </div>
            </section>

            {/* Content Section */}
            <section className={styles.contentSection}>
                <div className="container">
                    <div className={styles.grid}>
                        <div className={styles.textContent}>
                            <h2>Professional & Punctual</h2>
                            <p>
                                In the fast-paced world of business, time is money. Our corporate travel services are designed
                                to provide seamless, reliable, and comfortable transportation for executives and their teams.
                            </p>
                            <p>
                                Whether you're rushing to a meeting, heading to the airport, or entertaining clients,
                                our professional chauffeurs ensure you arrive on time and in style. We understand the unique
                                needs of corporate travelers and offer flexible solutions to match your schedule.
                            </p>
                            <ul className={styles.features}>
                                <li><Check size={20} /> 24/7 Priority Booking</li>
                                <li><Check size={20} /> Dedicated Account Management</li>
                                <li><Check size={20} /> Wi-Fi & Charging Ports</li>
                                <li><Check size={20} /> Detailed Monthly Billing</li>
                            </ul>
                        </div>
                        <div className={styles.imageContent}>
                            <img src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=800" alt="Executive Meeting" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className="container">
                    <h2 className={styles.ctaTitle}>Ready to upgrade your business travel?</h2>
                    <p className={styles.ctaText}>Create a corporate account today and enjoy exclusive benefits.</p>
                    <a href="/login" className={styles.btnPrimary}>Create Corporate Account</a>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default CorporateTravel;
