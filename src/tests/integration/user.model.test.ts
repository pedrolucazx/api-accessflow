import { database } from '@/database';
import { userModel } from '@/models/user.model';
import { User } from '@/types/users.types';

describe('User Model Integration Tests', () => {
  let latestUser: Pick<User, 'id'> | undefined;
  beforeAll(async () => {
    latestUser = await database<User>('usuarios')
      .select('id')
      .orderBy('id', 'desc')
      .first();
  });

  it('should return all users', async () => {
    const users = await userModel.getAllUsers();
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
    const user = await userModel.getUserByParams({ id: 1 });

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
    const mockUser: User = {
      ativo: true,
      senha: 'Senha@321',
      nome: 'Novo Usuário',
      email: 'novousuario@exemplo.com',
    };
    const result = await userModel.createUser(mockUser);
    expect(result).toEqual(expect.any(Number));
  });

  it('should update a user and return the number of affected rows', async () => {
    const id = latestUser?.id;
    const updatedUser = { nome: 'Updated User' };
    const updatedRows = await userModel.updateUser(id!, updatedUser);
    expect(updatedRows).toBe(1);
  });

  it('should delete a user and return the number of affected rows', async () => {
    const id = latestUser?.id;
    const deleteRows = await userModel.deleteUser(id!);
    expect(deleteRows).toBe(1);
  });
});
