import { userProfileModel } from '../../models/user_profile.model';
import { executeQuery } from '../../utils/executeQuery';

jest.setTimeout(50000);
jest.mock('../../utils/executeQuery');

describe('User Profile Model Unit Tests', () => {
  const mockedExecuteQuery = executeQuery as jest.Mock;
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should associate the profile with the user successfully', async () => {
    mockedExecuteQuery.mockResolvedValueOnce(1);

    expect(await userProfileModel.associate(1, 1)).toEqual(1);
    expect(executeQuery).toHaveBeenCalledTimes(1);
  });

  it('should disassociate the profile with the user successfully', async () => {
    mockedExecuteQuery.mockResolvedValueOnce(1);

    expect(await userProfileModel.disassociate(1, 1)).toEqual(1);
    expect(executeQuery).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when associate the profile with the user', async () => {
    mockedExecuteQuery.mockRejectedValueOnce(
      new Error('Error when trying to associate a profile with a user.'),
    );

    await expect(userProfileModel.associate(1, 1)).rejects.toThrow(
      'Error when trying to associate a profile with a user.',
    );
  });

  it('should throw an error when disassociate the profile with the user', async () => {
    mockedExecuteQuery.mockRejectedValueOnce(
      new Error('Error when trying to disassociate a profile with a user.'),
    );

    await expect(userProfileModel.disassociate(1, 1)).rejects.toThrow(
      'Error when trying to disassociate a profile with a user.',
    );
  });
});
