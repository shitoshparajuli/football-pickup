'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getAuthUser } from '@/lib/authUtils';

type CheckinFormData = {
  firstName: string;
  lastName: string;
  email: string;
  numGuests: number;
};

function CheckinForm() {
  const [formData, setFormData] = useState<CheckinFormData>({
    firstName: '',
    lastName: '',
    email: '',
    numGuests: 0
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getAuthUser();
        setIsAuthenticated(!!user);
        if (user) {
          setFormData(prev => ({
            ...prev,
            firstName: String(user.userId || ''),
            lastName: String(user.username || '')
          }));
        }
      } catch (error: any) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log('Game check-in:', formData);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error during check-in:', error);
      setError('Failed to check in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numGuests' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Check In for Next Game</h1>
          <p className="mt-2 text-gray-600">
            Confirm your attendance for the upcoming game
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={isLoading || isAuthenticated}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={isLoading || isAuthenticated}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                disabled={isAuthenticated || isLoading}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 disabled:bg-gray-100"
              />
              {isAuthenticated && (
                <p className="mt-1 text-sm text-gray-500">
                  Your information is pre-filled from your account
                </p>
              )}
            </div>

            <div>
              <label htmlFor="numGuests" className="block text-sm font-medium text-gray-700">
                Number of Guests
              </label>
              <input
                id="numGuests"
                name="numGuests"
                type="number"
                min="0"
                max="5"
                value={formData.numGuests}
                onChange={handleInputChange}
                disabled={isLoading}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 disabled:bg-gray-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                How many guests are you bringing? (Max 5)
              </p>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center"
            >
              {isLoading ? 'Checking in...' : 'Check In'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    }>
      <CheckinForm />
    </Suspense>
  );
}
