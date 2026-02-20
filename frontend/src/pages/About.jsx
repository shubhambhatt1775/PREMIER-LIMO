import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import styles from './About.module.css';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.aboutPage}>
            <section className={styles.aboutHero}>
                <div className="container">
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-num">01</motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="section-title"
                        style={{ textAlign: 'left' }}
                    >
                        Excellence in every mile
                    </motion.h1>
                    <p className={styles.subtitle}>
                        Redefining the standard of premium vehicle rentals since 2024.
                    </p>
                </div>
            </section>

            <section className={styles.contentSection}>
                <div className="container">
                    <div className={styles.contentGrid}>
                        <div className={styles.textContent}>
                            <h2>Our Story</h2>
                            <p>
                                Premier Limo was born out of a passion for high-performance engineering and exceptional customer service.
                                We noticed a gap in the market for a truly premium, digital-first car rental experience.
                            </p>
                            <p>
                                From corporate executives in Ahmedabad to travelers exploring the vibrant streets of India, we provide a fleet that represents the pinnacle of automotive luxury.

                            </p>
                            <button
                                className="btn-primary"
                                onClick={() => navigate('/cars')}
                            >
                                Explore fleet
                            </button>
                        </div>

                        <div className={styles.contactInfo}>
                            <div className={styles.contactCard}>
                                <Mail className={styles.icon} />
                                <div>
                                    <h4>Email Us</h4>
                                    <p>hello@premierlimo.in</p>
                                </div>
                            </div>
                            <div className={styles.contactCard}>
                                <Phone className={styles.icon} />
                                <div>
                                    <h4>Call Us</h4>
                                    <p>+91 79 4000 1234</p>

                                </div>
                            </div>
                            <div className={styles.contactCard}>
                                <MapPin className={styles.icon} />
                                <div>
                                    <h4>Visit Us</h4>
                                    <p>S.G. Highway, Ahmedabad, Gujarat 380054</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
