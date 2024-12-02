import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('usuarios_perfis', (table) => {
    table.increments('id').primary();
    table.integer('usuario_id').unsigned().notNullable();
    table.integer('perfil_id').unsigned().notNullable();
    table
      .foreign('usuario_id')
      .references('id')
      .inTable('usuarios')
      .onDelete('CASCADE');
    table
      .foreign('perfil_id')
      .references('id')
      .inTable('perfis')
      .onDelete('CASCADE');
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTableIfExists('usuarios_perfis');
};
