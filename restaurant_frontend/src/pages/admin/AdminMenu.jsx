import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Search, Filter, X, Check, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const AdminMenu = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image: "",
    is_available: true
  });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const [foodRes, catRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/menu/'),
        axios.get('http://127.0.0.1:8000/api/categories/')
      ]);
      setFoods(foodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/api/menu/${editingId}/`, formData);
      } else {
        await axios.post('http://127.0.0.1:8000/api/menu/', formData);
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ name: "", description: "", price: "", category_id: "", image: "", is_available: true });
      fetchData();
    } catch (error) {
      console.error("Error saving food:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/menu/${id}/`);
      fetchData();
    } catch (error) {
      console.error("Error deleting food:", error);
    }
  };

  const startEdit = (food) => {
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price,
      category_id: food.category.id,
      image: food.image,
      is_available: food.is_available
    });
    setEditingId(food.id);
    setIsAdding(true);
  };

  const filteredFoods = foods.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "" || food.category.id === parseInt(selectedCategory))
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="admin-header">
        <h1>Menu Management</h1>
        <button className="btn" onClick={() => {
          setIsAdding(true);
          setEditingId(null);
          setFormData({ name: "", description: "", price: "", category_id: "", image: "", is_available: true });
        }}>
          <Plus size={18} /> Add Food Item
        </button>
      </div>

      {/* Filters */}
      <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search items..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '3rem', marginBottom: 0 }}
          />
        </div>
        <div style={{ width: '200px' }}>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ marginBottom: 0 }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass"
            style={{ padding: '2.5rem', marginBottom: '2rem' }}
          >
            <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? "Edit Food Item" : "New Food Item"}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
              <div className="admin-form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="admin-form-group">
                <label>Category</label>
                <select name="category_id" value={formData.category_id} onChange={handleInputChange} required>
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label>Price (so'm)</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
              </div>
              <div className="admin-form-group">
                <label>Image URL</label>
                <input type="text" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://..." />
              </div>
              <div className="admin-form-group" style={{ gridColumn: 'span 2' }}>
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" />
              </div>
              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input 
                  type="checkbox" 
                  name="is_available" 
                  checked={formData.is_available} 
                  onChange={handleInputChange}
                  style={{ width: 'auto', marginBottom: 0 }}
                />
                <label style={{ marginBottom: 0 }}>Is Available</label>
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
                <button type="submit" className="btn">Save Changes</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass" style={{ padding: '2rem' }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFoods.map((food) => (
                <tr key={food.id}>
                  <td>
                    {food.image ? (
                      <img src={food.image} alt={food.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageIcon size={20} color="var(--text-muted)" />
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{food.name}</td>
                  <td><span className="badge badge-pending" style={{ background: 'rgba(197, 160, 89, 0.1)', color: 'var(--accent-gold)' }}>{food.category.name}</span></td>
                  <td>{parseFloat(food.price).toLocaleString()} so'm</td>
                  <td>
                    <span className={`badge ${food.is_available ? 'badge-accepted' : 'badge-rejected'}`}>
                      {food.is_available ? 'Available' : 'Out of Stock'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="action-btn" onClick={() => startEdit(food)}><Edit2 size={18} /></button>
                      <button className="action-btn" style={{ color: '#dc3545' }} onClick={() => handleDelete(food.id)}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminMenu;
