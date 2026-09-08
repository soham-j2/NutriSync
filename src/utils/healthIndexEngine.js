// Composite Health Index Scoring Engine (0-100)
// Formula: Health Index = 0.30*(NutrientBalance) + 0.25*(JunkFoodPenalty) + 0.20*(ExerciseConsistency) + 0.15*(Hydration) + 0.10*(CalorieTrend)

import { IFCT_FOOD_DATABASE, EXERCISE_ACTIVITIES } from '../data/ifctFoodDatabase';
import { calculateNutritionalTargets, calculateActivityBurn } from './healthCalculators';

export const computeDailyHealthIndex = (loggedMeals = [], loggedActivities = [], waterGlasses = 0, userProfile = {}, customFoods = []) => {
  const targets = calculateNutritionalTargets(userProfile);

  const combinedDatabase = [...customFoods, ...IFCT_FOOD_DATABASE];

  // 1. Aggregate nutrients from logged meals
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalSodium = 0;
  let totalSugar = 0;
  let junkItemCount = 0;

  loggedMeals.forEach(entry => {
    const food = combinedDatabase.find(f => f.id === entry.foodId);
    const qty = Number(entry.qty) || 1;
    if (food) {
      totalCalories += food.calories * qty;
      totalProtein += food.protein * qty;
      totalCarbs += food.carbs * qty;
      totalFat += food.fat * qty;
      totalFiber += (food.fiber || 0) * qty;
      totalSodium += (food.sodium || 0) * qty;
      totalSugar += (food.sugar || 0) * qty;
      if (food.isJunk) junkItemCount += qty;
    } else if (entry.calories !== undefined) {
      // Direct custom entry values
      totalCalories += (entry.calories || 0);
      totalProtein += (entry.protein || 0);
      totalCarbs += (entry.carbs || 0);
      totalFat += (entry.fat || 0);
      totalFiber += (entry.fiber || 0);
      totalSodium += (entry.sodium || 0);
      totalSugar += (entry.sugar || 0);
      if (entry.isJunk) junkItemCount += qty;
    }
  });

  // 2. Aggregate burn from logged activities
  let totalBurnedCalories = 0;
  let totalExerciseMinutes = 0;
  loggedActivities.forEach(act => {
    const actDef = EXERCISE_ACTIVITIES.find(a => a.id === act.activityId);
    const met = actDef ? actDef.met : 3.8;
    const dur = Number(act.duration) || 0;
    totalExerciseMinutes += dur;
    totalBurnedCalories += calculateActivityBurn(met, dur, userProfile.weight || 68);
  });

  // Handle empty state gracefully
  if (loggedMeals.length === 0 && loggedActivities.length === 0 && waterGlasses === 0) {
    return {
      finalScore: 50,
      healthIndexScore: 50,
      grade: { label: 'Moderate', color: 'amber', badge: 'Log Started' },

      totals: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sodium: 0,
        sugar: 0,
        burnedCalories: 0,
        exerciseMinutes: 0,
        waterGlasses: 0,
        junkItemCount: 0
      },
      targets,
      subScores: {
        nutrientBalanceScore: 50,
        junkPenaltyScore: 100,
        exerciseScore: 0,
        hydrationScore: 0,
        calorieTrendScore: 50
      },
      suggestions: [
        {
          type: 'info',
          title: 'Start Logging Today',
          message: 'Log your breakfast, lunch, or a quick walk to compute your daily composite Health Index score!',
          category: 'Getting Started'
        }
      ]
    };
  }

  // --- SUB-SCORE COMPUTATIONS (0 - 100 each) ---

  // A. Nutrient Balance Score (Weight: 30%)
  const proteinRatio = Math.min(totalProtein / Math.max(targets.targetProteinGrams, 1), 1.2);
  const fiberRatio = Math.min(totalFiber / Math.max(targets.targetFiberGrams, 1), 1.2);
  
  const actualCarbCal = totalCarbs * 4;
  const carbPct = totalCalories > 0 ? actualCarbCal / totalCalories : 0.5;
  const carbScore = (carbPct >= 0.40 && carbPct <= 0.60) ? 100 : Math.max(0, 100 - Math.abs(carbPct - 0.50) * 150);

  const nutrientBalanceScore = Math.round(
    (proteinRatio * 40) + (fiberRatio * 35) + (carbScore * 0.25)
  );
  const clampedNutrientScore = Math.min(Math.max(nutrientBalanceScore, 10), 100);

  // B. Junk Food Penalty / Clean Diet Score (Weight: 25%)
  let junkPenaltyScore = 100;
  junkPenaltyScore -= junkItemCount * 18;
  if (totalSodium > 2000) junkPenaltyScore -= Math.min(25, (totalSodium - 2000) / 100);
  if (totalSugar > 35) junkPenaltyScore -= Math.min(20, (totalSugar - 35) * 1.5);
  const clampedJunkScore = Math.min(Math.max(Math.round(junkPenaltyScore), 0), 100);

  // C. Exercise Consistency Score (Weight: 20%)
  const minRatio = Math.min(totalExerciseMinutes / 30, 1.2);
  const burnRatio = Math.min(totalBurnedCalories / 250, 1.2);
  const exerciseScore = Math.min(Math.round(((minRatio + burnRatio) / 2) * 100), 100);

  // D. Hydration Score (Weight: 15%)
  const hydrationRatio = Math.min(waterGlasses / Math.max(targets.targetWaterGlasses, 1), 1.0);
  const hydrationScore = Math.round(hydrationRatio * 100);

  // E. Calorie Trend Score (Weight: 10%)
  // Only penalise over-eating (>110% of target), not under-eating (user may not have logged all meals yet)
  const netCalories = totalCalories - totalBurnedCalories;
  let calorieTrendScore = 100;
  if (netCalories > targets.targetCalories * 1.10) {
    const overageKcal = netCalories - targets.targetCalories;
    calorieTrendScore = Math.max(20, 100 - Math.round(overageKcal / 15));
  }

  // --- FINAL COMPOSITE HEALTH INDEX ---
  const rawComposite = (
    (clampedNutrientScore * 0.30) +
    (clampedJunkScore * 0.25) +
    (exerciseScore * 0.20) +
    (hydrationScore * 0.15) +
    (calorieTrendScore * 0.10)
  );

  const finalScore = Math.min(Math.max(Math.round(rawComposite), 0), 100);

  // Determine Grade Badge
  let grade = { label: 'Needs Attention', color: 'rose', badge: 'Critical Gap' };
  if (finalScore >= 80) grade = { label: 'Optimal Balance', color: 'emerald', badge: 'Excellent' };
  else if (finalScore >= 60) grade = { label: 'Good Health', color: 'cyan', badge: 'On Track' };
  else if (finalScore >= 40) grade = { label: 'Moderate', color: 'amber', badge: 'Fair' };

  // --- GENERATE RULE-BASED SUGGESTIONS ---
  const suggestions = [];

  if (totalProtein < targets.targetProteinGrams * 0.7 && totalCalories > 0) {
    suggestions.push({
      type: 'warning',
      title: 'Protein Deficit Detected',
      message: `Logged ${Math.round(totalProtein)}g protein out of ${targets.targetProteinGrams}g target. Try adding eggs, paneer, sprouted chana, or curd.`,
      category: 'Nutrition'
    });
  }

  if (junkItemCount > 0 || totalSodium > 2000) {
    suggestions.push({
      type: 'danger',
      title: 'High Sodium / Fried Food Penalty',
      message: `Deep-fried or high-sodium items detected (${Math.round(totalSodium)}mg sodium). Drink extra water to support fluid balance.`,
      category: 'Junk Food'
    });
  }

  if (totalExerciseMinutes < 20) {
    suggestions.push({
      type: 'info',
      title: 'Boost Activity Score',
      message: `Only ${totalExerciseMinutes} mins exercise logged today. A 15-minute brisk walk will boost your Health Index by ~8 points!`,
      category: 'Exercise'
    });
  }

  if (waterGlasses < 6) {
    suggestions.push({
      type: 'info',
      title: 'Hydration Target Gap',
      message: `Logged ${waterGlasses}/${targets.targetWaterGlasses} glasses of water. Sip 2 more glasses before bed to support digestion.`,
      category: 'Hydration'
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      type: 'success',
      title: 'Outstanding Daily Balance!',
      message: 'Great job maintaining balanced macros, low junk intake, and active physical movement today.',
      category: 'Overall'
    });
  }

  return {
    finalScore,
    healthIndexScore: finalScore,
    grade,
    waterGlasses,

    totals: {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat),
      fiber: Math.round(totalFiber),
      sodium: Math.round(totalSodium),
      sugar: Math.round(totalSugar),
      burnedCalories: Math.round(totalBurnedCalories),
      exerciseMinutes: Math.round(totalExerciseMinutes),
      waterGlasses,
      junkItemCount
    },
    targets,
    subScores: {
      nutrientBalanceScore: clampedNutrientScore,
      junkPenaltyScore: clampedJunkScore,
      exerciseScore,
      hydrationScore,
      calorieTrendScore
    },
    suggestions
  };
};
