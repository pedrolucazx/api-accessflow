import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import Knex from 'knex';
import knexConfig from '../knexfile';

const knex = Knex(knexConfig.development);

const startServer = async () => {
  const typeDefs = `#graphql
    type Query {
      testDatabaseConnection: String
    }
  `;

  const resolvers = {
    Query: {
      testDatabaseConnection: async () => {
        try {
          await knex.raw('SELECT 1+1 AS result');
          return '✅ Database connection successful!';
        } catch (error) {
          console.error('❌ Database connection failed:', error);
          return '❌ Failed to connect to the database.';
        }
      },
    },
  };

  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.warn(`🚀 Server ready at: ${url}`);
};

startServer();
