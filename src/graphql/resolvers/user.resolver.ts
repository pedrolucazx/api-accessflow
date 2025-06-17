import { Profile } from '@/types/profiles.types';
import { userService } from '../../service/user.service';
import {
  argsType,
  AuthenticatedUser,
  LoginInput,
  SignUpInput,
  User,
  UserInput,
  Metrics,
  UserUpdateInput,
} from '../../types/users.types';
import { Context } from '../context';

const resolvers = {
  User: {
    perfis: async (parent: User): Promise<Profile[] | undefined> => {
      return await userService.getUserProfiles(parent?.id);
    },
  },
  Query: {
    getAllUsers: async (
      _obj: unknown,
      _args: argsType,
      context: Context,
    ): Promise<User[] | undefined> => {
      context.validateAdmin();
      return await userService.getAllUsers();
    },
    getUserByParams: async (
      _obj: unknown,
      args: argsType,
      context: Context,
    ): Promise<User | undefined> => {
      context.validateUserAccess(args.filter.id!);
      return await userService.getUserByParams(args?.filter);
    },
    login: async (
      _obj: unknown,
      args: { input: LoginInput },
    ): Promise<AuthenticatedUser | undefined> => {
      return await userService.login(args?.input);
    },
    getMetrics: async (
      _obj: unknown,
      _args: argsType,
      _context: Context,
    ): Promise<Metrics | undefined> => {
      return await userService.getMetrics();
    },
  },
  Mutation: {
    createUser: async (
      _obj: unknown,
      args: { input: UserInput },
      context: Context,
    ): Promise<User | undefined> => {
      context.validateAdmin();
      return await userService.createUser(args?.input);
    },
    updateUser: async (
      _obj: unknown,
      args: { input: UserUpdateInput; id: number },
      context: Context,
    ): Promise<User | undefined> => {
      context.validateUserAccess(args?.id);
      return await userService.updateUser(
        args?.id,
        args?.input,
        context?.user?.perfis as Profile[],
      );
    },
    deleteUser: async (
      _obj: unknown,
      args: argsType,
      context: Context,
    ): Promise<string | undefined> => {
      context.validateAdmin();
      return await userService.deleteUser(args?.id);
    },
    signUp: async (
      _obj: unknown,
      args: { input: SignUpInput },
    ): Promise<User | undefined> => {
      return await userService.signUp(args?.input);
    },
  },
};

export default resolvers;
