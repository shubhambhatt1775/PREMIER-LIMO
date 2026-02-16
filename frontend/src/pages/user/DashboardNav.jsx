import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Calendar, FileText, CreditCard, Settings, LogOut } from 'lucide-react';
import styles from './DashboardNav.module.css';
import { useAuth } from '../../context/AuthContext';

const DashboardNav = () => {
    const { logout } = useAuth();

    const navItems = [
        { name: 'My Profile', path: '/dashboard/profile', icon: User },
        { name: 'My Bookings', path: '/dashboard/bookings', icon: Calendar },
        { name: 'Driving License', path: '/dashboard/license', icon: FileText },
        { name: 'Payment Methods', path: '/dashboard/payments', icon: CreditCard },
        { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];

    return (
        <nav className={styles.nav}>
            <div className={styles.navContainer}>
                <div className={styles.navLinks}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                            }
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </div>
                <button onClick={logout} className={styles.logoutBtn}>
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>
            </div>
        </nav>
    );
};

export default DashboardNav;
