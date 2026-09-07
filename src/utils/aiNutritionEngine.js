// Real Live Google Gemini AI & Health Intelligence Engine for NutriVista

export const GEMINI_API_KEY = 
  import.meta.env.VITE_GEMINI_API_KEY || 
  'AIzaSyCtTp4j4hvXulxYgIKzkC22Ne3eXu9VAjM';

export const QUICK_PROMPTS = [
  { id: 'analyze', icon: 'Sparkles', text: 'Analyze My Real Logged Data' },
  { id: 'dinner', icon: 'Utensils', text: 'Suggest Personalized Meal' },
  { id: 'macros', icon: 'PieChart', text: 'Critique My Macro Balance' },
  { id: 'workout', icon: 'Activity', text: 'Analyze Workout Progress' },
  { id: 'hydration', icon: 'Droplets', text: 'Hydration & Water Goal' }
];

const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest'
];

/**
 * Calls Real Live Google Gemini API with user context payload.
 */
export async function callGeminiApi(userQuery, healthAnalysis, loggedMeals = [], loggedActivities = [], userProfile = {}) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('[NutriAI] No Gemini API key found, using local fallback engine.');
    return generateFallbackAiResponse(userQuery, healthAnalysis, loggedMeals, loggedActivities, userProfile);
  }

  const score = healthAnalysis?.finalScore ?? healthAnalysis?.healthIndexScore ?? 50;

  const totals = healthAnalysis?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, burnedCalories: 0, exerciseMinutes: 0, junkItemCount: 0 };
  const targets = healthAnalysis?.targets || { targetCalories: 2000, targetProtein: 120, targetCarbs: 250, targetFat: 60, targetFiber: 28, targetWaterGlasses: 8 };
  // waterGlasses is now available at top-level AND inside totals
  const waterGlasses = healthAnalysis?.waterGlasses ?? healthAnalysis?.totals?.waterGlasses ?? 0;

  const mealsText = loggedMeals.length > 0 
    ? loggedMeals.map(m => `- ${m.name}: ${m.calories} kcal, ${m.protein}g protein, ${m.carbs}g carbs, ${m.fat}g fat, ${m.fiber || 0}g fiber`).join('\n')
    : 'No meals logged yet today.';

  const workoutsText = loggedActivities.length > 0
    ? loggedActivities.map(a => `- ${a.name}: ${a.durationMins || a.duration || 0} mins, ${a.caloriesBurned || a.calories || 0} kcal burned`).join('\n')
    : 'No workouts logged yet today.';

  const promptText = `
You are NutriAI, an elite, highly encouraging, and scientific nutrition & health coach built inside the NutriVista health tracking app.
Respond concisely using rich Markdown (headers with ###, bullet points with •, bold text **text**).
IMPORTANT: When recommending meals or foods, ALWAYS use specific Indian dish names (e.g., "Paneer Tikka", "Moong Dal Chilla", "Rajma Chawal", "Sprouts Salad", "Grilled Fish", "Chicken Curry with Brown Rice"). Never use generic phrases like 'high-protein meal' without naming the actual dish.

LIVE USER DATA:
- User Profile: ${userProfile.gender || 'male'}, ${userProfile.age || 21} years old, ${userProfile.weight || 68} kg, ${userProfile.height || 175} cm tall. Primary Goal: ${userProfile.goal || 'maintain'}.
- Daily Composite Health Index Score: ${score}/100.
- Calorie Intake So Far: ${totals.calories} kcal (Daily Target: ${targets.targetCalories} kcal; ${targets.targetCalories - totals.calories} kcal remaining for the day).
- Exercise Burned: ${totals.burnedCalories} kcal (${totals.exerciseMinutes} active mins).
- Net Calories (Intake - Burned): ${totals.calories - totals.burnedCalories} kcal.
- Protein Intake: ${totals.protein}g (Target: ${targets.targetProtein}g; ${Math.max(0, targets.targetProtein - totals.protein)}g still needed).
- Carbohydrates: ${totals.carbs}g (Target: ${targets.targetCarbs}g).
- Dietary Fat: ${totals.fat}g (Target: ${targets.targetFat}g).
- Fiber: ${totals.fiber}g (Target: ${targets.targetFiber}g).
- Water Intake: ${waterGlasses} / ${targets.targetWaterGlasses} glasses.
- Junk Items Logged: ${totals.junkItemCount}.

LOGGED MEALS TODAY:
${mealsText}

LOGGED WORKOUTS TODAY:
${workoutsText}

USER QUESTION: "${userQuery}"

Provide an intelligent, personalized, and actionable response based directly on the above real user data. Always reference actual logged meals by name. When suggesting foods, name specific Indian dishes. Be concise, practical, and highly motivating!
`;

  // Try each supported model until one succeeds
  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply && reply.trim()) {
          return reply;
        }
      } else {
        console.warn(`[NutriAI Gemini Model ${model} returned ${res.status}]`);
      }
    } catch (e) {
      console.warn(`[NutriAI Gemini Model ${model} failed]`, e);
    }
  }

  // Local fallback if all model calls fail
  return generateFallbackAiResponse(userQuery, healthAnalysis, loggedMeals, loggedActivities, userProfile);
}

/**
 * Mathematical Fallback Engine if network is offline.
 */
export function generateFallbackAiResponse(userQuery, healthAnalysis, loggedMeals = [], loggedActivities = [], userProfile = {}) {
  const score = healthAnalysis?.finalScore ?? healthAnalysis?.healthIndexScore ?? 50;

  const totals = healthAnalysis?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, burnedCalories: 0, exerciseMinutes: 0 };
  const targets = healthAnalysis?.targets || { targetCalories: 2000, targetProtein: 120, targetWaterGlasses: 10 };
  const waterGlasses = healthAnalysis?.waterGlasses || 0;
  const remainingCalories = targets.targetCalories - (totals.calories - totals.burnedCalories);
  const remainingProtein = Math.max(0, targets.targetProtein - totals.protein);

  return `### 📊 Real Data Analysis (Health Index: ${score}/100)

- **Calorie Intake**: **${totals.calories}** / **${targets.targetCalories} kcal** (${remainingCalories >= 0 ? `${remainingCalories} kcal remaining` : `${Math.abs(remainingCalories)} kcal over target`})
- **Protein Intake**: **${totals.protein}g** / **${targets.targetProtein}g** (${remainingProtein > 0 ? `Need ${remainingProtein}g more` : 'Target Achieved!'})
- **Workouts**: **${loggedActivities.length} items** (${totals.burnedCalories} kcal burned)
- **Water**: **${waterGlasses}** / **${targets.targetWaterGlasses} glasses**

Ask me anything specific about your daily diet or workout progress!`;
}
