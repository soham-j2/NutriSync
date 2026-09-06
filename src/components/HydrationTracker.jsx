import React from 'react';
import { Droplet, Plus, Minus } from 'lucide-react';

export const HydrationTracker = ({ waterGlasses, onUpdateWater, targetGlasses = 8 }) => {
  const pct = Math.min(Math.round((waterGlasses / targetGlasses) * 100), 100);
  const displayCount = Math.max(targetGlasses, waterGlasses);

  return (
    <div className="white-card white-card-hover" style={{ padding: '16px' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--accent-cyan-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
            <Droplet size={18} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>Hydration Tracker</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Target: {targetGlasses} glasses (2.0 L)</div>
          </div>
        </div>

        <span className="chip chip-cyan" style={{ fontSize: '11px', fontWeight: '800' }}>
          {waterGlasses}/{targetGlasses} ({waterGlasses * 250}ml)
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '7px', background: 'rgba(147, 51, 234, 0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)', borderRadius: '4px', transition: 'width 0.4s ease' }} />
      </div>

      {/* Glass Icons & Quick Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {Array.from({ length: displayCount }).map((_, idx) => (
            <Droplet 
              key={idx} 
              size={18} 
              color={idx < waterGlasses ? '#06b6d4' : '#cbd5e1'}
              fill={idx < waterGlasses ? '#06b6d4' : 'transparent'}
            />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <button 
            className="btn-subtle" 
            style={{ padding: '5px 12px', borderRadius: 'var(--radius-full)' }}
            onClick={() => onUpdateWater(Math.max(0, waterGlasses - 1))}
          >
            <Minus size={13} />
          </button>
          <button 
            className="btn-purple" 
            style={{ padding: '5px 16px', fontSize: '11px', borderRadius: 'var(--radius-full)' }}
            onClick={() => onUpdateWater(waterGlasses + 1)}
          >
            <Plus size={13} />
            <span>+250ml</span>
          </button>
        </div>
      </div>

    </div>
  );
};
