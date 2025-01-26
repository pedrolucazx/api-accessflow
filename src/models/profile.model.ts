import { database } from '@/database';
import type { Profile, ProfileModel } from '@/types/profiles.types';

export const profileModel: ProfileModel = {
  getAllProfiles: async (): Promise<Profile[]> => {
    try {
      return await database<Profile>('perfis').select('*');
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getProfileByParams: async (
    params: Partial<Profile>,
  ): Promise<Profile | undefined> => {
    try {
      return await database<Profile>('perfis').where(params).first();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  createProfile: async (
    profile: Omit<Profile, 'id'>,
  ): Promise<number | undefined> => {
    try {
      const [id] = await database<Profile>('perfis').insert(profile);
      return id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updateProfile: async (
    id: number,
    profile: Partial<Profile>,
  ): Promise<number> => {
    try {
      return await database<Profile>('perfis').where({ id }).update(profile);
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
};
