import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Phone, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Branches = () => {
  const { t } = useTranslation();
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    axios.get('/api/branches/').then(res => {
      setBranches(res.data);
    });
  }, []);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>{t('branches')}</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {branches.map((branch, idx) => (
          <motion.div 
            key={branch.id}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass"
            style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', overflow: 'hidden', minHeight: '400px' }}
          >
            <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ color: 'var(--accent-gold)' }}>{branch.name}</h2>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <MapPin color="var(--accent-gold)" />
                <div>
                  <h4 style={{ marginBottom: '0.25rem' }}>Manzil</h4>
                  <p style={{ color: 'var(--text-muted)' }}>{branch.address}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <Phone color="var(--accent-gold)" />
                <div>
                  <h4 style={{ marginBottom: '0.25rem' }}>{t('phone')}</h4>
                  <p style={{ color: 'var(--text-muted)' }}>{branch.phone}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <Clock color="var(--accent-gold)" />
                <div>
                  <h4 style={{ marginBottom: '0.25rem' }}>Ish vaqti</h4>
                  <p style={{ color: 'var(--text-muted)' }}>{branch.working_hours}</p>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '400px' }}>
              <iframe 
                src={branch.map_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d191885.50263690623!2d69.13928236259449!3d41.28251254641908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9d3%3A0x40d9016b2a30ca17!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1711732000000!5m2!1sen!2s"} 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(0.5) contrast(1.2) brightness(0.8)' }} 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Branches;
