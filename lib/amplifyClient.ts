import { Amplify } from 'aws-amplify';
import { awsConfig } from './awsConfig';

export function configureClientside() {
  if (typeof window === 'undefined') {
    return;
  }

  Amplify.configure(awsConfig, {
    ssr: true
  });
}
