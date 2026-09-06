import React from 'react';
import { Droplet, Plus, Minus } from 'lucide-react';

export const HydrationTracker = ({ waterGlasses, onUpdateWater, targetGlasses = 8 }) => {
  const pct = Math.min(Math.round((waterGlasses / targetGlasses) * 100), 100);

  return (
    <div className="white-card white-card-hover" style={{ padding: '18px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--accent-cyan-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
            <Droplet size={20} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>Hydration Tracker</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target: {targetGlasses} glasses (2.0 L)</div>
          </div>
        </div>

        <span className="chip chip-cyan" style={{ fontSize: '12px', fontWeight: '800' }}>
          {waterGlasses} / {targetGlasses} Glasses ({waterGlasses * 250} ml)
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '8px', background: 'rgba(147, 51, 234, 0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)', borderRadius: '4px', transition: 'width 0.4s ease' }} />
      </div>

      {/* Glass Icons & Quick Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {Array.from({ length: targetGlasses }).map((_, idx) => (
            <Droplet 
              key={idx} 
              size={20} 
              color={idx < waterGlasses ? '#06b6d4' : '#cbd5e1'}
              fill={idx < waterGlasses ? '#06b6d4' : 'transparent'}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn-subtle" 
            style={{ padding: '6px 12px', borderRadius: 'var(--radius-full)' }}
            onClick={() => onUpdateWater(Math.max(0, waterGlasses - 1))}
          >
            <Minus size={14} />
          </button>
          <button 
            className="btn-purple" 
            style={{ padding: '6px 16px', fontSize: '12px', borderRadius: 'var(--radius-full)' }}
            onClick={() => onUpdateWater(waterGlasses + 1)}
          >
            <Plus size={14} />
            <span>+250ml</span>
          </button>
        </div>
      </div>

    </div>
  );
};
