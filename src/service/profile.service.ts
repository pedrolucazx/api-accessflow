import { CustomError, handleError } from '../../src/utils/handleError';
import { profileRepository } from '../repositories/profile.repository';
import {
  Profile,
  ProfileFilter,
  ProfileInput,
  ProfileService,
} from '../types/profiles.types';

export const profileService: ProfileService = {
  getAllProfiles: async (): Promise<Profile[] | undefined> => {
    try {
      const profiles = await profileRepository.getAllProfiles();
      if (!profiles?.length) {
        throw new CustomError('No profiles found.');
      }
      return profiles;
    } catch (error) {
      handleError('Error fetching profiles:', error);
    }
  },

  getProfileByParams: async (
    filters: ProfileFilter,
  ): Promise<Profile | undefined> => {
    try {
      if (!Object.keys(filters).length) {
        throw new CustomError('At least one parameter must be provided.');
      }
      const profile = await profileRepository.getProfileByParams(filters);
      if (!profile) {
        throw new CustomError('Perfil não encontrado.');
      }
      return profile;
    } catch (error) {
      handleError('Error fetching profile by parameters:', error);
    }
  },

  createProfile: async (
    profile: ProfileInput,
  ): Promise<Profile | undefined> => {
    try {
      if (!profile || !profile.nome) {
        throw new CustomError('Profile data is incomplete or invalid.');
      }

      const createdProfile = await profileRepository.createProfile(profile);
      if (!createdProfile) throw new CustomError('Failed to create profile.');

      return createdProfile;
    } catch (error) {
      handleError('Error creating profile:', error);
    }
  },

  updateProfile: async (
    id: number,
    profile: Partial<ProfileInput>,
  ): Promise<Profile | undefined> => {
    try {
      if (!id || !profile || !Object.keys(profile).length) {
        throw new CustomError('Invalid profile data or ID.');
      }

      const updatedProfile = await profileRepository.updateProfile(id, profile);
      if (!updatedProfile) {
        throw new CustomError(`No profile found with ID ${id} to update.`);
      }

      return updatedProfile;
    } catch (error) {
      handleError(`Error updating profile with ID ${id}:`, error);
    }
  },

  deleteProfile: async (id: number): Promise<string | undefined> => {
    try {
      if (!id) {
        throw new CustomError('Profile ID is required.');
      }

      const deletedRows = await profileRepository.deleteProfile(id);
      if (!deletedRows) {
        throw new CustomError(`No profile found with ID ${id} to delete.`);
      }

      return `Profile with ID ${id} was successfully deleted.`;
    } catch (error) {
      handleError(`Error deleting profile with ID ${id}:`, error);
    }
  },
};
