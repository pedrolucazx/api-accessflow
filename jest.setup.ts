import knex from 'knex';
import config from './knexfile';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.test' });

const environment = process.env.NODE_ENV || 'test';
const dbConfig = config[environment];
const database = knex(dbConfig);

beforeAll(async () => {
  await database.migrate.latest({ directory: './src/database/migrations' });
  await database.seed.run({ directory: './src/database/seeds' });
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(async () => {
  await database.destroy();
  jest.restoreAllMocks();
});

export default database;
