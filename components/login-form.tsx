'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GoogleIcon } from '@/components/ui/google-icon';
import { signIn } from '@/lib/authUtils';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn('Google');
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome</CardTitle>
        <CardDescription>
          Sign in is only supported with Google
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col gap-4">
        <Button
          className="w-full flex items-center gap-2"
          onClick={handleSignIn}
          variant="default"
          disabled={isLoading}
        >
          <GoogleIcon />
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
      </CardFooter>
    </Card>
  );
}
