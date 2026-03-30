import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, MapPin, Phone, Clock, Map } from 'lucide-react';
import axios from 'axios';

const AdminBranches = () => {
  const [branches, setBranches] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    working_hours: "",
    map_url: ""
  });

  const fetchBranches = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/branches/');
      setBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/api/branches/${editingId}/`, formData);
      } else {
        await axios.post('http://127.0.0.1:8000/api/branches/', formData);
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ name: "", address: "", phone: "", working_hours: "", map_url: "" });
      fetchBranches();
    } catch (error) {
      console.error("Error saving branch:", error);
    }
  };

  const startEdit = (branch) => {
    setFormData(branch);
    setEditingId(branch.id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this branch?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/branches/${id}/`);
      fetchBranches();
    } catch (error) {
      console.error("Error deleting branch:", error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="admin-header">
        <h1>Branches</h1>
        <button className="btn" onClick={() => { setIsAdding(true); setEditingId(null); }}>
          <Plus size={18} /> Add Branch
        </button>
      </div>

      {isAdding && (
        <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3>{editingId ? "Edit Branch" : "New Branch"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2" style={{ gap: '1.5rem', marginTop: '1.5rem' }}>
            <div className="admin-form-group">
              <label>Branch Name</label>
              <input name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="admin-form-group">
              <label>Phone</label>
              <input name="phone" value={formData.phone} onChange={handleInputChange} required />
            </div>
            <div className="admin-form-group" style={{ gridColumn: 'span 2' }}>
              <label>Address</label>
              <input name="address" value={formData.address} onChange={handleInputChange} required />
            </div>
            <div className="admin-form-group">
              <label>Working Hours</label>
              <input name="working_hours" value={formData.working_hours} onChange={handleInputChange} required />
            </div>
            <div className="admin-form-group">
              <label>Map URL</label>
              <input name="map_url" value={formData.map_url} onChange={handleInputChange} />
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
              <button type="submit" className="btn">Save Branch</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2">
        {branches.map((branch) => (
          <div key={branch.id} className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3>{branch.name}</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="action-btn" onClick={() => startEdit(branch)}><Edit2 size={18} /></button>
                <button className="action-btn" style={{ color: '#dc3545' }} onClick={() => handleDelete(branch.id)}><Trash2 size={18} /></button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--text-muted)' }}>
              <MapPin size={18} color="var(--accent-gold)" /> <span>{branch.address}</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--text-muted)' }}>
              <Phone size={18} color="var(--accent-gold)" /> <span>{branch.phone}</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--text-muted)' }}>
              <Clock size={18} color="var(--accent-gold)" /> <span>{branch.working_hours}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminBranches;
