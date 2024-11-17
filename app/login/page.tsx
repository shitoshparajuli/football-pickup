'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { signIn } from '@/lib/auth';
import { signInWithRedirect } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { awsConfig } from '@/lib/awsConfig';

// Amplify.configure(awsConfig);
const handleRedirect = () => {
  window.location.href = "https://www.google.com";
};
const loginUrl = "https://football-pickup.auth.us-west-2.amazoncognito.com/login?client_id=s65e3c51hald0jc3khkcca405&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fprofile";

export default function LoginPage() {
  console.log(loginUrl);
  return (

    
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            This webapp uses Amazon Cognito for authentication.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          
          <form
                      className="w-full"
          >
            <Button className="w-full" onClick={handleRedirect}><a href = {loginUrl}>Click to sign in</a></Button>
          </form>
        </CardFooter>
      </Card>


    </div>
  );
}
