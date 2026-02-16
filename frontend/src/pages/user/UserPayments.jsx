import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, Trash2, ShieldCheck } from 'lucide-react';

const UserPayments = () => {
    const [cards, setCards] = useState([
        { id: 1, type: 'Visa', last4: '4242', expiry: '12/28', holder: 'John Doe' },
        { id: 2, type: 'Mastercard', last4: '8888', expiry: '09/26', holder: 'John Doe' }
    ]);

    // Inline styles for simplicity for this component
    const styles = {
        container: { maxWidth: '800px', width: '100%' },
        header: { textAlign: 'center', marginBottom: '3rem' },
        cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' },
        paymentCard: {
            background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '20px',
            position: 'relative',
            aspectRatio: '1.586',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        },
        cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        chip: { width: '40px', height: '30px', background: '#d4af37', borderRadius: '6px' }, // Gold chip
        cardNumber: { fontSize: '1.5rem', letterSpacing: '2px', margin: '1rem 0' },
        cardBottom: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#aaa' },
        cardName: { textTransform: 'uppercase' },
        addCard: {
            border: '2px dashed #e5e5e5',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            cursor: 'pointer',
            aspectRatio: '1.586',
            color: '#666',
            transition: 'all 0.3s ease'
        }
    };

    return (
        <motion.div
            style={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div style={styles.header}>
                <h1 className="gradient-text">Payment Methods</h1>
                <p>Manage your saved credit cards for faster checkout.</p>
            </div>

            <div style={styles.cardGrid}>
                {cards.map(card => (
                    <div key={card.id} style={styles.paymentCard}>
                        <div style={styles.cardTop}>
                            <div style={styles.chip}></div>
                            <span style={{ fontWeight: 'bold', fontStyle: 'italic' }}>{card.type}</span>
                        </div>
                        <div style={styles.cardNumber}>•••• •••• •••• {card.last4}</div>
                        <div style={styles.cardBottom}>
                            <div style={styles.cardName}>{card.holder}</div>
                            <div>{card.expiry}</div>
                        </div>
                    </div>
                ))}

                <div style={styles.addCard}>
                    <Plus size={32} color="var(--primary)" />
                    <span style={{ fontWeight: 600 }}>Add New Card</span>
                </div>
            </div>

            <p style={{ textAlign: 'center', marginTop: '3rem', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} /> Payments are secured by Stripe.
            </p>
        </motion.div>
    );
};

export default UserPayments;
