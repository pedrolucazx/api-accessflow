import database from '../database/index';
import { Profile, ProfileMethods } from '../types/profiles.types';

export const profileModel: ProfileMethods = {
  getAllProfiles: async (): Promise<Profile[]> => {
    try {
      const profiles = await database<Profile>('perfis').select('*');
      if (!profiles.length) {
        throw new Error('No profiles found.');
      }

      return profiles;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw new Error('Could not fetch profiles.');
    }
  },

  getProfileByParams: async (params: Partial<Profile>): Promise<Profile> => {
    try {
      const profile = await database<Profile>('perfis').where(params).first();
      if (!profile) {
        throw new Error('Profile not found');
      }
      return profile;
    } catch (error) {
      console.error('Error fetching profile by parameters:', error);
      throw new Error('Could not fetch profile by parameters.');
    }
  },

  createProfile: async (profile: Profile): Promise<number[]> => {
    try {
      return await database<Profile>('perfis').insert(profile);
    } catch (error) {
      console.error('Error creating profile:', error);
      throw new Error('Could not create profile.');
    }
  },

  updateProfile: async (
    id: number,
    profile: Partial<Profile>,
  ): Promise<number> => {
    try {
      const updatedRows = await database<Profile>('perfis')
        .where({ id })
        .update(profile);
      if (!updatedRows) {
        throw new Error(`Profile with ID ${id} not found.`);
      }
      return updatedRows;
    } catch (error) {
      console.error(`Error updating profile with ID ${id}:`, error);
      throw new Error(`Could not update profile with ID ${id}.`);
    }
  },

  deleteProfile: async (id: number): Promise<number> => {
    try {
      const deletedRows = await database<Profile>('perfis')
        .where({ id })
        .delete();
      if (!deletedRows) {
        throw new Error(`Profile with ID ${id} not found.`);
      }
      return deletedRows;
    } catch (error) {
      console.error(`Error deleting profile with ID ${id}:`, error);
      throw new Error(`Could not delete profile with ID ${id}.`);
    }
  },
};
