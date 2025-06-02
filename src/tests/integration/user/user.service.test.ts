import { database } from '@/database';
import { userService } from '@/service/user.service';
import {
  SignUpInput,
  User,
  UserInput,
  UserUpdateInput,
} from '@/types/users.types';

describe('User Service Integration Tests', () => {
  let latestUser: Pick<User, 'id'> | undefined;
  beforeAll(async () => {
    latestUser = await database<User>('usuarios')
      .select('id')
      .orderBy('id', 'desc')
      .first();
  });

  it('should fetch all users from the database', async () => {
    const profiles = await userService.getAllUsers();

    expect(profiles).toHaveLength(2);
    expect(profiles).toEqual([
      {
        ativo: 1,
        data_criacao: expect.any(String),
        data_update: expect.any(String),
        email: 'admin@exemplo.com',
        id: 1,
        nome: 'Admin Usuário',
        senha: expect.any(String),
      },
      {
        ativo: 1,
        data_criacao: expect.any(String),
        data_update: expect.any(String),
        email: 'usuario@exemplo.com',
        id: 2,
        nome: 'Usuário Comum',
        senha: expect.any(String),
      },
    ]);
  });

  it('should fetch a specific user matching the given parameters', async () => {
    const user = await userService.getUserByParams({ id: 1 });

    expect(user).toEqual({
      id: 1,
      ativo: 1,
      nome: 'Admin Usuário',
      email: 'admin@exemplo.com',
      data_update: expect.any(String),
      data_criacao: expect.any(String),
      senha: expect.any(String),
    });
  });

  it('should create a new user and return its data', async () => {
    const newUser: UserInput = {
      nome: 'new user',
      email: 'newuser@mail.com',
      senha: 'Password@321',
    };

    const createdProfile = await userService.createUser(newUser);
    expect(createdProfile).toEqual({
      id: 3,
      ativo: 1,
      nome: 'new user',
      email: 'newuser@mail.com',
      data_update: expect.any(String),
      data_criacao: expect.any(String),
      senha: expect.any(String),
    });
  });

  it('should update an existing user with the provided updates', async () => {
    const id = latestUser?.id;
    const updates: UserUpdateInput = {
      nome: 'update user',
      email: 'update@mail.com',
      senha: 'Password@321',
      data_update: new Date().toISOString(),
    };
    const updatedProfile = await userService.updateUser(id!, updates);

    expect(updatedProfile).toEqual({
      id: 2,
      ativo: 1,
      nome: 'update user',
      email: 'update@mail.com',
      data_update: expect.any(String),
      data_criacao: expect.any(String),
      senha: expect.any(String),
    });
  });

  it('should delete an existing profile and confirm its removal', async () => {
    const id = latestUser?.id;
    const deletedProfile = await userService.deleteUser(id!);

    expect(deletedProfile).toEqual(
      `Usuário com ID ${id} foi deletado com sucesso.`,
    );
  });

  it('should sign up a new user', async () => {
    const newUser: SignUpInput = {
      nome: 'new user',
      email: 'signup@mail.com',
      senha: 'Password@321',
    };

    const createdProfile = await userService.signUp(newUser);
    expect(createdProfile).toEqual({
      email: 'signup@mail.com',
      id: 4,
      nome: 'new user',
      ativo: 1,
      data_update: expect.any(String),
      data_criacao: expect.any(String),
      senha: expect.any(String),
    });
  });
});
