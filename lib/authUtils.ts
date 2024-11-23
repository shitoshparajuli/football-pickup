import { getCurrentUser, signOut as amplifySignOut, fetchAuthSession, signInWithRedirect } from 'aws-amplify/auth';
import { configureClientside } from './amplifyClient';
import { Hub } from 'aws-amplify/utils';

// Initialize Amplify on the client side
if (typeof window !== 'undefined') {
  configureClientside();
  
  // Listen for auth events
  Hub.listen('auth', ({ payload }) => {
    console.log('Auth event:', payload);
    const { event } = payload;
    
    if (event === 'signedIn') {
      console.log('User signed in');
      window.location.href = '/profile';
    } else if (event === 'signedOut') {
      console.log('User signed out');
      window.location.href = '/';
    } else if (event === 'customOAuthState') {
      console.log('Custom OAuth state:', payload.data);
    }
  });
}

export async function getAuthUser() {
  try {
    console.log('Getting current user...');
    const session = await fetchAuthSession();
    console.log('Session:', session);
    
    if (!session.tokens) {
      console.log('No valid session');
      return null;
    }
    
    const user = await getCurrentUser();
    console.log('User found:', user);
    return user;
  } catch (error) {
    console.log('No user found or error:', error);
    return null;
  }
}

export async function handleAuthResponse() {
  try {
    console.log('Handling auth response...');
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    console.log('Auth code:', code);
    console.log('Auth state:', state);
    
    if (!code) {
      throw new Error('No auth code found in URL');
    }

    const session = await fetchAuthSession();
    console.log('Session after auth:', session);
    return session;
  } catch (error) {
    console.error('Error handling auth response:', error);
    throw error;
  }
}

export async function signIn(provider?: 'Google') {
  try {
    await signInWithRedirect(provider ? { provider } : undefined);
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    console.log('Signing out...');
    await amplifySignOut({ global: true });
    console.log('Signed out successfully');
    window.location.href = '/';
  } catch (error) {
    console.error('Error signing out:', error);
  }
}
