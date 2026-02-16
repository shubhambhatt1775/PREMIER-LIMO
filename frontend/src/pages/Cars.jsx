import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import CarCard from '../components/cars/CarCard';
import BookingModal from '../components/cars/BookingModal';
import api from '../services/api';
import styles from './Cars.module.css';

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedCar, setSelectedCar] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('ALL');

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

    const navigate = useNavigate();

    const handleRentNow = (car) => {
        navigate(`/cars/${car._id}`);
    };

    const categories = ['ALL', 'LUXURY', 'SPORTS', 'SUV', 'SEDAN'];
    const filteredCars = activeCategory === 'ALL'
        ? cars
        : cars.filter(car => car.category.toUpperCase() === activeCategory);


    return (
        <div className={styles.carsPage}>
            <div className="container">
                <header className={styles.header}>
                    <h1 className="section-title">Our full fleet</h1>
                    <p>Choose from our curated collection of premium vehicles, each maintained to the highest standards of luxury and performance.</p>
                </header>

                <div className={styles.fleetFilters}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={activeCategory === cat ? styles.activeFilter : ''}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className={styles.carGrid}>
                    {loading ? (
                        <div className={styles.loading}>Loading fleet...</div>
                    ) : filteredCars.length > 0 ? (
                        filteredCars.map(car => (
                            <CarCard
                                key={car._id}
                                car={car}
                                onRent={() => handleRentNow(car)}
                            />
                        ))
                    ) : (
                        <div className={styles.noCars}>No vehicles available in this category.</div>
                    )}
                </div>

            </div>

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

export default Cars;
