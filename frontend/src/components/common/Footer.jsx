import { Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerMain}>
                    <div className={styles.footerBrand}>
                        <h2 className={styles.footerLogo}>PREMIER <span>LIMO</span></h2>
                        <p>S.G. Highway, Ahmedabad, Gujarat 380054</p>
                        <p>info@premierlimo.in</p>

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
                            <Link to="/city/ahmedabad">Ahmedabad</Link>
                            <Link to="/city/gandhinagar">Gandhinagar</Link>
                            <Link to="/city/mumbai">Mumbai</Link>
                            <Link to="/city/delhi">Delhi</Link>
                            <Link to="/city/bangalore">Bangalore</Link>
                        </div>
                        <div className={styles.linkColumn}>
                            <h4>Explore</h4>
                            <Link to="/explore/industry-rides">Industry rides</Link>
                            <Link to="/explore/limousine-service">Limousine service</Link>
                            <Link to="/explore/chauffeur-service">Chauffeur service</Link>
                            <Link to="/explore/private-car-service">Private car service</Link>
                            <Link to="/services/airport-transfers">Airport transfer</Link>
                        </div>
                        <div className={styles.linkColumn}>
                            <h4>Top City Rides</h4>
                            <Link to="/route/ahmedabad-gandhinagar">Ahmedabad - Gandhinagar</Link>
                            <Link to="/route/mumbai-pune">Mumbai - Pune</Link>
                            <Link to="/route/delhi-gurgaon">Delhi - Gurgaon</Link>
                            <Link to="/route/bangalore-mysore">Bangalore - Mysore</Link>
                            <Link to="/route/chennai-vellore">Chennai - Vellore</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>&copy; 2024 PREMIER LIMO</p>
                    <div className={styles.legalLinks}>
                        <Link to="/terms">Terms</Link>
                        <Link to="/privacy">Privacy policy</Link>
                        <Link to="/legal-notice">Legal notice</Link>
                        <Link to="/accessibility">Accessibility</Link>
                        <Link to="/developer" className={styles.developerLink}>Developed by Shubham Bhatt</Link>
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
