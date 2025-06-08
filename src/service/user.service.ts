import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { profileRepository } from '../repositories/profile.repository';
import { userRepository } from '../repositories/user.repository';
import { Profile } from '../types/profiles.types';
import {
  AuthenticatedUser,
  LoginInput,
  SignUpInput,
  User,
  UserFilter,
  UserInput,
  Metrics,
  UserUpdateInput,
} from '../types/users.types';
import { CustomError, handleError } from '../utils/handleError';

export const userService = {
  getAllUsers: async (): Promise<User[] | undefined> => {
    try {
      const users = await userRepository.getAllUsers();
      if (!users?.length) {
        throw new CustomError('Nenhum usuário encontrado.');
      }
      return users;
    } catch (error) {
      handleError('Erro ao buscar usuários:', error);
    }
  },

  getUserByParams: async (filter: UserFilter): Promise<User | undefined> => {
    try {
      if (!Object.keys(filter).length) {
        throw new CustomError('Pelo menos um parâmetro deve ser fornecido.');
      }

      const user = await userRepository.getUserByParams(filter);
      if (!user) {
        throw new CustomError('Usuário não encontrado.');
      }

      return user;
    } catch (error) {
      handleError('Erro ao buscar usuário por parâmetros:', error);
    }
  },

  createUser: async (data: UserInput): Promise<User | undefined> => {
    try {
      const { perfis, ...user } = data;
      const profilesIDs: (number | undefined)[] = [];
      if (
        !Object.keys(user).length ||
        Object.values(user).some((value) => !value)
      ) {
        throw new CustomError(
          'Os dados do usuário estão incompletos ou inválidos.',
        );
      }

      const hashedPassword = await bcrypt.hash(user?.senha, 10);
      if (perfis?.length) {
        for (const perfil of perfis) {
          const profile = await profileRepository.getProfileByParams(perfil);
          if (!profile) throw new CustomError('Perfil não encontrado.');
          profilesIDs.push(profile.id);
        }
      }

      const createdUser = await userRepository.createUser({
        ...user,
        senha: hashedPassword,
      });
      if (!createdUser) throw new CustomError('Falha ao criar o usuário.');

      if (perfis?.length) {
        for (const id of profilesIDs) {
          const assignedProfile = await userRepository.assignProfile({
            usuario_id: createdUser.id,
            perfil_id: id!,
          });

          if (!assignedProfile) {
            throw new CustomError('Falha ao associar perfis ao usuário.');
          }
        }
      }

      return createdUser;
    } catch (error) {
      handleError('Erro ao criar usuário:', error);
    }
  },

  updateUser: async (
    id: number,
    data: UserUpdateInput,
    currentUserProfiles: Profile[],
  ): Promise<User | undefined> => {
    try {
      const { perfis, ...userData } = data;
      if (!id || !userData || !Object.keys(userData).length) {
        throw new CustomError('Dados do usuário ou ID inválidos.');
      }

      const existingUser = await userService.getUserByParams({ id });
      const isAdmin = currentUserProfiles?.some((p) => p?.nome === 'admin');

      let allowedData = userData;
      if (!isAdmin) {
        allowedData = {
          nome: userData.nome,
          email: userData.email,
          senha: userData.senha,
          data_update: new Date().toISOString(),
        };
      }

      const hashedPassword = allowedData?.senha
        ? await bcrypt.hash(allowedData?.senha, 10)
        : existingUser?.senha;

      const updatedUser = await userRepository.updateUser(id, {
        ...existingUser,
        ...allowedData,
        senha: hashedPassword,
        data_update: new Date().toISOString(),
      });

      if (!updatedUser) {
        throw new CustomError(
          `Usuário com ID ${id} existe, mas nenhuma modificação foi aplicada.`,
        );
      }

      if (isAdmin && perfis?.length) {
        const profilesIDs: number[] = [];

        for (const perfil of perfis) {
          const profile = await profileRepository.getProfileByParams(perfil);
          if (!profile) throw new CustomError('Perfil não encontrado.');
          profilesIDs.push(profile.id);
        }

        await userRepository.unassignProfile(id);
        for (const profileId of profilesIDs) {
          const assignedProfile = await userRepository.assignProfile({
            usuario_id: updatedUser.id,
            perfil_id: profileId,
          });

          if (!assignedProfile) {
            throw new CustomError('Falha ao associar perfis ao usuário.');
          }
        }
      }

      return updatedUser;
    } catch (error) {
      handleError(`Erro ao atualizar usuário com ID ${id}:`, error);
    }
  },

  deleteUser: async (id: number): Promise<string | undefined> => {
    try {
      if (!id) {
        throw new CustomError('É necessário fornecer o ID do usuário.');
      }

      const deletedRows = await userRepository.deleteUser(id);
      if (!deletedRows) {
        throw new CustomError(
          `Nenhum usuário encontrado com o ID ${id} para deletar.`,
        );
      }

      return `Usuário com ID ${id} foi deletado com sucesso.`;
    } catch (error) {
      handleError(`Erro ao deletar o usuário com ID ${id}:`, error);
    }
  },

  getUserProfiles: async (userId: number): Promise<Profile[] | undefined> => {
    try {
      if (!userId) {
        throw new CustomError('É necessário fornecer o ID do usuário.');
      }
      return await userRepository.getUserProfiles(userId);
    } catch (error) {
      handleError(`Erro ao obter perfis para usuário com ID ${userId}:`, error);
    }
  },

  signUp: async (user: SignUpInput): Promise<User | undefined> => {
    try {
      const createdUser = await userService.createUser({
        ...user,
        perfis: [{ nome: 'comum', descricao: 'Comum' }],
      });

      return createdUser;
    } catch (error) {
      handleError('Erro ao cadastrar usuário:', error);
    }
  },

  getAuthenticatedUser: async (
    user: User,
  ): Promise<AuthenticatedUser | undefined> => {
    try {
      const profiles = await userService.getUserProfiles(user.id);

      const payload = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        ativo: user.ativo,
        perfis: profiles,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: '24h',
      });

      const decoded = jwt.decode(token) as { iat: number; exp: number };

      return {
        id: user.id,
        nome: user.nome,
        email: user.email,
        ativo: user.ativo,
        token,
        iat: decoded.iat,
        exp: decoded.exp,
        perfis: profiles,
      };
    } catch (error) {
      handleError('Erro ao autenticar o usuário:', error);
    }
  },

  login: async ({
    email,
    senha,
  }: LoginInput): Promise<AuthenticatedUser | undefined> => {
    try {
      if (!email) throw new CustomError('O e-mail é obrigatório.');

      const user = await userService.getUserByParams({ email });

      const isPasswordValid = await bcrypt.compare(senha, user!.senha);
      if (!isPasswordValid) throw new CustomError('Senha inválida.');

      return await userService.getAuthenticatedUser(user!);
    } catch (error) {
      handleError('Erro ao autenticar o usuário:', error);
    }
  },

  getMetrics: async (): Promise<Metrics | undefined> => {
    try {
      const [totalUsers, activeUsers, inactiveUsers, totalProfiles] =
        await Promise.all([
          userRepository.countUsers(),
          userRepository.countActiveUsers(),
          userRepository.countInactiveUsers(),
          profileRepository.countProfiles(),
        ]);

      return { totalUsers, activeUsers, inactiveUsers, totalProfiles };
    } catch (error) {
      handleError('Não foi possível carregar as métricas:', error);
    }
  },
};
