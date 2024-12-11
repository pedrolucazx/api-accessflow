import { profileModel } from '../../models/profile.model';
import database from '../../database/index';
import { Profile } from '../../types/profiles.types';

jest.mock('../../database/index');

const createMockConnection = () => ({
  select: jest.fn(),
  insert: jest.fn(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('Profile Model Unit Tests', () => {
  let mockConnection: ReturnType<typeof createMockConnection>;

  beforeEach(() => {
    mockConnection = createMockConnection();
    (database as unknown as jest.Mock).mockReturnValue(mockConnection);
  });

  describe('Success Cases', () => {
    it('should fetch all profiles successfully', async () => {
      const mockProfiles: Profile[] = [
        { id: 1, nome: 'admin', descricao: 'Administrador' },
        { id: 2, nome: 'comum', descricao: 'Comum' },
      ];

      mockConnection.select.mockResolvedValueOnce(mockProfiles);

      const profiles = await profileModel.getAllProfiles();

      expect(profiles).toEqual(mockProfiles);
      expect(mockConnection.select).toHaveBeenCalledWith('*');
    });

    it('should fetch a profile by parameters successfully', async () => {
      const mockProfile = { id: 1, nome: 'admin', descricao: 'Administrador' };

      mockConnection.first.mockResolvedValueOnce(mockProfile);

      const params = { id: 1 };
      const profile = await profileModel.getProfileByParams(params);

      expect(profile).toEqual(mockProfile);
      expect(mockConnection.where).toHaveBeenCalledWith(params);
      expect(mockConnection.first).toHaveBeenCalled();
    });

    it('should create a new profile successfully', async () => {
      const mockInsertResult = [1];
      mockConnection.insert.mockResolvedValueOnce(mockInsertResult);

      const newProfile = { nome: 'admin', descricao: 'Administrador' };
      const result = await profileModel.createProfile(newProfile);

      expect(result).toEqual(mockInsertResult);
      expect(mockConnection.insert).toHaveBeenCalledWith(newProfile);
    });

    it('should update a profile successfully', async () => {
      const mockUpdatedRows = 1;
      mockConnection.update.mockResolvedValueOnce(mockUpdatedRows);

      const id = 1;
      const updatedProfile = { nome: 'Updated Admin' };
      const result = await profileModel.updateProfile(id, updatedProfile);

      expect(result).toBe(mockUpdatedRows);
      expect(mockConnection.where).toHaveBeenCalledWith({ id });
      expect(mockConnection.update).toHaveBeenCalledWith(updatedProfile);
    });

    it('should delete a profile successfully', async () => {
      const mockDeletedRows = 1;
      mockConnection.delete.mockResolvedValueOnce(mockDeletedRows);

      const id = 1;
      const result = await profileModel.deleteProfile(id);

      expect(result).toBe(mockDeletedRows);
      expect(mockConnection.where).toHaveBeenCalledWith({ id });
      expect(mockConnection.delete).toHaveBeenCalled();
    });
  });

  describe('Error Cases', () => {
    const testErrorHandling = async (
      action: () => Promise<unknown>,
      expectedError: string,
      mockMethod: jest.Mock,
    ) => {
      mockMethod.mockRejectedValueOnce(new Error('Database error'));
      await expect(action()).rejects.toThrow(expectedError);
    };

    it('should throw an error when fetching all profiles fails', async () => {
      await testErrorHandling(
        () => profileModel.getAllProfiles(),
        'Could not fetch profiles.',
        mockConnection.select,
      );
    });

    it('should throw an error when fetching a profile by parameters fails', async () => {
      await testErrorHandling(
        () => profileModel.getProfileByParams({ id: 1 }),
        'Could not fetch profile by parameters.',
        mockConnection.first,
      );
    });

    it('should throw an error when creating a profile fails', async () => {
      await testErrorHandling(
        () =>
          profileModel.createProfile({
            nome: 'admin',
            descricao: 'Administrador',
          }),
        'Could not create profile.',
        mockConnection.insert,
      );
    });

    it('should throw an error when updating a profile fails', async () => {
      await testErrorHandling(
        () => profileModel.updateProfile(1, { nome: 'Updated Admin' }),
        'Could not update profile with ID 1.',
        mockConnection.update,
      );
    });

    it('should throw an error when deleting a profile fails', async () => {
      await testErrorHandling(
        () => profileModel.deleteProfile(1),
        'Could not delete profile with ID 1.',
        mockConnection.delete,
      );
    });
  });
});
