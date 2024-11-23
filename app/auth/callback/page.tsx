'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleAuthResponse, getAuthUser } from '@/lib/authUtils';
import { updateUserProfile, getUserProfile } from '@/lib/userApi';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Starting auth callback handling...');
        await handleAuthResponse();
        console.log('Auth response handled successfully');
        
        // Get the authenticated user and update their profile
        const user = await getAuthUser();
        console.log('Got auth user:', user);
        
        // if (user?.username) {
        //   console.log('Attempting to get user profile for:', user.username);
        //   const existingUser = await getUserProfile(user.username);
        //   console.log('Get user profile result:', existingUser);
          
        //   if (!existingUser) {
        //     console.log('User not found, creating new profile');
        //     const updateResult = await updateUserProfile({
        //       email: user.username,
        //       firstName: user.username.split('_')[1] || '', // Extract ID from google_ID format
        //       lastName: '',
        //     });
        //     console.log('Profile update result:', updateResult);
        //   } else {
        //     console.log('Existing user found:', existingUser);
        //   }
        // } else {
        //   console.log('No username found in user details:', user);
        // }
        
        router.push('/profile');
      } catch (error) {
        console.error('Error in auth callback:', error);
        router.push('/login');
      }
    };

    console.log('Auth callback component mounted');
    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}
