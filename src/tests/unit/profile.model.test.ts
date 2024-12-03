import { profileModel, Profile } from '../../models/profile.model';
import database from '../../database/index';

describe('Profile Model Unit Tests: Success Cases', () => {
  const testProfile: Profile = {
    nome: 'Admin',
    descricao: 'Perfil de Administrador',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a profile', async () => {
    const profileId = await profileModel.createProfile(testProfile);

    expect(profileId).toHaveLength(1);
    const createdProfile = await database<Profile>('perfis')
      .where({ id: profileId[0] })
      .first();
    expect(createdProfile).toMatchObject(testProfile);
  });

  it('should fetch all profiles', async () => {
    await profileModel.createProfile(testProfile);

    const profiles = await profileModel.getAllProfiles();
    expect(profiles.length).toBeGreaterThan(0);
    expect(profiles).toEqual(
      expect.arrayContaining([expect.objectContaining(testProfile)]),
    );
  });

  it('should fetch profile by params', async () => {
    const [profileId] = await profileModel.createProfile(testProfile);

    const profile = await profileModel.getProfileByParams({ id: profileId });
    expect(profile).toMatchObject(testProfile);
  });

  it('should update a profile', async () => {
    const [profileId] = await profileModel.createProfile(testProfile);

    const updatedProfile = { nome: 'Admin Updated' };
    const rowsUpdated = await profileModel.updateProfile(
      profileId,
      updatedProfile,
    );
    expect(rowsUpdated).toBe(1);

    const updatedProfileFromDb = await database<Profile>('perfis')
      .where({ id: profileId })
      .first();
    expect(updatedProfileFromDb?.nome).toBe(updatedProfile.nome);
  });

  it('should delete a profile', async () => {
    const [profileId] = await profileModel.createProfile(testProfile);

    const rowsDeleted = await profileModel.deleteProfile(profileId);
    expect(rowsDeleted).toBe(1);

    const deletedProfile = await database<Profile>('perfis')
      .where({ id: profileId })
      .first();
    expect(deletedProfile).toBeUndefined();
  });
});

describe('Profile Model Unit Tests: Error Cases', () => {
  it('should handle error when creating a profile with invalid data', async () => {
    const invalidProfile = {};
    jest.spyOn(database, 'insert').mockResolvedValueOnce(invalidProfile);

    await expect(
      profileModel.createProfile(invalidProfile as Profile),
    ).rejects.toThrow('Could not create profile.');
  });

  it('should throw an error when there is an issue fetching all profiles', async () => {
    jest
      .spyOn(database, 'select')
      .mockRejectedValueOnce(new Error('Database connection failed'));

    await expect(profileModel.getAllProfiles()).rejects.toThrow(
      'Could not fetch profiles.',
    );
  });

  it('should handle error when fetching profiles by invalid params', async () => {
    jest.spyOn(database, 'where').mockResolvedValueOnce([]);

    await expect(profileModel.getProfileByParams({ id: -1 })).rejects.toThrow(
      'Could not fetch profile by parameters.',
    );
  });

  it('should handle error when updating a non-existent profile', async () => {
    jest.spyOn(database, 'where').mockResolvedValueOnce([]);

    await expect(
      profileModel.updateProfile(9999, { nome: 'Nonexistent' }),
    ).rejects.toThrow('Could not update profile with ID 9999.');
  });

  it('should handle error when deleting a non-existent profile', async () => {
    jest.spyOn(database, 'where').mockResolvedValueOnce([]);

    await expect(profileModel.deleteProfile(9999)).rejects.toThrow(
      'Could not delete profile with ID 9999.',
    );
  });
});
