import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import WorldExplorer from './pages/WorldExplorer';
import Civilizations from './pages/Civilizations';
import Artifacts from './pages/Artifacts';
import Figures from './pages/Figures';
import Timeline from './pages/Timeline';
import KnowledgeGraph from './pages/KnowledgeGraph';
import AIHistorian from './pages/AIHistorian';
import ResearchLibrary from './pages/ResearchLibrary';
import LearningCenter from './pages/LearningCenter';
import SavedCollections from './pages/SavedCollections';
import SettingsPage from './pages/Settings';
import CuratorPanel from './pages/CuratorPanel';
import AuthPage from './pages/Auth';
import { ExcavationSimulator } from './pages/ExcavationSimulator';
import { ResearchWorkspace } from './pages/ResearchWorkspace';
import { ComparativeAnalysis } from './pages/ComparativeAnalysis';
import { PeerReview } from './pages/PeerReview';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { role, updateRole } = useAuth();
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [activeYear, setActiveYear] = useState<number | null>(null);

  // Handle global search from header
  const handleGlobalSearch = (query: string) => {
    setGlobalSearchQuery(query);
    setActiveTab('ai-historian'); // Route searches directly into the AI Historian chat query interface
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={(tab) => setActiveTab(tab)} 
            onSearchQuery={handleGlobalSearch} 
            userRole={role === 'Viewer' ? 'Student' : 'Scholar'} 
          />
        );
      case 'explorer':
        return <WorldExplorer activeYear={activeYear} />;
      case 'civilizations':
        return (
          <Civilizations 
            onNavigateToTab={(tab) => setActiveTab(tab)} 
            userRole={role === 'Viewer' ? 'Student' : 'Scholar'} 
          />
        );
      case 'artifacts':
        return (
          <Artifacts 
            onNavigateToTab={(tab) => setActiveTab(tab)} 
            userRole={role === 'Viewer' ? 'Student' : 'Scholar'} 
          />
        );
      case 'figures':
        return (
          <Figures 
            onNavigateToTab={(tab) => setActiveTab(tab)} 
            userRole={role === 'Viewer' ? 'Student' : 'Scholar'} 
          />
        );
      case 'timeline':
        return (
          <Timeline 
            userRole={role === 'Viewer' ? 'Student' : 'Scholar'} 
            activeYear={activeYear} 
            onYearChange={setActiveYear} 
          />
        );
      case 'graph':
        return <KnowledgeGraph activeYear={activeYear} />;
      case 'ai-historian':
        return (
          <AIHistorian 
            initialQuery={globalSearchQuery}
            onClearInitialQuery={() => setGlobalSearchQuery('')}
          />
        );
      case 'library':
        return <ResearchLibrary />;
      case 'excavations':
        return <ExcavationSimulator />;
      case 'workspace':
        return <ResearchWorkspace />;
      case 'compare':
        return <ComparativeAnalysis />;
      case 'review':
        return <PeerReview />;
      case 'learning':
        return <LearningCenter />;
      case 'collections':
        return <SavedCollections />;
      case 'curator-panel':
        return <CuratorPanel />;
      case 'auth':
        return <AuthPage onSuccess={() => setActiveTab('dashboard')} />;
      case 'settings':
        return (
          <SettingsPage 
            userRole={role === 'Viewer' ? 'Student' : 'Scholar'} 
            setUserRole={(newRole) => updateRole(newRole === 'Student' ? 'Viewer' : 'Curator')} 
          />
        );
      default:
        return (
          <Dashboard 
            onNavigate={(tab) => setActiveTab(tab)} 
            onSearchQuery={handleGlobalSearch} 
            userRole={role === 'Viewer' ? 'Student' : 'Scholar'} 
          />
        );
    }
  };

  return (
    <DashboardLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onSearch={handleGlobalSearch} 
      userRole={role === 'Viewer' ? 'Student' : 'Scholar'}
      setUserRole={(newRole) => updateRole(newRole === 'Student' ? 'Viewer' : 'Curator')}
    >
      {renderContent()}
    </DashboardLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
