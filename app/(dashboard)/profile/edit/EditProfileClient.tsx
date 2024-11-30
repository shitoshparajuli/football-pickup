'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import EditProfileForm from './EditProfileForm';
import type { Profile } from './EditProfileForm';

export default function EditProfileClient() {
  const { user, loading, error } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user?.userId) {
        return;
      }

      try {
        const response = await fetch(`/api/profile/${user.userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    }

    if (user) {
      loadProfile();
    } else if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || loadingProfile) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return null; // Router will handle redirect
  }

  return (
    <div className="container mx-auto py-8">
      <EditProfileForm initialProfile={profile} userId={user.userId} />
    </div>
  );
}
