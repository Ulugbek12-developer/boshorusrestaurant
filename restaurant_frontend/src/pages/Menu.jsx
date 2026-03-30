import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, MessageSquare, Plus, X, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const Menu = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Comment states
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [commentData, setCommentData] = useState({ user_name: '', text: '', rating: 5 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axios.get('http://127.0.0.1:8000/api/categories/');
        setCategories(catRes.data);
        const foodRes = await axios.get('http://127.0.0.1:8000/api/menu/');
        setFoods(foodRes.data);
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredFoods = foods.filter(food => {
    // food.category is an object, but activeCategory is a string
    const matchesCategory = activeCategory === 'All' || (food.category && food.category.name === activeCategory);
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/comments/', {
        food: selectedFood.id,
        ...commentData
      });
      alert(t('comment_success') || 'Rahmat! Fikringiz qabul qilindi.');
      setShowCommentModal(false);
      setCommentData({ user_name: '', text: '', rating: 5 });
      // Refresh food to see comment count update (if backend handles it)
      const foodRes = await axios.get('http://127.0.0.1:8000/api/menu/');
      setFoods(foodRes.data);
    } catch (err) {
      console.error("Comment error:", err);
      alert('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>{t('our_menu')}</h1>
      
      {/* Search and Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
          <input 
            type="text" 
            placeholder={t('search_placeholder')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '3rem', marginBottom: 0, borderRadius: '50px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${activeCategory === 'All' ? '' : 'btn-outline'}`}
            style={{ borderRadius: '50px', padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
            onClick={() => setActiveCategory('All')}
          >
            {activeCategory === 'All' ? '✓ ' : ''}All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`btn ${activeCategory === cat.name ? '' : 'btn-outline'}`}
              style={{ borderRadius: '50px', padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
              onClick={() => setActiveCategory(cat.name)}
            >
              {activeCategory === cat.name ? '✓ ' : ''}{cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--accent-gold)', padding: '5rem' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ display: 'inline-block' }}>
            ⏳
          </motion.div>
          <p style={{ marginTop: '1rem' }}>Loading Menu...</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-4">
          <AnimatePresence>
            {filteredFoods.map((food) => (
              <motion.div
                key={food.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="glass"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ position: 'relative', height: '200px', width: '100%', overflow: 'hidden' }}>
                  <img 
                    src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'} 
                    alt={food.name} 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800' }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} 
                  />
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', padding: '0.25rem 0.6rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--accent-gold)' }}>
                    <Star size={14} color="var(--accent-gold)" fill="var(--accent-gold)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white' }}>{food.rating}</span>
                  </div>
                </div>
                
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)', letterSpacing: '0.5px' }}>{food.name}</h3>
                  <p style={{ color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1.2rem' }}>
                    {formatPrice(food.price)} {t('currency')}
                  </p>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button 
                      onClick={() => { setSelectedFood(food); setShowCommentModal(true); }}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', transition: 'color 0.3s' }}
                      onMouseOver={(e) => e.target.style.color = 'var(--accent-gold)'}
                      onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}
                    >
                      <MessageSquare size={16} />
                      {t('comments')}
                    </button>
                    <button 
                      className="btn" 
                      style={{ padding: '0.6rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => {
                        addToCart(food);
                        toast.success("Sizning buyurtmangiz savatchaga qo'shildi!", {
                          duration: 3000,
                          icon: '🛒',
                          style: {
                            borderRadius: '10px',
                            background: '#1c1c1c',
                            color: '#fff',
                            border: '1px solid var(--accent-gold)'
                          }
                        });
                      }}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Comment Modal */}
      <AnimatePresence>
        {showCommentModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="glass"
              style={{ maxWidth: '500px', width: '100%', padding: '2rem', position: 'relative' }}
            >
              <button 
                onClick={() => setShowCommentModal(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>

              <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>{selectedFood?.name} - {t('add_comment')}</h2>
              
              <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{t('your_name')}</label>
                  <input 
                    type="text" 
                    required
                    value={commentData.user_name}
                    onChange={(e) => setCommentData({...commentData, user_name: e.target.value})}
                    placeholder="Ismingizni kiriting"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{t('rating')}</label>
                  <select 
                    value={commentData.rating}
                    onChange={(e) => setCommentData({...commentData, rating: parseInt(e.target.value)})}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} ★</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{t('message')}</label>
                  <textarea 
                    required
                    value={commentData.text}
                    onChange={(e) => setCommentData({...commentData, text: e.target.value})}
                    placeholder="Fikringizni qoldiring..."
                    rows={4}
                  />
                </div>

                <button type="submit" className="btn" style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Send size={18} />
                  {t('submit')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Menu;
