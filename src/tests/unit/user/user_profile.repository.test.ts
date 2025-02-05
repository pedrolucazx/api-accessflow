import { database } from '@/database';
import { userProfileModel } from '@/repositories/user_profile.repository';

jest.mock('@/database');

const createMockConnection = () => ({
  insert: jest.fn(),
  where: jest.fn().mockReturnThis(),
  delete: jest.fn(),
});

describe('User Profile Model Unit Tests', () => {
  let mockDatabase: ReturnType<typeof createMockConnection>;

  beforeEach(() => {
    mockDatabase = createMockConnection();
    (database as unknown as jest.Mock).mockReturnValue(mockDatabase);
  });

  it('should associate the profile with the user successfully', async () => {
    mockDatabase.insert.mockResolvedValueOnce([1]);
    expect(await userProfileModel.associate(1, 1)).toEqual(1);
  });

  it('should disassociate the profile with the user successfully', async () => {
    mockDatabase.delete.mockResolvedValueOnce([1]);
    expect(await userProfileModel.disassociate(1, 1)).toEqual([1]);
  });

  it('should throw an error when associate the profile with the user', async () => {
    mockDatabase.insert.mockRejectedValueOnce(new Error('Database error'));
    await expect(userProfileModel.associate(1, 1)).rejects.toThrow(
      'Database error',
    );
  });

  it('should throw an error when disassociate the profile with the user', async () => {
    mockDatabase.delete.mockRejectedValueOnce(new Error('Database error'));
    await expect(userProfileModel.disassociate(1, 1)).rejects.toThrow(
      'Database error',
    );
  });
});
