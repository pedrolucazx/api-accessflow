import { Profile } from '@/types/profiles.types';
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

  updateUser: async (id: number, data: UserInput): Promise<User> => {
    try {
      return await database.transaction(async (trx) => {
        const { perfis, ...user } = data;
        const [updatedUser] = await trx<User>('usuarios')
          .where({ id })
          .update(user)
          .returning('*');

        const userProfiles = perfis?.map(({ id }) => ({
          usuario_id: updatedUser?.id,
          perfil_id: id,
        }));

        await trx('usuarios_perfis').where({ usuario_id: id }).delete();
        await trx('usuarios_perfis').insert(userProfiles);

        return updatedUser;
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  deleteUser: async (id: number): Promise<number> => {
    try {
      return await database.transaction(async (trx) => {
        await trx('usuarios_perfis').where({ usuario_id: id }).delete();
        const deletedRows = await trx<User>('usuarios').where({ id }).delete();
        return deletedRows;
      });
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
};
