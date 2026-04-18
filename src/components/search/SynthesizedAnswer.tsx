import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SynthesizedAnswerProps {
  answer: string;
}

function useTypewriter(text: string, wordsPerTick = 2, tickMs = 30) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const prevText = useRef('');

  useEffect(() => {
    if (text === prevText.current) return;
    prevText.current = text;
    setDisplayed('');
    setDone(false);

    const words = text.split(/(\s+)/);
    let wordIdx = 0;

    const id = setInterval(() => {
      wordIdx += wordsPerTick;
      const slice = words.slice(0, wordIdx).join('');
      setDisplayed(slice);
      if (wordIdx >= words.length) {
        setDisplayed(text);
        clearInterval(id);
        setDone(true);
      }
    }, tickMs);

    return () => clearInterval(id);
  }, [text, wordsPerTick, tickMs]);

  return { displayed, done };
}

export function SynthesizedAnswer({ answer }: SynthesizedAnswerProps) {
  const { displayed, done } = useTypewriter(answer, 3, 25);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-glow"
      style={{ marginBottom: '1.5rem', position: 'relative' }}
    >
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '3px', height: '100%',
        borderRadius: '3px 0 0 3px',
        background: 'linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary))',
      }} />

      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        marginBottom: '0.75rem', paddingLeft: '0.25rem',
      }}>
        <div style={{
          width: 28, height: 28,
          borderRadius: '8px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={14} color="var(--accent-secondary)" />
        </div>
        <h3 style={{
          margin: 0, fontSize: '0.8125rem', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.05em',
          color: 'var(--text-secondary)',
        }}>
          AI Summary
        </h3>
      </div>

      <p style={{
        lineHeight: 1.65,
        color: 'var(--text-primary)',
        margin: 0,
        fontSize: '0.9375rem',
        paddingLeft: '0.25rem',
        minHeight: '1.65em',
      }}>
        {displayed}
        {!done && (
          <span style={{
            display: 'inline-block',
            width: '2px',
            height: '1em',
            background: 'var(--accent-primary)',
            marginLeft: '2px',
            verticalAlign: 'text-bottom',
            animation: 'blink 1s step-end infinite',
          }} />
        )}
      </p>
    </motion.div>
  );
}
