import { Profile, ProfileFilter } from './profiles.types';

export type User = {
  id: number;
  nome: string;
  email: string;
  senha: string;
  ativo: boolean;
  data_criacao?: string;
  data_update?: string;
};

export type UserFilter = {
  id?: number;
  nome?: string;
  email?: string;
};

export type UserInput = {
  nome: string;
  email: string;
  senha: string;
  perfis?: ProfileFilter[];
};

export interface UserRepository {
  getAllUsers: () => Promise<User[]>;
  getUserByParams: (filters: UserFilter) => Promise<User | undefined>;
  createUser: (data: UserInput) => Promise<User | undefined>;
  updateUser: (id: number, data: UserInput) => Promise<User | undefined>;
  deleteUser: (id: number) => Promise<number>;
  getUserProfiles: (userId: number) => Promise<Profile[]>;
}

export type argsType = {
  id: number;
  input: UserInput;
  filter: UserFilter;
};
