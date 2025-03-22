import { profileService } from '../../service/profile.service';
import { Profile, argsType } from '../../types/profiles.types';
import { Context } from '../context';

const resolvers = {
  Query: {
    getAllProfiles: async (
      _obj: unknown,
      _args: argsType,
      context: Context,
    ): Promise<Profile[] | undefined> => {
      context.validateAdmin();
      return await profileService.getAllProfiles();
    },

    getProfileByParams: async (
      _obj: unknown,
      args: argsType,
      context: Context,
    ): Promise<Profile | undefined> => {
      context.validateAdmin();
      return await profileService.getProfileByParams(args?.filter);
    },
  },

  Mutation: {
    createProfile: async (
      _obj: unknown,
      args: argsType,
      context: Context,
    ): Promise<Profile | undefined> => {
      context.validateAdmin();
      return await profileService.createProfile(args?.input);
    },

    updateProfile: async (
      _obj: unknown,
      args: argsType,
      context: Context,
    ): Promise<Profile | undefined> => {
      context.validateAdmin();
      return await profileService.updateProfile(args?.id, args?.input);
    },

    deleteProfile: async (
      _obj: unknown,
      args: argsType,
      context: Context,
    ): Promise<string | undefined> => {
      context.validateAdmin();
      return await profileService.deleteProfile(args?.id);
    },
  },
};

export default resolvers;
