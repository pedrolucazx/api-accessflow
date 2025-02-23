import { database } from '@/database';
import { userRepository } from '@/repositories/user.repository';
import { User, UserInput } from '@/types/users.types';

describe.skip('User Model Integration Tests', () => {
  let latestUser: Pick<User, 'id'> | undefined;
  beforeAll(async () => {
    latestUser = await database<User>('usuarios')
      .select('id')
      .orderBy('id', 'desc')
      .first();
  });

  it('should return all users', async () => {
    const users = await userRepository.getAllUsers();
    expect(users).toHaveLength(2);
    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ativo: 1,
          email: 'admin@exemplo.com',
          id: 1,
          nome: 'Admin Usuário',
          senha: 'senhaAdmin',
        }),
        expect.objectContaining({
          ativo: 1,
          email: 'usuario@exemplo.com',
          id: 2,
          nome: 'Usuário Comum',
          senha: 'senhaComum',
        }),
      ]),
    );
  });

  it('should return a specific user matching the parameters', async () => {
    const user = await userRepository.getUserByParams({ id: 1 });

    expect(user).toEqual(
      expect.objectContaining({
        ativo: 1,
        email: 'admin@exemplo.com',
        id: 1,
        nome: 'Admin Usuário',
        senha: 'senhaAdmin',
      }),
    );
  });

  it('should create a user and return the inserted ID', async () => {
    const mockUser: UserInput = {
      senha: 'Senha@321',
      nome: 'Novo Usuário',
      email: 'novousuario@exemplo.com',
    };
    const result = await userRepository.createUser(mockUser);
    expect(result).toEqual(expect.any(Number));
  });

  it('should update a user and return the number of affected rows', async () => {
    const id = latestUser?.id;
    const updatedUser: UserInput = {
      nome: 'Updated User',
      email: '',
      senha: '',
    };
    const updatedRows = await userRepository.updateUser(id!, updatedUser);
    expect(updatedRows).toBe(1);
  });

  it('should delete a user and return the number of affected rows', async () => {
    const id = latestUser?.id;
    const deleteRows = await userRepository.deleteUser(id!);
    expect(deleteRows).toBe(1);
  });
});
