import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import CarCard from '../components/cars/CarCard';
import BookingModal from '../components/cars/BookingModal';
import Footer from '../components/common/Footer';
import styles from './Home.module.css';

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activeFleetTab, setActiveFleetTab] = useState('ALL');
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCar, setSelectedCar] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRentNow = (car) => {
        setSelectedCar(car);
        setIsModalOpen(true);
    };

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await api.get('/cars');
                setCars(response.data);
            } catch (error) {
                console.error('Error fetching cars:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    const filteredCars = activeFleetTab === 'ALL'
        ? cars
        : cars.filter(car => car.category.toUpperCase() === activeFleetTab);


    return (
        <div className={styles.home}>
            {/* 00 HERO SECTION */}
            <section className={styles.hero}>
                <div className={`container ${styles.heroContainer}`}>
                    <div className={styles.heroText}>
                        <motion.h1
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {t('hero.title')}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {t('hero.subtitle')}
                        </motion.p>
                        <button
                            className="btn-primary"
                            onClick={() => document.getElementById('fleet').scrollIntoView({ behavior: 'smooth' })}
                        >
                            {t('hero.cta')}
                        </button>
                    </div>
                </div>

                <div className={styles.heroBottom}>
                    <div className={`container ${styles.bottomFlex}`}>
                        <div className={styles.scrollDown}>
                            <div className={styles.mouse}></div>
                            <span>Scroll down</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 01 OUR SERVICES */}
            <section className={styles.services}>
                <div className="container">
                    <span className="section-num">01</span>
                    <h2 className="section-title">Our services</h2>
                    <div className={styles.serviceGrid}>
                        <ServiceCard
                            title="Corporate travel"
                            img="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800"
                            badge="Corporate travel"
                            link="/services/corporate-travel"
                        />
                        <ServiceCard
                            title="Airport transfers"
                            img="https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&q=80&w=800"
                            badge="Airport transfers"
                            link="/services/airport-transfers"
                        />
                        <ServiceCard
                            title="Special events"
                            img="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"
                            badge="Special events"
                            link="/services/special-events"
                        />
                    </div>
                    <div className={styles.serviceDescription}>
                        <p>
                            Whether you're traveling for business, leisure, or a special occasion,
                            our chauffeur-driven limousines ensure you arrive in style, comfort, and on time.
                        </p>
                        <button className="btn-primary">Explore more</button>
                    </div>
                </div>
            </section>

            {/* 02 OUR FLEET */}
            <section className={styles.fleet} id="fleet">
                <div className="container">
                    <span className="section-num">02</span>
                    <h2 className="section-title">Our fleet</h2>

                    <div className={styles.fleetFilters}>
                        {['ALL', 'SEDAN', 'LUXURY', 'LIMOUSINE', 'SUV'].map(tab => (
                            <button
                                key={tab}
                                className={activeFleetTab === tab ? styles.activeFilter : ''}
                                onClick={() => setActiveFleetTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className={styles.carGrid}>
                        {loading ? (
                            <div className={styles.loading}>Loading fleet...</div>
                        ) : filteredCars.length > 0 ? (
                            filteredCars.slice(0, 4).map(car => (
                                <CarCard
                                    key={car._id}
                                    car={car}
                                    onRent={() => handleRentNow(car)}
                                />
                            ))
                        ) : (
                            <div className={styles.noCars}>No vehicles found in this category.</div>
                        )}
                    </div>

                    <div className={styles.fleetFooter}>
                        <div className={styles.pagination}>
                            <button><ChevronRight style={{ transform: 'rotate(180deg)' }} /></button>
                            <span>{filteredCars.length > 0 ? `1/${Math.min(filteredCars.length, 4)}` : '0/0'} vehicles</span>
                            <button><ChevronRight /></button>
                        </div>
                        <button className={styles.openPageBtn} onClick={() => navigate('/cars')}>Open page</button>
                    </div>

                </div>
            </section>

            {/* 03 TOP CITIES */}
            <section className={styles.cities}>
                <div className="container">
                    <span className="section-num">03</span>
                    <h2 className="section-title">Top cities</h2>
                    <div className={styles.citiesContent}>
                        <div className={styles.citiesText}>
                            <p>
                                Experience the height of luxury and convenience with Premier Limo's
                                chauffeur-driven and self-drive options. Our fleet features the latest models,
                                ensuring every journey is as exceptional as it is comfortable.
                            </p>
                            <button className="btn-primary">Open page</button>
                        </div>
                        <div className={styles.cityCards}>
                            <CityCard name="New York" img="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=400" />
                            <CityCard name="Atlanta" img="https://images.unsplash.com/photo-1550608514-42b785023fa3?auto=format&fit=crop&q=80&w=400" />
                            <CityCard name="Boston" img="https://images.unsplash.com/photo-1501461322965-edf609fad441?auto=format&fit=crop&q=80&w=400" />
                            <CityCard name="Chicago" img="https://images.unsplash.com/photo-1494522855154-9297ac3d6237?auto=format&fit=crop&q=80&w=400" />
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <Footer />

            <AnimatePresence>
                {isModalOpen && selectedCar && (
                    <BookingModal
                        car={selectedCar}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Helper Components
const ServiceCard = ({ title, img, badge, link }) => {
    const navigate = useNavigate();
    return (
        <div
            className={styles.serviceCard}
            onClick={() => link && navigate(link)}
            style={{ cursor: link ? 'pointer' : 'default' }}
        >
            <img src={img} alt={title} />
            <div className={styles.cardOverlay}>
                <span className={styles.cardBadge}>{badge}</span>
                <div className={styles.cardFooter}>
                    <span>Explore more</span>
                    <div className={styles.arrowCircle}><ChevronRight size={16} /></div>
                </div>
            </div>
        </div>
    );
};

const CityCard = ({ name, img }) => (
    <div className={styles.cityCard}>
        <img src={img} alt={name} />
        <div className={styles.cityName}>{name}</div>
    </div>
);

export default Home;
