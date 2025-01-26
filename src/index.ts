import startApolloServer from '../src/server';
import { database } from './database/index';

async function start() {
  try {
    const { url } = await startApolloServer(database);
    console.warn(`🚀 Server ready at: ${url}`);
  } catch (error) {
    console.error(`Error starting server: ${error}`);
  }
}

start();
