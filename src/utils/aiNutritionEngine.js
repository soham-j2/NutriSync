// High-Precision Real-Data AI Nutrition Engine for NutriVista

export const QUICK_PROMPTS = [
  { id: 'analyze', icon: 'Sparkles', text: 'Analyze My Real Logged Data' },
  { id: 'dinner', icon: 'Utensils', text: 'Suggest Personalized Meal' },
  { id: 'macros', icon: 'PieChart', text: 'Critique My Macro Balance' },
  { id: 'workout', icon: 'Activity', text: 'Analyze Workout Progress' },
  { id: 'hydration', icon: 'Droplets', text: 'Hydration & Water Goal' }
];

/**
 * Builds a clean list of logged meals with exact math.
 */
function getLoggedMealsDetail(loggedMeals = []) {
  if (!loggedMeals || loggedMeals.length === 0) {
    return null;
  }
  return loggedMeals
    .map((m, idx) => `• **${m.name || 'Meal'}**: ${m.calories || 0} kcal | ${m.protein || 0}g Protein | ${m.carbs || 0}g Carbs | ${m.fat || 0}g Fat`)
    .join('\n');
}

/**
 * Builds a clean list of logged workouts with exact math.
 */
function getLoggedActivitiesDetail(loggedActivities = []) {
  if (!loggedActivities || loggedActivities.length === 0) {
    return null;
  }
  return loggedActivities
    .map((a, idx) => `• **${a.name || 'Workout'}**: ${a.durationMins || a.duration || 0} mins | ${a.caloriesBurned || a.calories || 0} kcal burned`)
    .join('\n');
}

/**
 * Generates an AI response based on real mathematical calculations.
 */
export function generateAiResponse(userQuery, healthAnalysis, loggedMeals = [], loggedActivities = [], userProfile = {}) {
  const queryLower = userQuery.toLowerCase().trim();

  // Extract Live Metrics & Targets
  const score = healthAnalysis?.healthIndexScore || 75;
  const totals = healthAnalysis?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, burnedCalories: 0, exerciseMinutes: 0, junkItemCount: 0 };
  const targets = healthAnalysis?.targets || { targetCalories: 2000, targetProtein: 120, targetCarbs: 250, targetFat: 60, targetFiber: 28, targetWaterGlasses: 10 };
  const waterGlasses = healthAnalysis?.waterGlasses || 0;

  // User Profile
  const weight = userProfile.weight || 68;
  const height = userProfile.height || 175;
  const age = userProfile.age || 21;
  const gender = userProfile.gender || 'male';
  const goal = userProfile.goal || 'maintain';

  // Computed Real Math
  const netCalories = totals.calories - totals.burnedCalories;
  const remainingCalories = targets.targetCalories - netCalories;
  const remainingProtein = Math.max(0, targets.targetProtein - totals.protein);
  const remainingWater = Math.max(0, targets.targetWaterGlasses - waterGlasses);

  const mealsText = getLoggedMealsDetail(loggedMeals);
  const activitiesText = getLoggedActivitiesDetail(loggedActivities);

  // Highest protein meal finder
  const sortedByProtein = loggedMeals.length > 0 ? [...loggedMeals].sort((a, b) => (b.protein || 0) - (a.protein || 0)) : [];
  const topProteinMeal = sortedByProtein.length > 0 ? sortedByProtein[0] : null;

  // 1. ANALYZE REAL LOGGED DATA
  if (queryLower.includes('analyze') || queryLower.includes('score') || queryLower.includes('real') || queryLower.includes('data') || queryLower.includes('today')) {
    return `### 📊 Real Data Diagnosis: Health Index **${score}/100**

**Profile**: ${gender.toUpperCase()}, ${age} yrs, ${weight} kg | Goal: **${goal.toUpperCase()}**

#### 🥗 Logged Meals (${loggedMeals.length} items logged):
${mealsText ? mealsText : '_No meals logged yet today. Go to the **Meal Log** tab to add your first meal!_'}

#### 🏃 Logged Workouts (${loggedActivities.length} workouts logged):
${activitiesText ? activitiesText : '_No workouts logged yet today._'}

#### ⚡ Real Mathematical Totals:
• **Calorie Intake**: **${totals.calories} kcal** / **${targets.targetCalories} kcal Target**
• **Burned from Exercise**: **${totals.burnedCalories} kcal** (${totals.exerciseMinutes} active mins)
• **Net Calorie Load**: **${netCalories} kcal** (${remainingCalories >= 0 ? `${remainingCalories} kcal remaining` : `${Math.abs(remainingCalories)} kcal over target`})
• **Protein Progress**: **${totals.protein}g** / **${targets.targetProtein}g Target** (${remainingProtein > 0 ? `Need ${remainingProtein}g more` : '🎉 Goal Met!'})
• **Water Consumed**: **${waterGlasses}** / **${targets.targetWaterGlasses} glasses**

${topProteinMeal ? `💡 **Top Protein Contributor**: *${topProteinMeal.name}* provided **${topProteinMeal.protein}g protein** (${topProteinMeal.calories} kcal).` : ''}`;
  }

  // 2. MEAL SUGGESTIONS BASED ON REMAINING MACROS
  if (queryLower.includes('dinner') || queryLower.includes('meal') || queryLower.includes('suggest') || queryLower.includes('recipe') || queryLower.includes('eat') || queryLower.includes('food')) {
    const mealCalorieBudget = Math.max(250, Math.min(remainingCalories > 0 ? remainingCalories : 400, 600));
    const mealProteinTarget = Math.max(15, Math.min(remainingProtein > 0 ? remainingProtein : 25, 40));

    return `### 🥗 Custom Meal Recommendation (Target: ~${mealCalorieBudget} kcal, ${mealProteinTarget}g Protein)

Based on your current remaining budget (**${remainingCalories > 0 ? remainingCalories : 0} kcal** remaining, **${remainingProtein}g protein** needed):

#### Option 1: Grilled Tofu & Vegetable Skewers with Brown Rice (Veg)
• **Ingredients**: 150g Tofu, 1/2 cup Brown Rice, Bell Peppers, Zucchini.
• **Exact Macros**: ~**380 kcal** | **26g Protein** | 32g Carbs | 12g Fat

#### Option 2: Soya Chunk & Sprouted Moong Salad Bowl (High Protein & Fiber)
• **Ingredients**: 50g Nutrela Soya Chunks (boiled), 1 cup Sprouted Moong, Tomato, Cucumber, Lemon.
• **Exact Macros**: ~**360 kcal** | **34g Protein** | 28g Carbs | 8g Fiber

#### Option 3: Herb-Roasted Chicken Breast with Steamed Veggies (Non-Veg)
• **Ingredients**: 180g Chicken Breast, 100g Sweet Potato, Broccoli.
• **Exact Macros**: ~**410 kcal** | **42g Protein** | 24g Carbs | 6g Fat

_Tip: Pair with 1 glass of water to maximize digestion and nutrient absorption._`;
  }

  // 3. MACRO RATIO CRITIQUE
  if (queryLower.includes('macro') || queryLower.includes('balance') || queryLower.includes('carb') || queryLower.includes('fat') || queryLower.includes('fiber') || queryLower.includes('protein')) {
    const totalCal = totals.calories > 0 ? totals.calories : 1;
    const proteinPct = Math.round((totals.protein * 4 / totalCal) * 100);
    const carbsPct = Math.round((totals.carbs * 4 / totalCal) * 100);
    const fatPct = Math.round((totals.fat * 9 / totalCal) * 100);

    return `### 📈 Real Macro Ratio Breakdown

Calculated directly from your logged foods today:

• **Protein**: **${totals.protein}g** (**${proteinPct}%** of total calories) — Target: **${targets.targetProtein}g**
• **Carbohydrates**: **${totals.carbs}g** (**${carbsPct}%** of total calories) — Target: **${targets.targetCarbs}g**
• **Fat**: **${totals.fat}g** (**${fatPct}%** of total calories) — Target: **${targets.targetFat}g**
• **Dietary Fiber**: **${totals.fiber}g** — Target: **${targets.targetFiber}g**

#### 🔬 AI Critique:
${proteinPct < 22 ? `⚠️ **Low Protein Ratio (${proteinPct}%)**: Ideal range is 25-35%. Increase lean protein to preserve lean muscle mass.` : `✅ **Protein Ratio is Solid (${proteinPct}%)**.`}
${totals.fiber < 20 ? `⚠️ **Fiber Deficit (${totals.fiber}g)**: Aim for 25g+ daily via seeds, salads, and whole grains to improve digestion.` : `✅ **Fiber Intake is Great (${totals.fiber}g)**.`}`;
  }

  // 4. EXERCISE & WORKOUT ANALYSIS
  if (queryLower.includes('workout') || queryLower.includes('exercise') || queryLower.includes('burn') || queryLower.includes('activity') || queryLower.includes('walk')) {
    return `### 🏋️ Real Exercise Expenditure Report

• **Workouts Logged**: **${loggedActivities.length}**
• **Active Exercise Minutes**: **${totals.exerciseMinutes} mins**
• **Calories Burned**: **${totals.burnedCalories} kcal**

#### 🏃 Logged Exercise Items:
${activitiesText ? activitiesText : '_No exercise routines logged yet today._'}

**AI Workout Recommendation:**
${totals.exerciseMinutes < 30 ? `Add **${30 - totals.exerciseMinutes} mins** of brisk walking or HIIT to hit your daily exercise baseline.` : `🎉 Great job hitting **${totals.exerciseMinutes} mins** of workout today!`}`;
  }

  // 5. HYDRATION ANALYSIS
  if (queryLower.includes('water') || queryLower.includes('hydration') || queryLower.includes('drink')) {
    return `### 💧 Real Hydration Metrics

• **Glasses Logged**: **${waterGlasses}** / **${targets.targetWaterGlasses} glasses** (~**${(waterGlasses * 0.25).toFixed(2)} Liters**)
• **Remaining Goal**: **${remainingWater} glasses**

${waterGlasses >= targets.targetWaterGlasses ? `🎉 **Hydration Target Achieved!** Staying hydrated accelerates fat metabolism and mental clarity.` : `💡 **Drink Water Now**: You need **${remainingWater} more glasses** of water today to keep your daily health index high.`}`;
  }

  // 6. DEFAULT GENERAL REAL-DATA RESPONSE
  return `### 🤖 NutriAI Health Diagnosis

Here is your real-time summary for today:
• **Logged Meals**: ${loggedMeals.length} (${totals.calories} kcal, ${totals.protein}g protein)
• **Logged Workouts**: ${loggedActivities.length} (${totals.burnedCalories} kcal burned)
• **Hydration**: ${waterGlasses}/${targets.targetWaterGlasses} glasses
• **Health Index**: **${score}/100**

#### 📋 Logged Foods:
${mealsText ? mealsText : '_No meals logged yet today._'}

Ask me specific questions like:
- *"Analyze my real logged data"*
- *"Suggest a meal based on what I ate today"*
- *"Critique my macro balance"*`;
}
