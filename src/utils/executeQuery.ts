import { Knex } from 'knex';
import { databaseConnection } from '../database/index';

export async function executeQuery<T>(
  query: (database: Knex) => Promise<T>,
  errorMessage?: string,
): Promise<T> {
  try {
    const database = await databaseConnection;
    return await query(database);
  } catch (error) {
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
}
