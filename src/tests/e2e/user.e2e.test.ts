import { Context } from '@/graphql/context';
import startApolloServer from '@/server';
import { ApolloServer } from '@apollo/server';
import request from 'supertest';

jest.setTimeout(50000);

describe.skip('User End-to-End Tests', () => {
  const GET_ALL_USERS = `#graphql
    query {
      getAllUsers {
        id
        nome
        email
        ativo
        data_criacao
        data_update
        perfis {
          id
          # nome
          descricao
        }
      }
    }
  `;

  const GET_USER_BY_PARAMS = `#graphql
    query GetUserByParams($filter: UserFilter!) {
      getUserByParams(filter: $filter) {
        id
        nome
        email
        ativo
        data_criacao
        data_update
        perfis {
          id
          nome
          descricao
        }
      }
    }
  `;

  const CREATE_USER = `#graphql
    mutation CreateUser($input: UserInput) {
      createUser(input: $input) {
        id
        nome
        email
        ativo
        data_criacao
        data_update
        perfis {
          id
          nome
          descricao
        }
      }
    }
  `;

  const UPDATE_USER = `#graphql
    mutation UpdateUser($input: UserInput!, $updateUserId: Int!) {
      updateUser(input: $input, id: $updateUserId) {
        id
        nome
        email
        ativo
        data_criacao
        data_update
        perfis {
          id
          nome
          descricao
        }
      }
    }
  `;

  const DELETE_USER = `#graphql
    mutation DeleteUser($deleteUserId: Int!) {
      deleteUser(id: $deleteUserId)
    }
  `;
  const SIGNUP = `#graphql
    mutation SignUp($input: SignUpInput) {
      signUp(input: $input) {
        id
        nome
        email
        ativo
        data_criacao
        data_update
        perfis {
          id
          nome
          descricao
        }
      }
    }
  `;

  let apolloServer: ApolloServer<Context>;
  let urlServer: string;

  beforeAll(async () => {
    const { server, url } = await startApolloServer({ port: 4001 });
    apolloServer = server;
    urlServer = url;
  });

  afterAll(async () => {
    await apolloServer?.stop();
  });

  it('should fetch all users successfully', async () => {
    const response = await request(urlServer)
      .post('/')
      .send({ query: GET_ALL_USERS });

    expect(response.body.data.getAllUsers).toEqual([
      {
        ativo: true,
        data_criacao: expect.any(String),
        data_update: expect.any(String),
        email: 'admin@exemplo.com',
        id: 1,
        nome: 'Admin Usuário',
        perfis: [
          {
            descricao: 'Administrador',
            id: 1,
            nome: 'admin',
          },
        ],
      },
      {
        ativo: true,
        data_criacao: expect.any(String),
        data_update: expect.any(String),
        email: 'usuario@exemplo.com',
        id: 2,
        nome: 'Usuário Comum',
        perfis: [
          {
            descricao: 'Comum',
            id: 2,
            nome: 'comum',
          },
        ],
      },
    ]);
    expect(response.status).toBe(200);
  });

  it('should fetch a user by filter parameters', async () => {
    const filter = { id: 1 };

    const response = await request(urlServer)
      .post('/')
      .send({ query: GET_USER_BY_PARAMS, variables: { filter } });

    expect(response.body.data.getUserByParams).toEqual({
      ativo: true,
      data_criacao: expect.any(String),
      data_update: expect.any(String),
      email: 'admin@exemplo.com',
      id: 1,
      nome: 'Admin Usuário',
      perfis: [
        {
          descricao: 'Administrador',
          id: 1,
          nome: 'admin',
        },
      ],
    });
    expect(response.status).toBe(200);
  });

  it('should create a new user successfully', async () => {
    const response = await request(urlServer)
      .post('/')
      .send({
        query: CREATE_USER,
        variables: {
          input: {
            nome: 'New user',
            email: 'newuser@mail.com',
            senha: 'Password@321',
            perfis: [
              {
                id: 1,
              },
            ],
          },
        },
      });

    expect(response.body.data.createUser).toEqual({
      ativo: true,
      data_criacao: expect.any(String),
      data_update: expect.any(String),
      id: 3,
      nome: 'New user',
      email: 'newuser@mail.com',
      perfis: [
        {
          descricao: 'Administrador',
          id: 1,
          nome: 'admin',
        },
      ],
    });
    expect(response.status).toBe(200);
  });

  it('should update an existing user successfully', async () => {
    const response = await request(urlServer)
      .post('/')
      .send({
        query: UPDATE_USER,
        variables: {
          input: {
            nome: 'updated user',
            email: 'updated@mail.com',
            senha: 'Password@321',
            perfis: [
              {
                id: 2,
              },
            ],
          },
          updateUserId: 1,
        },
      });

    expect(response.body.data.updateUser).toEqual({
      ativo: true,
      data_criacao: expect.any(String),
      data_update: expect.any(String),
      email: 'updated@mail.com',
      id: 1,
      nome: 'updated user',
      perfis: [
        {
          descricao: 'Comum',
          id: 2,
          nome: 'comum',
        },
      ],
    });
    expect(response.status).toBe(200);
  });

  it('should delete a profile successfully', async () => {
    const response = await request(urlServer)
      .post('/')
      .send({
        query: DELETE_USER,
        variables: {
          deleteUserId: 1,
        },
      });

    expect(response.body.data.deleteUser).toBe(
      'User with ID 1 was successfully deleted.',
    );
    expect(response.status).toBe(200);
  });

  it('should sign up a new user successfully', async () => {
    const response = await request(urlServer)
      .post('/')
      .send({
        query: SIGNUP,
        variables: {
          input: {
            nome: 'Novo Usuário',
            email: 'novo@exemplo.com',
            senha: 'SenhaSegura123',
          },
        },
      });

    expect(response.body.data.signUp).toEqual({
      ativo: true,
      data_criacao: expect.any(String),
      data_update: expect.any(String),
      id: 4,
      nome: 'Novo Usuário',
      email: 'novo@exemplo.com',
      perfis: [
        {
          id: 2,
          nome: 'comum',
          descricao: 'Comum',
        },
      ],
    });
    expect(response.status).toBe(200);
  });
});
