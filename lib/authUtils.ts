import { getCurrentUser, signOut as amplifySignOut, fetchAuthSession, signInWithRedirect, fetchUserAttributes } from 'aws-amplify/auth';
import { configureClientside, configureServerside } from './amplifyClient';

export interface AppUser {
  userId: string;
  username: string;
}

// Initialize Amplify based on environment
if (typeof window !== 'undefined') {
  configureClientside();
} else {
  configureServerside();
}

export async function getAuthUser(): Promise<AppUser | null> {
  try {
    const session = await fetchAuthSession();
    console.log('Auth session environment:', typeof window === 'undefined' ? 'server' : 'client');
    console.log('Auth session tokens:', session?.tokens ? 'present' : 'missing');
    
    if (!session?.tokens?.accessToken) {
      console.log('No access token found in session');
      return null;
    }

    // For server-side components, extract user info from the token
    if (typeof window === 'undefined') {
      try {
        const payload = session.tokens.accessToken.payload;
        const user = {
          userId: payload.sub,
          username: payload.username || payload['cognito:username']
        };
        console.log('Server-side user extracted:', user);
        return user;
      } catch (error) {
        console.error('Error extracting user from token:', error);
        return null;
      }
    }

    // For client-side components, use getCurrentUser
    try {
      const user = await getCurrentUser();
      console.log('Client-side user:', user);
      
      return {
        userId: user.userId,
        username: user.username
      };
    } catch (userError) {
      console.error('Error getting current user:', userError);
      return null;
    }
  } catch (error: any) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function handleAuthResponse() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (!code) {
      throw new Error('No code parameter found in URL');
    }

    // The actual token exchange is handled by Amplify internally
    const session = await fetchAuthSession();
    return session;
  } catch (error: any) {
    console.error('Error in handleAuthResponse:', error);
    throw error;
  }
}

export async function signIn(provider?: 'Google') {
  try {
    await signInWithRedirect({
      provider: provider === 'Google' ? 'Google' : undefined
    });
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    await amplifySignOut();
    window.location.href = '/';
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw error;
  }
}
