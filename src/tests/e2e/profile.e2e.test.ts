import { Context } from '@/graphql/context';
import startApolloServer from '@/server';
import { ApolloServer } from '@apollo/server';
import request from 'supertest';

jest.setTimeout(50000);

describe('Profile End-to-End Tests', () => {
  const GET_ALL_PROFILES = `#graphql
  query {
    getAllProfiles {
      id
      nome
      descricao
    }
  }
`;

  const GET_PROFILE_BY_PARAMS = `#graphql
  query GetProfileByParams($filter: ProfileFilterInput!) {
    getProfileByParams(filter: $filter) {
      id
      nome
      descricao
    }
  }
`;

  const CREATE_PROFILE = `#graphql
  mutation CreateProfile($input: ProfileInput!) {
    createProfile(input: $input) {
      id
      nome
      descricao
    }
  }
`;

  const UPDATE_PROFILE = `#graphql
    mutation UpdateProfile($updateProfileId: Int!, $input: ProfileUpdateInput!) {
      updateProfile(id: $updateProfileId, input: $input) {
        id
        nome
        descricao
      }
}
`;

  const DELETE_PROFILE = `#graphql
    mutation DeleteProfile($deleteProfileId: Int!) {
      deleteProfile(id: $deleteProfileId)
    }
`;

  const LOGIN = `#graphql
    query Login($input: LoginInput) {
      login(input: $input) {
        token
      }
    }
  `;

  let urlServer: string;
  let adminToken: string;
  let authToken: string;
  let apolloServer: ApolloServer<Context>;

  beforeAll(async () => {
    const { server, url } = await startApolloServer({ port: 4001 });
    apolloServer = server;
    urlServer = url;
  });

  afterAll(async () => {
    await apolloServer?.stop();
  });

  it('should login admin user successfully', async () => {
    const response = await request(urlServer)
      .post('/')
      .send({
        query: LOGIN,
        variables: {
          input: {
            email: 'admin@exemplo.com',
            senha: 'senhaAdmin',
          },
        },
      });

    expect(response.status).toBe(200);
    adminToken = response.body.data.login.token;
  });

  it('should login common user successfully', async () => {
    const response = await request(urlServer)
      .post('/')
      .send({
        query: LOGIN,
        variables: {
          input: {
            email: 'usuario@exemplo.com',
            senha: 'senhaComum',
          },
        },
      });

    expect(response.status).toBe(200);
    authToken = response.body.data.login.token;
  });

  it('should fetch all profiles successfully', async () => {
    const response = await request(urlServer)
      .post('/')
      .send({ query: GET_ALL_PROFILES })
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ query: GET_ALL_PROFILES });

    expect(response.body.data.getAllProfiles).toEqual([
      { id: 1, nome: 'admin', descricao: 'Administrador' },
      { id: 2, nome: 'comum', descricao: 'Comum' },
    ]);
    expect(response.status).toBe(200);
  });

  it('should fetch a profile by filter parameters', async () => {
    const filter = { id: 1 };

    const response = await request(urlServer)
      .post('/')
      .send({ query: GET_PROFILE_BY_PARAMS, variables: { filter } })
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.body.data.getProfileByParams).toEqual({
      id: 1,
      nome: 'admin',
      descricao: 'Administrador',
    });
    expect(response.status).toBe(200);
  });

  it('should create a new profile successfully', async () => {
    const response = await request(urlServer)
      .post('/')
      .send({
        query: CREATE_PROFILE,
        variables: { input: { nome: 'gestor', descricao: 'Gestor de equipe' } },
      })
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.body.data.createProfile).toEqual({
      id: expect.any(Number),
      nome: 'gestor',
      descricao: 'Gestor de equipe',
    });
    expect(response.status).toBe(200);
  });

  it('should update an existing profile successfully', async () => {
    const updateData = {
      nome: 'admin atualizado',
      descricao: 'Administrador com novas permissões',
    };

    const response = await request(urlServer)
      .post('/')
      .send({
        query: UPDATE_PROFILE,
        variables: { updateProfileId: 1, input: updateData },
      })
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.body.data.updateProfile).toEqual({
      id: 1,
      nome: 'admin atualizado',
      descricao: 'Administrador com novas permissões',
    });
    expect(response.status).toBe(200);
  });

  it('should delete a profile successfully', async () => {
    const response = await request(urlServer)
      .post('/')
      .send({ query: DELETE_PROFILE, variables: { deleteProfileId: 2 } })
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.body.data?.deleteProfile).toMatch(
      /^Perfil com ID 2 foi deletado com sucesso.$/,
    );
    expect(response.status).toBe(200);
  });

  it('should fetch all profiles and throw an error if no admin user', async () => {
    const response = await request(urlServer)
      .post('/')
      .send({ query: GET_ALL_PROFILES })
      .set('Authorization', `Bearer ${authToken}`)
      .send({ query: GET_ALL_PROFILES });

    expect(response.body.errors[0].message).toMatch(
      /^Acesso negado: apenas administradores podem realizar essa ação.$/,
    );
    expect(response.status).toBe(401);
  });
});
