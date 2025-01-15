import { Knex } from 'knex';
import {
  createDatabaseConnection,
  stopTestDatabase,
} from './src/database/index';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.test' });
let dbConnection: Knex | null = null;

beforeAll(async () => {
  dbConnection = await createDatabaseConnection();
  await dbConnection?.migrate.latest({
    directory: './src/database/migrations',
  });
  await dbConnection?.seed.run({ directory: './src/database/seeds' });
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(async () => {
  if (dbConnection) {
    await dbConnection.migrate.rollback({
      directory: './src/database/migrations',
    });
    await dbConnection.destroy();
    dbConnection = null;
  }
  await stopTestDatabase();
  jest.restoreAllMocks();
});
