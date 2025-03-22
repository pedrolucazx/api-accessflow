import { database } from '@/database';
import { userRepository } from '@/repositories/user.repository';
import {
  User,
  UserInput,
  UserProfileAssignment,
  UserUpdateInput,
} from '@/types/users.types';

jest.mock('@/database');

const createMockConnection = () => ({
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnValue({ returning: jest.fn() }),
  where: jest.fn().mockReturnThis(),
  first: jest.fn(),
  update: jest.fn().mockReturnValue({ returning: jest.fn() }),
  delete: jest.fn(),
  join: jest.fn().mockReturnThis(),
});

describe('User Model Unit Tests', () => {
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

  it('should create a new user successfully', async () => {
    const newUser: UserInput = {
      nome: 'Novo Usuário',
      email: 'novousuario@exemplo.com',
      senha: 'Senha@321',
    };

    mockDatabase
      .insert()
      .returning.mockResolvedValueOnce([{ id: 1, ...newUser }]);

    const result = await userRepository.createUser(newUser);
    expect(result).toEqual({
      id: 1,
      nome: 'Novo Usuário',
      email: 'novousuario@exemplo.com',
      senha: 'Senha@321',
    });
    expect(mockDatabase.insert).toHaveBeenCalledWith(newUser);
    expect(mockDatabase.insert().returning).toHaveBeenCalledWith('*');
  });

  it('should assosite profile to user successfully', async () => {
    const newAssosite: UserProfileAssignment = {
      usuario_id: 1,
      perfil_id: 1,
    };

    mockDatabase
      .insert()
      .returning.mockResolvedValueOnce([{ id: 1, ...newAssosite }]);

    const result = await userRepository.assignProfile(newAssosite);
    expect(result).toEqual({
      id: 1,
      usuario_id: 1,
      perfil_id: 1,
    });
    expect(mockDatabase.insert).toHaveBeenCalledWith(newAssosite);
    expect(mockDatabase.insert().returning).toHaveBeenCalledWith('*');
  });

  it('should unassosite profile to user successfully', async () => {
    const mockDeletedRows = 1;
    mockDatabase.delete.mockResolvedValueOnce(mockDeletedRows);
    const usuario_id = 1;
    const result = await userRepository.unassignProfile(usuario_id);
    expect(result).toEqual(mockDeletedRows);
    expect(mockDatabase.where).toHaveBeenCalledWith({ usuario_id });
    expect(mockDatabase.delete).toHaveBeenCalled();
  });

  it('should update a user successfully', async () => {
    const userInput: UserUpdateInput = {
      nome: 'Updated User',
      email: 'anymail@mail.com',
      senha: 'Senha@321',
      data_update: new Date().toISOString(),
    };
    mockDatabase
      .update()
      .returning.mockResolvedValueOnce([{ id: 1, ...userInput }]);

    const result = await userRepository.updateUser(1, userInput);

    expect(result).toEqual({
      id: 1,
      nome: 'Updated User',
      email: 'anymail@mail.com',
      senha: 'Senha@321',
      data_update: expect.any(String),
    });
    expect(mockDatabase.update).toHaveBeenCalledWith(userInput);
    expect(mockDatabase.update().returning).toHaveBeenCalledWith('*');
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

  it('should throw an error when fetching all users', async () => {
    mockDatabase.select.mockRejectedValueOnce(new Error('Database error'));

    await expect(userRepository.getAllUsers()).rejects.toThrow(
      'Database error',
    );
  });

  it('should throw an error when fetching a user by parameters', async () => {
    mockDatabase.first.mockRejectedValueOnce(new Error('Database error'));

    await expect(userRepository.getUserByParams({ id: 1 })).rejects.toThrow(
      'Database error',
    );
  });

  it('should throw an error when creating a user', async () => {
    mockDatabase
      .insert()
      .returning.mockRejectedValueOnce(new Error('Database error'));

    await expect(
      userRepository.createUser({
        nome: 'Novo Usuário',
        email: 'novousuario@exemplo.com',
        senha: 'Senha@321',
      }),
    ).rejects.toThrow('Database error');
  });

  it('should throw an error when assoate profile to user', async () => {
    mockDatabase
      .insert()
      .returning.mockRejectedValueOnce(new Error('Database error'));

    await expect(
      userRepository.assignProfile({
        usuario_id: 1,
        perfil_id: 1,
      }),
    ).rejects.toThrow('Database error');
  });

  it('should throw an error when unassoate profile to user', async () => {
    mockDatabase.delete.mockRejectedValueOnce(new Error('Database error'));

    await expect(userRepository.unassignProfile(1)).rejects.toThrow(
      'Database error',
    );
  });

  it('should throw an error when updating a user', async () => {
    mockDatabase
      .update()
      .returning.mockRejectedValueOnce(new Error('Database error'));

    await expect(
      userRepository.updateUser(1, {
        nome: 'Updated User',
        email: '',
        senha: '',
        data_update: new Date().toISOString(),
      }),
    ).rejects.toThrow('Database error');
  });

  it('should throw an error when deleting a user fails', async () => {
    mockDatabase.delete.mockRejectedValueOnce(new Error('Database error'));

    await expect(userRepository.deleteUser(1)).rejects.toThrow(
      'Database error',
    );
  });

  it('should return user profiles successfully', async () => {
    mockDatabase.select.mockResolvedValueOnce([
      { id: 1, nome: 'admin', descricao: 'Administrador' },
    ]);

    const result = await userRepository.getUserProfiles(1);
    expect(result).toEqual([
      { id: 1, nome: 'admin', descricao: 'Administrador' },
    ]);
    expect(mockDatabase.select).toHaveBeenCalledWith(
      'p.id',
      'p.nome',
      'p.descricao',
    );
  });

  it('should throw an error if database query fails', async () => {
    mockDatabase.select.mockRejectedValueOnce(new Error('Database error'));
    await expect(userRepository.getUserProfiles(1)).rejects.toThrow(
      'Database error',
    );
  });
});
