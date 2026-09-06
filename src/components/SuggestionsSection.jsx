import React from 'react';
import { Lightbulb, AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const SuggestionsSection = ({ suggestions = [] }) => {
  if (!suggestions || suggestions.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'danger': return <AlertTriangle size={18} color="var(--accent-rose)" />;
      case 'warning': return <AlertCircle size={18} color="var(--accent-amber)" />;
      case 'success': return <CheckCircle size={18} color="var(--accent-emerald)" />;
      default: return <Info size={18} color="var(--accent-cyan)" />;
    }
  };

  const getCardStyle = (type) => {
    switch (type) {
      case 'danger': return { border: '1px solid rgba(244, 63, 94, 0.25)', bg: '#fff5f5' };
      case 'warning': return { border: '1px solid rgba(245, 158, 11, 0.25)', bg: '#fffbeb' };
      case 'success': return { border: '1px solid rgba(16, 185, 129, 0.25)', bg: '#f0fdf4' };
      default: return { border: '1px solid rgba(6, 182, 212, 0.25)', bg: '#ecfeff' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Lightbulb size={18} color="var(--primary-purple)" />
        <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
          Actionable Health Recommendations
        </span>
      </div>

      {suggestions.map((item, idx) => {
        const style = getCardStyle(item.type);
        return (
          <div
            key={idx}
            style={{
              padding: '14px 16px',
              borderRadius: '16px',
              background: style.bg,
              border: style.border,
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ marginTop: '2px' }}>{getIcon(item.type)}</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.4' }}>
                {item.message}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
