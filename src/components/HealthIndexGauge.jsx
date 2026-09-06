import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

export const HealthIndexGauge = ({ healthAnalysis }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { finalScore, grade, subScores, totals, targets } = healthAnalysis;

  // SVG Gauge calculations
  const radius = 72;
  const strokeWidth = 13;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.70;
  const strokeDashoffset = arcLength - (arcLength * (finalScore / 100));

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Emerald Green
    if (score >= 60) return '#06b6d4'; // Cyan
    if (score >= 40) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
  };

  return (
    <div className="white-card white-card-hover" style={{ textAlign: 'center', position: 'relative' }}>
      
      {/* Header Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.04em', color: 'var(--text-purple-muted)', textTransform: 'uppercase' }}>
          Composite Health Index
        </span>
        <span className={`chip chip-${grade.color}`}>
          <ShieldCheck size={12} />
          {grade.label}
        </span>
      </div>

      {/* SVG Radial Gauge */}
      <div style={{ position: 'relative', width: '190px', height: '140px', margin: '0 auto' }}>
        <svg width="190" height="140" viewBox="0 0 190 140" style={{ maxWidth: '100%' }}>
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Arc */}
          <path
            d="M 22 128 A 72 72 0 1 1 168 128"
            fill="none"
            stroke="rgba(147, 51, 234, 0.08)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Progress Arc */}
          <path
            d="M 22 128 A 72 72 0 1 1 168 128"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            filter="url(#softGlow)"
          />
        </svg>

        {/* Center Score & Info */}
        <div style={{
          position: 'absolute',
          top: '48px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '38px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--text-main)', lineHeight: '1' }}>
            {finalScore}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: '700' }}>
            OUT OF 100
          </div>
        </div>
      </div>

      {/* Quick Summary Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{ background: 'var(--bg-card-subtle)', padding: '8px 4px', borderRadius: '12px' }}>
          <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)' }}>NET CALS</div>
          <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
            {totals.calories - totals.burnedCalories} <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '500' }}>kcal</span>
          </div>
        </div>
        <div style={{ background: 'var(--bg-card-subtle)', padding: '8px 4px', borderRadius: '12px' }}>
          <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)' }}>WORKOUT</div>
          <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-emerald)', marginTop: '2px' }}>
            {totals.exerciseMinutes} <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '500' }}>mins</span>
          </div>
        </div>
        <div style={{ background: 'var(--bg-card-subtle)', padding: '8px 4px', borderRadius: '12px' }}>
          <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)' }}>JUNK PENALTY</div>
          <div style={{ fontSize: '12px', fontWeight: '800', color: totals.junkItemCount > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)', marginTop: '2px' }}>
            {totals.junkItemCount > 0 ? `-${totals.junkItemCount * 18} pts` : 'Clean'}
          </div>
        </div>
      </div>

      {/* Toggle Sub-Scores Breakdown Button */}
      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="btn-subtle"
        style={{
          width: '100%',
          marginTop: '12px',
          justifyContent: 'center',
          padding: '6px 10px'
        }}
      >
        <span>{showBreakdown ? 'Hide Breakdown' : 'View Formula Sub-Scores'}</span>
        {showBreakdown ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {/* Sub-Scores Drawer */}
      {showBreakdown && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: 'var(--bg-card-subtle)',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
          textAlign: 'left',
          fontSize: '11px'
        }}>
          <div style={{ fontWeight: '800', marginBottom: '10px', color: 'var(--text-main)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            5-Factor Formula Breakdown
          </div>

          {[
            { label: 'Nutrient Balance (30%)', score: subScores.nutrientBalanceScore, detail: `${totals.protein}g protein, ${totals.fiber}g fiber` },
            { label: 'Clean Diet & Junk (25%)', score: subScores.junkPenaltyScore, detail: `${totals.junkItemCount} junk items, ${totals.sodium}mg sodium` },
            { label: 'Exercise Consistency (20%)', score: subScores.exerciseScore, detail: `${totals.burnedCalories} kcal burned (${totals.exerciseMinutes} mins)` },
            { label: 'Hydration Intake (15%)', score: subScores.hydrationScore, detail: `${totals.waterGlasses}/8 glasses logged` },
            { label: 'Calorie Target Trend (10%)', score: subScores.calorieTrendScore, detail: `Target: ${targets.targetCalories} kcal` }
          ].map((item, idx) => (
            <div key={idx} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)', fontWeight: '700', fontSize: '11px' }}>
                <span>{item.label}</span>
                <span style={{ fontWeight: '800', color: getScoreColor(item.score) }}>{item.score}/100</span>
              </div>
              <div style={{ height: '5px', background: 'rgba(147, 51, 234, 0.08)', borderRadius: '3px', margin: '3px 0 2px 0', overflow: 'hidden' }}>
                <div style={{ width: `${item.score}%`, height: '100%', background: getScoreColor(item.score), borderRadius: '3px', transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{item.detail}</div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
