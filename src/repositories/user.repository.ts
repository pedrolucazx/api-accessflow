import { Profile } from '@/types/profiles.types';
import { database } from '../database';
import type {
  AssignedProfile,
  User,
  UserFilter,
  UserInput,
  UserProfileAssignment,
  UserRepository,
  UserUpdateInput,
} from '../types/users.types';

export const userRepository: UserRepository = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      return await database<User>('usuarios').select('*');
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getUserByParams: async (params: UserFilter): Promise<User | undefined> => {
    try {
      return await database<User>('usuarios').where(params).first();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  createUser: async (data: UserInput): Promise<User | undefined> => {
    try {
      const [createdUser] = await database<User>('usuarios')
        .insert(data)
        .returning('*');

      return createdUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  assignProfile: async (
    data: UserProfileAssignment,
  ): Promise<AssignedProfile> => {
    try {
      const [assignedProfiles] = await database<AssignedProfile>(
        'usuarios_perfis',
      )
        .insert(data)
        .returning('*');

      return assignedProfiles;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updateUser: async (id: number, data: UserUpdateInput): Promise<User> => {
    try {
      const [updatedUser] = await database<User>('usuarios')
        .where({ id })
        .update(data)
        .returning('*');

      return updatedUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  unassignProfile: async (usuario_id: number): Promise<number> => {
    try {
      const affectedRows = await database('usuarios_perfis')
        .where({ usuario_id })
        .delete();

      return affectedRows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  deleteUser: async (id: number): Promise<number> => {
    try {
      const deletedRows = await database<User>('usuarios')
        .where({ id })
        .delete();
      return deletedRows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getUserProfiles: async (userId: number): Promise<Profile[]> => {
    try {
      const profiles = await database<Profile>('perfis as p')
        .join('usuarios_perfis as up', 'p.id', 'up.perfil_id')
        .where('up.usuario_id', userId)
        .select('p.id', 'p.nome', 'p.descricao');

      return profiles;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  countUsers: async (): Promise<number> => {
    try {
      const { count } = (await database('usuarios')
        .count<{
          count: string | number;
        }>('id as count')
        .first()) ?? { count: 0 };
      return Number(count);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  countActiveUsers: async (): Promise<number> => {
    try {
      const { count } = (await database('usuarios')
        .where({ ativo: true })
        .count<{ count: string | number }>('id as count')
        .first()) ?? { count: 0 };
      return Number(count);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  countInactiveUsers: async (): Promise<number> => {
    try {
      const { count } = (await database('usuarios')
        .where({ ativo: false })
        .count<{ count: string | number }>('id as count')
        .first()) ?? { count: 0 };
      return Number(count);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
