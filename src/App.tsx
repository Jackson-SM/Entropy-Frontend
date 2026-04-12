import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { SearchForm } from './components/search/SearchForm';
import { SearchResults } from './components/search/SearchResults';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { ActivityGraph } from './components/dashboard/ActivityGraph';
import { IntegrationStatus } from './components/dashboard/IntegrationStatus';
import { SettingsPage } from './components/settings/SettingsPage';
import { useSearch } from './hooks/useSearch';
import type { FormEvent } from 'react';
import './App.css';

export default function App() {
  const { query, setQuery, isSearching, hasResults, results, synthesizedAnswer, handleSearch } = useSearch();
  const [currentView, setCurrentView] = useState('search');

  const submitSearch = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setCurrentView('search');
    handleSearch(e || ({} as FormEvent));
  };

  const handleSuggestedQuery = (q: string) => {
    setQuery(q);
    setCurrentView('search');
    const pseudoEvent = { preventDefault: () => {} } as FormEvent;
    handleSearch(pseudoEvent);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <Sidebar activeView={currentView} onViewChange={setCurrentView} />

      <main
        className="app-main"
        style={{
          flex: 1,
          padding: '2.5rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflowY: 'auto',
          minHeight: '100vh',
        }}
      >
        {/* Search Header */}
        <motion.div
          layout
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, type: 'spring', stiffness: 120 }}
          style={{ width: '100%', maxWidth: '800px', zIndex: 10 }}
        >
          <AnimatePresence mode="wait">
            {!hasResults && currentView === 'search' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ textAlign: 'center', marginBottom: '2.5rem' }}
              >
                <h2
                  className="hero-title"
                  style={{
                    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                    marginBottom: '0.75rem',
                    background: 'linear-gradient(135deg, #f8fafc 30%, #818cf8 60%, #c084fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                  }}
                >
                  Your Life's Index
                </h2>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                  maxWidth: '520px',
                  margin: '0 auto',
                  lineHeight: 1.5,
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
          />
        </motion.div>

        {/* Dynamic Views */}
        <div style={{ width: '100%', maxWidth: '1000px', flex: 1, position: 'relative' }}>
          <AnimatePresence mode="wait">
            {!hasResults && currentView === 'search' && (
              <motion.div key="home-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.15 } }} exit={{ opacity: 0 }}>
                <HomeDashboard onSelectQuery={handleSuggestedQuery} />
              </motion.div>
            )}

            {isSearching && currentView === 'search' && (
              <motion.div
                key="searching_loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ marginTop: '6rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}
              >
                <div style={{
                  width: '48px', height: '48px',
                  border: '2.5px solid rgba(99,102,241,0.15)',
                  borderTopColor: 'var(--accent-primary)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite',
                }} />
                <div style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}>
                  Searching your index...
                </div>
              </motion.div>
            )}

            {hasResults && !isSearching && currentView === 'search' && (
              <motion.div key="search_results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SearchResults results={results} synthesizedAnswer={synthesizedAnswer} />
              </motion.div>
            )}

            {currentView === 'activity' && (
              <motion.div key="activity_view" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ marginTop: '2rem' }}>
                  <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', marginBottom: '1.5rem' }}>Activity</h2>
                  <ActivityGraph />
                </div>
              </motion.div>
            )}

            {currentView === 'connectors' && (
              <motion.div key="connectors_view" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ marginTop: '2rem' }}>
                  <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', marginBottom: '1.5rem' }}>Data Sources</h2>
                  <IntegrationStatus />
                </div>
              </motion.div>
            )}

            {currentView === 'settings' && (
              <motion.div key="settings_view" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <SettingsPage />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <MobileNav activeView={currentView} onViewChange={setCurrentView} />
    </div>
  );
}
