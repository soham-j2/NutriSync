// NutriAI Engine — powered by Google Generative AI
// Set VITE_GEMINI_API_KEY in your .env file to enable live AI responses.

export const QUICK_PROMPTS = [
  { id: 'analyze', text: 'Analyze My Real Logged Data' },
  { id: 'dinner', text: 'Suggest Personalized Meal' },
  { id: 'macros', text: 'Critique My Macro Balance' },
  { id: 'workout', text: 'Analyze Workout Progress' },
  { id: 'hydration', text: 'Hydration & Water Goal' }
];

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Calls Real Live Google Gemini API with full user context.
 */
export async function callGeminiApi(userQuery, healthAnalysis, loggedMeals = [], loggedActivities = [], userProfile = {}) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_key_here') {
    console.warn('[NutriAI] No valid API key. Using smart local engine.');
    return generateSmartLocalResponse(userQuery, healthAnalysis, loggedMeals, loggedActivities, userProfile);
  }

  const score = healthAnalysis?.finalScore ?? healthAnalysis?.healthIndexScore ?? 50;
  const totals = healthAnalysis?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, burnedCalories: 0, exerciseMinutes: 0, junkItemCount: 0 };
  const targets = healthAnalysis?.targets || { targetCalories: 2000, targetProtein: 120, targetCarbs: 250, targetFat: 60, targetFiber: 28, targetWaterGlasses: 8 };
  const waterGlasses = healthAnalysis?.waterGlasses ?? healthAnalysis?.totals?.waterGlasses ?? 0;

  const mealsText = loggedMeals.length > 0
    ? loggedMeals.map(m => `- ${m.name}: ${m.calories} kcal, ${m.protein}g protein, ${m.carbs}g carbs, ${m.fat}g fat, ${m.fiber || 0}g fiber`).join('\n')
    : 'No meals logged yet today.';

  const workoutsText = loggedActivities.length > 0
    ? loggedActivities.map(a => `- ${a.name}: ${a.durationMins || a.duration || 0} mins, ${a.caloriesBurned || a.calories || 0} kcal burned`).join('\n')
    : 'No workouts logged yet today.';

  const userName = userProfile?.name?.trim() ? userProfile.name : 'User';
  const firstName = userName.split(' ')[0];

  const promptText = `You are NutriAI, an elite encouraging scientific nutrition & health coach inside the NutriVista app.
Respond concisely with rich Markdown (### headers, • bullets, **bold**).
IMPORTANT: Address the user by their name "${firstName}" when appropriate.
IMPORTANT: When recommending foods, ALWAYS name specific Indian dishes (e.g. "Paneer Tikka", "Moong Dal Chilla", "Rajma Chawal"). Never say "high-protein meal" without naming the dish.

LIVE USER DATA:
- Profile: Name: ${userName}, ${userProfile.gender || 'male'}, ${userProfile.age || 21} yrs, ${userProfile.weight || 68}kg, ${userProfile.height || 175}cm. Goal: ${userProfile.goal || 'maintain'}.
- Health Index Score: ${score}/100.
- Calories today: ${totals.calories} kcal eaten / ${targets.targetCalories} kcal target (${targets.targetCalories - totals.calories} kcal left).
- Exercise: ${totals.burnedCalories} kcal burned (${totals.exerciseMinutes} mins active).
- Net calories: ${totals.calories - totals.burnedCalories} kcal.
- Protein: ${totals.protein}g / ${targets.targetProtein}g target (${Math.max(0, targets.targetProtein - totals.protein)}g still needed).
- Carbs: ${totals.carbs}g / ${targets.targetCarbs}g. Fat: ${totals.fat}g / ${targets.targetFat}g. Fiber: ${totals.fiber}g / ${targets.targetFiber}g.
- Water: ${waterGlasses} / ${targets.targetWaterGlasses} glasses. Junk items: ${totals.junkItemCount}.

MEALS LOGGED TODAY:
${mealsText}

WORKOUTS LOGGED TODAY:
${workoutsText}

USER QUESTION: "${userQuery}"

Give an intelligent, personalized, actionable answer using the real data above. Address ${firstName} naturally. Reference logged meals by name. Suggest specific Indian dish names. Be concise and motivating.`;

  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });

    if (res.ok) {
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply && reply.trim()) return reply;
      console.warn('[NutriAI] Empty response from API.');
    } else {
      const errData = await res.json().catch(() => ({}));
      console.error(`[NutriAI] API error ${res.status}:`, errData?.error?.message || res.statusText);
    }
  } catch (e) {
    console.error('[NutriAI] Network error:', e.message);
  }

  return generateSmartLocalResponse(userQuery, healthAnalysis, loggedMeals, loggedActivities, userProfile);
}

/**
 * Smart local engine — gives different, question-aware answers based on
 * keyword detection. Used when API is unavailable.
 */
export function generateSmartLocalResponse(userQuery, healthAnalysis, loggedMeals = [], loggedActivities = [], userProfile = {}) {
  const q = (userQuery || '').toLowerCase();
  const userName = userProfile?.name?.trim() ? userProfile.name.split(' ')[0] : 'there';
  const score = healthAnalysis?.finalScore ?? healthAnalysis?.healthIndexScore ?? 50;
  const totals = healthAnalysis?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, burnedCalories: 0, exerciseMinutes: 0 };
  const targets = healthAnalysis?.targets || { targetCalories: 2000, targetProtein: 120, targetCarbs: 250, targetFat: 60, targetFiber: 30, targetWaterGlasses: 8 };
  const waterGlasses = healthAnalysis?.waterGlasses ?? healthAnalysis?.totals?.waterGlasses ?? 0;
  const remainingCal = targets.targetCalories - totals.calories;
  const remainingProtein = Math.max(0, targets.targetProtein - totals.protein);
  const mealNames = loggedMeals.map(m => m.name).join(', ') || 'nothing yet';

  // ── Meal / food / dinner suggestion ──
  if (q.match(/meal|food|eat|dinner|lunch|breakfast|snack|suggest|recommend|dish/)) {
    const proteinNeeded = remainingProtein > 0;
    return `### 🍽️ Personalised Meal Suggestions for ${userName}

**Based on your data**: You've had ${totals.calories} kcal (${mealNames}). You still have **${remainingCal > 0 ? remainingCal : 0} kcal** left for the day.

${proteinNeeded ? `⚠️ You need **${remainingProtein}g more protein** today. Prioritise protein-rich options below.\n` : '✅ Great protein intake today!\n'}
**Recommended for your remaining meals:**

• **Egg Curry with 2 Roti** — ~470 kcal, 22g protein. Great protein boost.
• **Paneer Bhurji with Chapati** — ~420 kcal, 20g protein. Quick to make.
• **Rajma Chawal** — ~420 kcal, 14.5g protein, 8.5g fiber. Balanced & filling.
• **Moong Dal Chilla (2 pcs)** — ~280 kcal, 16g protein. Light high-protein option.
• **Curd Rice with pickle** — ~300 kcal, 9g protein. Easy digestive dinner.
• **Grilled Chicken with Salad** — ~350 kcal, 35g protein. Best for muscle goal.

Pick whichever fits your remaining calorie budget of ~${Math.max(0, remainingCal)} kcal.`;
  }

  // ── Protein / macros ──
  if (q.match(/protein|macro|carb|fat|fiber|nutri/)) {
    const proteinPct = Math.round((totals.protein / targets.targetProtein) * 100);
    const carbPct = Math.round((totals.carbs / targets.targetCarbs) * 100);
    const fatPct = Math.round((totals.fat / targets.targetFat) * 100);
    return `### 📊 Your Macro Balance Analysis

**Meals logged**: ${mealNames}

| Macro | Consumed | Target | Progress |
|-------|----------|--------|----------|
| 🥩 Protein | ${totals.protein}g | ${targets.targetProtein}g | ${proteinPct}% |
| 🍚 Carbs | ${totals.carbs}g | ${targets.targetCarbs}g | ${carbPct}% |
| 🥑 Fat | ${totals.fat}g | ${targets.targetFat}g | ${fatPct}% |
| 🌾 Fiber | ${totals.fiber}g | ${targets.targetFiber}g | ${Math.round(totals.fiber/targets.targetFiber*100)}% |

${remainingProtein > 0 ? `• **Protein gap**: Add **${remainingProtein}g more** — try Paneer Tikka, Boiled Eggs, Moong Dal Chilla, or Sprouts Salad.` : '• ✅ **Protein target hit!** Great work.'}
${totals.fiber < targets.targetFiber * 0.7 ? `• **Fiber low** — add Rajma, Palak Sabzi, or a Fruit Bowl to boost digestion.` : '• ✅ Good fiber intake.'}
${carbPct > 110 ? `• ⚠️ Carbs slightly high — balance with more protein-rich foods.` : '• ✅ Carb intake looks balanced.'}`;
  }

  // ── Workout / exercise / calories burned ──
  if (q.match(/workout|exercise|gym|run|walk|activity|burn|calories? burn/)) {
    const burnTarget = 300;
    const remaining = Math.max(0, burnTarget - totals.burnedCalories);
    return `### 🏋️ Workout & Activity Analysis

**Today's activity**: ${loggedActivities.length > 0 ? loggedActivities.map(a => a.name).join(', ') : 'No workouts logged yet'}
• **Calories burned**: **${totals.burnedCalories} kcal** over **${totals.exerciseMinutes} minutes**

${totals.burnedCalories >= burnTarget
  ? '✅ **Great job!** You\'ve hit a solid calorie burn today.'
  : `⚠️ You've burned ${totals.burnedCalories} kcal. Add **${remaining} more kcal** to hit a good daily burn.`}

**Suggestions to boost activity:**
• **Brisk Walk 20 mins** — burns ~90 kcal, great for after-meal digestion
• **Stair Climbing 10 mins** — burns ~75 kcal, no equipment needed
• **Yoga & Stretching 30 mins** — burns ~60 kcal, reduces stress
• **Campus Walking 25 mins** — burns ~80 kcal, easy to fit in schedule

${totals.exerciseMinutes >= 30 ? '🎯 You\'re hitting the 30-min daily minimum. Try to sustain this habit!' : '💪 Aim for at least **30 minutes** of activity daily for optimal health.'}`;
  }

  // ── Water / hydration ──
  if (q.match(/water|hydrat|drink|fluid/)) {
    const waterPct = Math.round((waterGlasses / targets.targetWaterGlasses) * 100);
    const remaining = Math.max(0, targets.targetWaterGlasses - waterGlasses);
    return `### 💧 Hydration Status

• **Water consumed**: **${waterGlasses} / ${targets.targetWaterGlasses} glasses** (${waterPct}% of goal)
${waterGlasses >= targets.targetWaterGlasses
  ? '✅ **Excellent!** Hydration goal achieved for today.'
  : `⚠️ You still need **${remaining} more glasses** today.`}

**Why hydration matters for you:**
• Aids digestion of meals like Dal, Rajma & fiber-rich foods
• Boosts metabolism — can increase calorie burn by ~3-5%
• Reduces false hunger signals (people often mistake thirst for hunger)
• Supports kidney function, especially with high-protein meals

**Tips to hit your goal:**
• Keep a 1L bottle at your desk and refill twice
• Drink a glass before each meal (Breakfast, Lunch, Dinner, Snacks)
• Add lemon/cucumber to make it more appealing
• Herbal chai (without sugar) counts toward hydration too`;
  }

  // ── Score / health index ──
  if (q.match(/score|index|health|rating|grade|how am i/)) {
    const grade = score >= 80 ? 'Excellent 🌟' : score >= 60 ? 'Good 👍' : score >= 40 ? 'Fair ⚠️' : 'Needs Work 🔴';
    return `### 🎯 Your Health Index: ${score}/100 — ${grade}

**Meals today**: ${mealNames}

**Score breakdown:**
• 🥗 Nutrition Balance (30%) — based on your protein & fiber intake vs targets
• 🚫 Clean Diet (25%) — penalty for junk items: ${totals.junkItemCount > 0 ? `${totals.junkItemCount} junk items logged` : 'No junk food ✅'}
• 🏃 Exercise (20%) — ${totals.exerciseMinutes} mins active, ${totals.burnedCalories} kcal burned
• 💧 Hydration (15%) — ${waterGlasses}/${targets.targetWaterGlasses} glasses
• 📉 Calorie Trend (10%) — Net ${totals.calories - totals.burnedCalories} kcal consumed

**To improve your score:**
${totals.exerciseMinutes < 30 ? '• Add 20+ mins of brisk walking or Stair Climbing\n' : ''}${remainingProtein > 20 ? `• Eat more protein — try Boiled Eggs, Sprouts Salad, or Paneer Bhurji\n` : ''}${totals.junkItemCount > 0 ? '• Replace one junk item with a clean alternative like Fruit Bowl or Curd\n' : ''}${waterGlasses < targets.targetWaterGlasses - 2 ? '• Drink more water — aim for 2 more glasses before bed\n' : ''}
${score >= 70 ? '🎉 You\'re doing great — keep the momentum going!' : '💪 Small improvements each day add up fast. You\'ve got this!'}`;
  }

  // ── Analysis of current logged data ──
  if (q.match(/analyz|analy|overview|summary|today|logged|data|report/)) {
    return `### 📋 Today's Complete Health Overview

**Your health score: ${score}/100**

**Meals logged** (${loggedMeals.length} items):
${loggedMeals.length > 0 ? loggedMeals.map(m => `• ${m.name} — ${m.calories} kcal, ${m.protein}g protein`).join('\n') : '• No meals logged yet'}

**Nutrition totals:**
• Calories: **${totals.calories} / ${targets.targetCalories} kcal** (${Math.max(0, targets.targetCalories - totals.calories)} kcal remaining)
• Protein: **${totals.protein}g / ${targets.targetProtein}g** ${remainingProtein > 0 ? `(need ${remainingProtein}g more)` : '✅'}
• Fiber: **${totals.fiber}g / ${targets.targetFiber}g**

**Activity:** ${totals.exerciseMinutes} mins | ${totals.burnedCalories} kcal burned
**Water:** ${waterGlasses} / ${targets.targetWaterGlasses} glasses
**Junk items:** ${totals.junkItemCount === 0 ? 'None ✅' : `${totals.junkItemCount} item(s) — watch out!`}

${totals.calories === 0 ? '**Start logging your meals** to get a fully personalised analysis!' : ''}`;
  }

  // ── Generic / fallback — still question-aware ──
  return `### 💬 NutriAI Response

I'm currently running in offline mode. Here's what I can see from your data:

• **Health Score**: **${score}/100** — ${score >= 70 ? 'Looking good!' : 'Room to improve'}
• **Today's meals**: ${mealNames}
• **Calories**: ${totals.calories} kcal eaten / ${targets.targetCalories} kcal target
• **Protein**: ${totals.protein}g / ${targets.targetProtein}g target
• **Activity**: ${totals.burnedCalories} kcal burned (${totals.exerciseMinutes} mins)
• **Water**: ${waterGlasses} / ${targets.targetWaterGlasses} glasses

**You asked:** "${userQuery}"

Try one of the quick action buttons above for detailed analysis on meals, macros, workout, or hydration!`;
}

/**
 * Uses AI to estimate nutrition parameters (calories, protein, carbs, fat, fiber, isJunk)
 * and generates a smart health recommendation for any dish name (e.g. "Khichdi Rice", "Paneer Roll").
 */
export async function fetchNutritionFromAi(dishName) {
  if (!dishName || !dishName.trim()) return null;

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const nameTrimmed = dishName.trim();

  const promptText = `Given the Indian dish or meal name "${nameTrimmed}", return ONLY a raw valid JSON object (with NO markdown formatting, NO markdown backticks) containing accurate standard nutritional values for 1 standard serving/portion:
{
  "name": "${nameTrimmed}",
  "portion": "standard serving size (e.g. 1 bowl (200g) or 2 pcs)",
  "calories": 240,
  "protein": 8.5,
  "carbs": 43.0,
  "fat": 4.2,
  "fiber": 4.5,
  "isJunk": false,
  "recommendation": "1-2 sentence scientific health tip or diet recommendation for eating this dish"
}`;

  if (apiKey && apiKey !== 'your_key_here') {
    try {
      const res = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleaned = rawText.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed && (parsed.calories || parsed.protein)) {
          return {
            name: parsed.name || nameTrimmed,
            portion: parsed.portion || '1 serving (200g)',
            calories: Math.round(Number(parsed.calories) || 250),
            protein: Number(parsed.protein) || 8,
            carbs: Number(parsed.carbs) || 35,
            fat: Number(parsed.fat) || 6,
            fiber: Number(parsed.fiber) || 3,
            isJunk: Boolean(parsed.isJunk),
            recommendation: parsed.recommendation || `${nameTrimmed} provides balanced nutrition. Pair with salad or curd for fiber!`
          };
        }
      }
    } catch (e) {
      console.warn('[NutriAI] Live Gemini parse error, falling back to smart local nutrition engine:', e);
    }
  }

  // Smart local Indian food nutrition estimator fallback
  return estimateLocalNutrition(nameTrimmed);
}

/**
 * Smart local fallback estimator for common Indian dishes when API is unavailable.
 */
function estimateLocalNutrition(dishName) {
  const q = dishName.toLowerCase();

  if (q.includes('khichdi') || q.includes('khichuri') || q.includes('dal rice')) {
    return {
      name: dishName,
      portion: '1 bowl (220g)',
      calories: 240,
      protein: 8.5,
      carbs: 43.0,
      fat: 4.2,
      fiber: 4.8,
      isJunk: false,
      recommendation: 'Khichdi is easy to digest and combines dal + rice for a complete amino acid profile. Pair with curd or a tsp of ghee for optimal nutrient absorption.'
    };
  }

  if (q.includes('paneer')) {
    return {
      name: dishName,
      portion: '1 portion (150g)',
      calories: 320,
      protein: 16.0,
      carbs: 12.0,
      fat: 22.0,
      fiber: 2.5,
      isJunk: false,
      recommendation: 'Paneer is rich in casein protein & calcium! Great for muscle recovery and long-lasting satiety.'
    };
  }

  if (q.includes('chicken') || q.includes('fish') || q.includes('mutton')) {
    return {
      name: dishName,
      portion: '1 portion (180g)',
      calories: 310,
      protein: 28.0,
      carbs: 8.0,
      fat: 14.0,
      fiber: 1.5,
      isJunk: false,
      recommendation: 'Excellent high-protein, low-carb choice! Supports muscle synthesis and fat loss goals.'
    };
  }

  if (q.includes('egg') || q.includes('omelette') || q.includes('bhurji')) {
    return {
      name: dishName,
      portion: '2 eggs serving',
      calories: 190,
      protein: 14.0,
      carbs: 2.0,
      fat: 13.0,
      fiber: 0.5,
      isJunk: false,
      recommendation: 'Eggs deliver high bioavailable protein, Vitamin B12, and healthy choline for brain function.'
    };
  }

  if (q.includes('maggi') || q.includes('noodle') || q.includes('burger') || q.includes('pizza') || q.includes('fries') || q.includes('samosa') || q.includes('pakora')) {
    return {
      name: dishName,
      portion: '1 serving',
      calories: 320,
      protein: 6.0,
      carbs: 48.0,
      fat: 14.0,
      fiber: 1.5,
      isJunk: true,
      recommendation: '⚠️ Ultra-processed / high-sodium item. Enjoy occasionally and drink extra water to balance sodium retention.'
    };
  }

  if (q.includes('dosa') || q.includes('idli') || q.includes('poha') || q.includes('upma')) {
    return {
      name: dishName,
      portion: '1 plate serving',
      calories: 260,
      protein: 6.5,
      carbs: 45.0,
      fat: 6.0,
      fiber: 4.0,
      isJunk: false,
      recommendation: 'Fermented & light breakfast option! Easy on digestion and rich in B-vitamins.'
    };
  }

  // Generic balanced meal estimation
  return {
    name: dishName,
    portion: '1 standard serving (200g)',
    calories: 270,
    protein: 9.0,
    carbs: 40.0,
    fat: 8.0,
    fiber: 3.5,
    isJunk: false,
    recommendation: `AI estimated standard meal parameters for ${dishName}. Balance with fresh salad or curd for fiber & gut health!`
  };
}

