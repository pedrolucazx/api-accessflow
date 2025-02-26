import { userService } from '@/service/user.service';
import { userRepository } from '@/repositories/user.repository';
import { User } from '@/types/users.types';
import { profileRepository } from '@/repositories/profile.repository';

jest.mock('@/repositories/user.repository');
jest.mock('@/repositories/profile.repository');

describe('User Service Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
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
  it('should fetch all users successfully', async () => {
    (userRepository.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

    const result = await userService.getAllUsers();
    expect(result).toEqual([
      {
        ativo: true,
        data_criacao: '2025-01-16T02:54:02.311Z',
        data_update: '2025-01-16T02:54:02.311Z',
        email: 'admin@exemplo.com',
        id: 1,
        nome: 'Admin Usuário',
      },
      {
        ativo: true,
        data_criacao: '2025-01-16T02:54:02.311Z',
        data_update: '2025-01-16T02:54:02.311Z',
        email: 'usuario@exemplo.com',
        id: 2,
        nome: 'Usuário Comum',
      },
    ]);
    expect(userRepository.getAllUsers).toHaveBeenCalledTimes(1);
  });

  it('should throw an error no users found during fetch', async () => {
    (userRepository.getAllUsers as jest.Mock).mockResolvedValue([]);

    await expect(userService.getAllUsers()).rejects.toThrow('No users found');
  });

  it('should throw an error database during fetch of all users', async () => {
    (userRepository.getAllUsers as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(userService.getAllUsers()).rejects.toThrow(
      'Error fetching users: Database error',
    );
  });

  it('should fetch a user by valid parameters successfully', async () => {
    const { senha, ...expectedUser } = mockUsers[0];
    (userRepository.getUserByParams as jest.Mock).mockResolvedValue(
      expectedUser,
    );

    const user = await userService.getUserByParams({ id: 1 });
    expect(user).toEqual(expectedUser);
    expect(userRepository.getUserByParams).toHaveBeenCalledWith({
      id: 1,
    });
  });

  it('should throw an error invalid parameters for fetching a user', async () => {
    await expect(userService.getUserByParams({})).rejects.toThrow(
      'At least one parameter must be provided.',
    );
  });

  it('should throw an error if the user is not found with the given parameters', async () => {
    (userRepository.getUserByParams as jest.Mock).mockResolvedValue(undefined);

    await expect(
      userService.getUserByParams({ nome: 'Non-existent' }),
    ).rejects.toThrow('User not found.');
  });

  it('should throw an error database during fetch by parameters', async () => {
    (userRepository.getUserByParams as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(userService.getUserByParams({ id: 1 })).rejects.toThrow(
      'Error fetching user by parameters: Database error',
    );
  });

  it('should create a user and assign profiles', async () => {
    const userData = {
      nome: 'new user',
      email: 'newuser@mail.com',
      senha: 'Senha@321',
      perfis: [{ id: 1 }],
    };
    (profileRepository.getProfileByParams as jest.Mock).mockResolvedValue({
      id: 1,
      nome: 'admin',
      descricao: 'Administrador',
    });
    (userRepository.createUser as jest.Mock).mockResolvedValue({
      id: 1,
      ativo: true,
      nome: 'new user',
      senha: 'Senha@321',
      email: 'newuser@mail.com',
      data_criacao: '2025-01-16T02:54:02.311Z',
      data_update: '2025-01-16T02:54:02.311Z',
    });
    (userRepository.assignProfile as jest.Mock).mockResolvedValue(true);

    const result = await userService.createUser(userData);
    expect(result).toEqual({
      id: 1,
      ativo: true,
      nome: 'new user',
      email: 'newuser@mail.com',
      data_criacao: '2025-01-16T02:54:02.311Z',
      data_update: '2025-01-16T02:54:02.311Z',
    });
    expect(userRepository.createUser).toHaveBeenCalledWith({
      email: 'newuser@mail.com',
      nome: 'new user',
      senha: 'Senha@321',
    });
    expect(userRepository.assignProfile).toHaveBeenCalledWith({
      perfil_id: 1,
      usuario_id: 1,
    });
  });

  it('should throw an error incomplete user data during creation', async () => {
    await expect(userService.createUser({} as User)).rejects.toThrow(
      'User data is incomplete or invalid.',
    );
  });

  it('should throw an error when the specified profile does not exist', async () => {
    const userData = {
      nome: 'new user',
      email: 'newuser@mail.com',
      senha: 'Senha@321',
      perfis: [{ id: 3 }],
    };

    (profileRepository.getProfileByParams as jest.Mock).mockResolvedValue(
      undefined,
    );

    await expect(userService.createUser(userData)).rejects.toThrow(
      'Profile not found.',
    );
  });

  it('should throw an error when user creation fails', async () => {
    const userData = {
      nome: 'new user',
      email: 'newuser@mail.com',
      senha: 'Senha@321',
      perfis: [{ id: 1 }],
    };

    (profileRepository.getProfileByParams as jest.Mock).mockResolvedValue({
      id: 1,
      nome: 'admin',
      descricao: 'Administrador',
    });

    (userRepository.createUser as jest.Mock).mockResolvedValue(undefined);

    await expect(userService.createUser(userData)).rejects.toThrow(
      'Failed to create user.',
    );
  });

  it('should throw an error when profile association fails after user creation', async () => {
    const userData = {
      nome: 'new user',
      email: 'newuser@mail.com',
      senha: 'Senha@321',
      perfis: [{ id: 1 }],
    };

    (profileRepository.getProfileByParams as jest.Mock).mockResolvedValue({
      id: 1,
      nome: 'admin',
      descricao: 'Administrador',
    });

    (userRepository.createUser as jest.Mock).mockResolvedValue({
      id: 1,
      ativo: true,
      nome: 'new user',
      senha: 'Senha@321',
      email: 'newuser@mail.com',
      data_criacao: '2025-01-16T02:54:02.311Z',
      data_update: '2025-01-16T02:54:02.311Z',
    });

    (userRepository.assignProfile as jest.Mock).mockResolvedValue(false);

    await expect(userService.createUser(userData)).rejects.toThrow(
      'Failed to associate profiles to user.',
    );
  });

  it('should throw an error database during user create', async () => {
    const userData = {
      nome: 'new user',
      email: 'newuser@mail.com',
      senha: 'Senha@321',
      perfis: [{ id: 1 }],
    };
    (profileRepository.getProfileByParams as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(userService.createUser(userData)).rejects.toThrow(
      'Error creating user: Database error',
    );
  });

  it('should update user successfully', async () => {
    (userRepository.updateUser as jest.Mock).mockResolvedValueOnce(
      mockUsers[0],
    );
    (userRepository.unassignProfile as jest.Mock).mockResolvedValueOnce(true);
    (profileRepository.getProfileByParams as jest.Mock).mockResolvedValue({
      id: 1,
      nome: 'admin',
      descricao: 'Administrador',
    });
    (userRepository.assignProfile as jest.Mock).mockResolvedValue({
      id: 1,
      usuario_id: 1,
      perfil_id: 2,
    });

    const result = await userService.updateUser(1, {
      ...mockUsers[0],
      perfis: [{ id: 2 }],
    });
    expect(result).toEqual({
      ativo: true,
      data_criacao: '2025-01-16T02:54:02.311Z',
      data_update: '2025-01-16T02:54:02.311Z',
      email: 'admin@exemplo.com',
      id: 1,
      nome: 'Admin Usuário',
    });
    expect(userRepository.updateUser).toHaveBeenCalledWith(
      1,
      expect.objectContaining(mockUsers[0]),
    );
    expect(userRepository.unassignProfile).toHaveBeenCalledWith(1);
    expect(userRepository.assignProfile).toHaveBeenCalledWith({
      perfil_id: 2,
      usuario_id: 1,
    });
  });

  it('should throw an error if ID or user data is invalid', async () => {
    await expect(userService.updateUser(1, {} as User)).rejects.toThrow(
      'Invalid user data or ID.',
    );
  });

  it('should throw an error if a profile is not found', async () => {
    (profileRepository.getProfileByParams as jest.Mock).mockResolvedValueOnce(
      null,
    );
    await expect(
      userService.updateUser(1, { ...mockUsers[0], perfis: [{ id: 99 }] }),
    ).rejects.toThrow('Profile not found.');
  });

  it('should throw an error if no user is found to update', async () => {
    (userRepository.updateUser as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(
      userService.updateUser(1, { ...mockUsers[0], perfis: [{ id: 2 }] }),
    ).rejects.toThrow('No user found with ID 1 to update.');
  });

  it('should throw an error if assigning profiles fails', async () => {
    (userRepository.updateUser as jest.Mock).mockResolvedValueOnce(
      mockUsers[0],
    );
    (userRepository.unassignProfile as jest.Mock).mockResolvedValueOnce(true);
    (profileRepository.getProfileByParams as jest.Mock).mockResolvedValue({
      id: 1,
      nome: 'admin',
      descricao: 'Administrador',
    });
    (userRepository.assignProfile as jest.Mock).mockResolvedValue(null);

    await expect(
      userService.updateUser(1, { ...mockUsers[0], perfis: [{ id: 2 }] }),
    ).rejects.toThrow('Failed to associate profiles to user.');
  });

  it('should throw an error database during user update', async () => {
    (profileRepository.getProfileByParams as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(
      userService.updateUser(1, { ...mockUsers[0], perfis: [{ id: 2 }] }),
    ).rejects.toThrow('Error updating user with ID 1: Database error');
  });

  it('should delete a user successfully', async () => {
    const mockId = 1;
    const mockResponse = 1;
    (userRepository.deleteUser as jest.Mock).mockResolvedValueOnce(
      mockResponse,
    );

    const result = await userService.deleteUser(mockId);

    expect(result).toBe(`User with ID ${mockId} was successfully deleted.`);
    expect(userRepository.deleteUser).toHaveBeenCalledWith(mockId);
  });

  it('should throw an error if no ID is provided', async () => {
    await expect(userService.deleteUser(0)).rejects.toThrow(
      'User ID is required.',
    );
  });

  it('should throw an error if user is not found for deletion', async () => {
    const mockId = 1;
    userRepository.deleteUser = jest.fn().mockResolvedValue(0);
    (userRepository.deleteUser as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(userService.deleteUser(mockId)).rejects.toThrow(
      `No user found with ID ${mockId} to delete.`,
    );
  });

  it('should throw an error database during user delete', async () => {
    (userRepository.deleteUser as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(userService.deleteUser(1)).rejects.toThrow(
      'Error deleting user with ID 1: Database error',
    );
  });

  it('should return user profiles when ID is valid', async () => {
    const mockUserId = 1;
    const mockProfiles = [{ id: 1, nome: 'admin', descricao: 'Administrador' }];
    (userRepository.getUserProfiles as jest.Mock).mockResolvedValue(
      mockProfiles,
    );

    const result = await userService.getUserProfiles(mockUserId);

    expect(result).toEqual(mockProfiles);
    expect(userRepository.getUserProfiles).toHaveBeenCalledWith(mockUserId);
  });

  it('should throw an error if no user ID is provided', async () => {
    await expect(userService.getUserProfiles(0)).rejects.toThrow(
      'User ID is required.',
    );
  });

  it('should throw an error database during user fetch user profiles', async () => {
    (userRepository.getUserProfiles as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(userService.getUserProfiles(1)).rejects.toThrow(
      'Error get profiles user with ID 1: Database error',
    );
  });
});
