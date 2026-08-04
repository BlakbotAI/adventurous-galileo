import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'Viewer' | 'Curator' | 'Admin';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  signIn: (email: string, password?: string) => Promise<boolean>;
  signUp: (email: string, displayName: string, role: UserRole, password?: string) => Promise<boolean>;
  signOut: () => void;
  updateRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('hios_auth_session');
    if (session) {
      setUser(JSON.parse(session));
    } else {
      // Default guest session
      const guestUser: UserProfile = {
        id: 'guest_user_id',
        email: 'guest@hios.local',
        role: 'Viewer',
        displayName: 'Guest Scholar'
      };
      setUser(guestUser);
      localStorage.setItem('hios_auth_session', JSON.stringify(guestUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, _password?: string): Promise<boolean> => {
    // Simulate API request
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple mock login: check if there's a stored profile for this email,
        // or auto-create one. Let's make it a curator by default if email contains 'curator'
        const isCurator = email.toLowerCase().includes('curator');
        const isAdmin = email.toLowerCase().includes('admin');
        const role: UserRole = isAdmin ? 'Admin' : isCurator ? 'Curator' : 'Viewer';
        
        const loggedInUser: UserProfile = {
          id: `usr_${Date.now()}`,
          email,
          role,
          displayName: email.split('@')[0].toUpperCase()
        };
        setUser(loggedInUser);
        localStorage.setItem('hios_auth_session', JSON.stringify(loggedInUser));
        resolve(true);
      }, 500);
    });
  };

  const signUp = async (email: string, displayName: string, role: UserRole, _password?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: UserProfile = {
          id: `usr_${Date.now()}`,
          email,
          role,
          displayName
        };
        setUser(newUser);
        localStorage.setItem('hios_auth_session', JSON.stringify(newUser));
        resolve(true);
      }, 500);
    });
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('hios_auth_session');
    // Re-create default guest
    const guestUser: UserProfile = {
      id: 'guest_user_id',
      email: 'guest@hios.local',
      role: 'Viewer',
      displayName: 'Guest Scholar'
    };
    setUser(guestUser);
    localStorage.setItem('hios_auth_session', JSON.stringify(guestUser));
  };

  const updateRole = (newRole: UserRole) => {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      localStorage.setItem('hios_auth_session', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'Viewer',
        signIn,
        signUp,
        signOut,
        updateRole,
        isAuthenticated: !!user && user.id !== 'guest_user_id',
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;
