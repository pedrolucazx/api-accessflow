import { config as dotenvConfig } from 'dotenv';
import { database } from './src/database/index';

dotenvConfig({ path: '.env.test' });

beforeAll(async () => {
  await database?.migrate.latest({
    directory: './src/database/migrations',
  });
  await database?.seed.run({ directory: './src/database/seeds' });
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(async () => {
  await database.migrate.rollback({
    directory: './src/database/migrations',
  });
  await database.destroy();
  jest.restoreAllMocks();
});
