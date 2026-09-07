import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Zap, RefreshCw } from 'lucide-react';
import { callGeminiApi, QUICK_PROMPTS } from '../utils/aiNutritionEngine';

/**
 * Custom lightweight Markdown Formatter for AI chat messages.
 */
function renderFormattedText(text) {
  if (!text) return null;

  const lines = text.split('\n');
  return lines.map((line, idx) => {
    let trimmed = line.trim();

    // Headers
    if (trimmed.startsWith('### ')) {
      return (
        <h4 key={idx} style={{ fontSize: '15px', fontWeight: '800', margin: '8px 0 4px 0', color: 'var(--text-main)' }}>
          {trimmed.replace('### ', '')}
        </h4>
      );
    }
    if (trimmed.startsWith('#### ')) {
      return (
        <h5 key={idx} style={{ fontSize: '13px', fontWeight: '800', margin: '6px 0 3px 0', color: 'var(--primary-purple)' }}>
          {trimmed.replace('#### ', '')}
        </h5>
      );
    }

    // Bullet points
    if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
      const content = trimmed.substring(2);
      return (
        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', margin: '3px 0 3px 4px', fontSize: '13px' }}>
          <span style={{ color: 'var(--primary-purple)', fontWeight: '800', flexShrink: 0, marginTop: '1px' }}>•</span>
          <span>{renderInlineBold(content)}</span>
        </div>
      );
    }

    // Empty lines
    if (trimmed === '') {
      return <div key={idx} style={{ height: '6px' }} />;
    }

    // Normal text
    return (
      <div key={idx} style={{ margin: '2px 0', fontSize: '13px' }}>
        {renderInlineBold(line)}
      </div>
    );
  });
}

/**
 * Replaces **bold** tokens with <strong> element.
 */
function renderInlineBold(str) {
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: '800', color: 'var(--text-main)' }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export const NutriAiAssistant = ({
  isOpen,
  onClose,
  healthAnalysis,
  loggedMeals = [],
  loggedActivities = [],
  userProfile = {}
}) => {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Re-sync dynamic initial welcome message when opening
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const mealsCount = loggedMeals.length;
      const actCount = loggedActivities.length;
      const cals = healthAnalysis?.totals?.calories || 0;
      const protein = healthAnalysis?.totals?.protein || 0;
      const targetP = healthAnalysis?.targets?.targetProtein || 120;
      const score = healthAnalysis?.finalScore ?? healthAnalysis?.healthIndexScore ?? 50;
      const waterGlasses = healthAnalysis?.waterGlasses ?? healthAnalysis?.totals?.waterGlasses ?? 0;
      const targetWater = healthAnalysis?.targets?.targetWaterGlasses ?? 8;

      const userName = userProfile?.name?.trim() ? userProfile.name.split(' ')[0] : 'there';
      const welcomeText = `### 👋 Hello, ${userName}! I'm NutriAI — your personal health coach.

I've loaded your live health metrics for today:
• **Health Index Score**: **${score}/100**
• **Logged Meals**: **${mealsCount} items** (${cals} kcal consumed)
• **Logged Workouts**: **${actCount} sessions** (${healthAnalysis?.totals?.burnedCalories || 0} kcal burned)
• **Protein Progress**: **${protein}g** / ${targetP}g Target
• **Hydration**: **${waterGlasses}** / ${targetWater} glasses

Ask me anything about your real meals, macros, or a personalised diet plan!`;

      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [isOpen, healthAnalysis, loggedMeals, loggedActivities, messages.length]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isThinking]);

  // Intercept browser / mobile hardware Back button when modal is open
  useEffect(() => {
    if (!isOpen) return;

    // Push a history entry so mobile/browser back button closes modal instead of exiting page
    window.history.pushState({ nutriAiOpen: true }, '');

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  const handleModalClose = () => {
    if (window.history.state?.nutriAiOpen) {
      window.history.back();
    } else {
      onClose();
    }
  };

  // Focus input when opening on desktop
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const responseText = await callGeminiApi(query, healthAnalysis, loggedMeals, loggedActivities, userProfile);
      const aiMsg = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error('Error getting NutriAI response:', e);
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    /* Full-screen overlay — flex-end on mobile, center on desktop */
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-end',        /* bottom-sheet on mobile */
        justifyContent: 'center',
        padding: 0,
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={handleModalClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          /* Mobile: 100% wide, 95vh tall, rounded top corners */
          width: '100%',
          height: '95dvh',             /* dvh fills exact viewport on mobile */
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: '24px 24px 0 0',
          border: '1px solid rgba(147, 51, 234, 0.25)',
          boxShadow: '0 -8px 40px rgba(15, 23, 42, 0.35)',
          background: '#ffffff',
          /* On desktop override to centred card */
        }}
        className="nutri-ai-modal"
      >
        {/* ── Sleek Light Header ── */}
        <div style={{
          padding: '14px 18px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f5f2fc 100%)',
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* NutriAI logo icon */}
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(147,51,234,0.5)',
              background: '#1e1b4b'
            }}>
              <img
                src="/ai-logo.png"
                alt="NutriAI"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  // Fallback: show brain emoji if image fails
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:22px">🧠</div>';
                }}
              />
            </div>

            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                NutriAI Health Assistant
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '1px' }}>
                {loggedMeals.length} meals logged · Score: <strong style={{ color: 'var(--primary-purple)' }}>{healthAnalysis?.finalScore ?? 50}/100</strong>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Clear chat button */}
            <button
              onClick={handleClearChat}
              title="Clear chat"
              style={{
                background: 'var(--bg-card-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)',
                borderRadius: '50%', width: '32px', height: '32px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              <RefreshCw size={15} />
            </button>
            {/* Close */}
            <button
              onClick={handleModalClose}
              style={{
                background: 'var(--bg-card-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)',
                borderRadius: '50%', width: '32px', height: '32px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Quick Prompt Pills ── */}
        <div style={{
          padding: '10px 14px',
          background: 'var(--bg-main)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          flexShrink: 0
        }}>
          {QUICK_PROMPTS.map(prompt => (
            <button
              key={prompt.id}
              onClick={() => handleSendMessage(prompt.text)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '6px 13px', borderRadius: '20px', background: '#ffffff',
                border: '1px solid var(--border-subtle)', color: 'var(--primary-purple)',
                fontSize: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
                boxShadow: '0 2px 6px rgba(124,92,191,0.06)', transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-purple)'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = 'var(--primary-purple)'; }}
            >
              <Zap size={12} color="var(--accent-cta)" />
              <span>{prompt.text}</span>
            </button>
          ))}
        </div>

        {/* ── Messages Feed ── */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          background: 'linear-gradient(180deg, var(--bg-main) 0%, #ffffff 100%)'
        }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '8px', maxWidth: '90%',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
              }}>
                {/* Avatar */}
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--accent-cta), #E85D25)' : 'var(--primary-purple)',
                  color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: msg.sender === 'user' ? '0 4px 10px var(--accent-cta-glow)' : '0 4px 10px var(--primary-glow)', overflow: 'hidden'
                }}>
                  {msg.sender === 'user'
                    ? <User size={15} />
                    : <img src="/ai-logo.png" alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.innerHTML = '🧠'; }} />
                  }
                </div>

                {/* Bubble */}
                <div style={{
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #7C5CBF, #9575CD)' : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                  boxShadow: msg.sender === 'user' ? '0 6px 18px var(--primary-glow)' : 'var(--shadow-soft)',
                  fontSize: '13px', lineHeight: '1.6'
                }}>
                  {msg.sender === 'user' ? msg.text : renderFormattedText(msg.text)}
                </div>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px', padding: '0 6px' }}>
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isThinking && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
              background: '#ffffff', borderRadius: '18px', border: '1px solid var(--border-subtle)',
              width: 'fit-content', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', background: '#1e1b4b', flexShrink: 0
              }}>
                <img src="/ai-logo.png" alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.innerHTML = '🧠'; }} />
              </div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-purple)',
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
                  }} />
                ))}
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-purple)' }}>NutriAI is thinking…</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* ── Input Bar ── */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          style={{
            padding: '12px 14px 16px 14px',
            background: '#ffffff',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', gap: '10px',
            flexShrink: 0
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about your meals, macros, or health score…"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            style={{
              flex: 1, padding: '12px 18px', borderRadius: '24px',
              border: '1px solid var(--border-subtle)', background: 'var(--bg-card-subtle)',
              color: 'var(--text-main)', fontSize: '13px', fontWeight: '600', outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isThinking}
            style={{
              width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
              background: (inputQuery.trim() && !isThinking) ? 'linear-gradient(135deg, var(--accent-cta), #E85D25)' : 'var(--bg-card-subtle)',
              color: (inputQuery.trim() && !isThinking) ? '#ffffff' : 'var(--text-muted)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: (inputQuery.trim() && !isThinking) ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              boxShadow: (inputQuery.trim() && !isThinking) ? '0 4px 14px var(--accent-cta-glow)' : 'none'
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }

        /* Desktop: convert to centered modal card */
        @media (min-width: 768px) {
          .nutri-ai-modal {
            height: 88vh !important;
            max-width: 740px !important;
            border-radius: 24px !important;
            margin: auto;
          }
        }
      `}</style>
    </div>
  );
};
