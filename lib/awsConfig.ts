import { type ResourcesConfig } from 'aws-amplify/resources';

export const awsConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-west-2_ozUjobDbo',
      userPoolClientId: 's65e3c51hald0jc3khkcca405',
      signUpVerificationMethod: 'code',
      loginWith: {
        oauth: {
          domain: 'football-pickup.auth.us-west-2.amazoncognito.com',
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: ['http://localhost:3000/auth/callback'],
          redirectSignOut: ['http://localhost:3000/login'],
          responseType: 'code'
        },
        email: true,
        phone: false
      }
    }
  }
};
