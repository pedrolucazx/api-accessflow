import { database } from '../database';
import type {
  User,
  UserFilter,
  UserInput,
  UserRepository,
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
      return await database.transaction(async (trx) => {
        const { perfis, ...user } = data;
        const [createdUser] = await trx<User>('usuarios')
          .insert(user)
          .returning('*');

        const userProfiles = perfis?.map(({ id }) => ({
          usuario_id: createdUser?.id,
          perfil_id: id,
        }));

        await trx('usuarios_perfis').insert(userProfiles);
        return createdUser;
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updateUser: async (id: number, user: Partial<User>): Promise<User> => {
    try {
      const [updatedUser] = await database<User>('usuarios')
        .where({ id })
        .update(user)
        .returning('*');
      return updatedUser;
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
