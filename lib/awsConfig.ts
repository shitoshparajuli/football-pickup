import { ResourcesConfig } from 'aws-amplify';

export const awsConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-west-2_ozUjobDbo',
      userPoolClientId: 's65e3c51hald0jc3khkcca405',
      signUpVerificationMethod: 'code',
      loginWith: {
        oauth: {
          domain: 'football-pickup.auth.us-west-2.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: ['http://localhost:3000/auth/callback'],
          redirectSignOut: ['http://localhost:3000/'],
          responseType: 'code',
        },
      },
    }
  },
  API: {
    REST: {
      userAPI: {
        endpoint: 'https://oc896sn63e.execute-api.us-west-2.amazonaws.com',
        region: 'us-west-2',
      },
    },
  },
};
