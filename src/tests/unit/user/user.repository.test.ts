import { userRepository } from '@/repositories/user.repository';
import { database } from '@/database';
import { User, UserInput } from '@/types/users.types';

jest.mock('@/database');

const createMockConnection = () => ({
  select: jest.fn(),
  insert: jest.fn(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe.skip('User Model Unit Tests', () => {
  let mockDatabase: ReturnType<typeof createMockConnection>;

  beforeEach(() => {
    mockDatabase = createMockConnection();
    (database as unknown as jest.Mock).mockReturnValue(mockDatabase);
  });

  it('should fetch all users successfully', async () => {
    const mockUsers: User[] = [
      {
        id: 1,
        nome: 'Admin Usuário',
        email: 'admin@exemplo.com',
        ativo: true,
        data_criacao: '2025-01-16T02:54:02.311Z',
        data_update: '2025-01-16T02:54:02.311Z',
        senha: 'senhaAdmin',
      },
      {
        id: 2,
        nome: 'Usuário Comum',
        email: 'usuario@exemplo.com',
        ativo: true,
        data_criacao: '2025-01-16T02:54:02.311Z',
        data_update: '2025-01-16T02:54:02.311Z',
        senha: 'senhaComum',
      },
    ];

    mockDatabase.select.mockResolvedValueOnce(mockUsers);

    const users = await userRepository.getAllUsers();

    expect(users).toEqual(mockUsers);
    expect(mockDatabase.select).toHaveBeenCalledWith('*');
  });

  it('should fetch a user by parameters successfully', async () => {
    const mockUser: User = {
      id: 1,
      nome: 'Admin Usuário',
      email: 'admin@exemplo.com',
      ativo: true,
      data_criacao: '2025-01-16T02:54:02.311Z',
      data_update: '2025-01-16T02:54:02.311Z',
      senha: 'senhaAdmin',
    };

    mockDatabase.first.mockResolvedValueOnce(mockUser);

    const params = { id: 1 };
    const user = await userRepository.getUserByParams(params);
    expect(user).toEqual(mockUser);
    expect(mockDatabase.where).toHaveBeenCalledWith(params);
    expect(mockDatabase.first).toHaveBeenCalled();
  });

  it.skip('should create a new user successfully', async () => {
    const newUser = {
      nome: 'Novo Usuário',
      email: 'novousuario@exemplo.com',
      senha: 'Senha@321',
      ativo: true,
    };
    mockDatabase.insert.mockResolvedValueOnce([1]);

    const result = await userRepository.createUser(newUser);
    expect(result).toEqual(1);
    expect(mockDatabase.insert).toHaveBeenCalledWith(newUser);
  });

  it.skip('should update a user successfully', async () => {
    const mockUpdatedRows = 1;
    mockDatabase.update.mockResolvedValueOnce(mockUpdatedRows);

    const id = 1;
    const updatedUser: UserInput = {
      nome: 'Updated User',
      email: '',
      senha: '',
    };
    const result = await userRepository.updateUser(id, updatedUser);

    expect(result).toBe(mockUpdatedRows);
    expect(mockDatabase.where).toHaveBeenCalledWith({ id });
    expect(mockDatabase.update).toHaveBeenCalledWith(updatedUser);
  });

  it('should delete a user successfully', async () => {
    const mockDeletedRows = 1;
    mockDatabase.delete.mockResolvedValueOnce(mockDeletedRows);

    const id = 1;
    const result = await userRepository.deleteUser(id);

    expect(result).toBe(mockDeletedRows);
    expect(mockDatabase.where).toHaveBeenCalledWith({ id });
    expect(mockDatabase.delete).toHaveBeenCalled();
  });

  it('should throw an error when fetching all users fails', async () => {
    mockDatabase.select.mockRejectedValueOnce(new Error('Database error'));

    await expect(userRepository.getAllUsers()).rejects.toThrow(
      'Database error',
    );
  });

  it('should throw an error when fetching a user by parameters fails', async () => {
    mockDatabase.first.mockRejectedValueOnce(new Error('Database error'));

    await expect(userRepository.getUserByParams({ id: 1 })).rejects.toThrow(
      'Database error',
    );
  });

  it.skip('should throw an error when creating a user fails', async () => {
    mockDatabase.insert.mockRejectedValueOnce(new Error('Database error'));

    await expect(
      userRepository.createUser({
        nome: 'Novo Usuário',
        email: 'novousuario@exemplo.com',
        senha: 'Senha@321',
      }),
    ).rejects.toThrow('Database error');
  });

  it.skip('should throw an error when updating a user fails', async () => {
    mockDatabase.update.mockRejectedValueOnce(new Error('Database error'));

    await expect(
      userRepository.updateUser(1, {
        nome: 'Updated User',
        email: '',
        senha: '',
      }),
    ).rejects.toThrow('Database error');
  });

  it('should throw an error when deleting a user fails', async () => {
    mockDatabase.delete.mockRejectedValueOnce(new Error('Database error'));

    await expect(userRepository.deleteUser(1)).rejects.toThrow(
      'Database error',
    );
  });
});
