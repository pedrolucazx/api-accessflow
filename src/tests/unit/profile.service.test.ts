import { Profile } from '../../types/profiles.types';
import { profileService } from '../../service/profile.service';
import { profileModel } from '../../models/profile.model';

jest.mock('../../models/profile.model');

const mockProfiles: Profile[] = [
  { id: 1, nome: 'Admin', descricao: 'Admin profile' },
  { id: 2, nome: 'User', descricao: 'User profile' },
];

describe('Profile Service Unit Tests: Success Cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of profiles when successful', async () => {
    (profileModel.getAllProfiles as jest.Mock).mockResolvedValue([
      { id: 1, nome: 'Admin', descricao: 'Admin profile' },
      { id: 2, nome: 'User', descricao: 'User profile' },
    ]);

    const result = await profileService.getAllProfiles();
    expect(result).toEqual(mockProfiles);
    expect(profileModel.getAllProfiles).toHaveBeenCalledTimes(1);
  });

  it('should return a profile when found', async () => {
    (profileModel.getProfileByParams as jest.Mock).mockResolvedValue(
      mockProfiles[0],
    );

    const result = await profileService.getProfileByParams({ id: 1 });
    expect(result).toEqual({
      id: 1,
      nome: 'Admin',
      descricao: 'Admin profile',
    });
    expect(profileModel.getProfileByParams).toHaveBeenCalledTimes(1);
  });

  it('should create and return the created profile', async () => {
    const newProfile: Profile = {
      nome: 'New Profile',
      descricao: 'New Profile',
    };

    (profileModel.createProfile as jest.Mock).mockResolvedValue([1]);
    (profileModel.getProfileByParams as jest.Mock).mockResolvedValue(
      newProfile,
    );

    const result = await profileService.createProfile(newProfile);
    expect(result).toEqual(newProfile);
    expect(profileModel.createProfile).toHaveBeenCalledTimes(1);
    expect(profileModel.getProfileByParams).toHaveBeenCalledTimes(1);
  });

  it('should update and return the updated profile', async () => {
    jest
      .spyOn(profileModel, 'getProfileByParams')
      .mockResolvedValue(mockProfiles[0]);
    jest.spyOn(profileModel, 'updateProfile').mockResolvedValue(1);

    const updatedProfile = await profileService.updateProfile(1, {
      nome: 'Jane Doe',
    });

    expect(profileModel.getProfileByParams).toHaveBeenCalledWith({ id: 1 });
    expect(profileModel.updateProfile).toHaveBeenCalledWith(1, {
      nome: 'Jane Doe',
    });
    expect(profileModel.getProfileByParams).toHaveBeenCalledTimes(2);
    expect(updatedProfile).toEqual({
      id: 1,
      nome: 'Admin',
      descricao: 'Admin profile',
    });
  });

  it('should delete the profile and return a success message', async () => {
    (profileModel.deleteProfile as jest.Mock).mockResolvedValue(true);

    const result = await profileService.deleteProfile(1);
    expect(result).toBe('Profile with ID 1 was successfully deleted.');
    expect(profileModel.deleteProfile).toHaveBeenCalledTimes(1);
  });
});

describe('Profile Service Unit Tests: Error Cases', () => {
  it('should throw an error when fetching profiles fails', async () => {
    (profileModel.getAllProfiles as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(profileService.getAllProfiles()).rejects.toThrow(
      'Unable to fetch profiles. Please try again later.',
    );
    expect(profileModel.getAllProfiles).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when fetching profile fails', async () => {
    (profileModel.getProfileByParams as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(profileService.getProfileByParams({ id: 1 })).rejects.toThrow(
      'Unable to fetch profile based on the provided parameters. Please check the input and try again.',
    );
    expect(profileModel.getProfileByParams).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if profile to update is not found', async () => {
    (profileModel.getProfileByParams as jest.Mock).mockResolvedValue(null);
    await expect(profileService.updateProfile(1, {})).rejects.toThrow(
      'Profile with ID 1 does not exist.',
    );

    expect(profileModel.getProfileByParams as jest.Mock).toHaveBeenCalledWith({
      id: 1,
    });
    expect(profileModel.updateProfile as jest.Mock).not.toHaveBeenCalled();
  });

  it('should throw an error when the update fails', async () => {
    (profileModel.getProfileByParams as jest.Mock).mockResolvedValue({
      id: 1,
    } as Profile);
    (profileModel.updateProfile as jest.Mock).mockResolvedValue(false);

    await expect(
      profileService.updateProfile(1, { nome: 'Updated Name' }),
    ).rejects.toThrow(
      'Unable to update the profile with ID 1. Please try again later.',
    );

    expect(profileModel.getProfileByParams as jest.Mock).toHaveBeenCalledWith({
      id: 1,
    });
    expect(profileModel.updateProfile as jest.Mock).toHaveBeenCalledWith(1, {
      nome: 'Updated Name',
    });
  });

  it('should throw an unexpected error in the event of an exception', async () => {
    (profileModel.getProfileByParams as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(
      profileService.updateProfile(1, { nome: 'Updated Name' }),
    ).rejects.toThrow(
      'An unexpected error occurred while updating the profile.',
    );

    expect(profileModel.getProfileByParams as jest.Mock).toHaveBeenCalledWith({
      id: 1,
    });
    expect(profileModel.updateProfile as jest.Mock).not.toHaveBeenCalled();
  });
});
