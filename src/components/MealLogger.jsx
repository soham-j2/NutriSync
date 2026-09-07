import React, { useState } from 'react';
import { Plus, Search, Trash2, Utensils, AlertTriangle, Check, Sparkles, Filter, X } from 'lucide-react';
import { IFCT_FOOD_DATABASE } from '../data/ifctFoodDatabase';

export const MealLogger = ({ loggedMeals, onAddMeal, onDeleteMeal }) => {
  const [activeModalSlot, setActiveModalSlot] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedQty, setSelectedQty] = useState(1);

  const mealSlots = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const filterTags = ['All', 'High Protein', 'Hostel Favorite', 'South Indian', 'North Indian', 'Street Snack'];

  const filteredFoods = IFCT_FOOD_DATABASE.filter(food => {
    const matchesQuery = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         food.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === 'All' || food.tags.includes(selectedTag);
    return matchesQuery && matchesTag;
  });

  const getSlotMeals = (slotName) => {
    return loggedMeals.filter(m => m.mealType === slotName);
  };

  const handleSelectFood = (food) => {
    onAddMeal({
      foodId: food.id,
      mealType: activeModalSlot,
      qty: selectedQty,
      timestamp: new Date().toISOString()
    });
    setActiveModalSlot(null);
    setSearchQuery('');
    setSelectedQty(1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Daily Meal Logs
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Seeded IFCT Indian Food Database
          </span>
        </div>
        <span className="chip chip-purple" style={{ padding: '6px 14px', fontSize: '12px' }}>
          <Utensils size={14} />
          {loggedMeals.length} Food Items Logged
        </span>
      </div>

      {/* Meal Slots Grid (1 col on mobile, 2 cols on desktop) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        {mealSlots.map(slot => {
          const items = getSlotMeals(slot);
          const slotCalories = items.reduce((acc, item) => {
            const f = IFCT_FOOD_DATABASE.find(db => db.id === item.foodId);
            return acc + (f ? f.calories * (item.qty || 1) : 0);
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

                <button
                  className="btn-subtle"
                  style={{ padding: '6px 12px', fontSize: '11px' }}
                  onClick={() => setActiveModalSlot(slot)}
                >
                  <Plus size={14} />
                  <span>Add Food</span>
                </button>
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
                  Tap + to search and add your {slot.toLowerCase()}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {items.map((item, idx) => {
                    const food = IFCT_FOOD_DATABASE.find(f => f.id === item.foodId);
                    if (!food) return null;
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
                            {food.isJunk && (
                              <span className="chip chip-rose" style={{ padding: '1px 6px', fontSize: '9px' }}>
                                <AlertTriangle size={10} /> Junk
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {food.calories * qty} kcal • P: {Math.round(food.protein * qty)}g | C: {Math.round(food.carbs * qty)}g | F: {Math.round(food.fat * qty)}g
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

      {/* Food Search Bottom Sheet / Desktop Modal */}
      {activeModalSlot && (
        <div className="modal-overlay" onClick={() => setActiveModalSlot(null)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Search & Log {activeModalSlot}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>IFCT Indian Food Dataset</span>
              </div>
              <button 
                onClick={() => setActiveModalSlot(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <Search size={18} color="var(--primary-purple)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
              <input
                type="text"
                placeholder="Search food item (e.g., Masala Dosa, Dal Tadka, Poha...)"
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto' }}>
              {filteredFoods.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No matching items found in Indian food database.
                </div>
              ) : (
                filteredFoods.map(food => (
                  <div
                    key={food.id}
                    onClick={() => handleSelectFood(food)}
                    style={{
                      padding: '12px 14px',
                      background: '#ffffff',
                      borderRadius: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 2px 8px rgba(147, 51, 234, 0.04)',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                        {food.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {food.portion} • <span style={{ color: 'var(--primary-purple)', fontWeight: '700' }}>{food.calories * selectedQty} kcal</span>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                        {food.tags.map((t, idx) => (
                          <span key={idx} style={{ fontSize: '10px', background: 'var(--bg-card-subtle)', padding: '2px 8px', borderRadius: '6px', color: 'var(--text-purple-muted)', fontWeight: '600' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-emerald)', marginBottom: '6px' }}>
                        +{food.protein * selectedQty}g Protein
                      </div>
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

    </div>
  );
};
