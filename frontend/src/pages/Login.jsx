import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password);
        if (result.success) {
            navigate(from, { replace: true });
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
                    <h1>Welcome Back</h1>
                    <p>Enter your details to access your premier account.</p>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.authForm}>

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
                        <div className={styles.labelRow}>
                            <label>Password</label>
                            <a href="#" className={styles.forgotPass}>Forgot password?</a>
                        </div>
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
                        Sign In <ArrowRight size={18} />
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>or continue with</span>
                </div>

                <div className={styles.socialGrid}>
                    <button className={styles.socialBtn}>
                        <Github size={20} />
                        GitHub
                    </button>
                    <button className={styles.socialBtn}>
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="18" />
                        Google
                    </button>
                </div>

                <p className={styles.switchAuth}>
                    Don't have an account? <Link to="/signup">Create one</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
