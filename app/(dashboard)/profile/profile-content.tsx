'use client';

import { useRouter } from 'next/navigation';

interface Profile {
  FirstName: string;
  LastName: string;
  PreferredPositions: string[];
}

interface ProfileContentProps {
  profile: Profile;
}

export default function ProfileContent({ profile }: ProfileContentProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Profile</h2>
          <button
            onClick={() => router.push('/profile/edit')}
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
