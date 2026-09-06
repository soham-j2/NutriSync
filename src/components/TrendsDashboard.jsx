import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { TrendingUp, PieChart } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const TrendsDashboard = ({ currentAnalysis }) => {
  const { totals, targets, finalScore } = currentAnalysis;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
  const healthScores = [65, 72, 58, 81, 74, 69, finalScore];

  // 1. Health Index Line Chart Data
  const lineData = {
    labels: days,
    datasets: [
      {
        label: 'Health Index Score',
        data: healthScores,
        borderColor: '#9333ea',
        backgroundColor: 'rgba(147, 51, 234, 0.12)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#9333ea',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e1b4b',
        titleColor: '#fff',
        bodyColor: '#a855f7'
      }
    },
    scales: {
      x: { grid: { color: 'rgba(147, 51, 234, 0.05)' }, ticks: { color: '#6b7280', font: { weight: '600' } } },
      y: { min: 0, max: 100, grid: { color: 'rgba(147, 51, 234, 0.05)' }, ticks: { color: '#6b7280', font: { weight: '600' } } }
    }
  };

  // 2. Macronutrient Doughnut Data
  const doughnutData = {
    labels: ['Protein (g)', 'Carbs (g)', 'Fats (g)', 'Fiber (g)'],
    datasets: [
      {
        data: [totals.protein || 1, totals.carbs || 1, totals.fat || 1, totals.fiber || 1],
        backgroundColor: ['#9333ea', '#06b6d4', '#f59e0b', '#10b981'],
        borderWidth: 0
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#1e1b4b', font: { size: 12, weight: '600' } } }
    },
    cutout: '68%'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
          Health Index & Macro Analytics
        </h2>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          7-Day Progression Trajectory & Daily Macronutrient Ratios
        </span>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Line Chart */}
        <div className="white-card white-card-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <TrendingUp size={18} color="var(--primary-purple)" />
            <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
              7-Day Health Score Progression
            </span>
          </div>
          <div style={{ height: '220px' }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="white-card white-card-hover" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <PieChart size={18} color="var(--accent-cyan)" />
            <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
              Daily Macronutrient Distribution
            </span>
          </div>
          <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

      </div>

      {/* Energy Balance Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="white-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>TARGET TDEE REQUIREMENT</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary-purple)', marginTop: '4px' }}>
            {targets.targetCalories} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>kcal</span>
          </div>
        </div>
        <div className="white-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>DAILY CONSUMED</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--accent-emerald)', marginTop: '4px' }}>
            {totals.calories} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>kcal</span>
          </div>
        </div>
        <div className="white-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>WORKOUT BURNED</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--accent-amber)', marginTop: '4px' }}>
            {totals.burnedCalories} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>kcal</span>
          </div>
        </div>
      </div>

    </div>
  );
};
