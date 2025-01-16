import { User } from '../types/users.types';
import { executeQuery } from '../utils/executeQuery';

export const userModel = {
  getAllUsers: async (): Promise<User[]> => {
    return executeQuery(
      async (database) => await database<User>('usuarios').select('*'),
      'Error fetching users.',
    );
  },

  getUserByParams: async (params: Partial<User>): Promise<User | undefined> => {
    return executeQuery(
      async (database) =>
        await database<User>('usuarios').where(params).first(),
      'Error fetching user by parameters.',
    );
  },

  createUser: async (
    user: Omit<User, 'id' | 'data_criacao' | 'data_update'>,
  ): Promise<number | undefined> => {
    return executeQuery(async (database) => {
      const [{ id }] = await database<User>('usuarios')
        .insert(user)
        .returning('id');
      return id;
    }, 'Error creating user.');
  },
};
