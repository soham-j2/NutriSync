import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Zap, RefreshCw, Cpu } from 'lucide-react';
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
        <h4 key={idx} style={{ fontSize: '15px', fontWeight: '800', margin: '8px 0 4px 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', margin: '2px 0 2px 4px', fontSize: '13px' }}>
          <span style={{ color: 'var(--primary-purple)', fontWeight: '800' }}>•</span>
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

  // Re-sync dynamic initial welcome message when opening
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const mealsCount = loggedMeals.length;
      const actCount = loggedActivities.length;
      const cals = healthAnalysis?.totals?.calories || 0;
      const protein = healthAnalysis?.totals?.protein || 0;
      const targetP = healthAnalysis?.targets?.targetProtein || 120;
      const score = healthAnalysis?.healthIndexScore || 75;

      const welcomeText = `### 👋 Hello! I'm NutriAI powered by Google Gemini.

I've loaded your live health metrics for today:
• **Health Index Score**: **${score}/100**
• **Logged Meals**: **${mealsCount} items** (${cals} kcal consumed)
• **Logged Workouts**: **${actCount} items** (${healthAnalysis?.totals?.burnedCalories || 0} kcal burned)
• **Protein Progress**: **${protein}g** / ${targetP}g Target

Ask me any question about your real meals, macros, or customized diet plans!`;

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

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isThinking]);

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
      console.error('Error getting Gemini AI response:', e);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '720px',
          height: '88vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: '24px',
          border: '1px solid rgba(147, 51, 234, 0.3)',
          boxShadow: '0 25px 60px rgba(15, 23, 42, 0.3)',
          background: '#ffffff'
        }}
      >
        {/* Sleek Dark AI Header Bar */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #9333ea, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(147, 51, 234, 0.5)'
            }}>
              <Sparkles size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
                  NutriAI Health Assistant
                </h3>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  border: '1px solid rgba(52, 211, 153, 0.3)'
                }}>
                  GEMINI 1.5 FLASH (LIVE)
                </span>

              </div>
              <span style={{ fontSize: '11px', color: '#c7d2fe', display: 'block', marginTop: '1px' }}>
                Evaluating {loggedMeals.length} meals | Health Index: <strong>{healthAnalysis?.healthIndexScore || 75}/100</strong>
              </span>
            </div>
          </div>

          <button 
            onClick={onClose} 
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              border: 'none', 
              color: '#ffffff', 
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Prompt Pills Toolbar */}
        <div style={{
          padding: '10px 16px',
          background: '#f8fafc',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {QUICK_PROMPTS.map(prompt => (
            <button
              key={prompt.id}
              onClick={() => handleSendMessage(prompt.text)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                color: 'var(--primary-purple)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--primary-purple)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = 'var(--primary-purple)';
              }}
            >
              <Zap size={13} />
              <span>{prompt.text}</span>
            </button>
          ))}
        </div>

        {/* Messages Feed */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                maxWidth: '88%',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
              }}>
                {/* Avatar */}
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #9333ea, #7e22ce)' : '#1e1b4b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '13px',
                  fontWeight: '700',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                  {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Message Bubble */}
                <div style={{
                  padding: '14px 18px',
                  borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #9333ea, #7e22ce)' : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                  boxShadow: msg.sender === 'user' ? '0 6px 18px var(--primary-glow)' : '0 4px 18px rgba(0,0,0,0.04)',
                  fontSize: '13px',
                  lineHeight: '1.6'
                }}>
                  {msg.sender === 'user' ? msg.text : renderFormattedText(msg.text)}
                </div>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', padding: '0 6px' }}>
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isThinking && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: '#ffffff', borderRadius: '18px', border: '1px solid var(--border-subtle)', width: 'fit-content', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <Bot size={16} color="var(--primary-purple)" />
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-purple)' }}>NutriAI is analyzing live data...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          style={{
            padding: '14px 16px',
            background: '#ffffff',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <input
            type="text"
            placeholder="Ask NutriAI about your real meals, macros, or score..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: '24px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card-subtle)',
              color: 'var(--text-main)',
              fontSize: '13px',
              fontWeight: '600',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: inputQuery.trim() ? 'linear-gradient(135deg, #9333ea, #7e22ce)' : 'var(--bg-card-subtle)',
              color: inputQuery.trim() ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputQuery.trim() ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              boxShadow: inputQuery.trim() ? '0 4px 12px var(--primary-glow)' : 'none'
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
