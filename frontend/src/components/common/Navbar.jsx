import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { code: 'en', label: 'ENG' },
    { code: 'es', label: 'ESP' },
    { code: 'fr', label: 'FRA' },
    { code: 'de', label: 'DEU' }
  ];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  const navItems = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.fleet'), path: '/cars' },
    { name: t('nav.faq'), path: '/faq' },
  ];

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className={`${styles.navbar} ${scrolled || !isHome ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navContainer}`}>
        <Link to="/" className={styles.logo}>
          PREMIER <span>LIMO</span>
        </Link>

        <div className={styles.navLinks}>
          {navItems.map(item => (
            <Link key={item.path} to={item.path}>{item.name}</Link>
          ))}
        </div>

        <div className={styles.navActions}>
          <div className={styles.langContainer}>
            <div
              className={styles.langSwitch}
              onClick={() => setLangOpen(!langOpen)}
            >
              <Globe size={18} />
              <span>{languages.find(l => l.code === i18n.language)?.label || 'ENG'}</span>
              <ChevronDown size={14} className={langOpen ? styles.rotate : ''} />
            </div>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={styles.langDropdown}
                >
                  {languages.map(lang => (
                    <div
                      key={lang.code}
                      className={`${styles.langItem} ${i18n.language === lang.code ? styles.activeLang : ''}`}
                      onClick={() => changeLanguage(lang.code)}
                    >
                      {lang.label}
                      {i18n.language === lang.code && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-dark)' }}></div>}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user ? (
            <div className={styles.profileContainer}>
              <button
                className={styles.profileBtn}
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className={styles.avatar}>
                  {user.image ? (
                    <img src={user.image} alt={user.name} />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <span className={styles.userName}>{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} className={profileOpen ? styles.rotate : ''} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={styles.profileDropdown}
                  >
                    <div className={styles.dropdownHeader}>
                      <p className={styles.dropName}>{user.name}</p>
                      <p className={styles.dropEmail}>{user.email}</p>
                    </div>
                    <div className={styles.dropdownLinks}>
                      <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setProfileOpen(false)}>
                        <LayoutDashboard size={16} /> {t('nav.dashboard')}
                      </Link>
                      <button onClick={handleLogout}>
                        <LogOut size={16} /> {t('nav.logout')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/login" className={styles.loginLink}>{t('nav.login')}</Link>
              <Link to="/signup" className={styles.signupBtn}>{t('nav.signup')}</Link>
            </div>
          )}

          <button className={styles.menuBtn} onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.overlay}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className={styles.drawer}
            >
              <div className={styles.drawerHeader}>
                <Link to="/" className={styles.logo} onClick={() => setIsOpen(false)}>
                  PREMIER <span>LIMO</span>
                </Link>
                <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
                  <X size={24} />
                </button>
              </div>
              <div className={styles.drawerLinks}>
                {navItems.map(item => (
                  <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                    {item.name}
                  </Link>
                ))}

                {user ? (
                  <>
                    <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className={styles.drawerAdmin} onClick={() => setIsOpen(false)}>
                      Dashboard
                    </Link>
                    <button className={styles.drawerLogout} onClick={handleLogout}>Logout</button>
                  </>
                ) : (
                  <div className={styles.mobileAuth}>
                    <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                    <Link to="/signup" className={styles.mobileSignup} onClick={() => setIsOpen(false)}>Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
