import { database } from '@/database';
import type { User, UserRepository } from '@/types/users.types';

export const userRepository: UserRepository = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      return await database<User>('usuarios').select('*');
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getUserByParams: async (params: Partial<User>): Promise<User | undefined> => {
    try {
      return await database<User>('usuarios').where(params).first();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  createUser: async (
    user: Omit<User, 'id' | 'data_criacao' | 'data_update'>,
  ): Promise<number | undefined> => {
    try {
      const [id] = await database<User>('usuarios').insert(user);
      return id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updateUser: async (id: number, user: Partial<User>): Promise<number> => {
    try {
      return await database<User>('usuarios').where({ id }).update(user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  deleteUser: async (id: number): Promise<number> => {
    try {
      return await database<User>('usuarios').where({ id }).delete();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
