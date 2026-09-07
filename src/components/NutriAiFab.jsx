import React from 'react';

export const NutriAiFab = ({ onClick, healthScore = 75 }) => {
  return (
    <button
      onClick={onClick}
      id="nutri-ai-fab-btn"
      aria-label="Open NutriAI Health Assistant"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '20px',
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 18px 10px 10px',
        borderRadius: '30px',
        background: 'linear-gradient(135deg, #FF6B35 0%, #E85D25 100%)',
        color: '#ffffff',
        border: '1px solid rgba(255,255,255,0.3)',
        boxShadow: '0 8px 24px var(--accent-cta-glow)',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)';
        e.currentTarget.style.boxShadow = '0 14px 36px var(--accent-cta-glow)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 8px 24px var(--accent-cta-glow)';
      }}
    >
      {/* AI Logo instead of Sparkles */}
      <div style={{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.15)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src="/ai-logo.png"
          alt="NutriAI"
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.innerHTML = '🧠'; }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
          Ask NutriAI
        </span>
        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)', fontWeight: '700' }}>
          Score: {healthScore}/100
        </span>
      </div>
    </button>
  );
};
