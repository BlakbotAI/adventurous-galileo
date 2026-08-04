import React from 'react';
import { Shield, User, Globe, AlertCircle } from 'lucide-react';

interface SettingsProps {
  userRole: 'Student' | 'Scholar';
  setUserRole: (role: 'Student' | 'Scholar') => void;
}

export const SettingsPage: React.FC<SettingsProps> = ({ userRole, setUserRole }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-gold-500/10 pb-4">
        <h2 className="text-xl md:text-2xl text-gold-500 font-serif font-bold tracking-wider">System Settings</h2>
        <p className="text-xs text-gray-500 font-light mt-0.5">Configure cognitive filters, display preferences, and credentials.</p>
      </div>

      {/* Cognitive Role Toggle */}
      <div className="p-6 rounded-xl glass-panel border border-gold-500/10 space-y-4 bg-matte-950">
        <h3 className="text-sm font-serif text-white font-bold uppercase tracking-wider flex items-center gap-2">
          <User size={16} className="text-gold-500" /> Cognitive Role Settings
        </h3>
        
        <div className="space-y-4">
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Specify your research depth. Changing this role updates UI content layout across the operating system.
          </p>

          <div className="flex rounded-lg overflow-hidden border border-gold-500/20 text-xs">
            <button
              onClick={() => setUserRole('Student')}
              className={`flex-1 py-3 text-center transition-colors ${
                userRole === 'Student'
                  ? 'bg-gold-500 text-black font-semibold'
                  : 'bg-matte-900 hover:bg-matte-850 text-gray-400'
              }`}
            >
              Student Mode
            </button>
            <button
              onClick={() => setUserRole('Scholar')}
              className={`flex-1 py-3 text-center transition-colors ${
                userRole === 'Scholar'
                  ? 'bg-gold-500 text-black font-semibold'
                  : 'bg-matte-900 hover:bg-matte-850 text-gray-400'
              }`}
            >
              Scholar Mode
            </button>
          </div>

          <div className="p-3 rounded-lg bg-gold-950/15 border border-gold-500/10 flex gap-3 text-[11px] leading-relaxed text-gray-400">
            <AlertCircle className="text-gold-500 shrink-0 mt-0.5" size={16} />
            <p>
              {userRole === 'Student' 
                ? 'Student Mode utilizes age-appropriate explanations, interactive quizzes, and visual checklists.' 
                : 'Scholar Mode unlocks scientific carbon dating techniques, stratigraphic evidence tiers, and detailed bibliography references.'}
            </p>
          </div>
        </div>
      </div>

      {/* Map Preferences */}
      <div className="p-6 rounded-xl glass-panel border border-gold-500/10 space-y-4 bg-matte-950">
        <h3 className="text-sm font-serif text-white font-bold uppercase tracking-wider flex items-center gap-2">
          <Globe size={16} className="text-gold-500" /> Map Projection & Coordinates
        </h3>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center py-2 border-b border-gold-500/5">
            <div className="flex flex-col text-left">
              <span className="text-gray-300 font-semibold">Africa Center Focus</span>
              <span className="text-[10px] text-gray-500">Centers world maps on the African continent plate</span>
            </div>
            <span className="text-gold-500 font-bold">Enabled (Default)</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gold-500/5">
            <div className="flex flex-col text-left">
              <span className="text-gray-300 font-semibold">Coordinate Formatting</span>
              <span className="text-[10px] text-gray-500">Displays precise decimal coordinate values</span>
            </div>
            <span className="text-gray-400 font-mono">Decimal Degrees (DD)</span>
          </div>
        </div>
      </div>

      {/* Security Credentials */}
      <div className="p-6 rounded-xl glass-panel border border-gold-500/10 space-y-4 bg-matte-950">
        <h3 className="text-sm font-serif text-white font-bold uppercase tracking-wider flex items-center gap-2">
          <Shield size={16} className="text-gold-500" /> Security & Provenance API
        </h3>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-400">Database Connection:</span>
            <span className="text-green-500 font-semibold flex items-center gap-1">● Mock Engine Secure</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-400">Access Key:</span>
            <span className="text-gray-500 font-mono">HIOS-ANONYMOUS-GUEST</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
