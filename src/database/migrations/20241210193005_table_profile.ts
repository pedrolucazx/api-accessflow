import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('perfis', (table) => {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.text('descricao').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('perfis');
}
