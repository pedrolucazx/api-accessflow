import startApolloServer from '../src/server';
import { createDatabaseConnection } from './database/index';

async function start() {
  try {
    const database = await createDatabaseConnection();
    const { url } = await startApolloServer(database);
    console.warn(`🚀 Server ready at: ${url}`);
  } catch (error) {
    console.error(`Error starting server: ${error}`);
  }
}

start();
