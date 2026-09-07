import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Radar, Line, Doughnut } from 'react-chartjs-2';
import { 
  FileText, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Utensils, 
  Droplet, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  X,
  Share2,
  Sparkles
} from 'lucide-react';
import { IFCT_FOOD_DATABASE } from '../data/ifctFoodDatabase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const DailySummary = ({ currentAnalysis, loggedMeals = [], loggedActivities = [], userProfile = {} }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const { finalScore, grade, subScores, totals, targets, suggestions } = currentAnalysis;

  // 1. Meal-by-Meal Calorie Breakdown Data
  const mealSlotCalories = {
    Breakfast: 0,
    Lunch: 0,
    Dinner: 0,
    Snacks: 0
  };

  loggedMeals.forEach(item => {
    const food = IFCT_FOOD_DATABASE.find(f => f.id === item.foodId);
    if (food && mealSlotCalories[item.mealType] !== undefined) {
      mealSlotCalories[item.mealType] += food.calories * (item.qty || 1);
    }
  });

  const mealBarData = {
    labels: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
    datasets: [
      {
        label: 'Calories Consumed (kcal)',
        data: [
          mealSlotCalories.Breakfast,
          mealSlotCalories.Lunch,
          mealSlotCalories.Dinner,
          mealSlotCalories.Snacks
        ],
        backgroundColor: [
          'rgba(147, 51, 234, 0.75)',
          'rgba(6, 182, 212, 0.75)',
          'rgba(16, 185, 129, 0.75)',
          'rgba(245, 158, 11, 0.75)'
        ],
        borderRadius: 8,
        borderWidth: 0
      }
    ]
  };

  const mealBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e1b4b',
        titleColor: '#fff',
        bodyColor: '#a855f7'
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#6b7280', font: { weight: '600', size: 11 } } },
      y: { grid: { color: 'rgba(147, 51, 234, 0.06)' }, ticks: { color: '#6b7280', font: { weight: '600' } } }
    }
  };

  // 2. Macro Target vs Actual Comparison Chart Data
  const macroBarData = {
    labels: ['Protein (g)', 'Carbs (g)', 'Fats (g)', 'Fiber (g)'],
    datasets: [
      {
        label: 'Actual Logged',
        data: [totals.protein, totals.carbs, totals.fat, totals.fiber],
        backgroundColor: '#9333ea',
        borderRadius: 6
      },
      {
        label: 'Target Goal',
        data: [
          targets.targetProteinGrams,
          targets.targetCarbsGrams,
          targets.targetFatGrams,
          targets.targetFiberGrams
        ],
        backgroundColor: 'rgba(147, 51, 234, 0.15)',
        borderRadius: 6
      }
    ]
  };

  const macroBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#1e1b4b', font: { size: 11, weight: '700' } } },
      tooltip: { backgroundColor: '#1e1b4b' }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#6b7280', font: { weight: '600', size: 11 } } },
      y: { grid: { color: 'rgba(147, 51, 234, 0.06)' }, ticks: { color: '#6b7280', font: { weight: '600' } } }
    }
  };

  // 3. 5-Factor Health Radar Chart Data
  const radarData = {
    labels: ['Nutrients (30%)', 'Clean Diet (25%)', 'Exercise (20%)', 'Hydration (15%)', 'Calorie Trend (10%)'],
    datasets: [
      {
        label: 'Sub-Scores',
        data: [
          subScores.nutrientBalanceScore,
          subScores.junkPenaltyScore,
          subScores.exerciseScore,
          subScores.hydrationScore,
          subScores.calorieTrendScore
        ],
        backgroundColor: 'rgba(147, 51, 234, 0.25)',
        borderColor: '#9333ea',
        pointBackgroundColor: '#9333ea',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4
      }
    ]
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1e1b4b' }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(147, 51, 234, 0.12)' },
        grid: { color: 'rgba(147, 51, 234, 0.12)' },
        pointLabels: { color: '#1e1b4b', font: { size: 10, weight: '700' } },
        ticks: { display: false },
        min: 0,
        max: 100
      }
    }
  };

  // 4. 7-Day Trend Line Data
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
  const healthScores = [68, 74, 62, 82, 78, 70, finalScore];

  const lineData = {
    labels: days,
    datasets: [
      {
        label: 'Health Index',
        data: healthScores,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1e1b4b' }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#6b7280', font: { weight: '600', size: 11 } } },
      y: { min: 0, max: 100, grid: { color: 'rgba(147, 51, 234, 0.06)' }, ticks: { color: '#6b7280', font: { weight: '600' } } }
    }
  };

  const currentDateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
            Daily Summary & Analytics Report
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
            {currentDateStr} • NutriLoop Health Audit
          </span>
        </div>

        <button 
          className="btn-purple"
          onClick={() => setShowShareModal(true)}
          style={{ padding: '8px 18px', fontSize: '12px' }}
        >
          <Share2 size={14} />
          <span>Export Summary Card</span>
        </button>
      </div>

      {/* KPI Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        
        {/* Health Score Card */}
        <div className="white-card white-card-hover" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'var(--primary-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-purple)',
            fontWeight: '800',
            fontSize: '20px'
          }}>
            {finalScore}
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              HEALTH INDEX
            </div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{grade.label}</span>
              <span className={`chip chip-${grade.color}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                {grade.badge}
              </span>
            </div>
          </div>
        </div>

        {/* Calorie Net Balance Card */}
        <div className="white-card white-card-hover" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'var(--accent-emerald-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-emerald)'
          }}>
            <Utensils size={24} />
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              NET CALORIES
            </div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
              {totals.calories - totals.burnedCalories} <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>/ {targets.targetCalories} kcal</span>
            </div>
          </div>
        </div>

        {/* Workout & Hydration */}
        <div className="white-card white-card-hover" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'var(--accent-cyan-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              WORKOUT & WATER
            </div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
              {totals.exerciseMinutes}m active • {totals.waterGlasses}/8 cups
            </div>
          </div>
        </div>

        {/* Junk Food Control */}
        <div className="white-card white-card-hover" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: totals.junkItemCount > 0 ? 'var(--accent-rose-bg)' : 'var(--accent-emerald-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: totals.junkItemCount > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              DIET QUALITY
            </div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
              {totals.junkItemCount === 0 ? '100% Clean Food' : `${totals.junkItemCount} Junk Items`}
            </div>
          </div>
        </div>

      </div>

      {/* Main Charts Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        
        {/* Chart 1: Meal Slot Calorie Distribution */}
        <div className="white-card white-card-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} color="var(--primary-purple)" />
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                Meal-by-Meal Calories
              </span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary-purple)' }}>
              Total: {totals.calories} kcal
            </span>
          </div>
          <div style={{ height: '210px' }}>
            <Bar data={mealBarData} options={mealBarOptions} />
          </div>
        </div>

        {/* Chart 2: Target vs Actual Macronutrients */}
        <div className="white-card white-card-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieChart size={18} color="var(--accent-cyan)" />
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                Macro Goals vs Actuals
              </span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-cyan)' }}>
              {totals.protein}g Protein
            </span>
          </div>
          <div style={{ height: '210px' }}>
            <Bar data={macroBarData} options={macroBarOptions} />
          </div>
        </div>

        {/* Chart 3: 5-Factor Health Radar */}
        <div className="white-card white-card-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="var(--primary-purple)" />
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                5-Factor Health Radar
              </span>
            </div>
            <span className="chip chip-purple" style={{ fontSize: '10px' }}>
              Score: {finalScore}/100
            </span>
          </div>
          <div style={{ height: '210px' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        {/* Chart 4: 7-Day Trend */}
        <div className="white-card white-card-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--accent-emerald)" />
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                7-Day Health Trajectory
              </span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-emerald)' }}>
              Weekly Peak: 82
            </span>
          </div>
          <div style={{ height: '210px' }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

      </div>

      {/* Micronutrient Quality & Dietary Audit Panel */}
      <div className="white-card" style={{ padding: '20px' }}>
        <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="var(--primary-purple)" />
          <span>Dietary Micronutrient & Quality Audit</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          
          {/* Sodium */}
          <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sodium Intake</span>
              <span style={{ color: totals.sodium > 2000 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                {totals.sodium} mg / 2000 mg
              </span>
            </div>
            <div style={{ height: '6px', background: 'rgba(147, 51, 234, 0.08)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min((totals.sodium / 2000) * 100, 100)}%`, height: '100%', background: totals.sodium > 2000 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }} />
            </div>
          </div>

          {/* Sugar */}
          <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700' }}>
              <span style={{ color: 'var(--text-muted)' }}>Added Sugar</span>
              <span style={{ color: totals.sugar > 35 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                {totals.sugar} g / 35 g limit
              </span>
            </div>
            <div style={{ height: '6px', background: 'rgba(147, 51, 234, 0.08)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min((totals.sugar / 35) * 100, 100)}%`, height: '100%', background: totals.sugar > 35 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }} />
            </div>
          </div>

          {/* Fiber */}
          <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700' }}>
              <span style={{ color: 'var(--text-muted)' }}>Dietary Fiber</span>
              <span style={{ color: totals.fiber >= targets.targetFiberGrams ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                {totals.fiber} g / {targets.targetFiberGrams} g goal
              </span>
            </div>
            <div style={{ height: '6px', background: 'rgba(147, 51, 234, 0.08)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min((totals.fiber / targets.targetFiberGrams) * 100, 100)}%`, height: '100%', background: 'var(--accent-cyan)' }} />
            </div>
          </div>

        </div>
      </div>

      {/* Share / Printable Summary Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--primary-purple)" />
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Daily Health Report Card
                </h3>
              </div>
              <button onClick={() => setShowShareModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            {/* Styled Printable Card View */}
            <div id="printable-summary-card" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 10px 30px rgba(147, 51, 234, 0.1)',
              marginBottom: '18px'
            }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-purple)' }}>NutriLoop</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{currentDateStr}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1' }}>{finalScore}</div>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--primary-purple)' }}>HEALTH INDEX</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>CALORIES</div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>{totals.calories} kcal</div>
                </div>
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>PROTEIN</div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary-purple)' }}>{totals.protein}g</div>
                </div>
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>WORKOUT</div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-emerald)' }}>{totals.exerciseMinutes} mins</div>
                </div>
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>HYDRATION</div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-cyan)' }}>{totals.waterGlasses} cups</div>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-main)', fontWeight: '600', background: 'rgba(147, 51, 234, 0.06)', padding: '10px 12px', borderRadius: '10px' }}>
                💡 Key Assessment: {suggestions[0]?.message || 'Maintain consistent hydration and balanced protein intake.'}
              </div>

            </div>

            <button 
              className="btn-purple"
              style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
              onClick={() => {
                window.print();
              }}
            >
              <Printer size={16} />
              <span>Print / Download PDF Report</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
