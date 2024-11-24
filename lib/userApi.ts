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
  
  const token = idToken;
  if (token) {
    console.log('Using access token:', token);
  }
  return token;
}

export async function getUserProfile(userId: string) {
  try {
    const fullUrl = `${API_ENDPOINT}/user/`;
    
    const response = await fetch(`${fullUrl}${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000',
        'Accept': 'application/json',
        // Include authentication headers if your API requires them
        // 'Authorization': 'Bearer YOUR_JWT_TOKEN',
        // 'x-api-key': 'YOUR_API_KEY',
      },
      credentials: 'include',
    });

    console.log('User profile response:', response);

    if (response.status === 404) {
      console.log('User not found:', userId);
      return null;
    }

    if (!response.ok) {
      // Handle other HTTP errors
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
    }

    const userProfile = await response.json();
    return userProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
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