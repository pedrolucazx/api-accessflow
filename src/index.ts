import startApolloServer from '../src/server';
import connection from './database/index';

async function start() {
  try {
    const { url } = await startApolloServer(connection);
    console.warn(`🚀 Server ready at: ${url}`);
  } catch (error) {
    console.error(`Error starting server: ${error}`);
  }
}

start();
