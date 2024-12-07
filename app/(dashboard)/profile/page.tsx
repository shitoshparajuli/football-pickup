'use client';

import { Suspense } from 'react';
import { getAuthUser } from '@/lib/authUtils';
import { getUserProfile } from '@/lib/userApi';
import { redirect } from 'next/navigation';

interface Profile {
  FirstName: string;
  LastName: string;
  PreferredPositions: string[];
}

function ProfileContent({ profile }: { profile: Profile }) {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Profile</h2>
          <button
            onClick={() => redirect('/profile/edit')}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Edit Profile
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="mt-1 text-lg">{profile.FirstName} {profile.LastName}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Preferred Positions</h3>
            <div className="mt-2 space-y-2">
              {profile.PreferredPositions.map((position, index) => (
                <div
                  key={position}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-md"
                >
                  {index + 1}. {position}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function ProfileData() {
  try {
    const user = await getAuthUser();
    if (!user?.userId) {
      redirect('/login');
    }

    const profile = await getUserProfile(user.userId);
    if (!profile) {
      redirect('/profile/edit');
    }

    return <ProfileContent profile={profile} />;
  } catch (error) {
    console.error('Error loading profile:', error);
    redirect('/login');
  }
}

export default async function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Loading...</h1>
            <p className="text-gray-600">Please wait...</p>
          </div>
        </div>
      }
    >
      <ProfileData />
    </Suspense>
  );
}
