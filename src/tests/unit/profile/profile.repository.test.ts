import { database } from '../../../database';
import { profileRepository } from '../../../repositories/profile.repository';
import { Profile } from '../../../types/profiles.types';

jest.mock('../../../database');

const createMockConnection = () => ({
  select: jest.fn(),
  insert: jest.fn().mockReturnValue({ returning: jest.fn() }),
  where: jest.fn().mockReturnThis(),
  count: jest.fn().mockReturnThis(),
  first: jest.fn(),
  update: jest.fn().mockReturnValue({ returning: jest.fn() }),
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

      const profiles = await profileRepository.getAllProfiles();

      expect(profiles).toEqual(mockProfiles);
      expect(mockDatabase.select).toHaveBeenCalledWith('*');
    });

    it('should throw an error when fetching all profiles fails', async () => {
      mockDatabase.select.mockRejectedValueOnce(new Error('Database error'));

      await expect(profileRepository.getAllProfiles()).rejects.toThrow(
        /^Database error$/,
      );
    });

    it('should fetch a profile by parameters successfully', async () => {
      const mockProfile = { id: 1, nome: 'admin', descricao: 'Administrador' };
      mockDatabase.first.mockResolvedValueOnce(mockProfile);

      const params = { id: 1 };
      const profile = await profileRepository.getProfileByParams(params);
      expect(profile).toEqual(mockProfile);
      expect(mockDatabase.where).toHaveBeenCalledWith(params);
      expect(mockDatabase.first).toHaveBeenCalled();
    });

    it('should throw an error when fetching a profile by parameters fails', async () => {
      mockDatabase.first.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        profileRepository.getProfileByParams({ id: 1 }),
      ).rejects.toThrow(/^Database error$/);
    });

    it('should create a new profile successfully', async () => {
      const newProfile = { nome: 'admin', descricao: 'Administrador' };
      mockDatabase.insert().returning.mockResolvedValueOnce([newProfile]);

      const result = await profileRepository.createProfile(newProfile);
      expect(result).toEqual(newProfile);
      expect(mockDatabase.insert).toHaveBeenCalledWith(newProfile);
      expect(mockDatabase.insert().returning).toHaveBeenCalledWith('*');
    });

    it('should throw an error when creating a profile fails', async () => {
      mockDatabase
        .insert()
        .returning.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        profileRepository.createProfile({
          nome: 'admin',
          descricao: 'Administrador',
        }),
      ).rejects.toThrow(/^Database error$/);
    });

    it('should update a profile successfully', async () => {
      const updatedProfile = {
        id: 1,
        nome: 'Updated Admin',
        descricao: 'Administrador',
      };
      mockDatabase.update().returning.mockResolvedValueOnce([updatedProfile]);

      const result = await profileRepository.updateProfile(1, updatedProfile);

      expect(result).toEqual(updatedProfile);
      expect(mockDatabase.update).toHaveBeenCalledWith(updatedProfile);
      expect(mockDatabase.update().returning).toHaveBeenCalledWith('*');
    });

    it('should throw an error when updating a profile fails', async () => {
      mockDatabase
        .update()
        .returning.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        profileRepository.updateProfile(1, { nome: 'Updated Admin' }),
      ).rejects.toThrow(/^Database error$/);
    });

    it('should delete a profile successfully', async () => {
      const mockDeletedRows = 1;
      mockDatabase.delete.mockResolvedValueOnce(mockDeletedRows);

      const id = 1;
      const result = await profileRepository.deleteProfile(id);

      expect(result).toBe(mockDeletedRows);
      expect(mockDatabase.where).toHaveBeenCalledWith({ id });
      expect(mockDatabase.delete).toHaveBeenCalled();
    });

    it('should throw an error when deleting a profile fails', async () => {
      mockDatabase.delete.mockRejectedValueOnce(new Error('Database error'));

      await expect(profileRepository.deleteProfile(1)).rejects.toThrow(
        /^Database error$/,
      );
    });

    it('should return count of users', async () => {
      mockDatabase.count.mockReturnThis();
      mockDatabase.first.mockResolvedValueOnce({ count: '100' });
      const total = await profileRepository.countProfiles();
      expect(total).toBe(100);
      expect(mockDatabase.count).toHaveBeenCalledWith('id as count');
      expect(mockDatabase.first).toHaveBeenCalled();
    });

    it('should throw an error if count of users query fails', async () => {
      mockDatabase.count.mockReturnThis();
      mockDatabase.first.mockRejectedValueOnce(new Error('Database error'));
      await expect(profileRepository.countProfiles()).rejects.toThrow(
        /^Database error$/,
      );
    });

    it('should return 0 when there are no profiles', async () => {
      mockDatabase.count.mockReturnThis();
      mockDatabase.first.mockResolvedValueOnce(undefined);
      const total = await profileRepository.countProfiles();
      expect(total).toBe(0);
      expect(mockDatabase.count).toHaveBeenCalledWith('id as count');
      expect(mockDatabase.first).toHaveBeenCalled();
    });
  });
});
