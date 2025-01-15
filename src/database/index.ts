import knex, { Knex } from 'knex';
import config from '../../knexfile';
import {
  StartedTestContainer,
  GenericContainer,
  StoppedTestContainer,
} from 'testcontainers';

let testContainer: StartedTestContainer;
let dbConnection: Knex | null = null;

async function createDatabaseConnection(): Promise<Knex> {
  if (!dbConnection) {
    const environment = process.env.NODE_ENV || 'development';

    if (environment === 'test') {
      testContainer = await new GenericContainer('postgres:15')
        .withEnvironment({
          POSTGRES_DB: 'test_db',
          POSTGRES_USER: 'test_user',
          POSTGRES_PASSWORD: 'test_password',
        })
        .withExposedPorts(5432)
        .start();

      dbConnection = knex({
        client: 'pg',
        connection: {
          host: testContainer.getHost(),
          port: testContainer.getMappedPort(5432),
          user: 'test_user',
          password: 'test_password',
          database: 'test_db',
        },
        migrations: { directory: './src/database/migrations' },
        seeds: { directory: './src/database/seeds' },
      });
    } else {
      dbConnection = knex(config[environment]);
    }
  }

  return dbConnection;
}

export async function stopTestDatabase(): Promise<StoppedTestContainer> {
  return testContainer.stop();
}

export const databaseConnection = createDatabaseConnection();
