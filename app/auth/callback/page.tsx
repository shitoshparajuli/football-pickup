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
        console.log('Got auth user:', user.given_name);
        console.log('User Name:', user?.userId);
        
        if (user?.userId) {
          // Always redirect to profile page, which handles both new and existing users
          router.push('/profile');
        } else {
          console.log('No username found in user details:', user);
          router.push('/login');
        }
        
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
