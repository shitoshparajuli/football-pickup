'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthUser } from '@/lib/authUtils';
import { updateUserProfile } from '@/lib/userApi';

const positions = [
  'Forward',
  'Midfielder',
  'Defender',
  'Goalkeeper'
];

export default function Onboarding() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pre-fill the form with data from auth if available
    const loadUserData = async () => {
      const user = await getAuthUser();
      if (user?.given_name) setFirstName(user.given_name);
      if (user?.family_name) setLastName(user.family_name);
    };
    loadUserData();
  }, []);

  const handlePositionToggle = (position: string) => {
    setSelectedPositions(prev => 
      prev.includes(position)
        ? prev.filter(p => p !== position)
        : [...prev, position]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = await getAuthUser();
      if (!user?.userId) {
        throw new Error('No user ID found');
      }

      await updateUserProfile({
        UserId: user.userId,
        FirstName: firstName,
        LastName: lastName,
        PreferredPositions: selectedPositions
      });

      router.push('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      // You might want to add proper error handling UI here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Welcome to Football Pickup!</h2>
        <p className="text-gray-600 text-center mb-8">Let's set up your profile to help you find the perfect matches.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Positions</label>
            <div className="grid grid-cols-2 gap-4">
              {positions.map((position) => (
                <button
                  key={position}
                  type="button"
                  onClick={() => handlePositionToggle(position)}
                  className={`p-3 rounded-md border ${
                    selectedPositions.includes(position)
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {position}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
