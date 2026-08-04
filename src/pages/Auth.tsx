import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';
import { ShieldCheck, User, Mail, Sparkles, LogIn, AlertCircle } from 'lucide-react';

interface AuthProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthProps> = ({ onSuccess }) => {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Curator');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim()) {
      setErrorMsg('Please input a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          setErrorMsg('Display name is required for registration.');
          setIsLoading(false);
          return;
        }
        await signUp(email, displayName, selectedRole);
      } else {
        await signIn(email);
      }
      onSuccess();
    } catch (err) {
      setErrorMsg('Authentication failed. Check details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="p-8 rounded-2xl glass-panel border border-gold-500/25 bg-matte-950 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-600 via-bronze-500 to-gold-600 animate-pulse-glow" />

        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-bronze-600 to-gold-500 flex items-center justify-center font-serif text-black font-black text-xl mx-auto shadow-lg shadow-gold-500/20">
            H
          </div>
          <h2 className="text-xl md:text-2xl font-serif text-white font-bold tracking-wider">
            {isSignUp ? 'Establish Archivist Profile' : 'Authenticate Credentials'}
          </h2>
          <p className="text-xs text-gray-500 font-light">
            {isSignUp ? 'Gain administrative and curation privileges.' : 'Log in to sync Saved Collections and Curation edits.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20 flex gap-2 text-xs text-red-400">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-gray-400 font-medium flex items-center gap-1.5"><Mail size={12} className="text-gold-500/70" /> Email Address</label>
            <input
              type="email"
              placeholder="archivist@hios.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-3 pr-3 py-2.5 rounded-lg glass-input text-gray-200"
              required
            />
          </div>

          {isSignUp && (
            <>
              <div className="space-y-1">
                <label className="text-gray-400 font-medium flex items-center gap-1.5"><User size={12} className="text-gold-500/70" /> Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Diop"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-3 pr-3 py-2.5 rounded-lg glass-input text-gray-200"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-400 font-medium flex items-center gap-1.5"><ShieldCheck size={12} className="text-gold-500/70" /> Target Access Level</label>
                <div className="flex gap-2">
                  {(['Viewer', 'Curator'] as const).map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`flex-1 py-2 rounded-lg border text-center transition-all ${
                        selectedRole === role
                          ? 'bg-gold-500/25 border-gold-500 text-gold-400 font-bold'
                          : 'bg-matte-900 border-gold-500/10 hover:border-gold-500/30 text-gray-500'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-gradient-to-r from-gold-600 to-bronze-600 hover:from-gold-500 hover:to-bronze-500 disabled:from-gray-800 disabled:to-gray-900 text-black font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-gold-500/15"
          >
            {isLoading ? (
              <Sparkles size={14} className="animate-spin" />
            ) : (
              <>
                <LogIn size={14} /> {isSignUp ? 'Generate Profile' : 'Authenticate Session'}
              </>
            )}
          </button>
        </form>

        {/* Toggle Sign In / Sign Up */}
        <div className="text-center pt-2">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
            }}
            className="text-[11px] text-gold-500 hover:text-gold-400 hover:underline tracking-wide transition-all"
          >
            {isSignUp ? 'Already registered? Access session' : 'Establish new Curation credentials'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AuthPage;
