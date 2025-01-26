import { profileService } from '@/service/profile.service';
import { Profile, argsType } from '@/types/profiles.types';

const resolvers = {
  Query: {
    getAllProfiles: async (): Promise<Profile[] | undefined> => {
      return await profileService.getAllProfiles();
    },

    getProfileByParams: async (
      _parent: unknown,
      args: argsType,
    ): Promise<Profile | undefined> => {
      return await profileService.getProfileByParams(args?.filter);
    },
  },

  Mutation: {
    createProfile: async (
      _parent: unknown,
      args: argsType,
    ): Promise<Profile | undefined> => {
      return await profileService.createProfile(args?.input);
    },

    updateProfile: async (
      _parent: unknown,
      args: argsType,
    ): Promise<Profile | undefined> => {
      return await profileService.updateProfile(args?.id, args?.input);
    },

    deleteProfile: async (
      _parent: unknown,
      args: argsType,
    ): Promise<string | undefined> => {
      return await profileService.deleteProfile(args?.id);
    },
  },
};

export default resolvers;
