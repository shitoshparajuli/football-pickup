import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});
const docClient = DynamoDBDocumentClient.from(client);

export async function createGame(location: string, startTime: string, endTime: string) {
  const gameId = uuidv4();
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  const params = {
    TableName: 'Games',
    Item: {
      GameId: gameId,
      Date: date,
      Location: location,
      StartTime: startTime,
      EndTime: endTime,
    },
  };

  try {
    console.log('Client:', client);
    console.log("AWS_REGION:", process.env.AWS_REGION);
    await docClient.send(new PutCommand(params));
    return { success: true, gameId };
  } catch (error) {
    console.error('Error creating game:', error);
    return { success: false, error };
  }
}
