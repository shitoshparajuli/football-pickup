import { Amplify } from 'aws-amplify';
import { awsConfig } from './awsConfig';
import { type ResourcesConfig } from 'aws-amplify';

let isConfigured = false;

// Explicitly type the Auth configuration to ensure it matches expectations
const authConfig = {
  ...awsConfig?.Auth?.Cognito,
  cookieStorage: {
    domain: process.env.NEXT_PUBLIC_DOMAIN || 'localhost',
    path: '/',
    expires: 365,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
} as any; // Use 'as any' to suppress type issues temporarily

const config: ResourcesConfig = {
  Auth: {
    Cognito: authConfig,
  },
  API: awsConfig?.API
};

export function configureClientside() {
  if (typeof window === 'undefined') {
    return;
  }

  if (!isConfigured) {
    console.log('Configuring Amplify for client-side');
    Amplify.configure(config, { ssr: true });
    isConfigured = true;
  }
}

export function configureServerside() {
  if (typeof window !== 'undefined') {
    return;
  }

  if (!isConfigured) {
    console.log('Configuring Amplify for server-side');
    Amplify.configure(config, { ssr: true });
    isConfigured = true;
  }
}

// Initialize based on environment
if (typeof window !== 'undefined') {
  configureClientside();
} else {
  configureServerside();
}
