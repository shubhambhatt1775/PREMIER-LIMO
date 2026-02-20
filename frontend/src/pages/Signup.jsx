import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login-lite';
import styles from './Auth.module.css';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signup, googleLogin, facebookLogin } = useAuth();
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

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const result = await googleLogin(tokenResponse.access_token);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
            }
        },
        onError: () => setError('Google registration failed')
    });

    const handleFacebookResponse = async (response) => {
        if (response.authResponse) {
            const { accessToken, userID } = response.authResponse;
            const result = await facebookLogin(accessToken, userID);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
            }
        } else {
            setError('Facebook registration failed');
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

                <div className={styles.divider}>
                    <span>or continue with</span>
                </div>

                <div className={styles.socialGrid}>
                    <button className={styles.socialBtn} onClick={() => handleGoogleLogin()}>
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="18" />
                        Google
                    </button>
                    <FacebookLogin
                        appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                        onSuccess={handleFacebookResponse}
                        onFailure={() => setError('Facebook registration failed')}
                        render={({ onClick }) => (
                            <button className={styles.socialBtn} onClick={onClick}>
                                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" width="18" />
                                Facebook
                            </button>
                        )}
                    />
                </div>

                <p className={styles.switchAuth}>
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
