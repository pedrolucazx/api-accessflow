import knex, { Knex } from 'knex';
import config from '../../knexfile';

const envariment = process.env.NODE_ENV || 'development';
export const database: Knex = knex(config[envariment]);
