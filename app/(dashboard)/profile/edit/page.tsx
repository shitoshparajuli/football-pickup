import { getUserProfile } from '@/lib/userApi'
import EditProfileForm from './EditProfileForm'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { runWithAmplifyServerContext } from '@/lib/amplifyServer'
import { fetchAuthSession } from 'aws-amplify/auth/server'

export const dynamic = 'force-dynamic';

export default async function EditProfilePage() {
  try {
    const user = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: async (contextSpec) => {
        try {
          const session = await fetchAuthSession(contextSpec);
          if (!session?.tokens?.accessToken) {
            return null;
          }
          
          const payload = session.tokens.accessToken.payload;
          return {
            userId: payload.sub,
            username: payload.username || payload['cognito:username']
          };
        } catch (error) {
          console.error('Auth session error:', error);
          return null;
        }
      }
    });

    if (!user?.userId) {
      redirect('/login');
    }

    const profile = await getUserProfile(user.userId);
    
    return (
      <div className="container mx-auto py-8">
        <EditProfileForm initialProfile={profile} userId={user.userId} />
      </div>
    );
  } catch (error) {
    console.error('Error in EditProfilePage:', error);
    redirect('/profile');
  }
}