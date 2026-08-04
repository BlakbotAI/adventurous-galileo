import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Globe, 
  Landmark, 
  Scroll, 
  Crown, 
  Clock, 
  Library, 
  GraduationCap, 
  Star, 
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  X,
  MessageSquare,
  Share2,
  ShieldCheck,
  LogIn,
  LogOut,
  Compass,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearch: (query: string) => void;
  userRole: 'Student' | 'Scholar';
  setUserRole: (role: 'Student' | 'Scholar') => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab,
  onSearch,
  userRole,
  setUserRole
}) => {
  const { user, role: authRole, signOut, isAuthenticated } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explorer', label: 'World Explorer', icon: Globe },
    { id: 'excavations', label: 'Virtual Excavations', icon: Compass },
    { id: 'civilizations', label: 'Civilizations', icon: Landmark },
    { id: 'artifacts', label: 'Artifact Curation', icon: Scroll },
    { id: 'figures', label: 'Historical Figures', icon: Crown },
    { id: 'timeline', label: 'Interactive Timeline', icon: Clock },
    { id: 'graph', label: 'Knowledge Graph', icon: Share2 },
    { id: 'ai-historian', label: 'AI Historian', icon: MessageSquare },
    { id: 'workspace', label: 'Research Workspace', icon: BookOpen },
    { id: 'library', label: 'Research Library', icon: Library },
    { id: 'learning', label: 'Learning Center', icon: GraduationCap },
    { id: 'collections', label: 'Saved Collections', icon: Star },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  if (authRole === 'Curator' || authRole === 'Admin') {
    menuItems.push({ id: 'curator-panel', label: 'Curator Panel', icon: ShieldCheck });
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const getPageTitle = () => {
    const activeItem = menuItems.find(item => item.id === activeTab);
    return activeItem ? activeItem.label : 'Historical Intelligence OS';
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-matte-950/95 border-r border-gold-500/10 text-gray-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-gold-500/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-bronze-600 to-gold-500 flex items-center justify-center font-serif text-black font-bold shadow-md shadow-gold-500/20 animate-pulse-glow">
            H
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-serif tracking-widest text-gold-500 font-bold text-sm">HIOS</span>
              <span className="text-[9px] text-bronze-300 font-sans tracking-wide uppercase">Historical Intel OS</span>
            </div>
          )}
        </div>
        {/* Desktop Collapse Button */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex p-1.5 rounded hover:bg-gold-500/10 text-gold-500/70 hover:text-gold-500 transition-colors"
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden p-1.5 rounded hover:bg-gold-500/10 text-gold-500/70 hover:text-gold-500"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-sans tracking-wide transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-gold-950/40 to-bronze-950/20 border-l-2 border-gold-500 text-gold-400 font-semibold shadow-[inset_0_1px_1px_rgba(212,175,55,0.05)]' 
                  : 'hover:bg-matte-900 text-gray-400 hover:text-gray-200'
              }`}
            >
              <span className={isActive ? 'text-gold-500' : 'text-gray-500 group-hover:text-gray-300'}>
                <Icon size={18} />
              </span>
              {(!isSidebarCollapsed || isMobileOpen) && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User Status / Mode Toggler */}
      <div className="p-4 border-t border-gold-500/10 bg-matte-950/50">
        {!isSidebarCollapsed || isMobileOpen ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Cognitive Level</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold-950/40 text-gold-400 border border-gold-500/20">
                {userRole}
              </span>
            </div>
            <div className="flex rounded overflow-hidden border border-gold-500/20 text-xs">
              <button
                onClick={() => setUserRole('Student')}
                className={`flex-1 py-1.5 text-center transition-colors ${
                  userRole === 'Student' 
                    ? 'bg-gold-500 text-black font-semibold' 
                    : 'bg-matte-900 hover:bg-matte-800 text-gray-400'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setUserRole('Scholar')}
                className={`flex-1 py-1.5 text-center transition-colors ${
                  userRole === 'Scholar' 
                    ? 'bg-gold-500 text-black font-semibold' 
                    : 'bg-matte-900 hover:bg-matte-800 text-gray-400'
                }`}
              >
                Scholar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center text-gold-500" title={`Mode: ${userRole}`}>
            <User size={18} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-screen bg-matte-950 overflow-hidden text-gray-300">
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden md:block h-full transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-sm">
          <div className="w-64 h-full animate-slide-in">
            <SidebarContent />
          </div>
          <div className="flex-1" onClick={() => setIsMobileOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-matte-950/80 backdrop-blur border-b border-gold-500/10 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-1.5 rounded hover:bg-gold-500/10 text-gold-500/70 hover:text-gold-500"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg md:text-xl font-serif text-gold-500 tracking-wider font-semibold glow-gold-text">
              {getPageTitle()}
            </h2>
          </div>

          {/* Search Bar in Header */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative w-64 md:w-80">
            <input
              type="text"
              placeholder="Query historical engine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-full text-xs glass-input text-gray-200"
            />
            <Search className="absolute left-3 text-gold-500/60" size={14} />
            <button type="submit" className="hidden" />
          </form>

          {/* User Account / Context Info */}
          <div className="flex items-center gap-4 relative">
            <div className="text-[11px] text-right hidden lg:block">
              <p className="text-gray-400 font-medium">{user ? user.displayName : 'Guest Scholar'}</p>
              <p className="text-bronze-400 text-[9px] tracking-widest font-mono uppercase">
                {user ? `${user.role} ACCESS` : 'VIEWER ACCESS'}
              </p>
            </div>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 rounded-full border border-gold-500/30 flex items-center justify-center bg-matte-900 text-gold-500 cursor-pointer hover:border-gold-500 transition-colors"
            >
              <User size={16} />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-10 w-48 p-2 rounded-lg glass-panel border border-gold-500/20 bg-matte-950 shadow-2xl z-30 text-xs text-gray-300">
                <div className="p-2 border-b border-gold-500/5 text-[10px] text-gray-500 font-light truncate">
                  {user?.email}
                </div>
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      signOut();
                      setShowProfileMenu(false);
                      setActiveTab('dashboard');
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-red-500/10 text-red-400 hover:text-red-300 flex items-center gap-2 mt-1"
                  >
                    <LogOut size={12} /> Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveTab('auth');
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-gold-500/10 text-gold-400 hover:text-white flex items-center gap-2 mt-1"
                  >
                    <LogIn size={12} /> Sign In
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Page Wrapper */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-earth-950/20 via-matte-950 to-matte-950">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-2.5 px-6 border-t border-gold-500/5 bg-matte-950 text-center text-[10px] text-gray-500 tracking-wide font-sans flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Historical Intelligence Operating System v1.0 Foundation</span>
          <div className="flex gap-4">
            <span className="hover:text-gold-500/60 cursor-pointer">Scholarly Evidence Policy</span>
            <span className="hover:text-gold-500/60 cursor-pointer">API Integration</span>
            <span className="hover:text-gold-500/60 cursor-pointer">Decolonial Archiving Project</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
export default DashboardLayout;
