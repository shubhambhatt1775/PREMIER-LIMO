import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Award, CheckCircle } from 'lucide-react';
import Footer from '../../components/common/Footer';
import styles from './GenericExplore.module.css';


const GenericExplore = ({ title, subtitle, description, features, image }) => {
    return (
        <div className={styles.explorePage}>
            <div className={`container ${styles.container}`}>
                <section className={styles.hero}>
                    <div className={styles.heroText}>
                        <motion.h1
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {title}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className={styles.subtitle}
                        >
                            {subtitle}
                        </motion.p>
                    </div>
                </section>

                <div className={styles.mainContent}>
                    <div className={styles.textSection}>
                        <p className={styles.description}>{description}</p>
                        <div className={styles.featureList}>
                            {features.map((f, i) => (
                                <div key={i} className={styles.featureItem}>
                                    <CheckCircle size={20} className={styles.check} />
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.imageSection}>
                        <img src={image} alt={title} />
                    </div>
                </div>

                <section className={styles.stats}>
                    <div className={styles.statItem}>
                        <Shield />
                        <h4>Safe Travel</h4>
                    </div>
                    <div className={styles.statItem}>
                        <Clock />
                        <h4>On-time Arrival</h4>
                    </div>
                    <div className={styles.statItem}>
                        <Award />
                        <h4>Premium Fleet</h4>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export const IndustryRides = () => (
    <GenericExplore
        title="Industry Rides"
        subtitle="Specialized transportation for media, entertainment, and fashion industries."
        description="Our heavy-duty yet luxurious fleet is perfectly suited for production crews, talent movement, and industry events. We understand the unique requirements of on-location shoots and long production days."
        features={["On-set standby vehicles", "VVIP talent transportation", "Equipment support vehicles", "Flexible booking hours"]}
        image="https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80&w=800"
    />
);

export const LimousineService = () => (
    <GenericExplore
        title="Limousine Service"
        subtitle="The ultimate statement in luxury and prestige."
        description="Our stretch limousines offer an unparalleled level of privacy and comfort. Perfect for weddings, high-profile galas, and corporate celebrations where making an entrance is everything."
        features={["Full privacy partition", "Premium mini-bar", "Surround sound system", "Climate control"]}
        image="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800"
    />
);

export const ChauffeurService = () => (
    <GenericExplore
        title="Chauffeur Service"
        subtitle="Professional drivers for your own peace of mind."
        description="Don't just rent a car, rent a personal navigator. Our chauffeurs are trained in high-profile hospitality and defensive driving to ensure you can focus on what matters most while we handle the road."
        features={["Uniformed professional drivers", "Multilingual staff", "Punctuality guaranteed", "Personal assistance"]}
        image="https://images.unsplash.com/photo-1518175510444-469b764b8bb2?auto=format&fit=crop&q=80&w=800"
    />
);

export const PrivateCarService = () => (
    <GenericExplore
        title="Private Car Service"
        subtitle="Discreet, reliable, and personalized travel."
        description="For those who value discretion and simplicity. A dedicated vehicle and driver for your personal use, available on-demand or for scheduled daily routines."
        features={["No branding/unmarked cars", "Dedicated driver", "Customizable routes", "Daily/Weekly packages"]}
        image="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800"
    />
);
