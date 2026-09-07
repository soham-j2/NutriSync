import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, Flame, Activity, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export const HealthIndexGauge = ({ healthAnalysis }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { finalScore, grade, subScores, totals, targets } = healthAnalysis;

  // SVG Gauge calculations (Semi-circle Arc)
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Half circumference
  const strokeDashoffset = circumference - (circumference * (Math.min(finalScore, 100) / 100));

  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981'; // Emerald Green
    if (score >= 70) return '#06b6d4'; // Cyan
    if (score >= 50) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
  };

  const scoreColor = getScoreColor(finalScore);

  return (
    <div className="white-card white-card-hover" style={{
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #ffffff 0%, #fcfaff 100%)',
      border: '1px solid var(--border-subtle)'
    }}>
      
      {/* Top Badge Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="var(--primary-purple)" />
          <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.04em', color: 'var(--text-purple-muted)', textTransform: 'uppercase' }}>
            Composite Health Index
          </span>
        </div>
        <span className={`chip chip-${grade.color}`} style={{ padding: '4px 10px', fontSize: '11px', fontWeight: '800' }}>
          <ShieldCheck size={13} />
          {grade.label}
        </span>
      </div>

      {/* SVG Radial Semi-Circle Arc Gauge */}
      <div style={{ position: 'relative', width: '220px', height: '125px', margin: '8px auto 0 auto' }}>
        <svg width="220" height="125" viewBox="0 0 220 125" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="scoreArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="65%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track Arc */}
          <path
            d="M 20 115 A 80 80 0 0 1 200 115"
            fill="none"
            stroke="rgba(147, 51, 234, 0.08)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Filled Glow Arc */}
          <path
            d="M 20 115 A 80 80 0 0 1 200 115"
            fill="none"
            stroke="url(#scoreArcGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            filter="url(#neonGlow)"
          />
        </svg>

        {/* Center Display: Score Number & Label */}
        <div style={{
          position: 'absolute',
          top: '36px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          width: '100%'
        }}>
          <div style={{
            fontSize: '44px',
            fontWeight: '800',
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-main)',
            lineHeight: '1',
            letterSpacing: '-0.03em'
          }}>
            {finalScore}
            <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-muted)', marginLeft: '2px' }}>/100</span>
          </div>

          <div style={{
            fontSize: '11px',
            fontWeight: '800',
            color: scoreColor,
            marginTop: '4px',
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}>
            {finalScore >= 85 ? 'Stellar Health Balance' : finalScore >= 70 ? 'Solid Daily Score' : finalScore >= 50 ? 'Moderate Progress' : 'Action Required'}
          </div>
        </div>
      </div>

      {/* 3 Quick Indicator Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        marginTop: '14px',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{ background: 'var(--bg-card-subtle)', padding: '8px 6px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>NET INTENDED</div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
            {totals.calories - totals.burnedCalories} <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>kcal</span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card-subtle)', padding: '8px 6px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>WORKOUT</div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent-emerald)', marginTop: '2px' }}>
            {totals.exerciseMinutes} <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>mins</span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card-subtle)', padding: '8px 6px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>DIET CLEANLINESS</div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: totals.junkItemCount > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)', marginTop: '2px' }}>
            {totals.junkItemCount > 0 ? `-${totals.junkItemCount * 18} pts` : '100% Clean'}
          </div>
        </div>
      </div>

      {/* Breakdown Toggle Button */}
      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="btn-subtle"
        style={{
          width: '100%',
          marginTop: '12px',
          justifyContent: 'center',
          padding: '8px 12px',
          borderRadius: '12px'
        }}
      >
        <span>{showBreakdown ? 'Hide 5-Factor Formula Breakdown' : 'View 5-Factor Formula Breakdown'}</span>
        {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Animated 5-Factor Sub-Scores Drawer */}
      {showBreakdown && (
        <div style={{
          marginTop: '12px',
          padding: '14px',
          background: 'var(--bg-card-subtle)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          textAlign: 'left',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{ fontWeight: '800', marginBottom: '12px', color: 'var(--text-main)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Algorithm Factor Weights</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>Weighted Average</span>
          </div>

          {[
            { label: 'Nutrient & Protein (30%)', score: subScores.nutrientBalanceScore, detail: `${totals.protein}g / ${targets.targetProtein}g protein, ${totals.fiber}g fiber` },
            { label: 'Clean Food & Junk Penalty (25%)', score: subScores.junkPenaltyScore, detail: `${totals.junkItemCount} junk foods logged (${totals.sodium}mg sodium)` },
            { label: 'Exercise & Movement (20%)', score: subScores.exerciseScore, detail: `${totals.burnedCalories} kcal burned (${totals.exerciseMinutes} mins active)` },
            { label: 'Hydration Level (15%)', score: subScores.hydrationScore, detail: `${totals.waterGlasses}/${targets.targetWaterGlasses} water glasses` },
            { label: 'Calorie Target Trend (10%)', score: subScores.calorieTrendScore, detail: `${totals.calories}/${targets.targetCalories} kcal budget` }
          ].map((item, idx) => (
            <div key={idx} style={{ marginBottom: '10px', background: '#ffffff', padding: '8px 10px', borderRadius: '10px', border: '1px solid rgba(147, 51, 234, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)', fontWeight: '700', fontSize: '12px' }}>
                <span>{item.label}</span>
                <span style={{ fontWeight: '800', color: getScoreColor(item.score) }}>{item.score}/100</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(147, 51, 234, 0.08)', borderRadius: '3px', margin: '5px 0 4px 0', overflow: 'hidden' }}>
                <div style={{ width: `${item.score}%`, height: '100%', background: getScoreColor(item.score), borderRadius: '3px', transition: 'width 0.5s ease-out' }} />
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '500' }}>{item.detail}</div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
