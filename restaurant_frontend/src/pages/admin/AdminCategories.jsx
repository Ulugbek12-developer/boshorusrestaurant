import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import axios from 'axios';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    try {
      await axios.post('/api/categories/', { name: newCategory });
      setNewCategory("");
      setIsAdding(false);
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`/api/categories/${id}/`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleUpdate = async (id) => {
    if (!editValue.trim()) return;
    try {
      await axios.put(`/api/categories/${id}/`, { name: editValue });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="admin-header">
        <h1>Categories</h1>
        <button className="btn" onClick={() => setIsAdding(true)}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="glass" style={{ padding: '2rem' }}>
        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden', marginBottom: '2rem' }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Category Name" 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ marginBottom: 0 }}
                />
                <button className="btn" onClick={handleAdd}><Check size={18} /></button>
                <button className="btn btn-outline" onClick={() => setIsAdding(false)}><X size={18} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>#{cat.id}</td>
                  <td>
                    {editingId === cat.id ? (
                      <input 
                        type="text" 
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        style={{ marginBottom: 0, padding: '0.5rem' }}
                      />
                    ) : cat.name}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {editingId === cat.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="action-btn" style={{ color: '#28a745' }} onClick={() => handleUpdate(cat.id)}>
                          <Check size={18} />
                        </button>
                        <button className="action-btn" onClick={() => setEditingId(null)}>
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          className="action-btn" 
                          onClick={() => {
                            setEditingId(cat.id);
                            setEditValue(cat.name);
                          }}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button className="action-btn" style={{ color: '#dc3545' }} onClick={() => handleDelete(cat.id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
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

export default AdminCategories;
