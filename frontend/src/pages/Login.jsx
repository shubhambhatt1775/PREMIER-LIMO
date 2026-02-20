import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login-lite';
import styles from './Auth.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, googleLogin, facebookLogin } = useAuth();
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

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const result = await googleLogin(tokenResponse.access_token);
            if (result.success) {
                navigate(from, { replace: true });
            } else {
                setError(result.message);
            }
        },
        onError: () => setError('Google login failed')
    });

    const handleFacebookResponse = async (response) => {
        if (response.authResponse) {
            const { accessToken, userID } = response.authResponse;
            const result = await facebookLogin(accessToken, userID);
            if (result.success) {
                navigate(from, { replace: true });
            } else {
                setError(result.message);
            }
        } else {
            setError('Facebook login failed');
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
                    <button className={styles.socialBtn} onClick={() => handleGoogleLogin()}>
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="18" />
                        Google
                    </button>
                    <FacebookLogin
                        appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                        onSuccess={handleFacebookResponse}
                        onFailure={() => setError('Facebook login failed')}
                        render={({ onClick }) => (
                            <button className={styles.socialBtn} onClick={onClick}>
                                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" width="18" />
                                Facebook
                            </button>
                        )}
                    />
                </div>

                <p className={styles.switchAuth}>
                    Don't have an account? <Link to="/signup">Create one</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
