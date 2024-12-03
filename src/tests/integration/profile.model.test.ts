import { profileModel, Profile } from '../../models/profile.model';
import database from '../../database/index';

describe('Profile Model Integration Tests: Success Cases', () => {
  it('should return all profiles from the database', async () => {
    const mockProfiles: Profile[] = [
      { nome: 'Admin', descricao: 'Administrator' },
      { nome: 'User', descricao: 'Regular user' },
    ];

    await database('perfis').insert(mockProfiles);

    const profiles = await profileModel.getAllProfiles();

    expect(profiles).toHaveLength(2);
    expect(profiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ nome: 'Admin', descricao: 'Administrator' }),
        expect.objectContaining({ nome: 'User', descricao: 'Regular user' }),
      ]),
    );
  });

  it('should return a specific profile matching the parameters', async () => {
    const mockProfile: Profile = {
      nome: 'Admin',
      descricao: 'Administrator',
    };
    await database('perfis').insert(mockProfile);

    const profile = await profileModel.getProfileByParams({ nome: 'Admin' });

    expect(profile).toEqual(expect.objectContaining(mockProfile));
  });

  it('should insert a new profile into the database', async () => {
    const newProfile: Profile = {
      nome: 'NewProfile',
      descricao: 'A new profile',
    };

    const result = await profileModel.createProfile(newProfile);
    const insertedProfile = await database('perfis')
      .where({ id: result[0] })
      .first();

    expect(insertedProfile).toEqual(expect.objectContaining(newProfile));
  });

  it('should update an existing profile', async () => {
    const mockProfile: Profile = {
      nome: 'ToUpdate',
      descricao: 'Old Description',
    };
    const [id] = await database('perfis').insert(mockProfile);

    const updates = { descricao: 'New Description' };
    await profileModel.updateProfile(id, updates);

    const updatedProfile = await database('perfis').where({ id }).first();
    expect(updatedProfile).toEqual(
      expect.objectContaining({ ...mockProfile, ...updates }),
    );
  });

  it('should delete a profile from the database', async () => {
    const mockProfile: Profile = {
      nome: 'ToDelete',
      descricao: 'A profile to delete',
    };
    const [id] = await database('perfis').insert(mockProfile);

    await profileModel.deleteProfile(id);
    const deletedProfile = await database('perfis').where({ id }).first();

    expect(deletedProfile).toBeUndefined();
  });
});

describe('Profile Model Integration Tests: Error Cases', () => {
  it('should throw an error when trying to fetch a non-existent profile', async () => {
    await expect(
      profileModel.getProfileByParams({ nome: 'NonExistent' }),
    ).rejects.toThrow('Could not fetch profile by parameters.');
  });

  it('should throw an error when trying to create an invalid profile', async () => {
    await expect(profileModel.createProfile({} as Profile)).rejects.toThrow(
      'Could not create profile.',
    );
  });

  it('should throw an error when trying to update a non-existent profile', async () => {
    await expect(profileModel.updateProfile(-1, {} as Profile)).rejects.toThrow(
      'Could not update profile with ID -1.',
    );
  });

  it('should throw an error when trying to delete a non-existent profile', async () => {
    await expect(profileModel.deleteProfile(9999)).rejects.toThrow(
      'Could not delete profile with ID 9999.',
    );
  });
});
