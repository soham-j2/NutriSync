import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { WebAppLayout } from './components/WebAppLayout';
import { HealthIndexGauge } from './components/HealthIndexGauge';
import { MealLogger } from './components/MealLogger';
import { ActivityLogger } from './components/ActivityLogger';
import { HydrationTracker } from './components/HydrationTracker';
import { SuggestionsSection } from './components/SuggestionsSection';
import { TrendsDashboard } from './components/TrendsDashboard';
import { DailySummary } from './components/DailySummary';
import { OnboardingModal } from './components/OnboardingModal';
import { NutriAiAssistant } from './components/NutriAiAssistant';
import { NutriAiFab } from './components/NutriAiFab';
import { computeDailyHealthIndex } from './utils/healthIndexEngine';
import { DEMO_PRESETS } from './data/ifctFoodDatabase';
import { Utensils, Activity, Sparkles, ArrowRight } from 'lucide-react';

const DEFAULT_PROFILE = {
  age: 21,
  gender: 'male',
  height: 175,
  weight: 68,
  activityLevel: 'moderate',
  goal: 'maintain'
};

// Helper to attach unique IDs to preset items if missing
const ensureUniqueIds = (items = []) => {
  return items.map((item, idx) => ({
    ...item,
    id: item.id || `preset_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`
  }));
};

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('nutriloop_profile') || localStorage.getItem('nutrisync_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });




  const [loggedMeals, setLoggedMeals] = useState(() => {
    const saved = localStorage.getItem('nutriloop_meals') || localStorage.getItem('nutrisync_meals');
    return saved ? JSON.parse(saved) : ensureUniqueIds(DEMO_PRESETS.healthy.meals);
  });

  const [loggedActivities, setLoggedActivities] = useState(() => {
    const saved = localStorage.getItem('nutriloop_activities') || localStorage.getItem('nutrisync_activities');
    return saved ? JSON.parse(saved) : ensureUniqueIds(DEMO_PRESETS.healthy.activities);
  });

  const [waterGlasses, setWaterGlasses] = useState(() => {
    const saved = localStorage.getItem('nutriloop_water') || localStorage.getItem('nutrisync_water');
    return saved ? JSON.parse(saved) : DEMO_PRESETS.healthy.waterGlasses;
  });

  useEffect(() => {
    localStorage.setItem('nutriloop_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('nutriloop_meals', JSON.stringify(loggedMeals));
  }, [loggedMeals]);

  useEffect(() => {
    localStorage.setItem('nutriloop_activities', JSON.stringify(loggedActivities));
  }, [loggedActivities]);

  useEffect(() => {
    localStorage.setItem('nutriloop_water', JSON.stringify(waterGlasses));
  }, [waterGlasses]);

  const currentAnalysis = computeDailyHealthIndex(
    loggedMeals,
    loggedActivities,
    waterGlasses,
    userProfile
  );

  const triggerCelebration = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleLoadPreset = (preset) => {
    setLoggedMeals(ensureUniqueIds(preset.meals));
    setLoggedActivities(ensureUniqueIds(preset.activities));
    setWaterGlasses(preset.waterGlasses);
    if (preset.meals.length > 0) triggerCelebration();
  };

  const handleAddMeal = (meal) => {
    const newMeal = {
      ...meal,
      id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
    };
    setLoggedMeals(prev => [newMeal, ...prev]);
  };

  const handleDeleteMeal = (mealToDelete) => {
    setLoggedMeals(prev => prev.filter(m => (m.id ? m.id !== mealToDelete.id : m !== mealToDelete)));
  };

  const handleAddActivity = (act) => {
    const newAct = {
      ...act,
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
    };
    setLoggedActivities(prev => [newAct, ...prev]);
  };

  const handleDeleteActivity = (actToDelete) => {
    setLoggedActivities(prev => prev.filter(a => (a.id ? a.id !== actToDelete.id : a !== actToDelete)));
  };

  return (
    <WebAppLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      userProfile={userProfile}
      onOpenProfileModal={() => setShowProfileModal(true)}
      onOpenAiAssistant={() => setShowAiAssistant(true)}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <>
            {/* Dashboard 2-Column Responsive Layout */}
            <div className="dashboard-grid">
              
              {/* Left Column: Health Index Gauge & Hydration */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <HealthIndexGauge healthAnalysis={currentAnalysis} />
                <HydrationTracker 
                  waterGlasses={waterGlasses} 
                  onUpdateWater={setWaterGlasses}
                  targetGlasses={currentAnalysis.targets.targetWaterGlasses}
                />
              </div>

              {/* Right Column: Recommendations & Action Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Actionable Health Tips */}
                <SuggestionsSection suggestions={currentAnalysis.suggestions} />

                {/* Quick Interactive Summary Cards Grid */}
                <div className="responsive-card-grid">
                  
                  <div 
                    className="white-card white-card-hover"
                    onClick={() => setActiveTab('meals')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="chip chip-purple">
                        <Utensils size={12} /> Meal Logger
                      </span>
                      <ArrowRight size={16} color="var(--primary-purple)" />
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginTop: '10px' }}>
                      {loggedMeals.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>items logged</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {currentAnalysis.totals.calories} / {currentAnalysis.targets.targetCalories} kcal Target
                    </div>
                  </div>

                  <div 
                    className="white-card white-card-hover"
                    onClick={() => setActiveTab('activity')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="chip chip-cyan">
                        <Activity size={12} /> Workout Tracker
                      </span>
                      <ArrowRight size={16} color="var(--accent-cyan)" />
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginTop: '10px' }}>
                      {currentAnalysis.totals.burnedCalories} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>kcal burned</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {currentAnalysis.totals.exerciseMinutes} mins active exercise
                    </div>
                  </div>

                  <div 
                    className="white-card white-card-hover"
                    onClick={() => setActiveTab('summary')}
                    style={{ cursor: 'pointer', gridColumn: 'span 2' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="chip chip-emerald">
                        <Sparkles size={12} /> Daily Summary & Charts
                      </span>
                      <ArrowRight size={16} color="var(--accent-emerald)" />
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px' }}>
                      View Complete Daily Health Report Card
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Visual meal breakdown, macro comparison charts & 5-factor radar analysis
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </>
        )}

        {/* MEALS TAB */}
        {activeTab === 'meals' && (
          <MealLogger
            loggedMeals={loggedMeals}
            onAddMeal={handleAddMeal}
            onDeleteMeal={handleDeleteMeal}
          />
        )}

        {/* WORKOUT TAB */}
        {activeTab === 'activity' && (
          <ActivityLogger
            loggedActivities={loggedActivities}
            onAddActivity={handleAddActivity}
            onDeleteActivity={handleDeleteActivity}
            weightKg={userProfile.weight}
          />
        )}

        {/* DAILY SUMMARY TAB */}
        {activeTab === 'summary' && (
          <DailySummary
            currentAnalysis={currentAnalysis}
            loggedMeals={loggedMeals}
            loggedActivities={loggedActivities}
            userProfile={userProfile}
          />
        )}

        {/* TRENDS TAB */}
        {activeTab === 'trends' && (
          <TrendsDashboard currentAnalysis={currentAnalysis} />
        )}

      </div>

      {/* Profile & Biometrics Setup Modal */}
      <OnboardingModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userProfile={userProfile}
        onSaveProfile={setUserProfile}
      />

      {/* NutriAI Floating Action Button */}
      <NutriAiFab 
        onClick={() => setShowAiAssistant(true)} 
        healthScore={currentAnalysis.healthIndexScore} 
      />

      {/* NutriAI Interactive Assistant Chat Modal */}
      <NutriAiAssistant
        isOpen={showAiAssistant}
        onClose={() => setShowAiAssistant(false)}
        healthAnalysis={currentAnalysis}
        loggedMeals={loggedMeals}
        loggedActivities={loggedActivities}
        userProfile={userProfile}
      />
    </WebAppLayout>
  );
}




export default App;
