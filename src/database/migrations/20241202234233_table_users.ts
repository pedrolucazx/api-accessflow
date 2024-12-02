import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('usuarios', (table) => {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('email').notNullable().unique();
    table.string('senha').notNullable();
    table.boolean('ativo').defaultTo(true);
    table.timestamp('data_criacao').defaultTo(knex.fn.now());
    table.timestamp('data_update').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('usuarios');
}
