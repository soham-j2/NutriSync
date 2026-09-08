import React, { useState } from 'react';
import { LayoutDashboard, UtensilsCrossed, Activity, TrendingUp, User, Sparkles, Wifi, Battery, Signal, FileText } from 'lucide-react';
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
          background: 'rgba(255, 255, 255, 0.97)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(124, 92, 191, 0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 2px 12px rgba(124, 92, 191, 0.08)'
        }}>
          {/* Logo & App Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7C5CBF 0%, #AB8FD8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(124, 92, 191, 0.35)'
            }}>
              <Sparkles size={18} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, background: 'linear-gradient(90deg, #2D1B69, #7C5CBF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                NutriLoop
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
                style={{ padding: '6px 10px', fontSize: '11px', borderRadius: '20px', borderColor: 'var(--primary-purple)', color: 'var(--primary-purple)' }}
                onClick={() => setShowPresetDropdown(!showPresetDropdown)}
              >
                <Sparkles size={12} color="var(--primary-purple)" />
                <span>Demo Preset</span>
              </button>

              {showPresetDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '230px',
                  background: '#ffffff',
                  border: '1px solid rgba(124, 92, 191, 0.15)',
                  borderRadius: '14px',
                  padding: '8px',
                  boxShadow: '0 12px 30px rgba(124, 92, 191, 0.18)',
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
                        color: 'var(--text-main)',
                        fontSize: '12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(124, 92, 191, 0.10)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      onClick={() => {
                        onLoadPreset(preset);
                        setShowPresetDropdown(false);
                      }}
                    >
                      <span style={{ fontWeight: '600', color: 'var(--primary-purple)' }}>{preset.label}</span>
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
                background: 'rgba(124, 92, 191, 0.10)',
                border: '1px solid rgba(124, 92, 191, 0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-purple)',
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
            className={`nav-tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <div className="nav-icon-wrapper">
              <FileText size={20} />
            </div>
            <span>Summary</span>
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
