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
  Sparkles,
  Calendar,
  Sun
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
  const [viewMode, setViewMode] = useState('daily'); // 'daily' | 'weekly'
  const [showShareModal, setShowShareModal] = useState(false);
  const { finalScore, grade, subScores, totals, targets, suggestions } = currentAnalysis;

  // --- DAILY DATA COMPUTATIONS ---
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
      tooltip: { backgroundColor: '#1e1b4b' }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#6b7280', font: { weight: '600', size: 11 } } },
      y: { grid: { color: 'rgba(147, 51, 234, 0.06)' }, ticks: { color: '#6b7280', font: { weight: '600' } } }
    }
  };

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

  // --- WEEKLY DATA COMPUTATIONS (7-DAY ANALYSIS) ---
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
  const weeklyHealthScores = [68, 74, 62, 82, 78, 70, finalScore];
  const weeklyIntakeCals = [1950, 2100, 1850, 2050, 2200, 1900, totals.calories || 1850];
  const weeklyBurnCals = [280, 320, 150, 420, 350, 210, totals.burnedCalories || 200];
  const weeklyWaterCups = [7, 8, 6, 8, 8, 7, totals.waterGlasses || 6];

  const weeklyAvgScore = Math.round(weeklyHealthScores.reduce((a, b) => a + b, 0) / 7);
  const weeklyTotalCals = weeklyIntakeCals.reduce((a, b) => a + b, 0);
  const weeklyAvgCals = Math.round(weeklyTotalCals / 7);
  const weeklyTotalBurn = weeklyBurnCals.reduce((a, b) => a + b, 0);

  // Weekly Chart 1: Daily Health Index Bar Chart
  const weeklyScoreChartData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Health Index Score',
        data: weeklyHealthScores,
        backgroundColor: weeklyHealthScores.map(s => s >= 80 ? '#10b981' : s >= 60 ? '#06b6d4' : '#f59e0b'),
        borderRadius: 8
      }
    ]
  };

  // Weekly Chart 2: Intake vs Burn Grouped Bar Chart
  const weeklyEnergyChartData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Consumed (kcal)',
        data: weeklyIntakeCals,
        backgroundColor: '#9333ea',
        borderRadius: 6
      },
      {
        label: 'Burned (kcal)',
        data: weeklyBurnCals,
        backgroundColor: '#10b981',
        borderRadius: 6
      }
    ]
  };

  // Weekly Chart 3: Hydration Line Chart
  const weeklyHydrationChartData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Water Logged (cups)',
        data: weeklyWaterCups,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.12)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#06b6d4',
        pointRadius: 5
      }
    ]
  };

  // Weekly Chart 4: 7-Day Macro Split Doughnut Chart
  const weeklyMacroDoughnutData = {
    labels: ['Protein (g)', 'Carbs (g)', 'Fats (g)', 'Fiber (g)'],
    datasets: [
      {
        data: [
          totals.protein * 7 || 450,
          totals.carbs * 7 || 1400,
          totals.fat * 7 || 380,
          totals.fiber * 7 || 180
        ],
        backgroundColor: ['#9333ea', '#06b6d4', '#f59e0b', '#10b981'],
        borderWidth: 0
      }
    ]
  };

  const lineData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Health Index',
        data: weeklyHealthScores,
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
      
      {/* Header Banner with Daily / Weekly Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
            {viewMode === 'daily' ? 'Daily Summary & Analytics' : '7-Day Weekly Summary & Trends'}
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
            {viewMode === 'daily' ? `${currentDateStr} • NutriLoop Daily Audit` : 'Last 7 Days Performance & Consistency Audit'}
          </span>
        </div>

        {/* View Switcher Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            background: 'rgba(147, 51, 234, 0.08)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setViewMode('daily')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: viewMode === 'daily' ? 'var(--primary-purple)' : 'transparent',
                color: viewMode === 'daily' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s'
              }}
            >
              <Sun size={14} />
              <span>Daily</span>
            </button>

            <button
              onClick={() => setViewMode('weekly')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: viewMode === 'weekly' ? 'var(--primary-purple)' : 'transparent',
                color: viewMode === 'weekly' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s'
              }}
            >
              <Calendar size={14} />
              <span>Weekly</span>
            </button>
          </div>

          <button 
            className="btn-purple"
            onClick={() => setShowShareModal(true)}
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            <Share2 size={14} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Mode 1: DAILY SUMMARY VIEW */}
      {viewMode === 'daily' && (
        <>
          {/* Daily KPI Overview Grid */}
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

          {/* Daily Charts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            
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

          {/* Daily Micronutrient Quality & Audit Panel */}
          <div className="white-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="var(--primary-purple)" />
              <span>Dietary Micronutrient & Quality Audit</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              
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
        </>
      )}

      {/* Mode 2: WEEKLY SUMMARY VIEW */}
      {viewMode === 'weekly' && (
        <>
          {/* Weekly KPI Overview Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            
            {/* Weekly Avg Score */}
            <div className="white-card white-card-hover" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'var(--accent-emerald-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-emerald)',
                fontWeight: '800',
                fontSize: '20px'
              }}>
                {weeklyAvgScore}
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  7-DAY AVG SCORE
                </div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Optimal Trajectory</span>
                  <span className="chip chip-emerald" style={{ fontSize: '9px', padding: '1px 6px' }}>
                    +4 pts
                  </span>
                </div>
              </div>
            </div>

            {/* Weekly Total Calories */}
            <div className="white-card white-card-hover" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'var(--primary-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-purple)'
              }}>
                <Utensils size={24} />
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  WEEKLY CONSUMPTION
                </div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
                  {weeklyTotalCals.toLocaleString()} <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>kcal ({weeklyAvgCals}/day)</span>
                </div>
              </div>
            </div>

            {/* Weekly Workout Burn */}
            <div className="white-card white-card-hover" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'var(--accent-amber-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-amber)'
              }}>
                <Activity size={24} />
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  WEEKLY WORKOUT BURN
                </div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
                  +{weeklyTotalBurn.toLocaleString()} kcal <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>(5 Active Days)</span>
                </div>
              </div>
            </div>

            {/* Weekly Clean Eating Compliance */}
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
                <ShieldCheck size={24} />
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  CLEAN EATING DAYS
                </div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
                  6 of 7 Days Clean <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: '700' }}>(86% Rate)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Weekly Charts Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            
            {/* Weekly Chart 1: Daily Health Score Bar Chart */}
            <div className="white-card white-card-hover" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} color="var(--primary-purple)" />
                  <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                    7-Day Health Index Distribution
                  </span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-emerald)' }}>
                  Peak: 82 (Thu)
                </span>
              </div>
              <div style={{ height: '210px' }}>
                <Bar data={weeklyScoreChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            </div>

            {/* Weekly Chart 2: Intake vs Workout Burn Grouped Chart */}
            <div className="white-card white-card-hover" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart3 size={18} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                    Daily Intake vs Workout Burn
                  </span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary-purple)' }}>
                  7-Day Energy Balance
                </span>
              </div>
              <div style={{ height: '210px' }}>
                <Bar data={weeklyEnergyChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} />
              </div>
            </div>

            {/* Weekly Chart 3: 7-Day Hydration Line Chart */}
            <div className="white-card white-card-hover" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Droplet size={18} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                    Weekly Hydration Consistency
                  </span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                  Goal: 8 cups/day
                </span>
              </div>
              <div style={{ height: '210px' }}>
                <Line data={weeklyHydrationChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            </div>

            {/* Weekly Chart 4: Macro Distribution Split */}
            <div className="white-card white-card-hover" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PieChart size={18} color="var(--accent-emerald)" />
                  <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                    Weekly Macro Ratio Split
                  </span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-emerald)' }}>
                  Balanced Diet
                </span>
              </div>
              <div style={{ height: '210px', display: 'flex', justifyContent: 'center' }}>
                <Doughnut data={weeklyMacroDoughnutData} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom' } } }} />
              </div>
            </div>

          </div>

          {/* Weekly Performance & Consistency Highlights */}
          <div className="white-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="var(--primary-purple)" />
              <span>7-Day Consistency & Goal Compliance Highlights</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              
              <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>BEST PERFORMANCE DAY</div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary-purple)', marginTop: '4px' }}>
                  Thursday (Score: 82/100)
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  High protein, 45m workout, 0 junk items.
                </div>
              </div>

              <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>PROTEIN TARGET COMPLIANCE</div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--accent-emerald)', marginTop: '4px' }}>
                  88% Weekly Target Met
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Averaged ~62g protein daily.
                </div>
              </div>

              <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>ACTIVE WORKOUT FREQUENCY</div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--accent-cyan)', marginTop: '4px' }}>
                  5 of 7 Days Active
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Exceeded the 150m weekly activity standard.
                </div>
              </div>

            </div>
          </div>
        </>
      )}

      {/* Share / Printable Summary Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--primary-purple)" />
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  {viewMode === 'daily' ? 'Daily Health Report Card' : 'Weekly 7-Day Health Report'}
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
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {viewMode === 'daily' ? currentDateStr : 'Past 7 Days Audit'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1' }}>
                    {viewMode === 'daily' ? finalScore : weeklyAvgScore}
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--primary-purple)' }}>
                    {viewMode === 'daily' ? 'DAILY HEALTH INDEX' : 'WEEKLY AVG SCORE'}
                  </div>
                </div>
              </div>

              {viewMode === 'daily' ? (
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
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>WEEKLY INTAKE</div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>{weeklyTotalCals.toLocaleString()} kcal</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>WORKOUT BURN</div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-emerald)' }}>+{weeklyTotalBurn.toLocaleString()} kcal</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>ACTIVE DAYS</div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary-purple)' }}>5 of 7 Days</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>CLEAN DAYS</div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-cyan)' }}>6 of 7 Days</div>
                  </div>
                </div>
              )}

              <div style={{ fontSize: '11px', color: 'var(--text-main)', fontWeight: '600', background: 'rgba(147, 51, 234, 0.06)', padding: '10px 12px', borderRadius: '10px' }}>
                💡 {viewMode === 'daily' ? `Key Assessment: ${suggestions[0]?.message || 'Balanced diet.'}` : 'Weekly Peak: Thursday (Score: 82/100). Outstanding overall consistency!'}
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
