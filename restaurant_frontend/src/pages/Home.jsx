import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section 
        className="hero"
        style={{
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'radial-gradient(circle at center, rgba(197, 160, 89, 0.15) 0%, transparent 70%)' }} />
        
        <motion.h1 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ fontSize: '4rem', marginBottom: '1rem' }}
        >
          {t('hero_title')}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '2rem' }}
        >
          {t('hero_subtitle')}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link to="/menu">
            <button className="btn">{t('view_menu')}</button>
          </Link>
          <Link to="/book">
            <button className="btn btn-outline">{t('book_table')}</button>
          </Link>
        </motion.div>
      </section>

      {/* Featured Section */}
      <section className="container" style={{ padding: '4rem 1.5rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>{t('why_choose_us')}</h2>
        <div className="grid grid-cols-3">
          {[
            { title: t('fresh_ingredients'), desc: t('fresh_desc') },
            { title: t('master_chefs'), desc: t('master_desc') },
            { title: t('lux_ambi'), desc: t('lux_desc') },
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              className="glass"
              style={{ padding: '2rem', textAlign: 'center' }}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
            >
              <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
