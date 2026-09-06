import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, Flame, AlertCircle, Info, HeartPulse } from 'lucide-react';

export const HealthIndexGauge = ({ healthAnalysis }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { finalScore, grade, subScores, totals, targets } = healthAnalysis;

  // SVG Gauge calculations (semi-circle arc)
  const radius = 75;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.70;
  const strokeDashoffset = arcLength - (arcLength * (finalScore / 100));

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Emerald Green
    if (score >= 60) return '#06b6d4'; // Cyan
    if (score >= 40) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
  };

  const currentColor = getScoreColor(finalScore);

  return (
    <div className="white-card white-card-hover" style={{ textAlign: 'center', padding: '24px 20px', position: 'relative' }}>
      
      {/* Header Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em', color: 'var(--text-purple-muted)', textTransform: 'uppercase' }}>
          Composite Health Index
        </span>
        <span className={`chip chip-${grade.color}`}>
          <ShieldCheck size={14} />
          {grade.label}
        </span>
      </div>

      {/* SVG Radial Gauge */}
      <div style={{ position: 'relative', width: '200px', height: '150px', margin: '0 auto' }}>
        <svg width="200" height="150" viewBox="0 0 200 150">
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
            d="M 25 135 A 75 75 0 1 1 175 135"
            fill="none"
            stroke="rgba(147, 51, 234, 0.08)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Progress Arc */}
          <path
            d="M 25 135 A 75 75 0 1 1 175 135"
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
          top: '55px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '42px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--text-main)', lineHeight: '1' }}>
            {finalScore}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: '700' }}>
            OUT OF 100
          </div>
        </div>
      </div>

      {/* Quick Summary Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '8px',
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{ background: 'var(--bg-card-subtle)', padding: '10px', borderRadius: '14px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>NET CALORIES</div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
            {totals.calories - totals.burnedCalories} <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>kcal</span>
          </div>
        </div>
        <div style={{ background: 'var(--bg-card-subtle)', padding: '10px', borderRadius: '14px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>WORKOUT</div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-emerald)', marginTop: '2px' }}>
            {totals.exerciseMinutes} <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>mins</span>
          </div>
        </div>
        <div style={{ background: 'var(--bg-card-subtle)', padding: '10px', borderRadius: '14px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>JUNK PENALTY</div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: totals.junkItemCount > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)', marginTop: '2px' }}>
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
          marginTop: '16px',
          justifyContent: 'center'
        }}
      >
        <span>{showBreakdown ? 'Hide Formula Decomposition' : 'View Formula Sub-Scores'}</span>
        {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Sub-Scores Drawer */}
      {showBreakdown && (
        <div style={{
          marginTop: '14px',
          padding: '16px',
          background: 'var(--bg-card-subtle)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          textAlign: 'left',
          fontSize: '12px'
        }}>
          <div style={{ fontWeight: '800', marginBottom: '12px', color: 'var(--text-main)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            5-Factor Formula Breakdown
          </div>

          {[
            { label: 'Nutrient Balance (30%)', score: subScores.nutrientBalanceScore, detail: `${totals.protein}g protein, ${totals.fiber}g fiber` },
            { label: 'Clean Diet & Junk (25%)', score: subScores.junkPenaltyScore, detail: `${totals.junkItemCount} junk items, ${totals.sodium}mg sodium` },
            { label: 'Exercise Consistency (20%)', score: subScores.exerciseScore, detail: `${totals.burnedCalories} kcal burned (${totals.exerciseMinutes} mins)` },
            { label: 'Hydration Intake (15%)', score: subScores.hydrationScore, detail: `${totals.waterGlasses}/8 glasses logged` },
            { label: 'Calorie Target Trend (10%)', score: subScores.calorieTrendScore, detail: `Target: ${targets.targetCalories} kcal` }
          ].map((item, idx) => (
            <div key={idx} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)', fontWeight: '600', fontSize: '12px' }}>
                <span>{item.label}</span>
                <span style={{ fontWeight: '800', color: getScoreColor(item.score) }}>{item.score}/100</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(147, 51, 234, 0.08)', borderRadius: '3px', margin: '4px 0 2px 0', overflow: 'hidden' }}>
                <div style={{ width: `${item.score}%`, height: '100%', background: getScoreColor(item.score), borderRadius: '3px', transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.detail}</div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
