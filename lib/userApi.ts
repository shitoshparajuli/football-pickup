import { post, put, get } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_ENDPOINT = 'https://oc896sn63e.execute-api.us-west-2.amazonaws.com/Test';

export type UserData = {
  firstName: string;
  lastName: string;
  email: string;
};

async function getAuthToken() {
  const session = await fetchAuthSession();
  console.log('Auth session:', {
    hasTokens: !!session.tokens,
    hasIdToken: !!session.tokens?.idToken,
    hasAccessToken: !!session.tokens?.accessToken,
  });
  
  // Log the claims from the token to see what we have
  if (session.tokens?.idToken?.payload) {
    console.log('ID Token claims:', session.tokens.idToken.payload);
  }
  
  const accessToken = session.tokens?.accessToken?.toString();
  const idToken = session.tokens?.idToken?.toString();
  
  console.log('Access Token for testing:', accessToken);
  console.log('ID Token for testing:', idToken);
  
  const token = accessToken;
  if (token) {
    console.log('Using access token:', token.substring(0, 50) + '...');
  }
  return token;
}

export async function updateUserProfile(userData: UserData) {
  try {
    const token = await getAuthToken();
    console.log('Got auth token:', token ? 'Token present' : 'No token');
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${API_ENDPOINT}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function getUserProfile() {
  try {
    const token = await getAuthToken();
    console.log('Got auth token:', token ? 'Token present' : 'No token');
    if (!token) {
      throw new Error('No authentication token available');
    }

    const fullUrl = `${API_ENDPOINT}/user`;
    console.log('Request path:', fullUrl);
    console.log('Request headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.substring(0, 20)}...`,
    });
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Response status:', response.status);
    if (response.status === 401) {
      const responseText = await response.text();
      console.log('Response body:', responseText);
    }
    
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.log('Error getting user profile:', error);
    throw error;
  }
}
