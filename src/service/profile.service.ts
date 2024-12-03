import { profileModel } from '../models/profile.model';
import { ProfileMethods, Profile } from '../types/profiles.types';

export const profileService: ProfileMethods = {
  getAllProfiles: async (): Promise<Profile[]> => {
    try {
      return await profileModel.getAllProfiles();
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw new Error('Could not fetch profiles.');
    }
  },

  getProfileByParams: async (params: Partial<Profile>): Promise<Profile> => {
    try {
      return await profileModel.getProfileByParams(params);
    } catch (error) {
      console.error('Error fetching profile by parameters:', error);
      throw new Error('Could not fetch profile by parameters.');
    }
  },

  createProfile: async (profile: Profile): Promise<number[]> => {
    try {
      return await profileModel.createProfile(profile);
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
      return await profileModel.updateProfile(id, profile);
    } catch (error) {
      console.error(`Error updating profile with ID ${id}:`, error);
      throw new Error(`Could not update profile with ID ${id}.`);
    }
  },

  deleteProfile: async (id: number): Promise<number> => {
    try {
      return await profileModel.deleteProfile(id);
    } catch (error) {
      console.error(`Error deleting profile with ID ${id}:`, error);
      throw new Error(`Could not delete profile with ID ${id}.`);
    }
  },
};
