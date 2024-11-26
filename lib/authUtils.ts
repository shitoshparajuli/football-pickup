import { getCurrentUser, signOut as amplifySignOut, fetchAuthSession, signInWithRedirect, fetchUserAttributes } from 'aws-amplify/auth';
import { configureClientside } from './amplifyClient';

// Initialize Amplify on the client side
if (typeof window !== 'undefined') {
  configureClientside();
}

export async function getAuthUser() {
  try {
    const session = await fetchAuthSession();
    
    if (!session.tokens) {
      return null;
    }
    
    const user = await getCurrentUser();
    
    return {
      userId: user.userId,
      username: user.username
    };
  } catch (error: any) {
    console.error('No user found or error:', error);
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
