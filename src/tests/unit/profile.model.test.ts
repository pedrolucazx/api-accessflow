import { profileModel } from '../../models/profile.model';
import { Profile } from '../../types/profiles.types';
import { executeQuery } from '../../utils/executeQuery';

jest.setTimeout(50000);
jest.mock('../../utils/executeQuery');

describe('Profile Model Unit Tests', () => {
  const mockedExecuteQuery = executeQuery as jest.Mock;
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all profiles successfully', async () => {
    const mockProfiles: Profile[] = [
      { id: 1, nome: 'admin', descricao: 'Administrador' },
      { id: 2, nome: 'comum', descricao: 'Comum' },
    ];

    mockedExecuteQuery.mockResolvedValueOnce(mockProfiles);

    const profiles = await profileModel.getAllProfiles();
    expect(profiles).toEqual(mockProfiles);
    expect(executeQuery).toHaveBeenCalledTimes(1);
  });

  it('should fetch a profile by parameters successfully', async () => {
    const mockProfile = { id: 1, nome: 'admin', descricao: 'Administrador' };

    mockedExecuteQuery.mockResolvedValueOnce(mockProfile);

    expect(await profileModel.getProfileByParams({ id: 1 })).toEqual(
      mockProfile,
    );
    expect(executeQuery).toHaveBeenCalledTimes(1);
  });

  it('should create a new profile successfully', async () => {
    mockedExecuteQuery.mockResolvedValueOnce(1);

    expect(
      await profileModel.createProfile({
        nome: 'admin',
        descricao: 'Administrador',
      }),
    ).toBe(1);
    expect(executeQuery).toHaveBeenCalledTimes(1);
  });

  it('should update a profile successfully', async () => {
    const mockUpdatedRows = 1;

    mockedExecuteQuery.mockResolvedValueOnce(1);

    expect(
      await profileModel.updateProfile(1, {
        nome: 'Updated Admin',
      }),
    ).toBe(mockUpdatedRows);
    expect(executeQuery).toHaveBeenCalledTimes(1);
  });

  it('should delete a profile successfully', async () => {
    const mockDeletedRows = 1;
    mockedExecuteQuery.mockResolvedValueOnce(mockDeletedRows);

    expect(await profileModel.deleteProfile(1)).toBe(mockDeletedRows);
    expect(executeQuery).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when fetching all profiles fails', async () => {
    mockedExecuteQuery.mockRejectedValueOnce(
      new Error('Error fetching profiles.'),
    );

    await expect(profileModel.getAllProfiles()).rejects.toThrow(
      'Error fetching profiles.',
    );
  });

  it('should throw an error when fetching a profile by parameters fails', async () => {
    mockedExecuteQuery.mockRejectedValueOnce(
      new Error('Could not fetch profile by parameters.'),
    );
    await expect(profileModel.getProfileByParams({ id: 1 })).rejects.toThrow(
      'Could not fetch profile by parameters.',
    );
  });

  it('should throw an error when creating a profile fails', async () => {
    mockedExecuteQuery.mockRejectedValueOnce(
      new Error('Could not create profile.'),
    );
    await expect(
      profileModel.createProfile({
        nome: 'admin',
        descricao: 'Administrador',
      }),
    ).rejects.toThrow('Could not create profile.');
  });

  it('should throw an error when updating a profile fails', async () => {
    mockedExecuteQuery.mockRejectedValueOnce(
      new Error('Could not update profile with ID 1.'),
    );
    await expect(
      profileModel.updateProfile(1, { nome: 'Updated Admin' }),
    ).rejects.toThrow('Could not update profile with ID 1.');
  });

  it('should throw an error when deleting a profile fails', async () => {
    mockedExecuteQuery.mockRejectedValueOnce(
      new Error('Could not delete profile with ID 1.'),
    );
    await expect(profileModel.deleteProfile(1)).rejects.toThrow(
      'Could not delete profile with ID 1.',
    );
  });
});
