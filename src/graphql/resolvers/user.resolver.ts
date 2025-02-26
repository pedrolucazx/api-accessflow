import { Profile } from '@/types/profiles.types';
import { userService } from '../../service/user.service';
import { argsType, User } from '../../types/users.types';

const resolvers = {
  User: {
    perfis: async (parent: User): Promise<Profile[] | undefined> => {
      return await userService.getUserProfiles(parent?.id);
    },
  },
  Query: {
    getAllUsers: async (): Promise<Omit<User, 'senha'>[] | undefined> => {
      return await userService.getAllUsers();
    },
    getUserByParams: async (
      _parent: unknown,
      args: argsType,
    ): Promise<Omit<User, 'senha'> | undefined> => {
      return await userService.getUserByParams(args?.filter);
    },
  },
  Mutation: {
    createUser: async (
      _parent: unknown,
      args: argsType,
    ): Promise<Omit<User, 'senha'> | undefined> => {
      return await userService.createUser(args?.input);
    },
    updateUser: async (
      _parent: unknown,
      args: argsType,
    ): Promise<Omit<User, 'senha'> | undefined> => {
      return await userService.updateUser(args?.id, args?.input);
    },
    deleteUser: async (
      _parent: unknown,
      args: argsType,
    ): Promise<string | undefined> => {
      return await userService.deleteUser(args?.id);
    },
  },
};

export default resolvers;
