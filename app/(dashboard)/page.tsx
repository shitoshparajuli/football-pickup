'use client';

import Image from 'next/image';
import { GameCheckinButton } from '@/components/game-signup-button';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Image
            src="/logo.png?height=200&width=200"
            alt="Everest Warriors Logo"
            width={200}
            height={200}
            className="mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Everest Warriors</h1>
          <p className="text-xl mb-8 text-gray-600">
            Join us for an exciting pickup football game!
          </p>
          <GameCheckinButton />
        </div>
      </main>

      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Everest Warriors. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}