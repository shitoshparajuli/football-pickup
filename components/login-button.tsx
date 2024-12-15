'use client';

import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/ui/google-icon';
import { signIn } from '@/lib/authUtils';

export default function LoginButton() {
  const handleSignIn = async (provider?: 'Google') => {
    try {
      await signIn(provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <Button
      className="w-full flex items-center gap-2"
      onClick={() => handleSignIn('Google')}
      variant="default"
    >
      <GoogleIcon />
      Sign in with Google
    </Button>
  );
}
