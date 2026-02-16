import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Gauge, Fuel, Users, Settings, BadgeCheck, Star, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import BookingModal from '../components/cars/BookingModal';
import styles from './CarDetails.module.css';

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await api.get(`/cars/${id}`);
                setCar(response.data);
            } catch (error) {
                console.error('Error fetching car details:', error);
                // Optionally navigate to 404 or show error
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading vehicle details...</p>
            </div>
        );
    }

    if (!car) {
        return (
            <div className={styles.errorContainer}>
                <h2>Vehicle Not Found</h2>
                <button onClick={() => navigate('/cars')}>Return to Fleet</button>
            </div>
        );
    }

    return (
        <div className={styles.detailsPage}>
            <div className="container">
                <button onClick={() => navigate('/cars')} className={styles.backBtn}>
                    <ArrowLeft size={20} /> Back to Fleet
                </button>

                <div className={styles.contentGrid}>
                    {/* Left Column: Image & visuals */}
                    <div className={styles.visualSection}>
                        <motion.div
                            className={styles.mainImageWrapper}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <img
                                src={car.image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'}
                                alt={car.name}
                                className={styles.mainImage}
                            />
                            <div className={styles.categoryBadge}>{car.category}</div>
                        </motion.div>

                        <div className={styles.galleryGrid}>
                            {/* Placeholder for future gallery images - reusing main image for demo effect if needed or just static placeholders */}
                            <div className={styles.galleryItem}>
                                <img src={car.image} alt="Detail view" />
                            </div>
                            <div className={styles.galleryItem}>
                                <div className={styles.galleryOverlay}>+3</div>
                                <img src={car.image} alt="More photos" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Info & Booking */}
                    <div className={styles.infoSection}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className={styles.header}>
                                <h1 className={styles.carTitle}>{car.name}</h1>
                                <div className={styles.rating}>
                                    <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                                    <span>4.9 (120 trips)</span>
                                </div>
                            </div>

                            <div className={styles.priceCard}>
                                <div className={styles.priceInfo}>
                                    <span className={styles.priceLabel}>Daily Rate</span>
                                    <div className={styles.priceValue}>
                                        ${car.pricePerDay} <span>/ day</span>
                                    </div>
                                </div>
                                <button
                                    className={styles.bookBtn}
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Book This Vehicle
                                </button>
                            </div>

                            <div className={styles.specsGrid}>
                                <div className={styles.specItem}>
                                    <Gauge size={20} />
                                    <div className={styles.specText}>
                                        <label>Speed</label>
                                        <span>0-60 in 3.2s</span>
                                    </div>
                                </div>
                                <div className={styles.specItem}>
                                    <Settings size={20} />
                                    <div className={styles.specText}>
                                        <label>Transmission</label>
                                        <span>{car.transmission}</span>
                                    </div>
                                </div>
                                <div className={styles.specItem}>
                                    <Fuel size={20} />
                                    <div className={styles.specText}>
                                        <label>Fuel Type</label>
                                        <span>{car.fuel}</span>
                                    </div>
                                </div>
                                <div className={styles.specItem}>
                                    <Users size={20} />
                                    <div className={styles.specText}>
                                        <label>Seats</label>
                                        <span>{car.seats || 2} Persons</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.featuresSection}>
                                <h3>Premium Features</h3>
                                <ul className={styles.featureList}>
                                    <li><BadgeCheck size={16} /> GPS Navigation System</li>
                                    <li><BadgeCheck size={16} /> Heated Leather Seats</li>
                                    <li><BadgeCheck size={16} /> Bluetooth & Apple CarPlay</li>
                                    <li><BadgeCheck size={16} /> Premium Sound System</li>
                                    <li><BadgeCheck size={16} /> 24/7 Roadside Assistance</li>
                                </ul>
                            </div>

                            <div className={styles.insuranceNote}>
                                <ShieldCheck size={20} />
                                <p>Full insurance coverage included with every rental. Zero liability for scratches and minor dents.</p>
                            </div>

                        </motion.div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <BookingModal
                        car={car}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default CarDetails;
