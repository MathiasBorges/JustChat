import { Client,Databases} from 'appwrite';

export const client = new Client();

export const PROJECT_ID = '6519a951924a8aefbc59';
export const DATABASE_ID = '6519ba7f22f53c28f4b2';
export const COLLECTION_ID_MESSAGES = '6519baa3bad411bba6f5';

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6519a951924a8aefbc59');


export const databases = new Databases(client);

export default client;
