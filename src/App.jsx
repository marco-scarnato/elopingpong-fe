import React, { useState, useEffect } from 'react'
import './Rankings.css'

function App() {
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    fetchData()
  }, [])

  if (loading) return <div className="container"><h1>Loading rankings...</h1></div>

  const players11 = [...players].sort((a, b) => b.score_11 - a.score_11)
  const players21 = [...players].sort((a, b) => b.score_21 - a.score_21)

  return (
    <div className="container">
      <header>
        <h1>ELOPINGPONG</h1>
        <p>The Ultimate Office Ranking Tracker</p>
      </header>

      <div className="rankings-grid">
        {/* Single 11 Points */}
        <section className="ranking-card">
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
              {players11.map((p, i) => (
                <tr key={p.id}>
                  <td><span className="rank-pill">{i + 1}</span></td>
                  <td>
                    <span className="player-name">{p.name}</span>
                    <span className="player-bu">{p.bu}</span>
                  </td>
                  <td className="score">{p.score_11}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Single 21 Points */}
        <section className="ranking-card">
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
              {players21.map((p, i) => (
                <tr key={p.id}>
                  <td><span className="rank-pill">{i + 1}</span></td>
                  <td>
                    <span className="player-name">{p.name}</span>
                    <span className="player-bu">{p.bu}</span>
                  </td>
                  <td className="score">{p.score_21}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Doubles 21 Points */}
        <section className="ranking-card">
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
              {teams.map((t, i) => (
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
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}

export default App
