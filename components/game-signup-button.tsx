'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { getAuthUser, signIn } from '@/lib/authUtils';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GoogleIcon } from '@/components/ui/google-icon';

export function GameCheckinButton() {
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();

  const handleCheckinClick = async () => {
    try {
      const user = await getAuthUser();
      if (user) {
        // User is authenticated, redirect to checkin page
        router.push('/checkin');
      } else {
        // Show dialog for non-authenticated users
        setShowDialog(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const handleGuestCheckin = () => {
    setShowDialog(false);
    router.push('/checkin');
  };

  const handleSignIn = async () => {
    try {
      await signIn('Google');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <Button
          onClick={handleCheckinClick}
          className="px-8 py-3 flex items-center justify-center gap-2"
        >
          <Calendar className="h-5 w-5" />
          Check In for Next Game
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose how to check in</DialogTitle>
            <DialogDescription>
              You can check in as a guest or sign in with your account
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Button
              className="w-full flex items-center gap-2"
              onClick={handleSignIn}
              variant="default"
            >
              <GoogleIcon />
              Sign in with Google
            </Button>
            <Button onClick={handleGuestCheckin}
              className="w-full flex items-center gap-2"
              variant="outline">
              Continue as Guest
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
