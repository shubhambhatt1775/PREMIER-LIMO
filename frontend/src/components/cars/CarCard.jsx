import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import styles from './CarCard.module.css';

const CarCard = ({ car, onRent }) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className={styles.card}
            onClick={onRent}
        >
            <div className={styles.info}>
                <h3>{car.name}</h3>
                <p>${car.pricePerDay} / day</p>
                {car.totalReviews > 0 && (
                    <div className={styles.rating}>
                        <span className={styles.star}>★</span>
                        <span className={styles.ratingValue}>{car.averageRating?.toFixed(1)}</span>
                        <span className={styles.totalReviews}>({car.totalReviews})</span>
                    </div>
                )}
            </div>
            <div className={styles.imageContainer}>
                <img src={car.image || `https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800`} alt={car.name} />
            </div>
            <div className={styles.categoryBadge}>{car.category}</div>
            <div className={styles.footer}>
                <span>Rent Now</span>
                <div className={styles.arrowCircle}><ChevronRight size={16} /></div>
            </div>
        </motion.div>
    );
};

export default CarCard;
