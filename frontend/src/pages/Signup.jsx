import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await signup({ name, email, password });
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };


    return (
        <div className={styles.authPage}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.authCard}
            >
                <div className={styles.authHeader}>
                    <h1 className="gradient-text">Create Account</h1>
                    <p>Join Premier Limo for an unparalleled rental experience.</p>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.authForm}>

                    <div className={styles.inputGroup}>
                        <label>Full Name</label>
                        <div className={styles.inputWrapper}>
                            <User size={18} />
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <div className={styles.inputWrapper}>
                            <Mail size={18} />
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        Get Started <ArrowRight size={18} />
                    </button>
                </form>

                <p className={styles.switchAuth}>
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
