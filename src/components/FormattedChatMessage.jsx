import React from 'react';
import { Copy, Check, Sparkles, Utensils, Activity, Droplets } from 'lucide-react';

export const FormattedChatMessage = ({ text, sender }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (sender === 'user') {
    return <div style={{ fontWeight: '600', fontSize: '13.5px' }}>{text}</div>;
  }

  // Parse lines for AI Markdown formatting
  const lines = text.split('\n');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', position: 'relative' }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) return <div key={idx} style={{ height: '4px' }} />;

        // Headers: ### Header
        if (trimmed.startsWith('### ')) {
          const headerText = trimmed.replace('### ', '');
          return (
            <div 
              key={idx} 
              style={{ 
                fontSize: '15px', 
                fontWeight: '800', 
                color: 'var(--text-main)', 
                margin: '6px 0 2px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '4px'
              }}
            >
              {renderFormattedText(headerText)}
            </div>
          );
        }

        // Subheaders: #### Subheader
        if (trimmed.startsWith('#### ')) {
          const subText = trimmed.replace('#### ', '');
          return (
            <div 
              key={idx} 
              style={{ 
                fontSize: '13px', 
                fontWeight: '800', 
                color: 'var(--primary-purple)', 
                margin: '4px 0 2px 0'
              }}
            >
              {renderFormattedText(subText)}
            </div>
          );
        }

        // Bullet Points: - or *
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.replace(/^[-*]\s+/, '');
          return (
            <div 
              key={idx} 
              style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '8px', 
                background: 'rgba(147, 51, 234, 0.03)',
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(147, 51, 234, 0.08)',
                fontSize: '12.5px',
                color: 'var(--text-main)',
                lineHeight: '1.5'
              }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-purple)', marginTop: '6px', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>{renderFormattedText(bulletText)}</div>
            </div>
          );
        }

        // Numbered Items: 1. 2.
        if (/^\d+\.\s+/.test(trimmed)) {
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '8px', 
                  background: 'rgba(6, 182, 212, 0.04)',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(6, 182, 212, 0.12)',
                  fontSize: '12.5px',
                  color: 'var(--text-main)',
                  lineHeight: '1.5'
                }}
              >
                <span style={{ fontWeight: '800', color: 'var(--accent-cyan)', fontSize: '12px' }}>{numMatch[1]}.</span>
                <div style={{ flex: 1 }}>{renderFormattedText(numMatch[2])}</div>
              </div>
            );
          }
        }

        // Italic tips
        if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.includes('**')) {
          return (
            <div key={idx} style={{ fontSize: '11.5px', fontStyle: 'italic', color: 'var(--text-muted)', background: 'var(--bg-card-subtle)', padding: '6px 10px', borderRadius: '8px' }}>
              {trimmed.slice(1, -1)}
            </div>
          );
        }

        // Standard Paragraph
        return (
          <div key={idx} style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--text-main)' }}>
            {renderFormattedText(trimmed)}
          </div>
        );
      })}

      {/* Copy Action Button */}
      <button
        onClick={handleCopy}
        title="Copy response"
        style={{
          alignSelf: 'flex-end',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 8px',
          borderRadius: '6px',
          border: '1px solid var(--border-subtle)',
          background: '#ffffff',
          color: 'var(--text-muted)',
          fontSize: '10px',
          fontWeight: '700',
          cursor: 'pointer',
          marginTop: '6px'
        }}
      >
        {copied ? <Check size={11} color="#10b981" /> : <Copy size={11} />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
};

/**
 * Helper to convert **bold** and *italic* markdown inside strings into clean React elements.
 */
function renderFormattedText(text) {
  if (!text) return null;

  // Split by ** for bolding
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'var(--text-main)', fontWeight: '800' }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
