import { profileModel } from '@/models/profile.model';
import { database } from '@/database';
import { Profile } from '@/types/profiles.types';

jest.mock('@/database');

const createMockConnection = () => ({
  select: jest.fn(),
  insert: jest.fn(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('Profile Model Unit Tests', () => {
  let mockDatabase: ReturnType<typeof createMockConnection>;

  beforeEach(() => {
    mockDatabase = createMockConnection();
    (database as unknown as jest.Mock).mockReturnValue(mockDatabase);
  });

  describe('Success Cases', () => {
    it('should fetch all profiles successfully', async () => {
      const mockProfiles: Profile[] = [
        { id: 1, nome: 'admin', descricao: 'Administrador' },
        { id: 2, nome: 'comum', descricao: 'Comum' },
      ];

      mockDatabase.select.mockResolvedValueOnce(mockProfiles);

      const profiles = await profileModel.getAllProfiles();

      expect(profiles).toEqual(mockProfiles);
      expect(mockDatabase.select).toHaveBeenCalledWith('*');
    });

    it('should throw an error when fetching all profiles fails', async () => {
      mockDatabase.select.mockRejectedValueOnce(new Error('Database error'));

      await expect(profileModel.getAllProfiles()).rejects.toThrow(
        'Database error',
      );
    });

    it('should fetch a profile by parameters successfully', async () => {
      const mockProfile = { id: 1, nome: 'admin', descricao: 'Administrador' };
      mockDatabase.first.mockResolvedValueOnce(mockProfile);

      const params = { id: 1 };
      const profile = await profileModel.getProfileByParams(params);
      expect(profile).toEqual(mockProfile);
      expect(mockDatabase.where).toHaveBeenCalledWith(params);
      expect(mockDatabase.first).toHaveBeenCalled();
    });

    it('should throw an error when fetching a profile by parameters fails', async () => {
      mockDatabase.first.mockRejectedValueOnce(new Error('Database error'));

      await expect(profileModel.getProfileByParams({ id: 1 })).rejects.toThrow(
        'Database error',
      );
    });

    it('should create a new profile successfully', async () => {
      const newProfile = { nome: 'admin', descricao: 'Administrador' };
      mockDatabase.insert.mockResolvedValueOnce([1]);

      const result = await profileModel.createProfile(newProfile);
      expect(result).toEqual(1);
      expect(mockDatabase.insert).toHaveBeenCalledWith(newProfile);
    });

    it('should throw an error when creating a profile fails', async () => {
      mockDatabase.insert.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        profileModel.createProfile({
          nome: 'admin',
          descricao: 'Administrador',
        }),
      ).rejects.toThrow('Database error');
    });

    it('should update a profile successfully', async () => {
      const mockUpdatedRows = 1;
      mockDatabase.update.mockResolvedValueOnce(mockUpdatedRows);

      const id = 1;
      const updatedProfile = { nome: 'Updated Admin' };
      const result = await profileModel.updateProfile(id, updatedProfile);

      expect(result).toBe(mockUpdatedRows);
      expect(mockDatabase.where).toHaveBeenCalledWith({ id });
      expect(mockDatabase.update).toHaveBeenCalledWith(updatedProfile);
    });

    it('should throw an error when updating a profile fails', async () => {
      mockDatabase.update.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        profileModel.updateProfile(1, { nome: 'Updated Admin' }),
      ).rejects.toThrow('Database error');
    });

    it('should delete a profile successfully', async () => {
      const mockDeletedRows = 1;
      mockDatabase.delete.mockResolvedValueOnce(mockDeletedRows);

      const id = 1;
      const result = await profileModel.deleteProfile(id);

      expect(result).toBe(mockDeletedRows);
      expect(mockDatabase.where).toHaveBeenCalledWith({ id });
      expect(mockDatabase.delete).toHaveBeenCalled();
    });

    it('should throw an error when deleting a profile fails', async () => {
      mockDatabase.delete.mockRejectedValueOnce(new Error('Database error'));

      await expect(profileModel.deleteProfile(1)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
