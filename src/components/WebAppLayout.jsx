import React from 'react';
import { LayoutDashboard, UtensilsCrossed, Activity, TrendingUp, User, FileText } from 'lucide-react';

export const WebAppLayout = ({ 
  activeTab, 
  setActiveTab, 
  children, 
  userProfile,
  onOpenProfileModal,
  onOpenAiAssistant
}) => {
  return (
    <div style={{ minHeight: '100vh' }}>
      
      {/* Sticky Glass Navbar */}
      <header className="web-navbar">
        <div className="web-navbar-inner">
          
          {/* Top Row for Mobile & Desktop (Logo + Action Buttons) */}
          <div className="nav-top-row">
            {/* Logo & App Name NutriLoop */}
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} 
              onClick={() => setActiveTab('dashboard')}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: '0 6px 18px var(--primary-glow)',
                padding: '3px'
              }}>
                <img 
                  src="/logo.png" 
                  alt="NutriLoop Logo" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '10px' }} 
                />
              </div>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                  NutriLoop
                </h1>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-purple-muted)', display: 'block', marginTop: '-2px' }}>
                  Daily Health Index
                </span>
              </div>
            </div>

            {/* Right Action Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

              {/* Profile Biometrics Button */}
              <button 
                onClick={onOpenProfileModal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '40px',
                  padding: '0 16px 0 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '700',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--primary-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <User size={14} />
                </div>
                <span>Profile</span>
              </button>

            </div>
          </div>





          {/* Navigation Tab Pills */}
          <nav className="web-nav-tabs">
            <button 
              className={`web-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={15} />
              <span>Overview</span>
            </button>

            <button 
              className={`web-tab-btn ${activeTab === 'meals' ? 'active' : ''}`}
              onClick={() => setActiveTab('meals')}
            >
              <UtensilsCrossed size={15} />
              <span>Meal Log</span>
            </button>

            <button 
              className={`web-tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <Activity size={15} />
              <span>Workout</span>
            </button>

            <button 
              className={`web-tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              <FileText size={15} />
              <span>Summary</span>
            </button>

            <button 
              className={`web-tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
              onClick={() => setActiveTab('trends')}
            >
              <TrendingUp size={15} />
              <span>Trends</span>
            </button>
          </nav>

        </div>
      </header>

      {/* Main Page Container */}
      <main className="web-app-container">
        {children}
      </main>

    </div>
  );
};
