import { Profile } from '../../types/profiles.types';
import { profileService } from '../../service/profile.service';
import { profileModel } from '../../models/profile.model';

jest.setTimeout(50000);
jest.mock('../../models/profile.model');

describe('Profile Service Unit Tests', () => {
  const mockProfiles: Profile[] = [
    { id: 1, nome: 'admin', descricao: 'Administrador' },
    { id: 2, nome: 'comum', descricao: 'Comum' },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all profiles successfully', async () => {
    (profileModel.getAllProfiles as jest.Mock).mockResolvedValue(mockProfiles);
    const profiles = await profileService.getAllProfiles();

    expect(profiles).toEqual(mockProfiles);
    expect(profileModel.getAllProfiles).toHaveBeenCalledTimes(1);
  });

  it('should fetch a profile by valid parameters successfully', async () => {
    const expectedProfile = mockProfiles[0];
    (profileModel.getProfileByParams as jest.Mock).mockResolvedValue(
      expectedProfile,
    );
    const profile = await profileService.getProfileByParams({ id: 1 });

    expect(profile).toEqual(expectedProfile);
    expect(profileModel.getProfileByParams).toHaveBeenCalledWith({ id: 1 });
  });

  it('should create a profile successfully', async () => {
    const newProfile: Profile = {
      nome: 'New Profile',
      descricao: 'New Profile',
    };
    const createdProfile = { id: 1, ...newProfile };

    (profileModel.createProfile as jest.Mock).mockResolvedValue(1);
    (profileModel.getProfileByParams as jest.Mock).mockResolvedValue(
      createdProfile,
    );

    const result = await profileService.createProfile(newProfile);
    expect(result).toEqual(createdProfile);
    expect(profileModel.createProfile).toHaveBeenCalledWith(newProfile);
    expect(profileModel.getProfileByParams).toHaveBeenCalledWith({ id: 1 });
  });

  it('should update a profile successfully', async () => {
    const updatedData = { nome: 'Updated admin' };
    const updatedProfile = {
      id: 1,
      nome: 'Updated admin',
      descricao: 'Administrador',
    };

    (profileModel.updateProfile as jest.Mock).mockResolvedValue(1);
    (profileModel.getProfileByParams as jest.Mock).mockResolvedValue(
      updatedProfile,
    );

    const result = await profileService.updateProfile(1, updatedData);
    expect(result).toEqual(updatedProfile);
    expect(profileModel.updateProfile).toHaveBeenCalledWith(1, updatedData);
    expect(profileModel.getProfileByParams).toHaveBeenCalledWith({ id: 1 });
  });

  it('should delete a profile successfully', async () => {
    const profileId = 1;
    (profileModel.deleteProfile as jest.Mock).mockResolvedValue(1);
    const result = await profileService.deleteProfile(profileId);
    expect(result).toBe(
      `Profile with ID ${profileId} was successfully deleted.`,
    );
    expect(profileModel.deleteProfile).toHaveBeenCalledWith(profileId);
  });

  it('should throw an error no profiles found during fetch', async () => {
    (profileModel.getAllProfiles as jest.Mock).mockResolvedValue([]);
    const result = await profileService.getAllProfiles();
    expect(result).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching profiles:',
      new Error('No profiles found.'),
    );
  });

  it('should throw an error database during fetch of all profiles', async () => {
    (profileModel.getAllProfiles as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    expect(await profileService.getAllProfiles()).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching profiles:',
      new Error('Database error'),
    );
  });

  it('should throw an error invalid parameters for fetching a profile', async () => {
    (profileModel.getProfileByParams as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    expect(await profileService.getProfileByParams({})).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching profile by parameters:',
      new Error('At least one parameter must be provided.'),
    );
  });

  it('should throw an error profile not found for given parameters', async () => {
    (profileModel.getProfileByParams as jest.Mock).mockResolvedValue(undefined);

    expect(
      await profileService.getProfileByParams({ nome: 'Non-existent' }),
    ).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching profile by parameters:',
      new Error('Profile not found.'),
    );
  });

  it('should throw an error database during fetch by parameters', async () => {
    (profileModel.getProfileByParams as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    expect(await profileService.getProfileByParams({ id: 1 })).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching profile by parameters:',
      new Error('Database error'),
    );
  });

  it('should throw an error incomplete profile data during creation', async () => {
    (profileModel.createProfile as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    expect(await profileService.createProfile({} as Profile)).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      'Error creating profile:',
      new Error('Profile data is incomplete or invalid.'),
    );
  });

  it('should throw an error failure to create a profile', async () => {
    (profileModel.createProfile as jest.Mock).mockResolvedValue(undefined);

    expect(
      await profileService.createProfile({
        nome: 'New Profile',
        descricao: 'New Profile',
      }),
    ).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      'Error creating profile:',
      new Error('Failed to create profile.'),
    );
  });

  it('should throw an error invalid ID or data during update', async () => {
    expect(await profileService.updateProfile(0, {})).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      'Error updating profile with ID 0:',
      new Error('Invalid profile data or ID.'),
    );
  });

  it('should throw an error profile not found for update', async () => {
    (profileModel.updateProfile as jest.Mock).mockResolvedValue(0);

    expect(
      await profileService.updateProfile(1, { nome: 'Update' }),
    ).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      'Error updating profile with ID 1:',
      new Error('No profile found with ID 1 to update.'),
    );
  });

  it('should throw an error database during profile update', async () => {
    (profileModel.updateProfile as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    expect(
      await profileService.updateProfile(1, { nome: 'Update' }),
    ).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      'Error updating profile with ID 1:',
      new Error('Database error'),
    );
  });

  it('should throw an error missing ID during deletion', async () => {
    expect(
      await profileService.deleteProfile(undefined as unknown as number),
    ).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      'Error deleting profile with ID undefined:',
      new Error('Profile ID is required.'),
    );
  });

  it('should throw an error database during profile deletion', async () => {
    (profileModel.deleteProfile as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    expect(await profileService.deleteProfile(1)).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      'Error deleting profile with ID 1:',
      new Error('Database error'),
    );
  });

  it('should throw an error profile not found for deletion', async () => {
    (profileModel.deleteProfile as jest.Mock).mockResolvedValue(undefined);

    expect(await profileService.deleteProfile(1)).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      'Error deleting profile with ID 1:',
      new Error('No profile found with ID 1 to delete.'),
    );
  });
});
