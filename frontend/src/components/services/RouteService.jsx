import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Shield, Coffee } from 'lucide-react';
import Footer from '../common/Footer';
import styles from './RouteService.module.css';

const RouteService = () => {
    const { routeSlug } = useParams();
    const navigate = useNavigate();

    const formattedRoute = routeSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' to ');

    return (
        <div className={styles.routePage}>
            <div className="container">
                <section className={styles.hero}>
                    <motion.span
                        className="section-num"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        Premium Inter-City Transfer
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        {formattedRoute}
                    </motion.h1>
                    <p>Travel between major hubs in absolute luxury. Our specialized inter-city service ensures a smooth, stress-free journey.</p>
                </section>

                <div className={styles.benefits}>
                    <div className={styles.benefitItem}>
                        <Clock className={styles.icon} />
                        <h4>Fixed Pricing</h4>
                        <p>No hidden charges or surge pricing. Transparent flat rates for all inter-city routes.</p>
                    </div>
                    <div className={styles.benefitItem}>
                        <Shield className={styles.icon} />
                        <h4>Professional Chauffeurs</h4>
                        <p>Experienced long-distance drivers trained in highway safety and VIP protocols.</p>
                    </div>
                    <div className={styles.benefitItem}>
                        <Coffee className={styles.icon} />
                        <h4>Complimentary Drinks</h4>
                        <p>Enjoy premium refreshments and high-speed Wi-Fi throughout your journey.</p>
                    </div>
                </div>

                <motion.div
                    className={styles.ctaCard}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className={styles.ctaContent}>
                        <h2>Book your {formattedRoute} ride today</h2>
                        <p>Starting from ₹4,999 onwards. Special fleet available for groups.</p>
                    </div>
                    <button className="btn-primary" onClick={() => navigate('/cars')}>
                        Book Now <ArrowRight size={18} />
                    </button>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default RouteService;
