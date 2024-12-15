import { Suspense } from 'react';
import { CreateGameForm } from '@/components/create-game-form';
import Link from 'next/link';

// Prevent static export of this page
export const dynamic = 'force-dynamic';

export default function CreateGamePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Game</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <CreateGameForm />
        </Suspense>
      </div>
    </div>
  );
}
