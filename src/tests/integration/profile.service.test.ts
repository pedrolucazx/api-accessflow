import { profileService } from '../../service/profile.service';
import database from '../../database/index';
import { Profile } from '../../types/profiles.types';

describe('Profile Service Integration Tests: Success Cases', () => {
  it('should return all profiles from the database', async () => {
    const mockProfiles: Profile[] = [
      { nome: 'Admin', descricao: 'Administrator' },
      { nome: 'User', descricao: 'Regular user' },
    ];

    await database('perfis').insert(mockProfiles);

    const profiles = await profileService.getAllProfiles();

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

    const profile = await profileService.getProfileByParams({ nome: 'Admin' });

    expect(profile).toEqual(expect.objectContaining(mockProfile));
  });

  it('should create a new profile and return it with the correct data', async () => {
    const newProfile: Profile = {
      nome: 'Test Profile',
      descricao: 'A test profile for integration tests',
    };

    const createdProfile = await profileService.createProfile(newProfile);

    const insertedProfile = await database('perfis')
      .where({ id: createdProfile.id })
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
    await profileService.updateProfile(id, updates);

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

    await profileService.deleteProfile(id);
    const deletedProfile = await database('perfis').where({ id }).first();

    expect(deletedProfile).toBeUndefined();
  });
  // Outros testes
});

describe('Profile Service Integration Tests: Error Cases', () => {
  it('should throw an error when trying to fetch a profiles', async () => {
    await expect(profileService.getAllProfiles()).rejects.toThrow(
      'Unable to fetch profiles. Please try again later.',
    );
  });

  it('should throw an error when trying to fetch a non-existent profile', async () => {
    await expect(
      profileService.getProfileByParams({ nome: 'NonExistent' }),
    ).rejects.toThrow(
      'Unable to fetch profile based on the provided parameters. Please check the input and try again.',
    );
  });

  it('should throw an error when trying to create an invalid profile', async () => {
    await expect(profileService.createProfile({} as Profile)).rejects.toThrow(
      'Unable to create a new profile. Please try again later.',
    );
  });

  it('should throw an error when trying to update a non-existent profile', async () => {
    await expect(
      profileService.updateProfile(-1, {} as Profile),
    ).rejects.toThrow(
      'An unexpected error occurred while updating the profile.',
    );
  });

  it('should throw an error when trying to delete a non-existent profile', async () => {
    await expect(profileService.deleteProfile(9999)).rejects.toThrow(
      'Unable to delete the profile with ID 9999. Please try again later.',
    );
  });
});
