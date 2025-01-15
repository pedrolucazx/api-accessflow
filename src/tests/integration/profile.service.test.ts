import { profileService } from '../../service/profile.service';
import { Profile } from '../../types/profiles.types';
import { executeQuery } from '../../utils/executeQuery';

jest.setTimeout(50000);

describe('Profile Service Integration Tests', () => {
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

  it('should fetch all profiles from the database', async () => {
    const profiles = await profileService.getAllProfiles();

    expect(profiles).toHaveLength(2);
    expect(profiles).toEqual([
      { descricao: 'Administrador', id: 1, nome: 'admin' },
      { descricao: 'Comum', id: 2, nome: 'comum' },
    ]);
  });

  it('should fetch a specific profile matching the given parameters', async () => {
    const profile = await profileService.getProfileByParams({ id: 1 });

    expect(profile).toEqual({
      descricao: 'Administrador',
      id: 1,
      nome: 'admin',
    });
  });

  it('should create a new profile and return its data', async () => {
    const newProfile: Profile = {
      nome: 'Test Profile',
      descricao: 'A test profile for integration tests',
    };

    const createdProfile = await profileService.createProfile(newProfile);
    expect(createdProfile).toEqual(expect.objectContaining(newProfile));
  });

  it('should update an existing profile with the provided updates', async () => {
    const id = latestProfile?.id;
    const updates = { descricao: 'New Description' };
    const updatedProfile = await profileService.updateProfile(id!, updates);

    expect(updatedProfile).toEqual(
      expect.objectContaining({ ...updatedProfile, ...updates }),
    );
  });

  it('should delete an existing profile and confirm its removal', async () => {
    const id = latestProfile?.id;
    const deletedProfile = await profileService.deleteProfile(id!);

    expect(deletedProfile).toEqual(
      `Profile with ID ${id} was successfully deleted.`,
    );
  });
});
