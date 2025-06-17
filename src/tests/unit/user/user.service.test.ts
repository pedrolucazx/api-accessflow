import { profileRepository } from '../../../repositories/profile.repository';
import { userRepository } from '../../../repositories/user.repository';
import { userService } from '../../../service/user.service';
import { User, UserUpdateInput } from '../../../types/users.types';
import jwt from 'jsonwebtoken';

jest.mock('../../../repositories/user.repository');
jest.mock('../../../repositories/profile.repository');
jest.mock('jsonwebtoken');

describe('User Service Unit Tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
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
        senha: 'senhaAdmin',
      },
      {
        ativo: true,
        data_criacao: '2025-01-16T02:54:02.311Z',
        data_update: '2025-01-16T02:54:02.311Z',
        email: 'usuario@exemplo.com',
        id: 2,
        nome: 'Usuário Comum',
        senha: 'senhaComum',
      },
    ]);
    expect(userRepository.getAllUsers).toHaveBeenCalledTimes(1);
  });

  it('should throw an error no users found during fetch', async () => {
    (userRepository.getAllUsers as jest.Mock).mockResolvedValue([]);

    await expect(userService.getAllUsers()).rejects.toThrow(
      /^Nenhum usuário encontrado.$/,
    );
  });

  it('should throw an error database during fetch of all users', async () => {
    (userRepository.getAllUsers as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(userService.getAllUsers()).rejects.toThrow(
      /^Erro ao buscar usuários: Database error$/,
    );
  });

  it('should fetch a user by valid parameters successfully', async () => {
    const id = { id: 1 };
    const { senha, ...expectedUser } = mockUsers[0];
    (userRepository.getUserByParams as jest.Mock).mockResolvedValue(
      expectedUser,
    );

    const user = await userService.getUserByParams(id);
    expect(user).toEqual(expectedUser);
    expect(userRepository.getUserByParams).toHaveBeenCalledWith(id);
  });

  it('should throw an error invalid parameters for fetching a user', async () => {
    await expect(userService.getUserByParams({})).rejects.toThrow(
      /^Pelo menos um parâmetro deve ser fornecido.$/,
    );
  });

  it('should throw an error if the user is not found with the given parameters', async () => {
    (userRepository.getUserByParams as jest.Mock).mockResolvedValue(undefined);

    await expect(
      userService.getUserByParams({ nome: 'Non-existent' }),
    ).rejects.toThrow(/^Usuário não encontrado.$/);
  });

  it('should throw an error database during fetch by parameters', async () => {
    (userRepository.getUserByParams as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(userService.getUserByParams({ id: 1 })).rejects.toThrow(
      /^Erro ao buscar usuário por parâmetros: Database error$/,
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
      senha: 'Senha@321',
    });
    expect(userRepository.createUser).toHaveBeenCalledWith({
      email: 'newuser@mail.com',
      nome: 'new user',
      senha: expect.any(String),
    });
    expect(userRepository.assignProfile).toHaveBeenCalledWith({
      perfil_id: 1,
      usuario_id: 1,
    });
  });

  it('should throw an error incomplete user data during creation', async () => {
    await expect(userService.createUser({} as User)).rejects.toThrow(
      /^Os dados do usuário estão incompletos ou inválidos.$/,
    );
  });

  it('should throw an error when the specified profile does not exist', async () => {
    const inputUser = {
      nome: 'new user',
      email: 'newuser@mail.com',
      senha: 'Senha@321',
      perfis: [{ id: 3 }],
    };

    (profileRepository.getProfileByParams as jest.Mock).mockResolvedValue(
      undefined,
    );

    await expect(userService.createUser(inputUser)).rejects.toThrow(
      /^Perfil não encontrado.$/,
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
      /^Falha ao criar o usuário.$/,
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
      /^Falha ao associar perfis ao usuário.$/,
    );
  });

  it('should throw an error database during user create', async () => {
    const userData = {
      nome: 'new user',
      email: 'newuser@mail.com',
      senha: 'Senha@321',
      perfis: [{ id: 1 }],
    };

    (userRepository.createUser as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(userService.createUser(userData)).rejects.toThrow(
      /^Erro ao criar usuário: Database error$/,
    );
  });

  it('should update user successfully', async () => {
    const mockUser = {
      id: 1,
      ativo: true,
      senha: 'senhaAdmin',
      nome: 'Admin Usuário',
      email: 'admin@exemplo.com',
      data_update: '2025-01-16T02:54:02.311Z',
      data_criacao: '2025-01-11T02:54:02.311Z',
    };
    const mockProfile = { id: 2, nome: 'comum', descricao: 'Comum' };
    const mockProfiles = [{ id: 1, nome: 'admin', descricao: 'Administrador' }];

    (profileRepository.getProfileByParams as jest.Mock).mockResolvedValue(
      mockProfile,
    );
    (userRepository.getUserByParams as jest.Mock).mockResolvedValue(mockUser);
    (userRepository.updateUser as jest.Mock).mockResolvedValueOnce(mockUser);
    (userRepository.unassignProfile as jest.Mock).mockResolvedValueOnce(true);
    (userRepository.assignProfile as jest.Mock).mockResolvedValue({
      id: 1,
      usuario_id: 1,
      perfil_id: 2,
    });

    const result = await userService.updateUser(
      1,
      {
        ...mockUser,
        perfis: [{ id: 2 }],
      },
      mockProfiles,
    );

    expect(result).toEqual(mockUser);
    expect(userRepository.updateUser).toHaveBeenCalledWith(1, {
      ...mockUser,
      data_update: expect.any(String),
      senha: expect.any(String),
    });
    expect(userRepository.unassignProfile).toHaveBeenCalledWith(1);
    expect(userRepository.assignProfile).toHaveBeenCalledWith({
      perfil_id: 2,
      usuario_id: 1,
    });
  });

  it('should throw an error if ID or user data is invalid', async () => {
    await expect(
      userService.updateUser(1, {} as UserUpdateInput, []),
    ).rejects.toThrow(/^Dados do usuário ou ID inválidos.$/);
  });

  it('should throw an error during user update', async () => {
    const mockUser = {
      id: 1,
      ativo: true,
      senha: 'senhaAdmin',
      nome: 'Admin Usuário',
      email: 'admin@exemplo.com',
      data_update: '2025-01-16T02:54:02.311Z',
      data_criacao: '2025-01-11T02:54:02.311Z',
    };
    const mockProfiles = [{ id: 1, nome: 'admin', descricao: 'Administrador' }];
    (userRepository.getUserByParams as jest.Mock).mockResolvedValue(mockUser);
    (userRepository.updateUser as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(
      userService.updateUser(
        1,
        { ...mockUser, perfis: [{ id: 2 }] },
        mockProfiles,
      ),
    ).rejects.toThrow(
      /^Usuário com ID 1 existe, mas nenhuma modificação foi aplicada.$/,
    );
  });

  it('should throw an error if a profile is not found', async () => {
    const mockUser = {
      id: 1,
      ativo: true,
      senha: 'senhaAdmin',
      nome: 'Admin Usuário',
      email: 'admin@exemplo.com',
      data_update: '2025-01-16T02:54:02.311Z',
      data_criacao: '2025-01-11T02:54:02.311Z',
    };
    const mockProfiles = [{ id: 1, nome: 'admin', descricao: 'Administrador' }];
    (userRepository.getUserByParams as jest.Mock).mockResolvedValue(mockUser);
    (userRepository.updateUser as jest.Mock).mockResolvedValueOnce(mockUser);
    (profileRepository.getProfileByParams as jest.Mock).mockResolvedValueOnce(
      null,
    );
    await expect(
      userService.updateUser(
        1,
        { ...mockUser, perfis: [{ id: 2 }] },
        mockProfiles,
      ),
    ).rejects.toThrow(/^Perfil não encontrado.$/);
  });

  it('should throw an error if assigning profiles fails', async () => {
    const mockUser = {
      id: 1,
      ativo: true,
      senha: 'senhaAdmin',
      nome: 'Admin Usuário',
      email: 'admin@exemplo.com',
      data_update: '2025-01-16T02:54:02.311Z',
      data_criacao: '2025-01-11T02:54:02.311Z',
    };

    const mockProfiles = [{ id: 1, nome: 'admin', descricao: 'Administrador' }];

    (userRepository.getUserByParams as jest.Mock).mockResolvedValue(mockUser);
    (userRepository.updateUser as jest.Mock).mockResolvedValueOnce(mockUser);
    (userRepository.unassignProfile as jest.Mock).mockResolvedValueOnce(true);
    (userRepository.assignProfile as jest.Mock).mockResolvedValue(undefined);

    await expect(
      userService.updateUser(
        1,
        { ...mockUser, perfis: [{ id: 2 }] },
        mockProfiles,
      ),
    ).rejects.toThrow(/^Falha ao associar perfis ao usuário.$/);
  });

  it('should throw an error database during user update', async () => {
    const mockUser = {
      ativo: true,
      data_criacao: '2025-01-11T02:54:02.311Z',
      data_update: '2025-01-16T02:54:02.311Z',
      email: 'admin@exemplo.com',
      id: 1,
      nome: 'Admin Usuário',
      senha: 'senhaAdmin',
    };
    const mockProfiles = [{ id: 1, nome: 'admin', descricao: 'Administrador' }];
    (userRepository.getUserByParams as jest.Mock).mockResolvedValue(mockUser);
    (userRepository.updateUser as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );
    await expect(
      userService.updateUser(
        1,
        { ...mockUser, perfis: [{ id: 2 }] },
        mockProfiles,
      ),
    ).rejects.toThrow(/^Erro ao atualizar usuário com ID 1: Database error$/);
  });

  it('should delete a user successfully', async () => {
    const mockId = 1;
    const mockResponse = 1;
    (userRepository.deleteUser as jest.Mock).mockResolvedValueOnce(
      mockResponse,
    );

    const result = await userService.deleteUser(mockId);

    expect(result).toBe(`Usuário com ID ${mockId} foi deletado com sucesso.`);
    expect(userRepository.deleteUser).toHaveBeenCalledWith(mockId);
  });

  it('should throw an error if no ID is provided', async () => {
    await expect(userService.deleteUser(0)).rejects.toThrow(
      /^É necessário fornecer o ID do usuário.$/,
    );
  });

  it('should throw an error if user is not found for deletion', async () => {
    const mockId = 1;
    (userRepository.deleteUser as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(userService.deleteUser(mockId)).rejects.toThrow(
      /^Nenhum usuário encontrado com o ID 1 para deletar.$/,
    );
  });

  it('should throw an error database during user delete', async () => {
    (userRepository.deleteUser as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(userService.deleteUser(1)).rejects.toThrow(
      /^Erro ao deletar o usuário com ID 1: Database error$/,
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
  });

  it('should throw an error if no user ID is provided', async () => {
    await expect(userService.getUserProfiles(0)).rejects.toThrow(
      /^É necessário fornecer o ID do usuário.$/,
    );
  });

  it('should throw an error database during user fetch user profiles', async () => {
    (userRepository.getUserProfiles as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(userService.getUserProfiles(1)).rejects.toThrow(
      /^Erro ao obter perfis para usuário com ID 1: Database error$/,
    );
  });

  it('should successfully sign up a user with a default profile', async () => {
    const userInput = {
      nome: 'Novo Usuário',
      email: 'novo@exemplo.com',
      senha: 'SenhaSegura123',
    };

    const createdUser: User = {
      id: 3,
      ...userInput,
      ativo: true,
      data_criacao: new Date().toISOString(),
      data_update: new Date().toISOString(),
    };

    jest.spyOn(userService, 'createUser').mockResolvedValue(createdUser);

    const result = await userService.signUp(userInput);

    expect(result).toEqual(createdUser);
    expect(userService.createUser).toHaveBeenCalledWith({
      ...userInput,
      perfis: [{ nome: 'comum', descricao: 'Comum' }],
    });
  });

  it('should throw an error database during sign up a user with a default profile', async () => {
    const userInput = {
      nome: 'Novo Usuário',
      email: 'novo@exemplo.com',
      senha: 'SenhaSegura123',
    };

    jest
      .spyOn(userService, 'createUser')
      .mockRejectedValue(new Error('Database error'));

    await expect(userService.signUp(userInput)).rejects.toThrow(
      /^Erro ao cadastrar usuário: Database error$/,
    );
  });

  it('should return authenticated user with token on success', async () => {
    const mockUser = {
      ativo: true,
      data_criacao: '2025-01-11T02:54:02.311Z',
      data_update: '2025-01-16T02:54:02.311Z',
      email: 'admin@exemplo.com',
      id: 1,
      nome: 'Admin Usuário',
      senha: 'senhaAdmin',
    };
    const mockProfiles = [{ id: 1, nome: 'admin', descricao: 'Administrador' }];
    const expectedPayload = {
      ativo: true,
      email: 'admin@exemplo.com',
      iat: 111,
      exp: 222,
      id: 1,
      nome: 'Admin Usuário',
      perfis: [
        {
          descricao: 'Administrador',
          id: 1,
          nome: 'admin',
        },
      ],
      token: 'mockedToken',
    };
    const { iat, exp, token, ...payloadWithoutExtraFields } = expectedPayload;
    jest.spyOn(userService, 'getUserProfiles').mockResolvedValue(mockProfiles);
    (jwt.sign as jest.Mock).mockReturnValue('mockedToken');
    (jwt.decode as jest.Mock).mockReturnValue({ iat: 111, exp: 222 });

    const result = await userService.getAuthenticatedUser(mockUser);

    expect(result).toEqual(expectedPayload);
    expect(userService.getUserProfiles).toHaveBeenCalledWith(mockUser.id);
    expect(jwt.sign).toHaveBeenCalledWith(
      payloadWithoutExtraFields,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
    );
    expect(jwt.decode).toHaveBeenCalledWith('mockedToken');
  });

  it('should throw an error if authenticated user not found profiles', async () => {
    const mockUser = {
      ativo: true,
      data_criacao: '2025-01-11T02:54:02.311Z',
      data_update: '2025-01-16T02:54:02.311Z',
      email: 'admin@exemplo.com',
      id: 1,
      nome: 'Admin Usuário',
      senha: 'senhaAdmin',
    };
    jest
      .spyOn(userService, 'getUserProfiles')
      .mockRejectedValue(new Error('Database error'));

    await expect(userService.getAuthenticatedUser(mockUser)).rejects.toThrow(
      /^Erro ao autenticar o usuário: Database error$/,
    );
  });

  it('should return authenticated user on successful login', async () => {
    const mockUser = {
      ativo: true,
      data_criacao: '2025-01-11T02:54:02.311Z',
      data_update: '2025-01-16T02:54:02.311Z',
      email: 'admin@exemplo.com',
      id: 1,
      nome: 'Admin Usuário',
      senha: '$2b$10$Gsklrg7fGdpSFok54jEa7ugDTpcONcbnvLFhu4A6zTLarvynKvmCq',
    };
    jest.spyOn(userService, 'getUserByParams').mockResolvedValue(mockUser);
    jest.spyOn(userService, 'getAuthenticatedUser').mockResolvedValue({
      id: 1,
      nome: 'Admin Usuário',
      email: 'admin@exemplo.com',
      ativo: true,
      perfis: [
        {
          id: 1,
          nome: 'admin',
          descricao: 'Administrador',
        },
      ],
      iat: 1742694551,
      exp: 1742780951,
      token: 'mockedToken',
    });

    const result = await userService.login({
      email: 'admin@exemplo.com',
      senha: 'senhaAdmin',
    });

    expect(result).toEqual({
      ativo: true,
      email: 'admin@exemplo.com',
      exp: 1742780951,
      iat: 1742694551,
      id: 1,
      nome: 'Admin Usuário',
      perfis: [
        {
          descricao: 'Administrador',
          id: 1,
          nome: 'admin',
        },
      ],
      token: 'mockedToken',
    });
  });

  it('should throw an error if email is missing', async () => {
    await expect(
      userService.login({ email: '', senha: 'password' }),
    ).rejects.toThrow(/^O e-mail é obrigatório.$/);
  });

  it('should throw an error if password is invalid', async () => {
    const mockUser = {
      ativo: true,
      data_criacao: '2025-01-11T02:54:02.311Z',
      data_update: '2025-01-16T02:54:02.311Z',
      email: 'admin@exemplo.com',
      id: 1,
      nome: 'Admin Usuário',
      senha: '$2b$10$Gsklrg7fGdpSFok54jEa7ugDTpcONcbnvLFhu4A6zTLarvynKvmCq',
    };
    jest.spyOn(userService, 'getUserByParams').mockResolvedValue(mockUser);
    jest.spyOn(userService, 'getAuthenticatedUser').mockResolvedValue({
      id: 1,
      nome: 'Admin Usuário',
      email: 'admin@exemplo.com',
      ativo: true,
      perfis: [
        {
          id: 1,
          nome: 'admin',
          descricao: 'Administrador',
        },
      ],
      iat: 1742694551,
      exp: 1742780951,
      token: 'mockedToken',
    });
    await expect(
      userService.login({ email: mockUser.email, senha: 'wrongPassword' }),
    ).rejects.toThrow(/^Senha inválida.$/);
  });

  it('should handle unexpected errors gracefully', async () => {
    jest
      .spyOn(userService, 'getUserByParams')
      .mockRejectedValue(new Error('Database error'));

    await expect(
      userService.login({ email: 'admin@exemplo.com', senha: 'senhaAdmin' }),
    ).rejects.toThrow(/^Erro ao autenticar o usuário: Database error$/);
  });

  it('should return the metrics successfully', async () => {
    (userRepository.countUsers as jest.Mock).mockResolvedValue(2);
    (userRepository.countActiveUsers as jest.Mock).mockResolvedValue(1);
    (userRepository.countInactiveUsers as jest.Mock).mockResolvedValue(1);
    (profileRepository.countProfiles as jest.Mock).mockResolvedValue(2);
    const metrics = await userService.getMetrics();

    expect(metrics).toEqual({
      totalUsers: 2,
      activeUsers: 1,
      inactiveUsers: 1,
      totalProfiles: 2,
    });
    expect(userRepository.countUsers).toHaveBeenCalledTimes(1);
    expect(userRepository.countActiveUsers).toHaveBeenCalledTimes(1);
    expect(userRepository.countInactiveUsers).toHaveBeenCalledTimes(1);
    expect(profileRepository.countProfiles).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when any count fails', async () => {
    (userRepository.countUsers as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(userService.getMetrics()).rejects.toThrow(
      /^Não foi possível carregar as métricas: Database error$/,
    );
  });
});
