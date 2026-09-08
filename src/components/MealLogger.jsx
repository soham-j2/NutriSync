import React, { useState } from 'react';
import { Plus, Search, Trash2, Utensils, AlertTriangle, Check, Sparkles, Filter, X, PlusCircle } from 'lucide-react';
import { IFCT_FOOD_DATABASE } from '../data/ifctFoodDatabase';

export const MealLogger = ({
  loggedMeals,
  onAddMeal,
  onDeleteMeal,
  customFoods = [],
  onAddCustomFood,
  onDeleteCustomFood
}) => {
  const [activeModalSlot, setActiveModalSlot] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedQty, setSelectedQty] = useState(1);

  // Custom food form state
  const [customForm, setCustomForm] = useState({
    name: '',
    portion: '1 serving (150g)',
    category: 'Breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    isJunk: false
  });

  const mealSlots = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const filterTags = ['All', '✨ Custom Dishes', 'High Protein', 'Hostel Favorite', 'South Indian', 'North Indian', 'Street Snack'];

  // Combine static IFCT food dataset + user custom saved foods
  const allFoods = [...customFoods, ...IFCT_FOOD_DATABASE];

  const filteredFoods = allFoods.filter(food => {
    const matchesQuery = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (food.tags && food.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    let matchesTag = selectedTag === 'All';
    if (selectedTag === '✨ Custom Dishes') matchesTag = food.isCustom;
    else if (selectedTag !== 'All') matchesTag = food.tags && food.tags.includes(selectedTag);

    return matchesQuery && matchesTag;
  });

  const getSlotMeals = (slotName) => {
    return loggedMeals.filter(m => m.mealType === slotName);
  };

  const handleSelectFood = (food) => {
    const qty = Number(selectedQty) || 1;
    onAddMeal({
      foodId: food.id,
      name: food.name,
      mealType: activeModalSlot || food.category || 'Breakfast',
      qty: qty,
      calories: Math.round(food.calories * qty),
      protein: Math.round(food.protein * qty),
      carbs: Math.round(food.carbs * qty),
      fat: Math.round(food.fat * qty),
      fiber: Math.round((food.fiber || 0) * qty),
      isJunk: food.isJunk,
      timestamp: new Date().toISOString()
    });
    setActiveModalSlot(null);
    setSearchQuery('');
    setSelectedQty(1);
  };

  const handleCreateCustomFoodSubmit = (e) => {
    e.preventDefault();
    if (!customForm.name.trim()) return;

    const newCustomFood = {
      name: customForm.name.trim(),
      portion: customForm.portion || '1 serving',
      category: customForm.category || activeModalSlot || 'Breakfast',
      calories: Number(customForm.calories) || 0,
      protein: Number(customForm.protein) || 0,
      carbs: Number(customForm.carbs) || 0,
      fat: Number(customForm.fat) || 0,
      fiber: Number(customForm.fiber) || 0,
      isJunk: Boolean(customForm.isJunk),
      tags: ['Custom Dish', customForm.category || 'Homemade'],
      isCustom: true
    };

    // Save to Database
    const savedFood = onAddCustomFood ? onAddCustomFood(newCustomFood) : newCustomFood;

    // Immediately log meal
    handleSelectFood(savedFood);

    // Reset form
    setCustomForm({
      name: '',
      portion: '1 serving (150g)',
      category: 'Breakfast',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      isJunk: false
    });
    setShowCustomModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Daily Meal Logs
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            IFCT Indian Food Dataset + Custom Saved Dishes ({customFoods.length} custom added)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="btn-purple"
            style={{ padding: '8px 14px', fontSize: '12px' }}
            onClick={() => {
              setCustomForm(prev => ({ ...prev, category: activeModalSlot || 'Breakfast' }));
              setShowCustomModal(true);
            }}
          >
            <PlusCircle size={15} />
            <span>Add Custom Dish</span>
          </button>
          
          <span className="chip chip-purple" style={{ padding: '6px 14px', fontSize: '12px' }}>
            <Utensils size={14} />
            {loggedMeals.length} Logged
          </span>
        </div>
      </div>

      {/* Meal Slots Grid (1 col on mobile, 2 cols on desktop) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        {mealSlots.map(slot => {
          const items = getSlotMeals(slot);
          const slotCalories = items.reduce((acc, item) => {
            const f = allFoods.find(db => db.id === item.foodId);
            return acc + (f ? f.calories * (item.qty || 1) : (item.calories || 0));
          }, 0);

          return (
            <div key={slot} className="white-card white-card-hover" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>{slot}</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary-purple)' }}>
                    ({slotCalories} kcal)
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className="btn-subtle"
                    style={{ padding: '6px 10px', fontSize: '11px' }}
                    onClick={() => setActiveModalSlot(slot)}
                  >
                    <Plus size={13} />
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* Logged Items List */}
              {items.length === 0 ? (
                <div 
                  onClick={() => setActiveModalSlot(slot)}
                  style={{
                    border: '2px dashed var(--border-subtle)',
                    borderRadius: '14px',
                    padding: '16px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    background: 'var(--bg-card-subtle)'
                  }}
                >
                  Tap + to search database or add custom {slot.toLowerCase()}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {items.map((item, idx) => {
                    const food = allFoods.find(f => f.id === item.foodId) || item;
                    const qty = item.qty || 1;

                    return (
                      <div 
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: 'var(--bg-card-subtle)',
                          borderRadius: '12px',
                          padding: '10px 12px',
                          border: food.isJunk ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border-subtle)'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{food.name}</span>
                            {qty > 1 && <span style={{ fontSize: '11px', color: 'var(--primary-purple)' }}>x{qty}</span>}
                            {food.isCustom && (
                              <span className="chip chip-purple" style={{ padding: '1px 6px', fontSize: '9px' }}>
                                Custom
                              </span>
                            )}
                            {food.isJunk && (
                              <span className="chip chip-rose" style={{ padding: '1px 6px', fontSize: '9px' }}>
                                <AlertTriangle size={10} /> Junk
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {(food.calories || item.calories) * qty} kcal • P: {Math.round((food.protein || item.protein || 0) * qty)}g | C: {Math.round((food.carbs || item.carbs || 0) * qty)}g | F: {Math.round((food.fat || item.fat || 0) * qty)}g
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteMeal(item)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Food Search Modal / Bottom Sheet */}
      {activeModalSlot && (
        <div className="modal-overlay" onClick={() => setActiveModalSlot(null)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Search & Log {activeModalSlot}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>IFCT Indian Food Dataset & Custom Dishes</span>
              </div>
              <button 
                onClick={() => setActiveModalSlot(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Top Bar with Custom Dish creation shortcut */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} color="var(--primary-purple)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                <input
                  type="text"
                  placeholder="Search food (e.g., Masala Dosa, Dal Tadka, Oats...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 42px',
                    background: 'var(--bg-card-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '14px',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    fontWeight: '500',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                className="btn-purple"
                style={{ padding: '0 14px', fontSize: '12px', whiteSpace: 'nowrap' }}
                onClick={() => {
                  setCustomForm(prev => ({
                    ...prev,
                    category: activeModalSlot || 'Breakfast',
                    name: searchQuery.trim() ? searchQuery.trim() : prev.name
                  }));
                  setShowCustomModal(true);
                }}
              >
                <PlusCircle size={15} />
                <span>+ Custom Dish</span>
              </button>
            </div>

            {/* Filter Tags Pill Row */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px' }}>
              {filterTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    fontWeight: '700',
                    border: 'none',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    background: selectedTag === tag ? 'var(--primary-purple)' : 'var(--bg-card-subtle)',
                    color: selectedTag === tag ? '#ffffff' : 'var(--text-muted)'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Quantity Portion Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', padding: '10px 14px', background: 'var(--bg-card-subtle)', borderRadius: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>Portion Multiplier:</span>
              {[1, 1.5, 2].map(q => (
                <button
                  key={q}
                  onClick={() => setSelectedQty(q)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    border: '1px solid var(--border-subtle)',
                    background: selectedQty === q ? 'var(--primary-purple)' : '#ffffff',
                    color: selectedQty === q ? '#ffffff' : 'var(--text-main)',
                    cursor: 'pointer'
                  }}
                >
                  {q}x
                </button>
              ))}
            </div>

            {/* Food Results List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
              {filteredFoods.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <div>No matching items found in food database.</div>
                  <button
                    className="btn-purple"
                    style={{ marginTop: '12px', padding: '8px 16px', fontSize: '12px' }}
                    onClick={() => {
                      setCustomForm(prev => ({ ...prev, name: searchQuery, category: activeModalSlot }));
                      setShowCustomModal(true);
                    }}
                  >
                    + Create "{searchQuery}" as Custom Dish
                  </button>
                </div>
              ) : (
                filteredFoods.map(food => (
                  <div
                    key={food.id}
                    onClick={() => handleSelectFood(food)}
                    style={{
                      padding: '12px 14px',
                      background: food.isCustom ? 'var(--bg-card-subtle)' : '#ffffff',
                      borderRadius: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: food.isCustom ? '1px solid var(--primary-purple)' : '1px solid var(--border-subtle)',
                      boxShadow: '0 2px 8px rgba(147, 51, 234, 0.04)',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{food.name}</span>
                        {food.isCustom && (
                          <span className="chip chip-purple" style={{ padding: '1px 6px', fontSize: '9px' }}>
                            ✨ Custom Saved
                          </span>
                        )}
                        {food.isJunk && (
                          <span className="chip chip-rose" style={{ padding: '1px 6px', fontSize: '9px' }}>
                            <AlertTriangle size={10} /> Junk
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {food.portion} • <span style={{ color: 'var(--primary-purple)', fontWeight: '700' }}>{food.calories * selectedQty} kcal</span> • P: {food.protein * selectedQty}g | C: {food.carbs * selectedQty}g | F: {food.fat * selectedQty}g
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {food.isCustom && onDeleteCustomFood && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCustomFood(food.id);
                          }}
                          title="Delete from custom database"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--accent-rose)',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                      
                      <button className="btn-purple" style={{ padding: '6px 14px', fontSize: '11px' }}>
                        Log Food
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── CREATE CUSTOM DISH MODAL ── */}
      {showCustomModal && (
        <div className="modal-overlay" onClick={() => setShowCustomModal(false)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-purple)' }}>
                  <PlusCircle size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    Add Custom Dish / Meal
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Save to Database & Log Immediately
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowCustomModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Custom Dish Form */}
            <form onSubmit={handleCreateCustomFoodSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Dish Name */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mom's Paneer Paratha, Whey Protein Shake..."
                  value={customForm.name}
                  onChange={(e) => setCustomForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'var(--bg-card-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Meal Slot Category & Portion */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                    Meal Slot
                  </label>
                  <select
                    value={customForm.category}
                    onChange={(e) => setCustomForm(prev => ({ ...prev, category: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'var(--bg-card-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      color: 'var(--text-main)',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    {mealSlots.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                    Portion Serving
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 bowl, 2 pcs, 100g"
                    value={customForm.portion}
                    onChange={(e) => setCustomForm(prev => ({ ...prev, portion: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'var(--bg-card-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      color: 'var(--text-main)',
                      fontSize: '13px',
                      fontWeight: '600',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Macros Grid: Calories, Protein, Carbs, Fat, Fiber */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                    Calories (kcal) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 350"
                    value={customForm.calories}
                    onChange={(e) => setCustomForm(prev => ({ ...prev, calories: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '9px',
                      background: 'var(--bg-card-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      color: 'var(--text-main)',
                      fontSize: '13px',
                      fontWeight: '700'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                    Protein (g) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    placeholder="e.g. 18"
                    value={customForm.protein}
                    onChange={(e) => setCustomForm(prev => ({ ...prev, protein: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '9px',
                      background: 'var(--bg-card-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      color: 'var(--text-main)',
                      fontSize: '13px',
                      fontWeight: '700'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="e.g. 40"
                    value={customForm.carbs}
                    onChange={(e) => setCustomForm(prev => ({ ...prev, carbs: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '9px',
                      background: 'var(--bg-card-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      color: 'var(--text-main)',
                      fontSize: '13px',
                      fontWeight: '700'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="e.g. 10"
                    value={customForm.fat}
                    onChange={(e) => setCustomForm(prev => ({ ...prev, fat: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '9px',
                      background: 'var(--bg-card-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      color: 'var(--text-main)',
                      fontSize: '13px',
                      fontWeight: '700'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                    Fiber (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="e.g. 5"
                    value={customForm.fiber}
                    onChange={(e) => setCustomForm(prev => ({ ...prev, fiber: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '9px',
                      background: 'var(--bg-card-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      color: 'var(--text-main)',
                      fontSize: '13px',
                      fontWeight: '700'
                    }}
                  />
                </div>

                {/* Junk Food Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: 'var(--accent-rose)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={customForm.isJunk}
                      onChange={(e) => setCustomForm(prev => ({ ...prev, isJunk: e.target.checked }))}
                    />
                    <span>Is Junk / Fast Food?</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-purple" style={{ width: '100%', padding: '12px', marginTop: '6px' }}>
                Save Dish to Database & Log Meal
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

