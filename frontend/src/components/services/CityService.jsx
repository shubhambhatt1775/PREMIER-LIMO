import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Shield, Star, Car } from 'lucide-react';
import Footer from '../common/Footer';
import styles from './CityService.module.css';

const CityService = () => {
    const { cityName } = useParams();
    const navigate = useNavigate();

    const formattedCity = cityName.charAt(0).toUpperCase() + cityName.slice(1);

    return (
        <div className={styles.cityPage}>
            <div className="container">
                <section className={styles.hero}>
                    <motion.span
                        className="section-num"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        Premium Local Service
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Luxury Car Rental in {formattedCity}
                    </motion.h1>
                    <p>Experience world-class transportation in the heart of {formattedCity}. From business meetings to leisure tours, we've got you covered.</p>
                </section>

                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <MapPin className={styles.icon} />
                        <h3>Local Expertise</h3>
                        <p>Our chauffeurs are highly familiar with {formattedCity}'s routes and traffic patterns.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <Shield className={styles.icon} />
                        <h3>Safe & Secure</h3>
                        <p>All vehicles are GPS-tracked and maintained to the highest safety standards.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <Star className={styles.icon} />
                        <h3>VIP Experience</h3>
                        <p>Tailored services for high-profile clients and luxury seekers in {formattedCity}.</p>
                    </div>
                </div>

                <section className={styles.cta}>
                    <h2>Ready to explore {formattedCity} in style?</h2>
                    <button className="btn-primary" onClick={() => navigate('/cars')}>
                        View Local Fleet <Car size={18} style={{ marginLeft: '10px' }} />
                    </button>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default CityService;
