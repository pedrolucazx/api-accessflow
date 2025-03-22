import startApolloServer from '../src/server';

async function start() {
  try {
    const { url } = await startApolloServer();
    console.warn(`🚀 Server ready at: ${url}`);
  } catch (error) {
    console.error(`Error starting server: ${error}`);
  }
}

start();
