import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/layout/Sidebar';
import { SearchForm } from './components/search/SearchForm';
import { SearchResults } from './components/search/SearchResults';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { ActivityGraph } from './components/dashboard/ActivityGraph';
import { IntegrationStatus } from './components/dashboard/IntegrationStatus';
import { useSearch } from './hooks/useSearch';
import type { FormEvent } from 'react';
import './App.css';

export default function App() {
  const { query, setQuery, isSearching, hasResults, results, synthesizedAnswer, handleSearch } = useSearch();
  const [currentView, setCurrentView] = useState('search');

  // Wrapper around handleSearch to also ensure we are in the 'search' view
  const submitSearch = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setCurrentView('search');
    handleSearch(e || ({} as FormEvent));
  };

  const handleSuggestedQuery = (q: string) => {
    setQuery(q);
    setCurrentView('search');
    // Simulate immediate submission
    const pseudoEvent = { preventDefault: () => {} } as FormEvent;
    handleSearch(pseudoEvent);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <Sidebar activeView={currentView} onViewChange={setCurrentView} />

      <main style={{ flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflowY: 'auto' }}>
        
        {/* Universal Search Header & Input */}
        <motion.div 
          layout
          initial={{ y: 20, opacity: 0 }}
          animate={{ 
            y: 0, 
            opacity: 1,
            scale: (hasResults || currentView !== 'search') ? 1 : 1.02
          }}
          transition={{ duration: 0.5, type: 'spring' }}
          style={{ width: '100%', maxWidth: '800px', zIndex: 10, transition: 'all 0.3s ease' }}
        >
          <AnimatePresence mode="wait">
            {(!hasResults && currentView === 'search') && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ textAlign: 'center', marginBottom: '3rem' }}
              >
                <h2 style={{ fontSize: '4rem', marginBottom: '1rem', background: 'linear-gradient(to right, #f8fafc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}>
                  Your Life's Index
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
                  A unified search across all your digital trails.
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

        {/* Dynamic Views below the search bar */}
        <div style={{ width: '100%', maxWidth: '1000px', flex: 1, position: 'relative' }}>
          <AnimatePresence mode="wait">
            
            {(!hasResults && currentView === 'search') && (
              <motion.div key="home-dashboard" initial={{opacity:0}} animate={{opacity:1, transition: {delay: 0.2}}} exit={{opacity:0}}>
                 <HomeDashboard onSelectQuery={handleSuggestedQuery} />
              </motion.div>
            )}

            {isSearching && currentView === 'search' && (
              <motion.div 
                key="searching_loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ marginTop: '8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
              >
                <div style={{
                  width: '60px', height: '60px', border: '3px solid rgba(99,102,241,0.2)',
                  borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite'
                }} />
                <div style={{ color: 'var(--text-muted)', fontSize: '1.125rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Indexing Neural Pathways...</div>
              </motion.div>
            )}

            {hasResults && !isSearching && currentView === 'search' && (
              <motion.div key="search_results" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <SearchResults results={results} synthesizedAnswer={synthesizedAnswer} />
              </motion.div>
            )}

            {currentView === 'activity' && (
              <motion.div key="activity_view" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0}}>
                <div style={{marginTop: '3rem'}}>
                  <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Activity</h2>
                  <ActivityGraph />
                </div>
              </motion.div>
            )}

            {currentView === 'connectors' && (
              <motion.div key="connectors_view" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0}}>
                 <div style={{marginTop: '3rem'}}>
                   <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Data Connectors</h2>
                   <IntegrationStatus />
                 </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </main>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
