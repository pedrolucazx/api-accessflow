import { CustomError, handleError } from '../../src/utils/handleError';
import { profileRepository } from '../repositories/profile.repository';
import {
  Profile,
  ProfileFilter,
  ProfileInput,
  ProfileService,
} from '../types/profiles.types';

export const profileService: ProfileService = {
  getAllProfiles: async (): Promise<Profile[] | undefined> => {
    try {
      const profiles = await profileRepository.getAllProfiles();
      if (!profiles?.length) {
        throw new CustomError('Nenhum perfil encontrado.');
      }
      return profiles;
    } catch (error) {
      handleError('Erro ao buscar perfis:', error);
    }
  },

  getProfileByParams: async (
    filters: ProfileFilter,
  ): Promise<Profile | undefined> => {
    try {
      if (!Object.keys(filters).length) {
        throw new CustomError('Pelo menos um parâmetro deve ser fornecido.');
      }
      const profile = await profileRepository.getProfileByParams(filters);
      if (!profile) {
        throw new CustomError('Perfil não encontrado.');
      }
      return profile;
    } catch (error) {
      handleError('Erro ao buscar perfil por parâmetros:', error);
    }
  },

  createProfile: async (
    profile: ProfileInput,
  ): Promise<Profile | undefined> => {
    try {
      if (!profile || !profile.nome) {
        throw new CustomError('Dados do perfil incompletos ou inválidos.');
      }

      const createdProfile = await profileRepository.createProfile(profile);
      if (!createdProfile) throw new CustomError('Falha ao criar perfil.');

      return createdProfile;
    } catch (error) {
      handleError('Erro ao criar perfil:', error);
    }
  },

  updateProfile: async (
    id: number,
    profile: Partial<ProfileInput>,
  ): Promise<Profile | undefined> => {
    try {
      if (!id || !profile || !Object.keys(profile).length) {
        throw new CustomError('Dados do perfil ou ID inválidos.');
      }

      const updatedProfile = await profileRepository.updateProfile(id, profile);
      if (!updatedProfile) {
        throw new CustomError(
          `Nenhum perfil encontrado com o ID ${id} para atualizar.`,
        );
      }

      return updatedProfile;
    } catch (error) {
      handleError(`Erro ao atualizar perfil com ID ${id}:`, error);
    }
  },

  deleteProfile: async (id: number): Promise<string | undefined> => {
    try {
      if (!id) {
        throw new CustomError('É necessário fornecer o ID do perfil.');
      }

      const deletedRows = await profileRepository.deleteProfile(id);
      if (!deletedRows) {
        throw new CustomError(
          `Nenhum perfil encontrado com o ID ${id} para deletar.`,
        );
      }

      return `Perfil com ID ${id} foi deletado com sucesso.`;
    } catch (error) {
      handleError(`Erro ao deletar perfil com ID ${id}:`, error);
    }
  },
};
