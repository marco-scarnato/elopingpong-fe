import React, { useState, useEffect } from 'react';
import './PendingMatches.css';

const PendingMatches = ({ onMatchUpdated }) => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/matches/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setPending(data);
    } catch (err) {
      console.error('Error fetching pending matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id, action) => {
    try {
      const response = await fetch(`http://localhost:3000/api/matches/${id}/${action}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setPending(prev => prev.filter(m => m.id !== id));
        onMatchUpdated();
      }
    } catch (err) {
      console.error(`Error ${action}ing match:`, err);
    }
  };

  if (loading) return null;
  if (pending.length === 0) return null;

  return (
    <section className="pending-section ranking-card">
      <h3 className="section-title">
        <span className="info-icon">🕒</span> Da Verificare
      </h3>
      <div className="pending-list">
        {pending.map(match => (
          <div key={match.id} className="pending-item">
            <div className="match-info">
              <span className="creator">{match.creator_name}</span>
              <span className="scores">
                {match.creator_score} - {match.opponent_score}
              </span>
              <span className="match-type">({match.match_type} pts)</span>
            </div>
            <div className="match-actions">
              <button className="confirm-btn" onClick={() => handleAction(match.id, 'verify')}>Conferma</button>
              <button className="reject-btn" onClick={() => handleAction(match.id, 'reject')}>Rifiuta</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PendingMatches;
