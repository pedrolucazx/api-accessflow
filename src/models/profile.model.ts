import database from '../database/index';
import { Profile, ProfileModel } from '../types/profiles.types';

export const profileModel: ProfileModel = {
  getAllProfiles: async (): Promise<Profile[] | undefined> => {
    try {
      const profiles = await database<Profile>('perfis').select('*');
      return profiles;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw new Error('Could not fetch profiles.');
    }
  },

  getProfileByParams: async (
    params: Partial<Profile>,
  ): Promise<Profile | undefined> => {
    try {
      const profile = await database<Profile>('perfis').where(params).first();
      return profile;
    } catch (error) {
      console.error('Error fetching profile by parameters:', error);
      throw new Error('Could not fetch profile by parameters.');
    }
  },

  createProfile: async (profile: Profile): Promise<number | undefined> => {
    try {
      const [id] = await database<Profile>('perfis').insert(profile);
      return id;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw new Error('Could not create profile.');
    }
  },

  updateProfile: async (
    id: number,
    profile: Partial<Profile>,
  ): Promise<number | undefined> => {
    try {
      const updatedRows = await database<Profile>('perfis')
        .where({ id })
        .update(profile);
      return updatedRows;
    } catch (error) {
      console.error(`Error updating profile with ID ${id}:`, error);
      throw new Error(`Could not update profile with ID ${id}.`);
    }
  },

  deleteProfile: async (id: number): Promise<number | undefined> => {
    try {
      const deletedRows = await database('perfis').where({ id }).delete();
      return deletedRows;
    } catch (error) {
      console.error(`Error deleting profile with ID ${id}:`, error);
      throw new Error(`Could not delete profile with ID ${id}.`);
    }
  },
};
