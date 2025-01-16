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
};
