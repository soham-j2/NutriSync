import React from 'react';
import { Sparkles } from 'lucide-react';

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
        gap: '10px',
        padding: '8px 16px 8px 10px',
        borderRadius: '30px',
        background: 'linear-gradient(135deg, #7C5CBF 0%, #9575CD 100%)',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 8px 24px rgba(124, 92, 191, 0.35), 0 2px 8px rgba(0, 0, 0, 0.04)',
        cursor: 'pointer',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
        e.currentTarget.style.boxShadow = '0 14px 32px rgba(124, 92, 191, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(124, 92, 191, 0.35), 0 2px 8px rgba(0, 0, 0, 0.04)';
      }}
    >
      {/* Animated AI Icon Container */}
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)'
      }}>
        <Sparkles size={16} color="#ffffff" />
        <span style={{
          position: 'absolute',
          top: '-1px',
          right: '-1px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#10b981',
          border: '1.5px solid #7C5CBF'
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textOverflow: 'ellipsis' }}>
        <span style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '-0.01em', lineHeight: '1.2' }}>
          NutriAI
        </span>
        <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: '700', letterSpacing: '0.01em' }}>
          Score: {healthScore}/100
        </span>
      </div>
    </button>
  );
};

