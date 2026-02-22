import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ players, onUpdate }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // For new match form
  const [creatorId, setCreatorId] = useState('');
  const [opponentId, setOpponentId] = useState('');
  const [creatorScore, setCreatorScore] = useState('');
  const [opponentScore, setOpponentScore] = useState('');
  const [matchType, setMatchType] = useState('21');
  const [error, setError] = useState('');

  const fetchMatches = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/matches/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setMatches(data);
    } catch (err) {
      console.error('Error fetching all matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo match? I punteggi verranno ricalcolati.')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/matches/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        fetchMatches();
        onUpdate();
      }
    } catch (err) {
      console.error('Error deleting match:', err);
    }
  };

  const handleAdminMatchSubmit = async (e) => {
    e.preventDefault();
    if (!creatorId || !opponentId || creatorScore === '' || opponentScore === '') {
      setError('Tutti i campi sono obbligatori.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/matches/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          creator_id: parseInt(creatorId),
          opponent_id: parseInt(opponentId),
          creator_score: parseInt(creatorScore),
          opponent_score: parseInt(opponentScore),
          match_type: matchType
        })
      });

      if (response.ok) {
        setCreatorId('');
        setOpponentId('');
        setCreatorScore('');
        setOpponentScore('');
        setError('');
        fetchMatches();
        onUpdate();
      } else {
        const data = await response.json();
        setError(data.error || 'Errore durante la creazione.');
      }
    } catch (err) {
      setError('Errore di connessione.');
    }
  };

  if (loading) return <div>Caricamento dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <section className="ranking-card">
        <h2>Inserimento Match Admin</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleAdminMatchSubmit} className="admin-match-form">
          <div className="form-row">
            <select value={creatorId} onChange={e => setCreatorId(e.target.value)} required>
              <option value="">Giocatore 1</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <span>VS</span>
            <select value={opponentId} onChange={e => setOpponentId(e.target.value)} required>
              <option value="">Giocatore 2</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-row">
            <input type="number" placeholder="Punti G1" value={creatorScore} onChange={e => setCreatorScore(e.target.value)} required />
            <input type="number" placeholder="Punti G2" value={opponentScore} onChange={e => setOpponentScore(e.target.value)} required />
            <select value={matchType} onChange={e => setMatchType(e.target.value)}>
              <option value="21">21 Pts</option>
              <option value="11">11 Pts</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Registra Match</button>
        </form>
      </section>

      <section className="ranking-card mt-2">
        <h2>Storico Tutti i Match</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Giocatori</th>
              <th>Risultato</th>
              <th>Tipo</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(m => (
              <tr key={m.id}>
                <td>{new Date(m.created_at).toLocaleDateString()}</td>
                <td>{m.creator_name} vs {m.opponent_name}</td>
                <td className="score">{m.creator_score} - {m.opponent_score}</td>
                <td>{m.match_type} pts</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(m.id)}>Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;
