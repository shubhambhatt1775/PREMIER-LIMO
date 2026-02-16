import React from 'react';
import { Check } from 'lucide-react';
import Footer from '../../components/common/Footer';
import styles from './Services.module.css';

const SpecialEvents = () => {
    return (
        <div className={styles.servicePage}>
            {/* Hero Section */}
            <section className={styles.hero} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1920")' }}>
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>Special Events</h1>
                    <p className={styles.subtitle}>Unforgettable moments deserve unforgettable transportation.</p>
                </div>
            </section>

            {/* Content Section */}
            <section className={styles.contentSection}>
                <div className="container">
                    <div className={styles.grid}>
                        <div className={styles.textContent}>
                            <h2>Celebrate in Style</h2>
                            <p>
                                From weddings and proms to anniversaries and red carpet events, our special event
                                services add a touch of glamour to your celebration.
                            </p>
                            <p>
                                Choose from our fleet of pristine limousines, luxury sedans, and SUVs. We offer
                                customizable packages to suit your specific needs, ensuring that every detail is perfect
                                for your big day.
                            </p>
                            <ul className={styles.features}>
                                <li><Check size={20} /> Red Carpet Service</li>
                                <li><Check size={20} /> Decorated Vehicles</li>
                                <li><Check size={20} /> Professional Uniformed Chauffeurs</li>
                                <li><Check size={20} /> Custom Refreshments</li>
                            </ul>
                        </div>
                        <div className={styles.imageContent}>
                            <img src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800" alt="Wedding Celebration" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className="container">
                    <h2 className={styles.ctaTitle}>Plan your special day</h2>
                    <p className={styles.ctaText}>Contact our events team to discuss your requirements.</p>
                    <a href="/contact" className={styles.btnPrimary}>Contact Us</a>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default SpecialEvents;
