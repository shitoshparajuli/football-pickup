export const awsConfig = {
    Auth: {
      region: 'us-west-2', // Replace with your AWS region
      userPoolId: 'us-west-2_ozUjobDbo', // Replace with your Cognito User Pool ID
      userPoolWebClientId: 's65e3c51hald0jc3khkcca405', // Replace with your App Client ID
      mandatorySignIn: false, // Optional
      oauth: {
        domain: 'football-pickup.auth.us-west-2.amazoncognito.com',
        scope: ['email', 'openid', 'profile'],
        redirectSignIn: 'http://localhost:3000/',
        redirectSignOut: 'http://localhost:3000/',
        responseType: 'code', // or 'token', depending on your configuration
      },
    },
  };
  
