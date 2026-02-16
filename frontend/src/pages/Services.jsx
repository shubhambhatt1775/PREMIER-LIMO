import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Clock, MapPin } from 'lucide-react';
import Footer from '../components/common/Footer';
import styles from './Services.module.css';

const Services = () => {
    const navigate = useNavigate();

    const mainServices = [
        {
            title: "Corporate Travel",
            desc: "Premier transportation for business executives.",
            img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
            link: "/services/corporate-travel"
        },
        {
            title: "Airport Transfers",
            desc: "Reliable airport pickups and drop-offs.",
            img: "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&q=80&w=800",
            link: "/services/airport-transfers"
        },
        {
            title: "Special Events",
            desc: "Make your special occasions unforgettable.",
            img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
            link: "/services/special-events"
        }
    ];

    const additionalServices = [
        {
            icon: <Star size={20} />,
            title: "Luxury Tours",
            desc: "Customized city tours in our premium vehicles, guided by local experts."
        },
        {
            icon: <Shield size={20} />,
            title: "Diplomatic Services",
            desc: "Secure and discreet transportation for diplomats and VIPs."
        },
        {
            icon: <Clock size={20} />,
            title: "Hourly Charter",
            desc: "Flexible hourly bookings for meetings, shopping, or leisure."
        },
        {
            icon: <MapPin size={20} />,
            title: "Inter-City Transfers",
            desc: "Comfortable long-distance travel between major cities."
        }
    ];

    return (
        <div className={styles.servicesPage}>
            <div className="container">
                <section className={styles.hero}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Our Premium Services
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Experience the epitome of luxury and professionalism with our diverse range of transportation solutions.
                    </motion.p>
                </section>

                <div className={styles.grid}>
                    {mainServices.map((service, index) => (
                        <motion.div
                            key={index}
                            className={styles.card}
                            whileHover={{ y: -10 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => navigate(service.link)}
                        >
                            <img src={service.img} alt={service.title} />
                            <div className={styles.cardOverlay}>
                                <h3>{service.title}</h3>
                                <p>{service.desc}</p>
                                <div className={styles.learnMore}>
                                    <span>Learn More</span>
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <section className={styles.otherServices}>
                    <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '3rem' }}>Additional Services</h2>
                    <div className={styles.listGrid}>
                        {additionalServices.map((item, index) => (
                            <motion.div
                                key={index}
                                className={styles.serviceItem}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className={styles.iconWrapper}>{item.icon}</div>
                                <div className={styles.serviceInfo}>
                                    <h4>{item.title}</h4>
                                    <p>{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default Services;
