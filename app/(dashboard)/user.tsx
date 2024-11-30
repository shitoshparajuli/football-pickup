'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAuthUser, signOut, type AppUser } from '@/lib/authUtils';

export function User() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth status...');
        const currentUser = await getAuthUser();
        console.log('Current user:', currentUser);
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Always render the button, even if loading or no user
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          {loading ? (
            <div className="w-9 h-9 animate-pulse bg-gray-200 rounded-full" />
          ) : (
            <Image
              src={'/placeholder-user.jpg'}
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {loading ? 'Loading...' : user ? user.username : 'Guest'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/support">Support</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {user ? (
          <DropdownMenuItem onSelect={(e) => {
            e.preventDefault();
            signOut();
          }}>
            Sign Out
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/login">Sign In</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
