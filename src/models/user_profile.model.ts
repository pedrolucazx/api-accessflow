import { executeQuery } from '../utils/executeQuery';

export const userProfileModel = {
  associate: async (
    userId: number,
    profileId: number,
  ): Promise<number | undefined> => {
    return executeQuery(async (database) => {
      const [{ id }] = await database('usuarios_perfis')
        .insert({
          usuario_id: userId,
          perfil_id: profileId,
        })
        .returning('id');
      return id;
    }, 'Error when trying to associate a profile with a user.');
  },

  async disassociate(userId: number, profileId: number): Promise<number> {
    return executeQuery(
      async (database) =>
        await database('usuarios_perfis')
          .where({
            usuario_id: userId,
            perfil_id: profileId,
          })
          .delete(),
      'Error when trying to disassociate a profile with a user.',
    );
  },
};
