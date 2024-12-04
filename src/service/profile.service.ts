import { profileModel } from '../models/profile.model';
import { Profile, ProfileService } from '../types/profiles.types';

export const profileService: ProfileService = {
  getAllProfiles: async (): Promise<Profile[]> => {
    try {
      return await profileModel.getAllProfiles();
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw new Error('Unable to fetch profiles. Please try again later.');
    }
  },

  getProfileByParams: async (params: Partial<Profile>): Promise<Profile> => {
    try {
      const profile = await profileModel.getProfileByParams(params);
      return profile;
    } catch (error) {
      console.error('Error fetching profile by parameters:', error);
      throw new Error(
        'Unable to fetch profile based on the provided parameters. Please check the input and try again.',
      );
    }
  },

  createProfile: async (profile: Profile): Promise<Profile> => {
    try {
      const createdProfile = await profileModel.createProfile(profile);
      return await profileModel.getProfileByParams({ id: createdProfile[0] });
    } catch (error) {
      console.error('Error creating profile:', error);
      throw new Error(
        'Unable to create a new profile. Please try again later.',
      );
    }
  },

  updateProfile: async (
    id: number,
    profile: Partial<Profile>,
  ): Promise<Profile> => {
    try {
      const existingProfile = await profileModel.getProfileByParams({ id });
      if (!existingProfile) {
        return Promise.reject(
          new Error(`Profile with ID ${id} does not exist.`),
        );
      }

      const updateSuccessful = await profileModel.updateProfile(id, profile);
      if (!updateSuccessful) {
        return Promise.reject(
          new Error(
            `Unable to update the profile with ID ${id}. Please try again later.`,
          ),
        );
      }

      return await profileModel.getProfileByParams({ id });
    } catch (error) {
      console.error(`Error updating profile with ID ${id}:`, error);
      throw new Error(
        `An unexpected error occurred while updating the profile.`,
      );
    }
  },

  deleteProfile: async (id: number): Promise<string> => {
    try {
      const result = await profileModel.deleteProfile(id);
      if (!result) {
        return Promise.reject(
          new Error(
            `Profile with ID ${id} not found. Deletion operation failed.`,
          ),
        );
      }
      return `Profile with ID ${id} was successfully deleted.`;
    } catch (error) {
      console.error(`Error deleting profile with ID ${id}:`, error);
      throw new Error(
        `Unable to delete the profile with ID ${id}. Please try again later.`,
      );
    }
  },
};
