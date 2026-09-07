import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Zap } from 'lucide-react';
import { generateAiResponse, QUICK_PROMPTS } from '../utils/aiNutritionEngine';
import { FormattedChatMessage } from './FormattedChatMessage';



export const NutriAiAssistant = ({
  isOpen,
  onClose,
  healthAnalysis,
  loggedMeals = [],
  loggedActivities = [],
  userProfile = {}
}) => {
  const [messages, setMessages] = useState([]);

  // Sync initial welcome message with live context whenever modal is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialText = `### 👋 Hello! I'm NutriAI, your personalized health & nutrition coach.

I've analyzed your real live data for today:
- **Health Index Score**: **${healthAnalysis?.healthIndexScore || 75}/100**
- **Logged Meals**: **${loggedMeals.length} items** (${healthAnalysis?.totals?.calories || 0} kcal consumed)
- **Logged Workouts**: **${loggedActivities.length} items** (${healthAnalysis?.totals?.burnedCalories || 0} kcal burned)
- **Protein Intake**: **${healthAnalysis?.totals?.protein || 0}g** / ${healthAnalysis?.targets?.targetProtein || 120}g

Click one of the quick prompts below or ask me any question about your real meals & workout data!`;

      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: initialText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [isOpen, healthAnalysis, loggedMeals, loggedActivities, messages.length]);


  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend) => {
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

    setTimeout(() => {
      const responseText = generateAiResponse(query, healthAnalysis, loggedMeals, loggedActivities, userProfile);
      const aiMsg = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: '24px',
          border: '1px solid rgba(147, 51, 234, 0.25)',
          boxShadow: '0 20px 50px rgba(147, 51, 234, 0.2)'
        }}
      >
        {/* AI Header Bar */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
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
              boxShadow: '0 4px 14px rgba(147, 51, 234, 0.4)'
            }}>
              <Sparkles size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                  NutriAI Assistant
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
                  LIVE ENGINE
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#c7d2fe', display: 'block', marginTop: '1px' }}>
                Daily Health Index: <strong>{healthAnalysis?.healthIndexScore || 75}/100</strong>
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
                padding: '6px 12px',
                borderRadius: '20px',
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                color: 'var(--primary-purple)',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
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
              <Zap size={12} />
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
                maxWidth: '85%',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
              }}>
                {/* Avatar */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: msg.sender === 'user' ? 'var(--primary-purple)' : '#312e81',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '12px',
                  fontWeight: '700',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Message Bubble */}
                <div style={{
                  padding: msg.sender === 'user' ? '12px 16px' : '16px 18px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #9333ea, #7e22ce)' : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                  boxShadow: msg.sender === 'user' ? '0 4px 14px var(--primary-glow)' : '0 4px 18px rgba(15, 23, 42, 0.05)',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  width: '100%'
                }}>
                  <FormattedChatMessage text={msg.text} sender={msg.sender} />
                </div>

              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', padding: '0 6px' }}>
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isThinking && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-subtle)', width: 'fit-content' }}>
              <Bot size={16} color="var(--primary-purple)" />
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-purple)' }}>NutriAI is analyzing metrics...</span>
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
            placeholder="Ask NutriAI (e.g. 'Suggest a meal under 400 kcal')..."
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
