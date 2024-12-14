import { Suspense } from 'react';
import { getAuthUser } from '@/lib/authUtils';
import { getUserProfile } from '@/lib/userApi';
import { runWithAmplifyServerContext } from '@/lib/amplifyServer';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { cookies } from 'next/headers';
import ProfileContent from './profile-content';

// This ensures the page is rendered at request time
export const dynamic = 'force-dynamic';

async function ProfileData() {
  try {
    // Get auth session using server context
    const authenticated = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: async (contextSpec) => {
        try {
          const session = await fetchAuthSession(contextSpec);
          if (!session.tokens?.accessToken) {
            console.log('No access token in server context');
            return null;
          }
          const payload = session.tokens.accessToken.payload;
          const userId = payload.sub;
          const username = payload.username || payload['cognito:username'];

          if (!userId || typeof userId !== 'string') {
            console.log('Invalid user ID in token payload');
            return null;
          }

          if (!username || typeof username !== 'string') {
            console.log('Invalid username in token payload');
            return null;
          }

          return { userId, username };
        } catch (error) {
          console.error('Server auth error:', error);
          return null;
        }
      }
    });

    if (!authenticated) {
      console.log('No authenticated user found');
      return (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your profile</p>
          <a 
            href="/login"
            className="inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Log In
          </a>
        </div>
      );
    }

    const profile = await getUserProfile(authenticated.userId);
    if (!profile) {
      console.log('No profile found for user:', authenticated.userId);
      return (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please complete your profile</p>
          <a 
            href="/profile/edit"
            className="inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Complete Profile
          </a>
        </div>
      );
    }

    return <ProfileContent profile={profile} />;
  } catch (error) {
    console.error('Error loading profile:', error);
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">Error loading profile</p>
        <a 
          href="/login"
          className="inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Try Again
        </a>
      </div>
    );
  }
}

export default async function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="text-2xl font-semibold mb-4">Loading...</h1>
              <p className="text-gray-600">Please wait...</p>
            </div>
          </div>
        }
      >
        <ProfileData />
      </Suspense>
    </div>
  );
}
