import React, { useState } from 'react';
import { Activity, Plus, Trash2, Zap, Flame, Clock, X, Footprints, Bike, Dumbbell, Sun, Trophy, MapPin } from 'lucide-react';
import { EXERCISE_ACTIVITIES } from '../data/ifctFoodDatabase';
import { calculateActivityBurn } from '../utils/healthCalculators';

export const ActivityLogger = ({ loggedActivities, onAddActivity, onDeleteActivity, weightKg = 68 }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(EXERCISE_ACTIVITIES[0].id);
  const [duration, setDuration] = useState(30);

  const selectedDef = EXERCISE_ACTIVITIES.find(a => a.id === selectedActivityId) || EXERCISE_ACTIVITIES[0];
  const predictedBurn = calculateActivityBurn(selectedDef.met, duration, weightKg);

  const handleAdd = () => {
    onAddActivity({
      activityId: selectedActivityId,
      duration: Number(duration),
      burnedCalories: predictedBurn,
      timestamp: new Date().toISOString()
    });
    setShowModal(false);
  };

  const totalBurn = loggedActivities.reduce((acc, a) => {
    const def = EXERCISE_ACTIVITIES.find(d => d.id === a.activityId);
    return acc + calculateActivityBurn(def ? def.met : 3.8, a.duration, weightKg);
  }, 0);

  const totalMinutes = loggedActivities.reduce((acc, a) => acc + Number(a.duration), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Physical Workouts
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            MET-Formula Daily Calorie Expenditure
          </span>
        </div>
        <button 
          className="btn-purple" 
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} />
          <span>Log Workout</span>
        </button>
      </div>

      {/* Summary Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="white-card white-card-hover" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--accent-amber-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-amber)' }}>
            <Flame size={24} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>CALORIES BURNED</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>
              {totalBurn} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>kcal</span>
            </div>
          </div>
        </div>

        <div className="white-card white-card-hover" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--accent-cyan-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>ACTIVE DURATION</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>
              {totalMinutes} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logged Workouts Container */}
      <div className="white-card" style={{ padding: '20px' }}>
        <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '14px' }}>
          Today's Active Sessions
        </div>

        {loggedActivities.length === 0 ? (
          <div 
            onClick={() => setShowModal(true)}
            style={{
              border: '2px dashed var(--border-subtle)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '13px',
              cursor: 'pointer',
              background: 'var(--bg-card-subtle)'
            }}
          >
            No workouts logged today. Tap + to add walking, gym, or sports!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loggedActivities.map((act, idx) => {
              const def = EXERCISE_ACTIVITIES.find(a => a.id === act.activityId) || EXERCISE_ACTIVITIES[0];
              const burn = calculateActivityBurn(def.met, act.duration, weightKg);

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--bg-card-subtle)',
                    borderRadius: '14px',
                    padding: '12px 16px',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-purple)' }}>
                      <Activity size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>{def.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {act.duration} mins • MET {def.met}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-emerald)' }}>
                      +{burn} kcal
                    </div>
                    <button
                      onClick={() => onDeleteActivity(act)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Log Activity Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Log Exercise Session
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Select activity & duration</span>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            {/* Exercise Type Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '18px' }}>
              {EXERCISE_ACTIVITIES.map(act => (
                <button
                  key={act.id}
                  onClick={() => setSelectedActivityId(act.id)}
                  style={{
                    padding: '12px',
                    borderRadius: '14px',
                    border: selectedActivityId === act.id ? '2px solid var(--primary-purple)' : '1px solid var(--border-subtle)',
                    background: selectedActivityId === act.id ? 'var(--bg-card-subtle)' : '#ffffff',
                    color: selectedActivityId === act.id ? 'var(--primary-purple)' : 'var(--text-main)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}
                >
                  <div style={{ fontSize: '13px' }}>{act.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    MET {act.met}
                  </div>
                </button>
              ))}
            </div>

            {/* Duration Slider */}
            <div style={{ marginBottom: '20px', background: 'var(--bg-card-subtle)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                <span>Duration: {duration} mins</span>
                <span style={{ color: 'var(--primary-purple)' }}>Est. Burn: {predictedBurn} kcal</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--primary-purple)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>5m</span>
                <span>30m</span>
                <span>60m</span>
                <span>120m</span>
              </div>
            </div>

            <button className="btn-purple" style={{ width: '100%', padding: '14px' }} onClick={handleAdd}>
              Log Activity (+{predictedBurn} kcal)
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
