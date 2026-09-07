import React from 'react';
import { Sparkles } from 'lucide-react';

export const NutriAiFab = ({ onClick, healthScore = 75 }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 18px 10px 14px',
        borderRadius: '30px',
        background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 50%, #4c1d95 100%)',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 24px rgba(147, 51, 234, 0.45)',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(147, 51, 234, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(147, 51, 234, 0.45)';
      }}
    >
      <div style={{
        width: '26px',
        height: '26px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'pulse 2s infinite'
      }}>
        <Sparkles size={15} color="#ffffff" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
          Ask NutriAI
        </span>
        <span style={{ fontSize: '10px', color: '#c7d2fe', fontWeight: '700' }}>
          Score: {healthScore}/100
        </span>
      </div>
    </button>
  );
};
