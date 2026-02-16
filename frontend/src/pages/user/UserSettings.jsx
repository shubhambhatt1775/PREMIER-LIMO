import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Lock, Smartphone, Globe, Moon, Sun, ChevronRight, ToggleRight, ToggleLeft } from 'lucide-react';
import styles from './UserSettings.module.css';

const UserSettings = () => {
    const [settings, setSettings] = useState({
        notifications: true,
        darkMode: false,
        twoFactor: false,
        newsletter: true
    });

    const toggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className={styles.header}>
                <h1 className="gradient-text">Account Settings</h1>
                <p>Manage your app preferences and security.</p>
            </div>

            <div className={styles.section}>
                <h3><Bell size={18} /> Notifications</h3>
                <div className={styles.settingItem} onClick={() => toggle('notifications')}>
                    <div className={styles.label}>
                        <span>Push Notifications</span>
                        <p>Receive updates about your bookings.</p>
                    </div>
                    {settings.notifications ? <ToggleRight size={32} color="var(--success)" /> : <ToggleLeft size={32} color="#ccc" />}
                </div>
                <div className={styles.settingItem} onClick={() => toggle('newsletter')}>
                    <div className={styles.label}>
                        <span>Email Newsletter</span>
                        <p>Get exclusive offers and travel tips.</p>
                    </div>
                    {settings.newsletter ? <ToggleRight size={32} color="var(--success)" /> : <ToggleLeft size={32} color="#ccc" />}
                </div>
            </div>

            <div className={styles.section}>
                <h3><Lock size={18} /> Security</h3>
                <div className={styles.settingItem} onClick={() => toggle('twoFactor')}>
                    <div className={styles.label}>
                        <span>Two-Factor Authentication</span>
                        <p>Add an extra layer of security to your account.</p>
                    </div>
                    {settings.twoFactor ? <ToggleRight size={32} color="var(--success)" /> : <ToggleLeft size={32} color="#ccc" />}
                </div>
                <div className={styles.settingItem}>
                    <div className={styles.label}>
                        <span>Change Password</span>
                        <p>Last updated 3 months ago.</p>
                    </div>
                    <ChevronRight size={20} color="#ccc" />
                </div>
            </div>

            <div className={styles.section}>
                <h3><Globe size={18} /> Appearance</h3>
                <div className={styles.settingItem} onClick={() => toggle('darkMode')}>
                    <div className={styles.label}>
                        <span>Dark Mode</span>
                        <p>Switch between light and dark themes.</p>
                    </div>
                    {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
                </div>
            </div>

            <button className={styles.deleteBtn}>Delete Account</button>
        </motion.div>
    );
};

export default UserSettings;
