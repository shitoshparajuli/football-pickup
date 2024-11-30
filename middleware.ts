import { fetchAuthSession } from 'aws-amplify/auth/server';
import { NextRequest, NextResponse } from 'next/server';
import { runWithAmplifyServerContext } from '@/lib/amplifyServer';

// Paths that require authentication
const protectedPaths = [
  '/profile',
  '/dashboard'
];

// Paths that should redirect to login if already authenticated
const authPaths = [
  '/login',
  '/signup'
];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Check if path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  if (!isProtectedPath && !isAuthPath) {
    return response;
  }

  try {
    const authenticated = await runWithAmplifyServerContext({
      nextServerContext: { request, response },
      operation: async (contextSpec) => {
        try {
          const session = await fetchAuthSession(contextSpec);
          return (
            session.tokens?.accessToken !== undefined &&
            session.tokens?.idToken !== undefined
          );
        } catch (error) {
          console.error('Auth session error:', error);
          return false;
        }
      }
    });

    // Handle authentication paths (login/signup)
    if (isAuthPath && authenticated) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }

    // Handle protected paths
    if (isProtectedPath && !authenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};