import { database } from '../../../database';
import { userRepository } from '../../../repositories/user.repository';
import { User, UserInput, UserUpdateInput } from '../../../types/users.types';

describe('User Repository Integration Tests', () => {
  let latestUser: Pick<User, 'id'> | undefined;

  beforeAll(async () => {
    latestUser = await database<User>('usuarios')
      .select('id')
      .orderBy('id', 'desc')
      .first();
  });

  it('should retrieve all users from the database', async () => {
    const users = await userRepository.getAllUsers();
    expect(users).toHaveLength(2);
    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ativo: 1,
          email: 'admin@exemplo.com',
          id: 1,
          nome: 'Admin Usuário',
        }),
        expect.objectContaining({
          ativo: 1,
          email: 'usuario@exemplo.com',
          id: 2,
          nome: 'Usuário Comum',
        }),
      ]),
    );
  });

  it('should retrieve a user matching the specified parameters', async () => {
    const user = await userRepository.getUserByParams({ id: 1 });
    expect(user).toEqual(
      expect.objectContaining({
        ativo: 1,
        email: 'admin@exemplo.com',
        id: 1,
        nome: 'Admin Usuário',
      }),
    );
  });

  it('should create a new user and return its details', async () => {
    const mockUser: UserInput = {
      senha: 'Password@123',
      nome: 'New User',
      email: 'newuser@example.com',
    };

    const result = await userRepository.createUser(mockUser);

    expect(result).toEqual({
      ativo: 1,
      data_criacao: expect.any(String),
      data_update: expect.any(String),
      email: 'newuser@example.com',
      id: 3,
      nome: 'New User',
      senha: expect.any(String),
    });
  });

  it('should update an existing user and return the updated record', async () => {
    const id = latestUser?.id;
    const updatedUser: UserUpdateInput = {
      nome: 'Updated User',
      email: 'updateduser@example.com',
      senha: 'NewPassword@321',
      data_update: new Date().toISOString(),
    };

    const updatedRows = await userRepository.updateUser(id!, updatedUser);

    expect(updatedRows).toEqual({
      ativo: 1,
      data_criacao: expect.any(String),
      data_update: expect.any(String),
      email: 'updateduser@example.com',
      id: 2,
      nome: 'Updated User',
      senha: 'NewPassword@321',
    });
  });

  it('should delete a user and return the number of affected rows', async () => {
    const id = latestUser?.id;
    const deletedRows = await userRepository.deleteUser(id!);
    expect(deletedRows).toBe(1);
  });

  it('should return count of users', async () => {
    const total = await userRepository.countUsers();
    expect(total).toBe(2);
  });

  it('should return count of active users', async () => {
    const total = await userRepository.countActiveUsers();
    expect(total).toBe(2);
  });

  it('should return count of inactive users', async () => {
    const total = await userRepository.countInactiveUsers();
    expect(total).toBe(0);
  });
});
