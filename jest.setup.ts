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

beforeEach(async () => {
  const tables = await database.raw(
    "SELECT name FROM sqlite_master WHERE type='table';",
  );
  for (const { name } of tables) {
    if (name !== 'sqlite_sequence') {
      await database(name).truncate();
    }
  }
});

afterAll(async () => {
  await database.destroy();
  jest.restoreAllMocks();
});

jest.mock('./src/database/index', () => database);

export default database;
