import resolversProfile from './resolvers/profile.resolver';
import resolversUser from './resolvers/user.resolver';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import path from 'path';

const typesArray = loadFilesSync(path.join(__dirname, '../graphql/schemas'), {
  extensions: ['graphql'],
});

const typeDefs = mergeTypeDefs(typesArray);

const resolvers = {
  User: { ...resolversUser?.User },
  Query: { ...resolversProfile?.Query, ...resolversUser?.Query },
  Mutation: { ...resolversUser?.Mutation, ...resolversProfile?.Mutation },
};

export { resolvers, typeDefs };
