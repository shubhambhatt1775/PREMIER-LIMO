import React from 'react';
import { Send } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerMain}>
                    <div className={styles.footerBrand}>
                        <h2 className={styles.footerLogo}>PREMIER <span>LIMO</span></h2>
                        <p>307 Westwood Blvd, Bronx, NY 10472</p>
                        <p>info@premierlimo.com</p>
                        <div className={styles.newsletter}>
                            <p>Subscribe to the newsletter</p>
                            <div className={styles.newsInput}>
                                <input type="email" placeholder="Email" />
                                <button><Send size={18} /></button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.footerLinks}>
                        <div className={styles.linkColumn}>
                            <h4>Services</h4>
                            <a href="#">New York</a>
                            <a href="#">London</a>
                            <a href="#">Berlin</a>
                            <a href="#">Casablanca</a>
                            <a href="#">Paris</a>
                        </div>
                        <div className={styles.linkColumn}>
                            <h4>Explore</h4>
                            <a href="#">Industry rides</a>
                            <a href="#">Limousine service</a>
                            <a href="#">Chauffeur service</a>
                            <a href="#">Private car service</a>
                            <a href="#">Airport transfer</a>
                        </div>
                        <div className={styles.linkColumn}>
                            <h4>Top City Rides</h4>
                            <a href="#">East Hampton - New York</a>
                            <a href="#">New York - Washington</a>
                            <a href="#">New York - Philadelphia</a>
                            <a href="#">Abu Dhabi - Dubai</a>
                            <a href="#">London - Birmingham</a>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>&copy; 2024 PREMIER LIMO</p>
                    <div className={styles.legalLinks}>
                        <a href="#">Terms</a>
                        <a href="#">Privacy policy</a>
                        <a href="#">Legal notice</a>
                        <a href="#">Accessibility</a>
                    </div>
                    <div className={styles.socials}>
                        {/* Add social icons here */}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
