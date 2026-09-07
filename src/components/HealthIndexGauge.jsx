import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, Sparkles, Flame, Activity, Droplets, Target, ShieldAlert } from 'lucide-react';

export const HealthIndexGauge = ({ healthAnalysis }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { finalScore, grade, subScores, totals, targets } = healthAnalysis;

  // SVG Gauge calculations (220deg arc)
  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const arcPercentage = 0.72; // 72% arc
  const arcLength = circumference * arcPercentage;
  const strokeDashoffset = arcLength - (arcLength * (Math.min(100, Math.max(0, finalScore)) / 100));

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Emerald Green
    if (score >= 65) return '#06b6d4'; // Cyan
    if (score >= 50) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
  };

  const scoreColor = getScoreColor(finalScore);

  return (
    <div 
      className="white-card white-card-hover" 
      style={{ 
        position: 'relative', 
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #ffffff 0%, #fcfaff 100%)',
        border: '1px solid var(--border-subtle)'
      }}
    >
      {/* Background Decorative Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${scoreColor}22 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      {/* Top Title & Badge Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: scoreColor,
            boxShadow: `0 0 10px ${scoreColor}`
          }} />
          <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em', color: 'var(--text-main)', textTransform: 'uppercase' }}>
            Composite Health Index
          </span>
        </div>
        <span 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '800',
            background: `${scoreColor}15`,
            color: scoreColor,
            border: `1px solid ${scoreColor}30`
          }}
        >
          <ShieldCheck size={13} />
          {grade.label}
        </span>
      </div>

      {/* SVG Radial Gauge Ring */}
      <div style={{ position: 'relative', width: '220px', height: '160px', margin: '0 auto' }}>
        <svg width="220" height="160" viewBox="0 0 220 160" style={{ maxWidth: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="gaugeGradientDynamic" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Track Arc Background */}
          <path
            d="M 28 145 A 80 80 0 1 1 192 145"
            fill="none"
            stroke="rgba(147, 51, 234, 0.08)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Colored Progress Arc */}
          <path
            d="M 28 145 A 80 80 0 1 1 192 145"
            fill="none"
            stroke="url(#gaugeGradientDynamic)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            filter="url(#gaugeGlow)"
          />
        </svg>

        {/* Inner Counter Content */}
        <div style={{
          position: 'absolute',
          top: '52px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          width: '100%'
        }}>
          <div style={{
            fontSize: '44px',
            fontWeight: '900',
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-main)',
            lineHeight: '0.95',
            letterSpacing: '-0.04em'
          }}>
            {finalScore}
          </div>
          <div style={{
            fontSize: '11px',
            fontWeight: '800',
            color: 'var(--text-muted)',
            marginTop: '4px',
            letterSpacing: '0.06em'
          }}>
            OUT OF 100
          </div>
        </div>
      </div>

      {/* 3 Metric Mini Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        marginTop: '8px',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          background: 'var(--bg-card-subtle)',
          padding: '10px 6px',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Net Energy
          </div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
            {totals.calories - totals.burnedCalories} <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>kcal</span>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card-subtle)',
          padding: '10px 6px',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Exercise
          </div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#06b6d4', marginTop: '2px' }}>
            {totals.exerciseMinutes} <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>mins</span>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card-subtle)',
          padding: '10px 6px',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Junk Item
          </div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: totals.junkItemCount > 0 ? '#f43f5e' : '#10b981', marginTop: '2px' }}>
            {totals.junkItemCount > 0 ? `-${totals.junkItemCount * 18} pts` : 'Clean ✨'}
          </div>
        </div>
      </div>

      {/* Expand/Collapse 5-Factor Formula Drawer Button */}
      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        style={{
          width: '100%',
          marginTop: '12px',
          padding: '8px 12px',
          borderRadius: '12px',
          background: 'rgba(147, 51, 234, 0.06)',
          border: '1px solid rgba(147, 51, 234, 0.15)',
          color: 'var(--primary-purple)',
          fontSize: '12px',
          fontWeight: '700',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          transition: 'all 0.2s ease'
        }}
      >
        <span>{showBreakdown ? 'Hide Formula Factors' : 'View 5-Factor Score Breakdown'}</span>
        {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Detailed Sub-Scores Breakdown Card */}
      {showBreakdown && (
        <div style={{
          marginTop: '12px',
          padding: '14px',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          textAlign: 'left',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Formula Weight Matrix
            </span>
            <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>
              Max: 100 pts
            </span>
          </div>

          {[
            { label: 'Nutrient Balance (30%)', score: subScores.nutrientBalanceScore, detail: `${totals.protein}g protein | ${totals.fiber}g fiber` },
            { label: 'Clean Diet & Junk (25%)', score: subScores.junkPenaltyScore, detail: `${totals.junkItemCount} junk food items logged` },
            { label: 'Exercise Consistency (20%)', score: subScores.exerciseScore, detail: `${totals.burnedCalories} kcal burned (${totals.exerciseMinutes} mins active)` },
            { label: 'Hydration Intake (15%)', score: subScores.hydrationScore, detail: `${totals.waterGlasses}/${targets.targetWaterGlasses} glasses logged` },
            { label: 'Calorie Target Trend (10%)', score: subScores.calorieTrendScore, detail: `Intake: ${totals.calories} / Target: ${targets.targetCalories} kcal` }
          ].map((item, idx) => {
            const itemColor = getScoreColor(item.score);
            return (
              <div key={idx} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: itemColor }}>
                    {item.score}/100
                  </span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-card-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.score}%`, height: '100%', background: itemColor, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {item.detail}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
