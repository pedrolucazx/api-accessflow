import { database } from '@/database';
import { profileModel } from '@/repositories/profile.repository';
import type { Profile } from '@/types/profiles.types';

describe('Profile Model Integration Tests', () => {
  let latestProfile: Pick<Profile, 'id'> | undefined;
  beforeAll(async () => {
    latestProfile = await database<Profile>('perfis')
      .select('id')
      .orderBy('id', 'desc')
      .first();
  });

  it('should return all profiles', async () => {
    const profiles = await profileModel.getAllProfiles();

    expect(profiles).toEqual([
      { id: 1, nome: 'admin', descricao: 'Administrador' },
      { id: 2, nome: 'comum', descricao: 'Comum' },
    ]);
  });

  it('should return a specific profile matching the parameters', async () => {
    const profile = await profileModel.getProfileByParams({ nome: 'admin' });
    expect(profile).toEqual(
      expect.objectContaining({ nome: 'admin', descricao: 'Administrador' }),
    );
  });

  it('should create a profile and return the inserted ID', async () => {
    const result = await profileModel.createProfile({
      nome: 'New Profile',
      descricao: 'New Profile',
    });
    expect(result).toBeDefined();
    expect(result).toEqual(expect.any(Number));
  });

  it('should update a profile and return the number of affected rows', async () => {
    const id = latestProfile?.id;
    const updatedProfile = { nome: 'Updated', descricao: 'Updated' };
    const updatedRows = await profileModel.updateProfile(id!, updatedProfile);
    expect(updatedRows).toBe(1);
  });

  it('should delete a profile and return the number of affected rows', async () => {
    const id = latestProfile?.id;
    const deleteRows = await profileModel.deleteProfile(id!);
    expect(deleteRows).toBe(1);
  });
});
