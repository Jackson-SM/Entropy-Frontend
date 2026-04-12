import { motion } from 'framer-motion';
import { ActivityGraph } from './ActivityGraph';
import { IntegrationStatus } from './IntegrationStatus';
import { SuggestedQueries } from './SuggestedQueries';

interface Props {
  onSelectQuery: (query: string) => void;
}

export function HomeDashboard({ onSelectQuery }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        marginTop: '2rem'
      }}
    >
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <ActivityGraph />
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <SuggestedQueries onSelect={onSelectQuery} />
        </div>
      </div>
      
      <IntegrationStatus />
    </motion.div>
  );
}
