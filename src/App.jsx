import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import MatchModal from './components/MatchModal'
import AdminDashboard from './components/AdminDashboard'
import { useAuth } from './context/AuthContext'
import './Rankings.css'

function App() {
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('singles21')
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false)
  const { user } = useAuth()

  const fetchData = async () => {
    try {
      const [playersRes, teamsRes] = await Promise.all([
        fetch('http://localhost:3000/api/players'),
        fetch('http://localhost:3000/api/teams')
      ])
      const playersData = await playersRes.json()
      const teamsData = await teamsRes.json()
      setPlayers(playersData)
      setTeams(teamsData)
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <div className="container" style={{display:'flex', justifyContent:'center', alignItems:'center', height:'80vh'}}><h1>Loading rankings...</h1></div>

  const players11 = [...players].sort((a, b) => b.score_11 - a.score_11)
  const players21 = [...players].sort((a, b) => b.score_21 - a.score_21)

  return (
    <div className="app-wrapper">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="container">
        {user && activeTab !== 'admin' && (
          <div className="actions-header" style={{display:'flex', gap:'1rem', marginBottom:'1.5rem', alignItems:'center', justifyContent: 'space-between'}}>
            <h1 style={{margin: 0}}>Classifica</h1>
            <button 
              onClick={() => setIsMatchModalOpen(true)}
              style={{
                background:'var(--accent-orange)', 
                color:'white', 
                border:'none', 
                padding:'0.8rem 1.5rem', 
                borderRadius:'8px', 
                fontWeight:'bold', 
                cursor:'pointer',
                boxShadow: '0 4px 15px rgba(255, 107, 0, 0.3)'
              }}
            >
              + Aggiungi Match
            </button>
          </div>
        )}

        <div className="tab-content">
          {activeTab === 'singles11' && (
            <section className="ranking-card full-width">
              <h2>Singles (11 pts)</h2>
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>ELO</th>
                  </tr>
                </thead>
                <tbody>
                  {players11.length > 0 ? players11.map((p, i) => (
                    <tr key={p.id}>
                      <td><span className="rank-pill">{i + 1}</span></td>
                      <td>
                        <span className="player-name">{p.name} {p.id === user?.id && <span style={{fontSize: '0.7rem', background: '#333', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px'}}>TU</span>}</span>
                        <span className="player-bu">{p.bu}</span>
                      </td>
                      <td className="score">{p.score_11}</td>
                    </tr>
                  )) : <tr><td colSpan="3" style={{textAlign:'center'}}>No players registered yet</td></tr>}
                </tbody>
              </table>
            </section>
          )}

          {activeTab === 'singles21' && (
            <section className="ranking-card full-width">
              <h2>Singles (21 pts)</h2>
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>ELO</th>
                  </tr>
                </thead>
                <tbody>
                  {players21.length > 0 ? players21.map((p, i) => (
                    <tr key={p.id}>
                      <td><span className="rank-pill">{i + 1}</span></td>
                      <td>
                        <span className="player-name">{p.name} {p.id === user?.id && <span style={{fontSize: '0.7rem', background: '#333', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px'}}>TU</span>}</span>
                        <span className="player-bu">{p.bu}</span>
                      </td>
                      <td className="score">{p.score_21}</td>
                    </tr>
                  )) : <tr><td colSpan="3" style={{textAlign:'center'}}>No players registered yet</td></tr>}
                </tbody>
              </table>
            </section>
          )}

          {activeTab === 'doubles' && (
            <section className="ranking-card full-width">
              <h2>Doubles (21 pts)</h2>
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team</th>
                    <th>ELO</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.length > 0 ? teams.map((t, i) => (
                    <tr key={t.id}>
                      <td><span className="rank-pill">{i + 1}</span></td>
                      <td>
                        <div className="player-name">{t.team_name}</div>
                        <div style={{fontSize: '0.75rem', color: 'var(--text-dim)'}}>
                          {t.p1_name} & {t.p2_name}
                        </div>
                      </td>
                      <td className="score">{t.score_21}</td>
                    </tr>
                  )) : <tr><td colSpan="3" style={{textAlign:'center'}}>No teams recorded yet</td></tr>}
                </tbody>
              </table>
            </section>
          )}

          {activeTab === 'admin' && user?.role === 'admin' && (
            <AdminDashboard players={players} onUpdate={fetchData} />
          )}
        </div>
      </div>

      <MatchModal 
        isOpen={isMatchModalOpen} 
        onClose={() => setIsMatchModalOpen(false)} 
        players={players}
        onMatchAdded={fetchData}
      />
    </div>
  )
}

export default App
