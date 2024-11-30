import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { configureServerside } from '@/lib/amplifyClient';
import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

// Ensure Amplify is configured
configureServerside()

export async function GET(request: Request) {
  try {
    // First try: Direct session fetch
    try {
      const session = await fetchAuthSession()
      console.log('Direct session check:', {
        hasIdToken: !!session?.tokens?.idToken,
        hasAccessToken: !!session?.tokens?.accessToken,
      })

      if (session?.tokens?.accessToken) {
        const payload = session.tokens.accessToken.payload
        const user = {
          userId: payload.sub,
          username: payload.username || payload['cognito:username']
        }
        console.log('User from direct session:', user)
        return NextResponse.json({ user })
      }
    } catch (sessionError) {
      console.log('Direct session error:', sessionError)
    }

    // Second try: Check cookies
    const cookieStore = await cookies()
    const allCookies: RequestCookie[] = cookieStore.getAll()
    console.log('All cookies:', allCookies.map(c => c.name))
    
    const cognitoCookies = allCookies.filter(cookie => 
      cookie.name.includes('CognitoIdentityServiceProvider')
    )
    
    console.log('Cognito cookies:', {
      count: cognitoCookies.length,
      names: cognitoCookies.map(c => c.name)
    })

    // Third try: getCurrentUser
    try {
      const currentUser = await getCurrentUser()
      console.log('Current user check:', currentUser)
      
      const user = {
        userId: currentUser.userId,
        username: currentUser.username
      }
      console.log('User from getCurrentUser:', user)
      return NextResponse.json({ user })
    } catch (userError) {
      console.log('getCurrentUser error:', userError)
    }

    // If all attempts fail
    console.log('All auth attempts failed')
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    )
  }
}
