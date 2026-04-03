import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, MessageSquare, User, Clock, Star } from 'lucide-react';
import axios from 'axios';

const AdminComments = () => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const response = await axios.get('/api/comments/');
      setComments(response.data.reverse());
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await axios.delete(`/api/comments/${id}//`);
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="admin-header">
        <h1>User Comments</h1>
        <div style={{ color: 'var(--text-muted)' }}>Moderate reviews and feedback</div>
      </div>

      <div className="grid grid-cols-2">
        {comments.map((comment) => (
          <div key={comment.id} className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(197, 160, 89, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
                  <User size={20} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>{comment.user_name}</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#ffc107', fontSize: '0.8rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < comment.rating ? "#ffc107" : "none"} />
                    ))}
                  </div>
                </div>
              </div>
              <button className="action-btn" style={{ color: '#dc3545' }} onClick={() => handleDelete(comment.id)}><Trash2 size={18} /></button>
            </div>
            
            <p style={{ color: 'var(--text-main)', fontStyle: 'italic', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-gold)' }}>
              "{comment.text}"
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <Clock size={14} /> <span>{new Date(comment.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="glass" style={{ gridColumn: 'span 2', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <MessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No comments found yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminComments;
