import React from 'react';
import { motion } from 'framer-motion';
import { Code, Layout, Database, Github, Linkedin, Instagram, Mail, ExternalLink, Award, GraduationCap } from 'lucide-react';
import Footer from '../components/common/Footer';
import styles from './Developer.module.css';

const Developer = () => {
    const skills = [
        { category: 'Frontend', items: ['React', 'JavaScript', 'Tailwind CSS', 'GSAP', 'Framer Motion'], icon: <Layout size={20} /> },
        { category: 'Backend', items: ['Node.js', 'Express.js', 'PHP', 'ASP.NET (C#)'], icon: <Code size={20} /> },
        { category: 'Database', items: ['MongoDB', 'MySQL', 'Firebase'], icon: <Database size={20} /> },
    ];

    const projects = [
        { title: 'PREMIER LIMO', tech: 'MERN Stack + Socket.io', desc: 'Luxury car rental platform with real-time features.' },
        { title: 'E-jewl', tech: 'MERN Stack', desc: 'An online jewellery shop with seamless UX.' },
        { title: 'Hypercars', tech: 'HTML/CSS/JS', desc: 'Visual showcase of high-performance vehicles.' },
    ];

    return (
        <div className={styles.devPage}>
            <div className="container">
                <header className={styles.hero}>
                    <motion.div
                        className={styles.pfpWrapper}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className={styles.pfp}>SB</div>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Shubham Bhatt
                    </motion.h1>
                    <motion.p
                        className={styles.role}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Full Stack Developer & UI/UX Designer
                    </motion.p>

                    <div className={styles.socialLinks}>
                        <a href="https://github.com/shubhambhatt1775" target="_blank" rel="noreferrer"><Github size={20} /></a>
                        <a href="https://www.linkedin.com/in/shubham-bhatt-761170316/" target="_blank" rel="noreferrer"><Linkedin size={20} /></a>
                        <a href="https://www.instagram.com/shubhambhatt1775/" target="_blank" rel="noreferrer"><Instagram size={20} /></a>
                        <a href="mailto:bhattshubham274@gmail.com"><Mail size={20} /></a>
                    </div>
                </header>

                <div className={styles.mainGrid}>
                    <motion.section
                        className={styles.section}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className={styles.sectionHeader}>
                            <Award className={styles.headerIcon} />
                            <h3>About Me</h3>
                        </div>
                        <p>I am a passionate developer focused on building robust, scalable applications with seamless user experiences. My approach combines technical excellence with creative design thinking.</p>

                        <div className={styles.education}>
                            <div className={styles.eduItem}>
                                <GraduationCap size={18} />
                                <div>
                                    <h4>MCA — LDRP-ITR</h4>
                                    <span>2024 – Present | Gandhinagar</span>
                                </div>
                            </div>
                            <div className={styles.eduItem}>
                                <GraduationCap size={18} />
                                <div>
                                    <h4>BCA — B.K. Mehta IT Centre</h4>
                                    <span>2021 – 2024</span>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    <motion.section
                        className={styles.section}
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className={styles.sectionHeader}>
                            <Code className={styles.headerIcon} />
                            <h3>Core Expertise</h3>
                        </div>
                        <div className={styles.skillGrid}>
                            {skills.map((s, i) => (
                                <div key={i} className={styles.skillCard}>
                                    <div className={styles.skillCategory}>
                                        {s.icon} {s.category}
                                    </div>
                                    <div className={styles.skillItems}>
                                        {s.items.map(item => <span key={item}>{item}</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                </div>

                <section className={styles.projectsSection}>
                    <h3 className={styles.centerTitle}>Featured Works</h3>
                    <div className={styles.projectGrid}>
                        {projects.map((p, i) => (
                            <motion.div
                                key={i}
                                className={styles.projectCard}
                                whileHover={{ scale: 1.02 }}
                            >
                                <h4>{p.title}</h4>
                                <span className={styles.tech}>{p.tech}</span>
                                <p>{p.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                    <div className={styles.portfolioCTA}>
                        <a href="https://shubhambhatt1775.github.io/Shubham-Intro/" target="_blank" rel="noreferrer" className="btn-primary">
                            View Full Portfolio <ExternalLink size={16} />
                        </a>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default Developer;
