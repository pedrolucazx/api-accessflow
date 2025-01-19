import { User, UserModel } from '../types/users.types';
import { executeQuery } from '../utils/executeQuery';

export const userModel: UserModel = {
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

  updateUser: async (id: number, user: Partial<User>): Promise<number> => {
    return executeQuery(
      async (database) =>
        await database<User>('usuarios').where({ id }).update(user),
      `Error updating user with ID ${id}.`,
    );
  },

  deleteUser: async (id: number): Promise<number> => {
    return executeQuery(
      async (database) =>
        await database<User>('usuarios').where({ id }).delete(),
      `Error deleting user with ID ${id}.`,
    );
  },
};
