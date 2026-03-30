import React from 'react';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon, X, ShoppingCart, Globe } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { cartItems } = useCart();

  const navLinks = [
    { title: t('home'), path: '/' },
    { title: t('menu'), path: '/menu' },
    { title: t('branches'), path: '/branches' },
    { title: t('book'), path: '/book' },
    { title: 'Admin', path: '/admin' },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <nav className="glass" style={{
      position: 'sticky', top: 0, zIndex: 50, borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0
    }}>
      <div className="container" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px'
      }}>
        <Link to="/" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
          BOSPHORUS
        </Link>
        
        {/* Desktop Nav */}
        <div style={{ display: 'none' }} className="desktop-nav">
          <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', alignItems: 'center' }}>
            {navLinks.map((link, idx) => (
              <li key={idx}>
                <Link to={link.path} className="nav-link" style={{ fontWeight: 500, transition: 'color 0.3s' }}>
                  {link.title}
                </Link>
              </li>
            ))}
            
            {/* Language Switcher */}
            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
              {['uz', 'ru', 'en'].map((lng) => (
                <button 
                  key={lng}
                  onClick={() => changeLanguage(lng)}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: i18n.language === lng ? 'var(--accent-gold)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontWeight: i18n.language === lng ? 'bold' : 'normal',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem'
                  }}
                >
                  {lng}
                </button>
              ))}
            </div>

            {/* Cart Icon */}
            <Link to="/cart" style={{ color: 'var(--text-main)', marginLeft: '1rem', position: 'relative' }}>
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--accent-gold)', color: '#000', borderRadius: '50%', padding: '0 5px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>
          </ul>
        </div>
        
        <style>{`
          @media (min-width: 768px) {
            .desktop-nav { display: block !important; }
            .mobile-toggle { display: none !important; }
          }
          .nav-link:hover { color: var(--accent-gold); }
        `}</style>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="mobile-toggle">
           <Link to="/cart" style={{ color: 'var(--text-main)', position: 'relative' }}>
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--accent-gold)', color: '#000', borderRadius: '50%', padding: '0 5px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>
           <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
            {isOpen ? <X size={28} /> : <MenuIcon size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass"
            style={{ position: 'absolute', top: '80px', left: 0, right: 0, border: 'none', borderRadius: '0 0 12px 12px' }}
          >
            <ul style={{ padding: '2rem', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
              {navLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path} 
                    style={{ fontSize: '1.25rem', fontWeight: 500 }}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                {['uz', 'ru', 'en'].map((lng) => (
                  <button 
                    key={lng}
                    onClick={() => changeLanguage(lng)}
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      color: i18n.language === lng ? 'var(--accent-gold)' : 'var(--text-muted)',
                      fontSize: '1.1rem',
                      textTransform: 'uppercase'
                    }}
                  >
                    {lng}
                  </button>
                ))}
              </div>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
