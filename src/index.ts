import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers, typeDefs } from '../src/graphql/index';

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.warn(`🚀 Server ready at: ${url}`);
}

startApolloServer().catch((error) =>
  console.error(`Error starting server: ${error}`),
);
