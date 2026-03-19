import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Define local mock interfaces to replace Supabase types
export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    [key: string]: unknown;
  };
}

export interface Session {
  access_token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null; needsVerification: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock initializing auth state: No logged-in user initially.
    const timer = setTimeout(() => {
      setSession(null);
      setUser(null);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Mock successful signup returning no session but requiring verification.
    console.log("Mock signUp called with", email, password, fullName);
    return { error: null, needsVerification: true };
  };

  const signIn = async (email: string, password: string) => {
    // Mock successful sign in by manually updating local state.
    console.log("Mock signIn called with", email, password);
    const mockUser: User = {
      id: "mock-user-123",
      email: email,
      user_metadata: {
        full_name: "Mock User",
      }
    };
    const mockSession: Session = {
      access_token: "mock-token-abc",
      user: mockUser
    };
    setUser(mockUser);
    setSession(mockSession);
    
    return { error: null };
  };

  const signInWithGoogle = async () => {
    // Mock successful google sign in by manually updating local state.
    console.log("Mock signInWithGoogle called");
    const mockUser: User = {
      id: "mock-google-user-456",
      email: "mock.user@google.com",
      user_metadata: {
        full_name: "Mock Google User",
      }
    };
    const mockSession: Session = {
      access_token: "mock-token-xyz",
      user: mockUser
    };
    setUser(mockUser);
    setSession(mockSession);
    
    return { error: null };
  };

  const signOut = async () => {
    console.log("Mock signOut called");
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signInWithGoogle, signOut }}>
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
