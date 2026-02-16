import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNav from './DashboardNav';
import styles from './UserDashboard.module.css';

const UserDashboard = () => {
    return (
        <div className={styles.dashboardLayout}>
            <div className="container">
                <div className={styles.dashboardGrid}>
                    <DashboardNav />
                    <main className={styles.dashboardMain}>
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
