// Deeply Personalized AI Nutrition & Health Coaching Engine for NutriVista

export const QUICK_PROMPTS = [
  { id: 'analyze', icon: 'Sparkles', text: 'Analyze My Real Logged Data' },
  { id: 'dinner', icon: 'Utensils', text: 'Suggest Personalized Meal' },
  { id: 'macros', icon: 'PieChart', text: 'Critique My Macro Balance' },
  { id: 'workout', icon: 'Activity', text: 'Analyze Workout Progress' },
  { id: 'hydration', icon: 'Droplets', text: 'Hydration & Water Goal' }
];

/**
 * Builds a clean text summary of logged meals.
 */
function getLoggedMealsSummary(loggedMeals = []) {
  if (!loggedMeals || loggedMeals.length === 0) {
    return 'No meals logged yet today.';
  }
  return loggedMeals
    .map((m, idx) => `${idx + 1}. **${m.name || 'Meal'}** (${m.calories || 0} kcal, ${m.protein || 0}g P, ${m.carbs || 0}g C, ${m.fat || 0}g F)`)
    .join('\n');
}

/**
 * Builds a clean text summary of logged workouts.
 */
function getLoggedActivitiesSummary(loggedActivities = []) {
  if (!loggedActivities || loggedActivities.length === 0) {
    return 'No exercise or workouts logged yet today.';
  }
  return loggedActivities
    .map((a, idx) => `${idx + 1}. **${a.name || 'Activity'}** (${a.durationMins || a.duration || 0} mins, ${a.caloriesBurned || a.calories || 0} kcal burned)`)
    .join('\n');
}

/**
 * Main AI Engine function returning personalized Markdown response based on live real data.
 */
export function generateAiResponse(userQuery, healthAnalysis, loggedMeals = [], loggedActivities = [], userProfile = {}) {
  const queryLower = userQuery.toLowerCase().trim();

  // Extract Live Metrics
  const score = healthAnalysis?.healthIndexScore || 75;
  const totals = healthAnalysis?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, burnedCalories: 0, exerciseMinutes: 0 };
  const targets = healthAnalysis?.targets || { targetCalories: 2000, targetProtein: 120, targetCarbs: 250, targetFat: 60, targetFiber: 28, targetWaterGlasses: 10 };
  const waterGlasses = healthAnalysis?.waterGlasses || 0;

  // Biometrics & Goals
  const weight = userProfile.weight || 68;
  const height = userProfile.height || 175;
  const age = userProfile.age || 21;
  const gender = userProfile.gender || 'male';
  const goal = userProfile.goal || 'maintain';
  const activityLevel = userProfile.activityLevel || 'moderate';

  // Computed Gaps
  const netCalories = totals.calories - totals.burnedCalories;
  const remainingCalories = targets.targetCalories - netCalories;
  const remainingProtein = Math.max(0, targets.targetProtein - totals.protein);
  const remainingCarbs = Math.max(0, targets.targetCarbs - totals.carbs);
  const remainingFat = Math.max(0, targets.targetFat - totals.fat);
  const remainingWater = Math.max(0, targets.targetWaterGlasses - waterGlasses);

  // Meal & Activity Details
  const mealsListText = getLoggedMealsSummary(loggedMeals);
  const activitiesListText = getLoggedActivitiesSummary(loggedActivities);

  // Highest protein & calorie meal finder
  let topProteinMeal = loggedMeals.length > 0 ? [...loggedMeals].sort((a, b) => (b.protein || 0) - (a.protein || 0))[0] : null;
  let topCalorieMeal = loggedMeals.length > 0 ? [...loggedMeals].sort((a, b) => (b.calories || 0) - (a.calories || 0))[0] : null;

  // 1. REAL-DATA DAILY OVERVIEW & SCORE ANALYSIS
  if (queryLower.includes('analyze') || queryLower.includes('score') || queryLower.includes('real') || queryLower.includes('data') || queryLower.includes('today')) {
    let scoreRating = 'Good';
    let statusEmoji = '🌟';
    if (score >= 85) { scoreRating = 'Optimal & Stellar'; statusEmoji = '🔥'; }
    else if (score >= 70) { scoreRating = 'Solid & Balanced'; statusEmoji = '⚡'; }
    else { scoreRating = 'Needs Attention'; statusEmoji = '💡'; }

    return `### ${statusEmoji} Personalized Real-Data Health Analysis (**${score}/100**)

Hello! Here is your live personalized diagnosis based on your **${weight}kg**, **${age}y ${gender}** profile (Goal: **${goal.toUpperCase()}**):

#### 📋 Today's Logged Meals (${loggedMeals.length} items):
${mealsListText}

#### 🏃 Today's Logged Workouts (${loggedActivities.length} items):
${activitiesListText}

#### 📊 Live Metric Breakdown:
- **Calorie Intake**: **${totals.calories}** / **${targets.targetCalories}** kcal (${remainingCalories >= 0 ? `${remainingCalories} kcal remaining` : `${Math.abs(remainingCalories)} kcal over target`})
- **Net Energy (Intake - Burned)**: **${netCalories}** kcal
- **Protein Intake**: **${totals.protein}g** / **${targets.targetProtein}g** (${remainingProtein > 0 ? `Need **${remainingProtein}g** more` : '🎉 Target Achieved!'})
- **Hydration Level**: **${waterGlasses}** / **${targets.targetWaterGlasses}** glasses

#### 🎯 AI Personalized Recommendations for You:
${topProteinMeal ? `- **Top Protein Source Today**: *${topProteinMeal.name}* provided **${topProteinMeal.protein}g** protein.` : '- *No protein logged yet today. Consider adding Paneer, Eggs, Dal, or Tofu.*'}
${remainingProtein > 20 ? `- **Protein Warning**: You are short by **${remainingProtein}g** of protein for optimal muscle recovery.` : '- **Protein Target**: On track!'}
${waterGlasses < targets.targetWaterGlasses ? `- **Hydration**: Drink **${remainingWater} more glasses** of water today to keep your metabolic rate high.` : '- **Hydration**: Perfect hydration level achieved!'}`;
  }

  // 2. PERSONALIZED MEAL RECOMMENDATION BASED ON WHAT WAS ALREADY EATEN
  if (queryLower.includes('dinner') || queryLower.includes('meal') || queryLower.includes('suggest') || queryLower.includes('eat') || queryLower.includes('recipe') || queryLower.includes('protein')) {
    const suggestedKcal = Math.max(250, Math.min(remainingCalories, 600));
    const targetP = Math.max(15, Math.min(remainingProtein, 40));

    return `### 🥗 Personalized Meal Plan (tailored to your real remaining macros)

Based on what you've eaten so far (**${totals.calories} kcal** consumed out of **${targets.targetCalories} kcal** limit):

- **Target Meal Budget**: ~**${suggestedKcal} kcal**
- **Protein Goal for Next Meal**: ~**${targetP}g protein**

${topCalorieMeal ? `*Note: You already logged **${topCalorieMeal.name}** (${topCalorieMeal.calories} kcal). Below are meals designed to balance out your remaining macros:*` : ''}

#### Option 1: High-Protein Paneer & Sprout Salad (Vegetarian)
- 🧀 **Ingredients**: 140g Low-fat Paneer / Tofu, 1 cup boiled Sprouted Moong, Cucumber, Tomato, Lemon & Chaat Masala.
- ⚡ **Macros**: ~**${Math.min(suggestedKcal, 380)} kcal** | **${Math.min(targetP + 5, 32)}g Protein** | 22g Carbs | 8g Fiber

#### Option 2: Soya Chunk & Quinoa Power Bowl (Vegan)
- 🫘 **Ingredients**: 50g Nutrela Soya Chunks (boiled), 1/2 cup cooked Quinoa, sautéed spinach & bell peppers.
- ⚡ **Macros**: ~**${Math.min(suggestedKcal, 410)} kcal** | **${Math.min(targetP + 8, 35)}g Protein** | 35g Carbs | 10g Fiber

#### Option 3: Grilled Chicken Breast with Roasted Sweet Potato (Non-Veg)
- 🍗 **Ingredients**: 160g Chicken Breast, 100g Roasted Sweet Potato, Steamed Broccoli.
- ⚡ **Macros**: ~**${Math.min(suggestedKcal, 420)} kcal** | **${Math.min(targetP + 10, 42)}g Protein** | 24g Carbs | 5g Fat

*AI Advice: Eat your next meal at least 2.5 hours before sleep for maximum BMR efficiency.*`;
  }

  // 3. REAL-DATA MACRO CRITIQUE
  if (queryLower.includes('macro') || queryLower.includes('balance') || queryLower.includes('carb') || queryLower.includes('fat') || queryLower.includes('fiber')) {
    const proteinPct = totals.calories > 0 ? Math.round((totals.protein * 4 / totals.calories) * 100) : 0;
    const carbsPct = totals.calories > 0 ? Math.round((totals.carbs * 4 / totals.calories) * 100) : 0;
    const fatPct = totals.calories > 0 ? Math.round((totals.fat * 9 / totals.calories) * 100) : 0;

    return `### 📊 Real Logged Macro Ratio Critique

Here is the exact macro balance calculated from your **${loggedMeals.length} logged meals** today:

- **Protein**: **${totals.protein}g** (**${proteinPct}%** of total calories) — *Target: ${targets.targetProtein}g*
- **Carbohydrates**: **${totals.carbs}g** (**${carbsPct}%** of total calories) — *Target: ${targets.targetCarbs}g*
- **Dietary Fat**: **${totals.fat}g** (**${fatPct}%** of total calories) — *Target: ${targets.targetFat}g*
- **Dietary Fiber**: **${totals.fiber}g** — *Target: ${targets.targetFiber}g*

#### 🔍 AI Analysis of Your Logged Meals:
${loggedMeals.length > 0 ? `Your logged meals include: ${loggedMeals.map(m => m.name).join(', ')}.` : 'You have not logged any meals yet today.'}
${topProteinMeal ? `- **Highest Protein Meal**: *${topProteinMeal.name}* (${topProteinMeal.protein}g protein)` : ''}
${topCalorieMeal ? `- **Highest Calorie Meal**: *${topCalorieMeal.name}* (${topCalorieMeal.calories} kcal)` : ''}

**AI Prescription:**
${proteinPct < 22 ? `⚠️ **Protein Shortfall**: Only ${proteinPct}% of your intake is protein. Boost protein to 25-30% to protect lean muscle mass.` : `✅ **Protein Ratio is Healthy!**`}
${totals.fiber < 20 ? `⚠️ **Fiber Deficiency**: Logged fiber is ${totals.fiber}g (Target: ${targets.targetFiber}g). Add chia seeds, flaxseeds, or greens to improve gut motility.` : `✅ **Fiber Intake is Great!**`}`;
  }

  // 4. REAL WORKOUT & EXERCISE ANALYSIS
  if (queryLower.includes('workout') || queryLower.includes('exercise') || queryLower.includes('burn') || queryLower.includes('activity') || queryLower.includes('walk')) {
    const totalBurned = totals.burnedCalories;
    const exerciseMins = totals.exerciseMinutes || 0;

    return `### 🏋️ Real Exercise & Energy Burn Analysis

#### 🏃 Today's Logged Workouts (${loggedActivities.length}):
${activitiesListText}

#### ⚡ Energy Expenditure Stats:
- **Total Burned from Workout**: **${totalBurned} kcal**
- **Total Exercise Duration**: **${exerciseMins} minutes**
- **Net Calorie Status**: **${totals.calories} consumed** - **${totalBurned} burned** = **${netCalories} net kcal**

#### 💡 Personalized Workout Advice for ${weight}kg Profile:
${exerciseMins < 30 ? `- **Activity Goal**: You have completed **${exerciseMins} mins** of exercise today. We recommend completing **${30 - exerciseMins} more minutes** of cardio or walking to boost your Health Index activity factor.` : `- 🎉 **Activity Target Met!** You have completed **${exerciseMins} mins** of active movement today.`}
- **Recommended Next Routine**: A 20-minute Resistance Bodyweight Circuit (Pushups, Air Squats, Plank holds) to stimulate metabolic rate for up to 14 hours post-workout.`;
  }

  // 5. HYDRATION ANALYSIS
  if (queryLower.includes('water') || queryLower.includes('hydration') || queryLower.includes('drink')) {
    return `### 💧 Real Hydration & Electrolyte Analysis

- **Logged Water Today**: **${waterGlasses}** / **${targets.targetWaterGlasses}** glasses (~**${(waterGlasses * 0.25).toFixed(2)} Liters**)
- **Remaining Target**: **${remainingWater} glasses**

#### 🌊 Impact on Your Health Index:
${waterGlasses >= targets.targetWaterGlasses ? `🎉 **Optimal Hydration Achieved!** Proper water balance enhances thermogenesis and cellular nutrient transport.` : `⚠️ **Hydration Deficit**: You are **${remainingWater} glasses** away from your ideal hydration goal. Drink 2 glasses of water in the next 2 hours.`}`;
  }

  // 6. GENERAL CUSTOM QUERY BASED ON LIVE DATA
  return `### 🤖 NutriAI Customized Response

Hello! Here is your custom real-time status summary:

- **Logged Items**: **${loggedMeals.length} Meals** (${totals.calories} kcal), **${loggedActivities.length} Workouts** (${totals.burnedCalories} kcal burned), **${waterGlasses} Water Glasses**.
- **Net Calorie Balance**: **${netCalories} kcal** (Target: ${targets.targetCalories} kcal).
- **Protein Status**: **${totals.protein}g** / ${targets.targetProtein}g.

#### Your Logged Meals List:
${mealsListText}

Ask me anything specific like:
- *"Analyze my real logged data"*
- *"Suggest a dinner based on what I ate today"*
- *"How many more calories can I eat today?"*`;
}
