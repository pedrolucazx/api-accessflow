import { database } from '@/database';
import type { UserProfileModel } from '@/types/user_profile.types';

export const userProfileModel: UserProfileModel = {
  associate: async (
    userId: number,
    profileId: number,
  ): Promise<number | undefined> => {
    try {
      const [id] = await database('usuarios_perfis').insert({
        usuario_id: userId,
        perfil_id: profileId,
      });
      return id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  disassociate: async (userId: number, profileId: number): Promise<number> => {
    try {
      return await database('usuarios_perfis')
        .where({
          usuario_id: userId,
          perfil_id: profileId,
        })
        .delete();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
