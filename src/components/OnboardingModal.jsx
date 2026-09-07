import React, { useState } from 'react';
import { User, X } from 'lucide-react';
import { calculateNutritionalTargets } from '../utils/healthCalculators';

export const OnboardingModal = ({ isOpen, onClose, userProfile, onSaveProfile }) => {
  const [formData, setFormData] = useState(userProfile);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculatedTargets = calculateNutritionalTargets(formData);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-purple)' }}>
              <User size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Biometrics Setup</h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Calculates BMR & TDEE Health Baseline</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>



        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Full Name */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Sazidur Rahman"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                color: 'var(--text-main)',
                fontSize: '13px',
                fontWeight: '600',
                outline: 'none'
              }}
            />
          </div>

          {/* Gender Selector */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              Gender
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {['male', 'female'].map(g => (
                <button
                  type="button"
                  key={g}
                  onClick={() => handleChange('gender', g)}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    border: formData.gender === g ? '2px solid var(--primary-purple)' : '1px solid var(--border-subtle)',
                    background: formData.gender === g ? 'var(--bg-card-subtle)' : '#ffffff',
                    color: formData.gender === g ? 'var(--primary-purple)' : 'var(--text-main)',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Age, Height, Weight Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                Age (years)
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  color: 'var(--text-main)',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                Height (cm)
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  color: 'var(--text-main)',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                Weight (kg)
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  color: 'var(--text-main)',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              />
            </div>
          </div>

          {/* Activity Level Select */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
              Daily Activity Level
            </label>
            <select
              value={formData.activityLevel}
              onChange={(e) => handleChange('activityLevel', e.target.value)}
              style={{
                width: '100%',
                padding: '11px',
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                color: 'var(--text-main)',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              <option value="sedentary">Sedentary (Desk work / Little exercise)</option>
              <option value="light">Lightly Active (1-3 days walking/exercise)</option>
              <option value="moderate">Moderately Active (3-5 days exercise)</option>
              <option value="active">Very Active (6-7 days intense sports/gym)</option>
            </select>
          </div>

          {/* Fitness Goal */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              Primary Fitness Goal
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { id: 'lose', label: 'Lose Weight' },
                { id: 'maintain', label: 'Maintain' },
                { id: 'gain', label: 'Gain Muscle' }
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleChange('goal', item.id)}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: formData.goal === item.id ? '2px solid var(--primary-purple)' : '1px solid var(--border-subtle)',
                    background: formData.goal === item.id ? 'var(--bg-card-subtle)' : '#ffffff',
                    color: formData.goal === item.id ? 'var(--primary-purple)' : 'var(--text-main)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Computed Preview Card */}
          <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>BMR</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>{calculatedTargets.bmr} kcal</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>TDEE</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-cyan)' }}>{calculatedTargets.tdee} kcal</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>TARGET</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary-purple)' }}>{calculatedTargets.targetCalories} kcal</div>
            </div>
          </div>

          <button type="submit" className="btn-purple" style={{ width: '100%', padding: '14px' }}>
            Save Biometrics & Baseline
          </button>

        </form>

      </div>
    </div>
  );
};
