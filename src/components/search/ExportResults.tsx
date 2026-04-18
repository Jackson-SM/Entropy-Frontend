import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, FileJson, Copy, ChevronDown } from 'lucide-react';
import { useToast } from '../ui/Toast';
import type { SearchResult } from '../../types';

interface Props {
  results: SearchResult[];
  query: string;
}

export function ExportResults({ results, query }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const asText = () => {
    const lines = [`Search: "${query}"`, `${results.length} results`, '---', ''];
    results.forEach((r, i) => {
      lines.push(`${i + 1}. [${r.source.toUpperCase()}] ${r.title}`);
      if (r.date) lines.push(`   Date: ${r.date}`);
      if (r.url) lines.push(`   URL: ${r.url}`);
      lines.push(`   ${r.text.slice(0, 200)}${r.text.length > 200 ? '...' : ''}`);
      lines.push('');
    });
    return lines.join('\n');
  };

  const copyAsText = () => {
    navigator.clipboard.writeText(asText());
    toast.success('Results copied as text');
    setOpen(false);
  };

  const downloadJSON = () => {
    const data = { query, exported_at: new Date().toISOString(), results_count: results.length, results };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `entropy-search-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Results downloaded as JSON');
    setOpen(false);
  };

  const downloadText = () => {
    const blob = new Blob([asText()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `entropy-search-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Results downloaded as text');
    setOpen(false);
  };

  if (results.length === 0) return null;

  const itemStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    padding: '0.6rem 0.875rem', cursor: 'pointer',
    fontSize: '0.8125rem', fontWeight: 500,
    color: 'var(--text-secondary)',
    transition: 'all 100ms',
    borderRadius: 'var(--radius-sm)',
    background: 'transparent', border: 'none', width: '100%',
    fontFamily: 'var(--font-body)', textAlign: 'left' as const,
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="btn-ghost"
        style={{ fontSize: '0.6875rem', gap: '0.3rem', padding: '0.3rem 0.6rem' }}
      >
        <Download size={12} />
        Export
        <ChevronDown size={10} style={{ opacity: 0.5 }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute', right: 0, top: '100%',
              marginTop: '0.375rem', width: 200,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
              padding: '0.375rem',
              zIndex: 50,
            }}
          >
            <button onClick={copyAsText} style={itemStyle}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-panel-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Copy size={13} /> Copy as text
            </button>
            <button onClick={downloadText} style={itemStyle}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-panel-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <FileText size={13} /> Download .txt
            </button>
            <button onClick={downloadJSON} style={itemStyle}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-panel-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <FileJson size={13} /> Download .json
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
