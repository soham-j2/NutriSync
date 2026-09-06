import React, { useState } from 'react';
import { LayoutDashboard, UtensilsCrossed, Activity, TrendingUp, User, Sparkles, Wifi, Battery, Signal } from 'lucide-react';
import { DEMO_PRESETS } from '../data/ifctFoodDatabase';

export const MobileContainer = ({ 
  activeTab, 
  setActiveTab, 
  children, 
  onLoadPreset,
  userProfile,
  onOpenProfileModal
}) => {
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="app-viewport-wrapper">
      <div className="mobile-phone-frame">
        
        {/* Phone Bezel Top Status Bar */}
        <div className="phone-status-bar">
          <span>{currentTime}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Signal size={12} />
            <Wifi size={12} />
            <Battery size={14} />
          </div>
        </div>

        {/* Top Header Bar */}
        <div style={{
          padding: '12px 18px',
          background: 'rgba(18, 24, 33, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          {/* Logo & App Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)'
            }}>
              <Sparkles size={18} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, background: 'linear-gradient(90deg, #ffffff, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                NutriVista
              </h1>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '-3px' }}>
                Indian Health Index
              </span>
            </div>
          </div>

          {/* Quick Demo Switcher & Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Demo Scenario Button */}
            <div style={{ position: 'relative' }}>
              <button 
                className="btn-secondary"
                style={{ padding: '6px 10px', fontSize: '11px', borderRadius: '20px', borderColor: 'var(--primary-emerald)' }}
                onClick={() => setShowPresetDropdown(!showPresetDropdown)}
              >
                <Sparkles size={12} color="var(--primary-emerald)" />
                <span>Demo Preset</span>
              </button>

              {showPresetDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '230px',
                  background: '#131922',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '14px',
                  padding: '8px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.7)',
                  zIndex: 100
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', padding: '4px 8px' }}>
                    LOAD TEST SCENARIOS
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
                        color: '#fff',
                        fontSize: '12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      onClick={() => {
                        onLoadPreset(preset);
                        setShowPresetDropdown(false);
                      }}
                    >
                      <span style={{ fontWeight: '600', color: 'var(--primary-emerald)' }}>{preset.label}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{preset.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Avatar Button */}
            <button 
              onClick={onOpenProfileModal}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              <User size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Main Screen Content */}
        <div className="phone-screen-content">
          {children}
        </div>

        {/* Mobile Floating Bottom Navigation */}
        <nav className="bottom-nav-bar">
          <button 
            className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="nav-icon-wrapper">
              <LayoutDashboard size={20} />
            </div>
            <span>Overview</span>
          </button>

          <button 
            className={`nav-tab-btn ${activeTab === 'meals' ? 'active' : ''}`}
            onClick={() => setActiveTab('meals')}
          >
            <div className="nav-icon-wrapper">
              <UtensilsCrossed size={20} />
            </div>
            <span>Meal Log</span>
          </button>

          <button 
            className={`nav-tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <div className="nav-icon-wrapper">
              <Activity size={20} />
            </div>
            <span>Workout</span>
          </button>

          <button 
            className={`nav-tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            <div className="nav-icon-wrapper">
              <TrendingUp size={20} />
            </div>
            <span>Trends</span>
          </button>

          <button 
            className={`nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={onOpenProfileModal}
          >
            <div className="nav-icon-wrapper">
              <User size={20} />
            </div>
            <span>Profile</span>
          </button>
        </nav>

      </div>
    </div>
  );
};
