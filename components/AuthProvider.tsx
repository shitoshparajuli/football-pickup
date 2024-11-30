'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { configureClientside } from '@/lib/amplifyClient';

// Configure Amplify on the client side
configureClientside();

type User = {
  userId: string;
  username: string;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  error: Error | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await fetchAuthSession();
        if (!session?.tokens?.accessToken) {
          setUser(null);
          return;
        }

        const currentUser = await getCurrentUser();
        setUser({
          userId: currentUser.userId,
          username: currentUser.username,
        });
      } catch (err) {
        console.error('Auth error:', err);
        setError(err as Error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
