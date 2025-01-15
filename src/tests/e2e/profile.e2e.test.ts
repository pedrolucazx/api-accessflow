import { ApolloServer, BaseContext } from '@apollo/server';
import request from 'supertest';
import { createDatabaseConnection } from '../../database';
import startApolloServer from '../../server';

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
  query($filter: ProfileFilterInput!) {
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
  mutation($id: Int!, $input: ProfileUpdateInput!) {
    updateProfile(id: $id, input: $input) {
      id
      nome
      descricao
    }
  }
`;

  const DELETE_PROFILE = `#graphql
  mutation($id: Int!) {
    deleteProfile(id: $id)
  }
`;

  let apolloServer: ApolloServer<BaseContext>;
  let urlServer: string;

  beforeAll(async () => {
    const database = await createDatabaseConnection();
    const { server, url } = await startApolloServer(database, { port: 3333 });
    apolloServer = server;
    urlServer = url;
  });

  afterAll(async () => {
    await apolloServer?.stop();
  });

  it('should fetch all profiles successfully', async () => {
    const response = await request(urlServer)
      .post('/')
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
      .send({ query: GET_PROFILE_BY_PARAMS, variables: { filter } });

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
      });

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
      .send({ query: UPDATE_PROFILE, variables: { id: 1, input: updateData } });

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
      .send({ query: DELETE_PROFILE, variables: { id: 2 } });

    expect(response.body.data.deleteProfile).toBe(
      'Profile with ID 2 was successfully deleted.',
    );
    expect(response.status).toBe(200);
  });
});
