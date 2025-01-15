import { Profile, ProfileModel } from '../types/profiles.types';
import { executeQuery } from '../utils/executeQuery';

export const profileModel: ProfileModel = {
  getAllProfiles: async (): Promise<Profile[]> => {
    return executeQuery(
      async (database) => await database<Profile>('perfis').select('*'),
      'Error fetching profiles.',
    );
  },

  getProfileByParams: async (
    params: Partial<Profile>,
  ): Promise<Profile | undefined> => {
    return executeQuery(
      async (database) =>
        await database<Profile>('perfis').where(params).first(),
      'Error fetching profile by parameters.',
    );
  },

  createProfile: async (
    profile: Omit<Profile, 'id'>,
  ): Promise<number | undefined> => {
    return executeQuery(async (database) => {
      const [{ id }] = await database<Profile>('perfis')
        .insert(profile)
        .returning('id');
      return id;
    }, 'Error creating profile.');
  },

  updateProfile: async (
    id: number,
    profile: Partial<Profile>,
  ): Promise<number> => {
    return executeQuery(
      async (database) =>
        await database<Profile>('perfis').where({ id }).update(profile),
      `Error updating profile with ID ${id}.`,
    );
  },

  deleteProfile: async (id: number): Promise<number> => {
    return executeQuery(
      async (database) =>
        await database<Profile>('perfis').where({ id }).delete(),
      `Error deleting profile with ID ${id}.`,
    );
  },
};
