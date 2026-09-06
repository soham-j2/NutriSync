import React, { useState } from 'react';
import { LayoutDashboard, UtensilsCrossed, Activity, TrendingUp, User, Sparkles, ChevronDown } from 'lucide-react';
import { DEMO_PRESETS } from '../data/ifctFoodDatabase';

export const WebAppLayout = ({ 
  activeTab, 
  setActiveTab, 
  children, 
  onLoadPreset,
  userProfile,
  onOpenProfileModal
}) => {
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);

  return (
    <div style={{ minHeight: '100vh' }}>
      
      {/* Sticky Glass Navbar */}
      <header className="web-navbar">
        <div className="web-navbar-inner">
          
          {/* Top Row for Mobile (Logo + Action Buttons) */}
          <div className="nav-top-row">
            {/* Logo & App Name NutriSync */}
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
                  alt="NutriSync Logo" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '10px' }} 
                />
              </div>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                  NutriSync
                </h1>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-purple-muted)', display: 'block', marginTop: '-2px' }}>
                  Daily Health Index
                </span>
              </div>
            </div>

            {/* Right Action Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              
              {/* Demo Preset Dropdown */}
              <div style={{ position: 'relative' }}>
                <button 
                  className="btn-subtle"
                  style={{ padding: '6px 12px', fontSize: '11px' }}
                  onClick={() => setShowPresetDropdown(!showPresetDropdown)}
                >
                  <Sparkles size={13} color="var(--primary-purple)" />
                  <span>Demo Presets</span>
                  <ChevronDown size={13} />
                </button>

                {showPresetDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '115%',
                    right: 0,
                    width: '250px',
                    background: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '18px',
                    padding: '10px',
                    boxShadow: '0 20px 40px -5px rgba(147, 51, 234, 0.25)',
                    zIndex: 100
                  }}>
                    <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-purple-muted)', padding: '4px 8px', letterSpacing: '0.04em' }}>
                      TEST DAY SCENARIOS
                    </div>
                    {Object.entries(DEMO_PRESETS).map(([key, preset]) => (
                      <button
                        key={key}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-main)',
                          fontSize: '12px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-card-subtle)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        onClick={() => {
                          onLoadPreset(preset);
                          setShowPresetDropdown(false);
                        }}
                      >
                        <span style={{ fontWeight: '700', color: 'var(--primary-purple)' }}>{preset.label}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{preset.description}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile Biometrics Button */}
              <button 
                onClick={onOpenProfileModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px 6px 6px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '700'
                }}
              >
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <User size={13} />
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
