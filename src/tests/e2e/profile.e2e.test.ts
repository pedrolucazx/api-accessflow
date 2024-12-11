import request from 'supertest';
import startApolloServer from '../../server';
import database from '../../../jest.setup';
import { ApolloServer, BaseContext } from '@apollo/server';

describe('Profile End-to-End Tests', () => {
  const GET_ALL_PROFILES = `
    query {
      getAllProfiles {
        id
        nome
        descricao
      }
    }
  `;

  const GET_PROFILE_BY_PARAMS = `
    query($filter: ProfileFilterInput!) {
      getProfileByParams(filter: $filter) {
        id
        nome
        descricao
      }
    }
  `;

  const CREATE_PROFILE = `
  mutation($input: ProfileInput!) {
    createProfile(input: $input) {
      id
      nome
      descricao
    }
  }
`;

  const UPDATE_PROFILE = `
  mutation($id: Int!, $input: ProfileUpdateInput!) {
    updateProfile(id: $id, input: $input) {
      id
      nome
      descricao
    }
  }
`;

  const DELETE_PROFILE = `
  mutation($id: Int!) {
    deleteProfile(id: $id)
  }
`;

  let server: ApolloServer<BaseContext>, url: string;

  beforeAll(async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    ({ server, url } = await startApolloServer(database, { port: 3333 }));
  });

  afterAll(async () => {
    await server?.stop();
  });

  it('should fetch all profiles successfully', async () => {
    const response = await request(url)
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

    const response = await request(url)
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
    const newProfile = {
      nome: 'gestor',
      descricao: 'Gestor de equipe',
    };

    const response = await request(url)
      .post('/')
      .send({ query: CREATE_PROFILE, variables: { input: newProfile } });

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

    const response = await request(url)
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
    const response = await request(url)
      .post('/')
      .send({ query: DELETE_PROFILE, variables: { id: 2 } });

    expect(response.body.data.deleteProfile).toBe(
      'Profile with ID 2 was successfully deleted.',
    );
    expect(response.status).toBe(200);
  });
});
