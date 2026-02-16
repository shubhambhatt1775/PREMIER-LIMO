import React from 'react';
import { Check } from 'lucide-react';
import Footer from '../../components/common/Footer';
import styles from './Services.module.css';

const AirportTransfers = () => {
    return (
        <div className={styles.servicePage}>
            {/* Hero Section */}
            <section className={styles.hero} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&q=80&w=1920")' }}>
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>Airport Transfers</h1>
                    <p className={styles.subtitle}>Start your journey with comfort and peace of mind.</p>
                </div>
            </section>

            {/* Content Section */}
            <section className={styles.contentSection}>
                <div className="container">
                    <div className={styles.grid}>
                        <div className={styles.textContent}>
                            <h2>Seamless Connections</h2>
                            <p>
                                Navigating airports can be stressful. Let us handle the logistics while you relax.
                                Our airport transfer service offers reliable pick-up and drop-off at all major airports.
                            </p>
                            <p>
                                We monitor flight schedules in real-time to ensure your chauffeur is waiting for you
                                when you land, regardless of delays. Enjoy a smooth transition from air to road in our
                                luxury vehicles.
                            </p>
                            <ul className={styles.features}>
                                <li><Check size={20} /> Real-time Flight Monitoring</li>
                                <li><Check size={20} /> Meet & Greet Service</li>
                                <li><Check size={20} /> Complimentary Wait Time</li>
                                <li><Check size={20} /> Luggage Assistance</li>
                            </ul>
                        </div>
                        <div className={styles.imageContent}>
                            <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800" alt="Airport Terminal" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className="container">
                    <h2 className={styles.ctaTitle}>Book your ride now</h2>
                    <p className={styles.ctaText}>Ensure a stress-free trip to or from the airport.</p>
                    <a href="/bookings" className={styles.btnPrimary}>Book Transfer</a>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AirportTransfers;
