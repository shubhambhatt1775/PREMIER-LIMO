import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import Footer from '../components/common/Footer';
import styles from './FAQ.module.css';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "What documents do I need to rent a car?",
            answer: "You will need a valid driver's license held for at least 12 months, a valid passport or ID card, and a credit card in the main driver's name for the security deposit. International renters may require an International Driving Permit."
        },
        {
            question: "Is there a minimum age for renting?",
            answer: "Yes, the minimum age is generally 21 years. However, for certain luxury and high-performance vehicles, the minimum age requirement may be 25 years. Drivers under 25 may incur a young driver surcharge."
        },
        {
            question: "Can I book a chauffeur service?",
            answer: "Absolutely. We offer professional chauffeur services for all our vehicles. You can select this option during the booking process or contact our support team to arrange a custom chauffeur package."
        },
        {
            question: "What is your fuel policy?",
            answer: "We operate on a 'Full-to-Full' policy. You will receive the vehicle with a full tank of fuel and are expected to return it full. If the tank is not full upon return, refueling charges will apply."
        },
        {
            question: "Do you offer airport delivery?",
            answer: "Yes, we offer premium airport meet-and-greet delivery services. Our team will bring the car directly to the arrivals terminal or a designated VIP parking area at Sardar Vallabhbhai Patel International Airport (AMD) or any other major airport in India."
        },

        {
            question: "What insurance is included?",
            answer: "All rentals include basic Third Party Liability insurance. We strongly recommend upgrading to our Comprehensive Coverage for peace of mind, which reduces your liability to zero in case of damage or theft."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className={styles.faqPage}>
            <div className="container">
                <section className={styles.hero}>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Find answers to common questions about our premium rental services.
                    </motion.p>
                </section>

                <div className={styles.faqContainer}>
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className={`${styles.faqItem} ${activeIndex === index ? styles.active : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <button
                                className={styles.question}
                                onClick={() => toggleFAQ(index)}
                            >
                                {faq.question}
                                <ChevronDown className={styles.icon} size={20} />
                            </button>
                            <div className={styles.answer}>
                                <p>{faq.answer}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className={styles.contactSection}>
                    <h3>Still have questions?</h3>
                    <p>Our dedicated support team is available 24/7 to assist you.</p>
                    <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MessageCircle size={18} /> Contact Support
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FAQ;
