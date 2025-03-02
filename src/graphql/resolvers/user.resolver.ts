import { Profile } from '@/types/profiles.types';
import { userService } from '../../service/user.service';
import { argsType, AuthenticatedUser, User } from '../../types/users.types';

const resolvers = {
  User: {
    perfis: async (parent: User): Promise<Profile[] | undefined> => {
      return await userService.getUserProfiles(parent?.id);
    },
  },
  Query: {
    getAllUsers: async (): Promise<User[] | undefined> => {
      return await userService.getAllUsers();
    },
    getUserByParams: async (
      _parent: unknown,
      args: argsType,
    ): Promise<User | undefined> => {
      return await userService.getUserByParams(args?.filter);
    },
    login: async (
      _parent: unknown,
      args: argsType,
    ): Promise<AuthenticatedUser | undefined> => {
      return await userService.login(args?.input);
    },
  },
  Mutation: {
    createUser: async (
      _parent: unknown,
      args: argsType,
    ): Promise<User | undefined> => {
      return await userService.createUser(args?.input);
    },
    updateUser: async (
      _parent: unknown,
      args: argsType,
    ): Promise<User | undefined> => {
      return await userService.updateUser(args?.id, args?.input);
    },
    deleteUser: async (
      _parent: unknown,
      args: argsType,
    ): Promise<string | undefined> => {
      return await userService.deleteUser(args?.id);
    },
    signUp: async (
      _parent: unknown,
      args: argsType,
    ): Promise<User | undefined> => {
      return await userService.signUp(args?.input);
    },
  },
};

export default resolvers;
