import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ListenOptions } from 'net';
import { resolvers, typeDefs } from './graphql/index';
import { Context, createContext } from './graphql/context';

interface ServerStart {
  server: ApolloServer<Context>;
  url: string;
}

async function startApolloServer(
  listenOptions: ListenOptions = { port: Number(process.env.PORT) },
): Promise<ServerStart> {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: listenOptions,
    context: async ({ req }) => createContext({ req }),
  });

  return { server, url };
}

export default startApolloServer;
