import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { SearchForm } from './components/search/SearchForm';
import { SearchFilters, type SearchFilterState } from './components/search/SearchFilters';
import { SearchResults } from './components/search/SearchResults';
import { ResultDetailPanel } from './components/search/ResultDetailPanel';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { ActivityDashboard } from './components/dashboard/ActivityDashboard';
import { IntegrationStatus } from './components/dashboard/IntegrationStatus';
import { SettingsPage } from './components/settings/SettingsPage';
import { SourceBrowser } from './components/sources/SourceBrowser';
import { SearchHistoryPage } from './components/search/SearchHistoryPage';
import { CommandPalette } from './components/ui/CommandPalette';
import { KeyboardShortcuts } from './components/ui/KeyboardShortcuts';
import { useSearch } from './hooks/useSearch';
import { useTheme } from './hooks/useTheme';
import { useFocusMode } from './hooks/useFocusMode';
import type { FormEvent } from 'react';
import type { SearchResult } from './types';
import './App.css';

function SearchView({
  query, setQuery, isSearching, hasResults, results, synthesizedAnswer, error,
  handleSearch, clearResults, filters, setFilters, filtersOpen, setFiltersOpen,
  selectedResult, setSelectedResult, navigate,
}: {
  query: string; setQuery: (q: string) => void;
  isSearching: boolean; hasResults: boolean;
  results: SearchResult[]; synthesizedAnswer: string | null; error: string | null;
  handleSearch: (e: FormEvent) => void; clearResults: () => void;
  filters: SearchFilterState; setFilters: (f: SearchFilterState) => void;
  filtersOpen: boolean; setFiltersOpen: (o: boolean) => void;
  selectedResult: SearchResult | null; setSelectedResult: (r: SearchResult | null) => void;
  navigate: (path: string) => void;
}) {
  const submitSearch = (e?: FormEvent) => {
    if (e) e.preventDefault();
    handleSearch(e || ({ preventDefault: () => {} } as FormEvent));
  };

  const handleSuggestedQuery = (q: string) => {
    setQuery(q);
    const pseudoEvent = { preventDefault: () => {} } as FormEvent;
    handleSearch(pseudoEvent);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 120 }}
        style={{ width: '100%', maxWidth: '800px', zIndex: 10 }}
      >
        <AnimatePresence mode="wait">
          {!hasResults && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ textAlign: 'center', marginBottom: '2.5rem' }}
            >
              <h2 className="hero-title" style={{
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                marginBottom: '0.75rem',
                background: 'linear-gradient(135deg, #f8fafc 30%, #818cf8 60%, #c084fc 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', letterSpacing: '-0.03em', lineHeight: 1.1,
              }}>
                Your Life's Index
              </h2>
              <p style={{
                color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                maxWidth: '520px', margin: '0 auto', lineHeight: 1.5,
              }}>
                A unified search across all your digital trails — emails, files, code, and conversations.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <SearchForm
          query={query}
          setQuery={setQuery}
          handleSearch={submitSearch}
          onToggleFilters={() => setFiltersOpen(!filtersOpen)}
          hasActiveFilters={filters.sources.length > 0 || !!filters.dateFrom || !!filters.dateTo}
        />

        <SearchFilters
          open={filtersOpen}
          filters={filters}
          onChange={setFilters}
          onClose={() => setFiltersOpen(false)}
        />
      </motion.div>

      <div style={{ width: '100%', maxWidth: '1000px', flex: 1, position: 'relative' }}>
        <AnimatePresence mode="wait">
          {!hasResults && (
            <motion.div key="home-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.15 } }} exit={{ opacity: 0 }}>
              <HomeDashboard onSelectQuery={handleSuggestedQuery} />
            </motion.div>
          )}

          {isSearching && (
            <motion.div key="searching_loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '800px' }}
            >
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  borderRadius: 'var(--radius-lg)', background: 'var(--bg-panel)',
                  border: '1px solid var(--border-subtle)', padding: '1.25rem',
                  animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 150}ms`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(99,102,241,0.08)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ width: `${55 + i * 10}%`, height: 14, borderRadius: 4, background: 'rgba(99,102,241,0.06)', marginBottom: '0.3rem' }} />
                      <div style={{ width: 60, height: 10, borderRadius: 4, background: 'rgba(99,102,241,0.04)' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div style={{ width: '90%', height: 10, borderRadius: 4, background: 'rgba(99,102,241,0.04)' }} />
                    <div style={{ width: '70%', height: 10, borderRadius: 4, background: 'rgba(99,102,241,0.03)' }} />
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', paddingTop: '0.5rem' }}>
                <div style={{
                  width: 40, height: 40, border: '2.5px solid rgba(99,102,241,0.15)',
                  borderTopColor: 'var(--accent-primary)', borderRadius: '50%',
                  animation: 'spin 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite',
                }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
                  Searching your index...
                </span>
              </div>
            </motion.div>
          )}

          {hasResults && !isSearching && error && (
            <motion.div key="search_error" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 'var(--radius-lg)',
                background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AlertCircle size={28} color="var(--color-error)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.35rem' }}>Search Failed</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: 380, margin: '0 auto', lineHeight: 1.5 }}>{error}</p>
              </div>
              <button onClick={() => handleSearch({ preventDefault: () => {} } as FormEvent)} className="btn-primary" style={{ gap: '0.5rem' }}>
                <RefreshCw size={15} /> Retry Search
              </button>
            </motion.div>
          )}

          {hasResults && !isSearching && !error && (
            <motion.div key="search_results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SearchResults
                results={results}
                synthesizedAnswer={synthesizedAnswer}
                onEscape={clearResults}
                onNavigate={(path) => navigate(path)}
                onSelectResult={setSelectedResult}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ResultDetailPanel result={selectedResult} onClose={() => setSelectedResult(null)} />
    </>
  );
}

export default function App() {
  const { query, setQuery, isSearching, hasResults, results, synthesizedAnswer, error, handleSearch, clearResults, setFilters: setSearchFilters } = useSearch();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilterState>({ sources: [], dateFrom: '', dateTo: '' });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { focusMode, toggleFocusMode } = useFocusMode();

  useTheme();

  useEffect(() => {
    setSearchFilters(filters);
  }, [filters, setSearchFilters]);

  useEffect(() => {
    let gPending = false;
    let gTimer: ReturnType<typeof setTimeout>;

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(prev => !prev);
        return;
      }

      if (isInput) return;

      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShortcutsOpen(prev => !prev);
        return;
      }

      if (gPending) {
        gPending = false;
        clearTimeout(gTimer);
        const map: Record<string, string> = { h: '/', a: '/activity', d: '/data', c: '/connectors', s: '/settings' };
        const path = map[e.key.toLowerCase()];
        if (path) { e.preventDefault(); navigate(path); }
        return;
      }

      if (e.key.toLowerCase() === 'g' && !e.ctrlKey && !e.metaKey) {
        gPending = true;
        gTimer = setTimeout(() => { gPending = false; }, 500);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      clearTimeout(gTimer);
    };
  }, [navigate]);

  const handlePaletteSearch = useCallback((q: string) => {
    setQuery(q);
    navigate('/');
    setTimeout(() => {
      handleSearch({ preventDefault: () => {} } as FormEvent);
    }, 0);
  }, [setQuery, handleSearch, navigate]);

  const handleHistorySearch = useCallback((q: string) => {
    setQuery(q);
    navigate('/');
    setTimeout(() => {
      handleSearch({ preventDefault: () => {} } as FormEvent);
    }, 0);
  }, [setQuery, handleSearch, navigate]);

  const currentView = (() => {
    const path = location.pathname;
    if (path === '/activity') return 'activity';
    if (path === '/data') return 'sources';
    if (path === '/connectors') return 'connectors';
    if (path === '/settings') return 'settings';
    if (path === '/history') return 'history';
    return 'search';
  })();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {!focusMode && <Sidebar activeView={currentView} onToggleFocus={toggleFocusMode} />}

      <main className="app-main" style={{
        flex: 1, padding: focusMode ? '2.5rem 2rem' : '2.5rem 3rem', display: 'flex', flexDirection: 'column',
        alignItems: 'center', position: 'relative', overflowY: 'auto', minHeight: '100vh',
      }}>
        {focusMode && (
          <button
            onClick={toggleFocusMode}
            className="btn-ghost"
            style={{ position: 'absolute', top: '1rem', left: '1rem', fontSize: '0.6875rem', zIndex: 20 }}
          >
            Exit Focus
          </button>
        )}
        <Routes>
          <Route index element={
            <SearchView
              query={query} setQuery={setQuery} isSearching={isSearching}
              hasResults={hasResults} results={results} synthesizedAnswer={synthesizedAnswer}
              error={error} handleSearch={handleSearch} clearResults={clearResults}
              filters={filters} setFilters={setFilters}
              filtersOpen={filtersOpen} setFiltersOpen={setFiltersOpen}
              selectedResult={selectedResult} setSelectedResult={setSelectedResult}
              navigate={navigate}
            />
          } />
          <Route path="activity" element={
            <motion.div key="activity" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '1000px' }}>
              <ActivityDashboard />
            </motion.div>
          } />
          <Route path="data" element={
            <motion.div key="sources" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '1000px' }}>
              <SourceBrowser />
            </motion.div>
          } />
          <Route path="connectors" element={
            <motion.div key="connectors" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '1000px' }}>
              <div style={{ marginTop: '2rem' }}>
                <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', marginBottom: '1.5rem' }}>Connectors</h2>
                <IntegrationStatus />
              </div>
            </motion.div>
          } />
          <Route path="settings" element={
            <motion.div key="settings" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '1000px' }}>
              <SettingsPage />
            </motion.div>
          } />
          <Route path="history" element={
            <motion.div key="history" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '1000px' }}>
              <SearchHistoryPage onSearch={handleHistorySearch} />
            </motion.div>
          } />
        </Routes>
      </main>

      {!focusMode && <MobileNav activeView={currentView} />}

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={(path) => { navigate(path); setPaletteOpen(false); }}
        onSearch={handlePaletteSearch}
      />

      <KeyboardShortcuts open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}
