import { Knex } from 'knex';
import { databaseConnection, stopTestDatabase } from './src/database/index';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.test' });
let dbConnection: Knex;

beforeAll(async () => {
  dbConnection = await databaseConnection;
  await dbConnection?.migrate.latest({
    directory: './src/database/migrations',
  });
  await dbConnection?.seed.run({ directory: './src/database/seeds' });
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(async () => {
  await dbConnection?.migrate.rollback({
    directory: './src/database/migrations',
  });
  await dbConnection?.destroy();
  await stopTestDatabase();
  jest.restoreAllMocks();
});
