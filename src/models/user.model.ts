import { User } from '../types/users.types';
import { executeQuery } from '../utils/executeQuery';

export const userModel = {
  getAllUsers: async (): Promise<User[]> => {
    return executeQuery(
      async (database) => await database<User>('usuarios').select('*'),
      'Error fetching profiles.',
    );
  },
};
