import { Profile } from '@/types/profiles.types';
import { profileService } from '@/service/profile.service';
import { profileModel } from '@/models/profile.model';

jest.mock('@/models/profile.model');

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

    await expect(profileService.getAllProfiles()).rejects.toThrow(
      'No profiles found.',
    );
  });

  it('should throw an error database during fetch of all profiles', async () => {
    (profileModel.getAllProfiles as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(profileService.getAllProfiles()).rejects.toThrow(
      'Error fetching profiles: Database error',
    );
  });

  it('should throw an error invalid parameters for fetching a profile', async () => {
    await expect(profileService.getProfileByParams({})).rejects.toThrow(
      'At least one parameter must be provided.',
    );
  });

  it('should throw an error profile not found for given parameters', async () => {
    (profileModel.getProfileByParams as jest.Mock).mockResolvedValue(undefined);

    await expect(
      profileService.getProfileByParams({ nome: 'Non-existent' }),
    ).rejects.toThrow('Profile not found.');
  });

  it('should throw an error database during fetch by parameters', async () => {
    (profileModel.getProfileByParams as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(profileService.getProfileByParams({ id: 1 })).rejects.toThrow(
      'Error fetching profile by parameters: Database error',
    );
  });

  it('should throw an error incomplete profile data during creation', async () => {
    await expect(profileService.createProfile({} as Profile)).rejects.toThrow(
      'Profile data is incomplete or invalid.',
    );
  });

  it('should throw an error failure to create a profile', async () => {
    (profileModel.createProfile as jest.Mock).mockResolvedValue(undefined);

    await expect(
      profileService.createProfile({
        nome: 'New Profile',
        descricao: 'New Profile',
      }),
    ).rejects.toThrow('Failed to create profile.');
  });

  it('should throw an error database during profile create', async () => {
    (profileModel.createProfile as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(
      profileService.createProfile({
        nome: 'New Profile',
        descricao: 'New Profile',
      }),
    ).rejects.toThrow('Error creating profile: Database error');
  });

  it('should throw an error invalid ID or data during update', async () => {
    await expect(profileService.updateProfile(0, {})).rejects.toThrow(
      'Invalid profile data or ID.',
    );
  });

  it('should throw an error profile not found for update', async () => {
    (profileModel.updateProfile as jest.Mock).mockResolvedValue(0);

    await expect(
      profileService.updateProfile(1, { nome: 'Update' }),
    ).rejects.toThrow(`No profile found with ID 1 to update.`);
  });

  it('should throw an error database during profile update', async () => {
    (profileModel.updateProfile as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(
      profileService.updateProfile(1, { nome: 'Update' }),
    ).rejects.toThrow('Error updating profile with ID 1: Database error');
  });

  it('should throw an error missing ID during deletion', async () => {
    await expect(
      profileService.deleteProfile(undefined as unknown as number),
    ).rejects.toThrow('Profile ID is required.');
  });

  it('should throw an error database during profile deletion', async () => {
    (profileModel.deleteProfile as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(profileService.deleteProfile(1)).rejects.toThrow(
      `Error deleting profile with ID 1: Database error`,
    );
  });

  it('should throw an error profile not found for deletion', async () => {
    (profileModel.deleteProfile as jest.Mock).mockResolvedValue(undefined);

    await expect(profileService.deleteProfile(1)).rejects.toThrow(
      'No profile found with ID 1 to delete.',
    );
  });
});
