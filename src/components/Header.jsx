import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import './Header.css';

const Header = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="header-nav">
        <div className="logo-container">
          <span className="logo-text">ELOPINGPONG</span>
        </div>

        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'singles11' ? 'active' : ''}`}
            onClick={() => onTabChange('singles11')}
          >
            Singles (11)
          </button>
          <button 
            className={`tab-btn ${activeTab === 'singles21' ? 'active' : ''}`}
            onClick={() => onTabChange('singles21')}
          >
            Singles (21)
          </button>
          <button 
            className={`tab-btn ${activeTab === 'doubles' ? 'active' : ''}`}
            onClick={() => onTabChange('doubles')}
          >
            Doubles
          </button>
          
          {user?.role === 'admin' && (
            <button 
              className={`tab-btn admin-link ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => onTabChange('admin')}
            >
              🛠 Admin
            </button>
          )}
        </div>

        <div className="user-section">
          {user ? (
            <div className="profile-badge">
              <span className="user-name">{user.name}</span>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
          ) : (
            <button className="profile-btn" onClick={() => setIsModalOpen(true)}>
              <span className="icon">👤</span> Profile
            </button>
          )}
        </div>
      </nav>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;
