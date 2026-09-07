// BMR & TDEE Biometric Calculators & Nutritional Targets

export const calculateBMR = ({ age = 22, gender = 'male', height = 175, weight = 68 }) => {
  const h = Number(height);
  const w = Number(weight);
  const a = Number(age);

  if (gender === 'female') {
    return Math.round(10 * w + 6.25 * h - 5 * a - 161);
  }
  return Math.round(10 * w + 6.25 * h - 5 * a + 5);
};

export const calculateTDEE = (bmr, activityLevel = 'moderate') => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extra: 1.9
  };
  const mult = multipliers[activityLevel] || 1.55;
  return Math.round(bmr * mult);
};

export const calculateNutritionalTargets = (profile = {}) => {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);

  let targetCalories = tdee;
  if (profile.goal === 'lose') targetCalories -= 400;
  if (profile.goal === 'gain') targetCalories += 350;

  // Target Macros
  const targetProtein = Math.round((targetCalories * 0.25) / 4); // 25% protein
  const targetCarbs = Math.round((targetCalories * 0.50) / 4);   // 50% carbs
  const targetFat = Math.round((targetCalories * 0.25) / 9);     // 25% fat
  const targetFiber = 30; // IFCT recommended fiber target
  const targetWaterGlasses = 8;

  return {
    bmr,
    tdee,
    targetCalories,
    targetProtein,
    targetProteinGrams: targetProtein,
    targetCarbs,
    targetCarbsGrams: targetCarbs,
    targetFat,
    targetFatGrams: targetFat,
    targetFiber,
    targetFiberGrams: targetFiber,
    targetWaterGlasses
  };
};

export const calculateActivityBurn = (met, durationMinutes, weightKg = 68) => {
  const metVal = Number(met);
  const dur = Number(durationMinutes);
  const w = Number(weightKg);
  return Math.round((metVal * 3.5 * w / 200) * dur);
};
