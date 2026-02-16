import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './NotFound.module.css';

const NotFound = () => {
    return (
        <div className={styles.notFound}>
            <div className={styles.overlay}></div>
            <motion.div
                className={styles.content}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className={styles.errorCode}>404</h1>
                <h2 className={styles.errorMessage}>Page Not Found</h2>
                <p className={styles.subMessage}>
                    The luxury you're looking for isn't here yet.
                </p>
                <Link to="/" className={styles.homeBtn}>
                    Back to Home
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
