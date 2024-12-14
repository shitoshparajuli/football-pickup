import { Suspense } from 'react';
import { CheckinForm } from './checkin-form';

export const dynamic = 'force-dynamic';

export default function CheckinPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <Suspense 
        fallback={
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Loading...</h1>
            <p className="text-gray-600">Please wait...</p>
          </div>
        }
      >
        <CheckinForm />
      </Suspense>
    </div>
  );
}