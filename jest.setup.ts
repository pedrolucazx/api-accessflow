import knex from 'knex';
import config from './knexfile';
import { unlinkSync, existsSync } from 'node:fs';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.test' });

const environment = process.env.NODE_ENV || 'test';
const dbConfig = config[environment];
const database = knex(dbConfig);

beforeAll(async () => {
  await database.migrate.latest({ directory: './src/database/migrations' });
  await database.seed.run({ directory: './src/database/seeds' });
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(async () => {
  await database.migrate.rollback({ directory: './src/database/migrations' });
  await database.destroy();
  jest.restoreAllMocks();
  const testDbPath = './src/database/test.db';

  if (existsSync(testDbPath)) {
    try {
      unlinkSync(testDbPath);
    } catch (err) {
      console.error('Erro ao deletar o arquivo');
    }
  }
});

export default database;
