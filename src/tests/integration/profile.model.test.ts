import { profileModel } from '../../models/profile.model';
import { Profile } from '../../types/profiles.types';
import { executeQuery } from '../../utils/executeQuery';

jest.setTimeout(50000);

describe('Profile Model Integration Tests', () => {
  let latestProfile: Pick<Profile, 'id'> | undefined;
  beforeAll(async () => {
    latestProfile = await executeQuery(
      async (database) =>
        await database<Profile>('perfis')
          .select('id')
          .orderBy('id', 'desc')
          .first(),
    );
  });

  it('should return all profiles', async () => {
    const fetchedProfiles = await profileModel.getAllProfiles();
    expect(fetchedProfiles).toHaveLength(2);
    expect(fetchedProfiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nome: 'admin',
          descricao: 'Administrador',
        }),
        expect.objectContaining({ nome: 'comum', descricao: 'Comum' }),
      ]),
    );
  });

  it('should return a specific profile matching the parameters', async () => {
    const profile = await profileModel.getProfileByParams({ nome: 'admin' });

    expect(profile).toEqual(
      expect.objectContaining({ nome: 'admin', descricao: 'Administrador' }),
    );
  });

  it('should create a profile and return the inserted ID', async () => {
    const profile = { nome: 'New Profile', descricao: 'New Profile' };
    const result = await profileModel.createProfile(profile);
    expect(result).toBeDefined();
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
