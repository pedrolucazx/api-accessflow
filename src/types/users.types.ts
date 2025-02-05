export type User = {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  ativo: boolean;
  data_criacao?: string;
  data_update?: string;
};

export interface UserRepository {
  getAllUsers: () => Promise<User[]>;
  getUserByParams: (params: Partial<User>) => Promise<User | undefined>;
  createUser: (
    user: Omit<User, 'id' | 'data_criacao' | 'data_update'>,
  ) => Promise<number | undefined>;
  updateUser: (id: number, user: Partial<User>) => Promise<number>;
  deleteUser: (id: number) => Promise<number>;
}
