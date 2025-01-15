import startApolloServer from '../src/server';
import { databaseConnection } from './database/index';

async function start() {
  try {
    const database = await databaseConnection;
    const { url } = await startApolloServer(database);
    console.warn(`🚀 Server ready at: ${url}`);
  } catch (error) {
    console.error(`Error starting server: ${error}`);
  }
}

start();
