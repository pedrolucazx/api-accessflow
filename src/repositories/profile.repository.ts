import { database } from '../database';
import type {
  Profile,
  ProfileFilter,
  ProfileInput,
  ProfileRepository,
} from '../types/profiles.types';

export const profileRepository: ProfileRepository = {
  getAllProfiles: async (): Promise<Profile[]> => {
    try {
      return await database<Profile>('perfis').select('*');
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getProfileByParams: async (
    filters: ProfileFilter,
  ): Promise<Profile | undefined> => {
    try {
      return await database<Profile>('perfis').where(filters).first();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  createProfile: async (
    profile: ProfileInput,
  ): Promise<Profile | undefined> => {
    try {
      const [createdProfile] = await database<Profile>('perfis')
        .insert(profile)
        .returning('*');

      return createdProfile;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updateProfile: async (
    id: number,
    profile: Partial<ProfileInput>,
  ): Promise<Profile | undefined> => {
    try {
      const [updatedProfile] = await database<Profile>('perfis')
        .where({ id })
        .update(profile)
        .returning('*');

      return updatedProfile;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  deleteProfile: async (id: number): Promise<number> => {
    try {
      return await database<Profile>('perfis').where({ id }).delete();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  countProfiles: async (): Promise<number> => {
    try {
      const { count } = (await database('perfis')
        .count<{
          count: string | number;
        }>('id as count')
        .first()) ?? { count: 0 };
      return Number(count);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
