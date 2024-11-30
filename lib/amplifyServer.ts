import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { ResourcesConfig } from 'aws-amplify';
import { awsConfig } from './awsConfig';

export const { runWithAmplifyServerContext } = createServerRunner({
  config: awsConfig
});