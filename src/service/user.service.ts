import bcrypt from 'bcrypt';
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
  UserUpdateInput,
} from '../types/users.types';
import { handleError } from '../utils/handleError';
import jwt from 'jsonwebtoken';

export const userService = {
  getAllUsers: async (): Promise<User[] | undefined> => {
    try {
      const users = await userRepository.getAllUsers();
      if (!users?.length) {
        throw new Error('No users found');
      }
      return users;
    } catch (error) {
      handleError('Error fetching users:', error);
    }
  },

  getUserByParams: async (filter: UserFilter): Promise<User | undefined> => {
    try {
      if (!Object.keys(filter).length) {
        throw new Error('At least one parameter must be provided.');
      }

      const user = await userRepository.getUserByParams(filter);
      if (!user) {
        throw new Error('User not found.');
      }

      return user;
    } catch (error) {
      handleError('Error fetching user by parameters:', error);
    }
  },

  createUser: async (data: UserInput): Promise<User | undefined> => {
    try {
      const { perfis, ...user } = data;
      const profilesIDs = [];
      if (
        !Object.keys(user).length ||
        Object.values(user).some((value) => !value)
      ) {
        throw new Error('User data is incomplete or invalid.');
      }

      const hashedPassword = await bcrypt.hash(user?.senha, 10);
      if (perfis?.length) {
        for (const perfil of perfis) {
          const profile = await profileRepository.getProfileByParams(perfil);
          profilesIDs.push(profile?.id);
          if (!profile) throw new Error('Profile not found.');
        }
      }

      const createdUser = await userRepository.createUser({
        ...user,
        senha: hashedPassword,
      });
      if (!createdUser) throw new Error('Failed to create user.');

      if (perfis?.length) {
        for (const id of profilesIDs) {
          const assignedProfile = await userRepository.assignProfile({
            usuario_id: createdUser.id,
            perfil_id: id!,
          });

          if (!assignedProfile) {
            throw new Error('Failed to associate profiles to user.');
          }
        }
      }

      return createdUser;
    } catch (error) {
      handleError('Error creating user:', error);
    }
  },

  updateUser: async (
    id: number,
    data: UserUpdateInput,
  ): Promise<User | undefined> => {
    try {
      const { perfis, ...user } = data;
      const profilesIDs = [];
      if (!id || !user || !Object.keys(user).length) {
        throw new Error('Invalid user data or ID.');
      }

      if (perfis?.length) {
        for (const perfil of perfis) {
          const profile = await profileRepository.getProfileByParams(perfil);
          profilesIDs.push(profile?.id);
          if (!profile) throw new Error('Profile not found.');
        }
      }

      const existingUser = await userService.getUserByParams({ id });
      const hashedPassword = user?.senha
        ? await bcrypt.hash(user?.senha, 10)
        : existingUser?.senha;

      const updatedUser = await userRepository.updateUser(id, {
        ...existingUser,
        ...user,
        senha: hashedPassword,
        data_update: new Date().toISOString(),
      });

      if (!updatedUser) {
        throw new Error(`No user found with ID ${id} to update.`);
      }

      const existingProfiles = await userService.getUserProfiles(
        updatedUser.id,
      );
      const isAdmin = existingProfiles?.some(
        (profile) => profile.nome === 'admin',
      );

      if (perfis?.length && isAdmin) {
        await userRepository.unassignProfile(id);
        for (const id of profilesIDs) {
          const assignedProfile = await userRepository.assignProfile({
            usuario_id: updatedUser?.id,
            perfil_id: id!,
          });

          if (!assignedProfile) {
            throw new Error('Failed to associate profiles to user.');
          }
        }
      }

      return updatedUser;
    } catch (error) {
      handleError(`Error updating user with ID ${id}:`, error);
    }
  },

  deleteUser: async (id: number): Promise<string | undefined> => {
    try {
      if (!id) {
        throw new Error('User ID is required.');
      }

      const deletedRows = await userRepository.deleteUser(id);
      if (!deletedRows) {
        throw new Error(`No user found with ID ${id} to delete.`);
      }

      return `User with ID ${id} was successfully deleted.`;
    } catch (error) {
      handleError(`Error deleting user with ID ${id}:`, error);
    }
  },

  getUserProfiles: async (userId: number): Promise<Profile[] | undefined> => {
    try {
      if (!userId) {
        throw new Error('User ID is required.');
      }
      return await userRepository.getUserProfiles(userId);
    } catch (error) {
      handleError(`Error getting profiles for user with ID ${userId}:`, error);
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
      handleError('Error signing up user:', error);
    }
  },

  getAuthenticatedUser: async (
    user: User,
  ): Promise<AuthenticatedUser | undefined> => {
    try {
      const profiles = await userService.getUserProfiles(user.id);
      const iat = Math.floor(Date.now() / 1000);
      const exp = iat + 24 * 60 * 60;

      const payload = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        ativo: user.ativo,
        perfis: profiles,
        iat,
        exp,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET as string);

      return {
        id: user.id,
        nome: user.nome,
        email: user.email,
        ativo: user.ativo,
        token,
        iat,
        exp,
        perfis: profiles,
      };
    } catch (error) {
      handleError('Error authenticating user:', error);
    }
  },

  login: async ({
    email,
    senha,
  }: LoginInput): Promise<AuthenticatedUser | undefined> => {
    try {
      if (!email) throw new Error('Email is required');

      const user = await userService.getUserByParams({ email });

      const isPasswordValid = await bcrypt.compare(senha, user!.senha);
      if (!isPasswordValid) throw new Error('Invalid password');

      return await userService.getAuthenticatedUser(user!);
    } catch (error) {
      handleError('Error authenticating user:', error);
    }
  },
};
