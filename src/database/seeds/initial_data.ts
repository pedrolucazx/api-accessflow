import { Knex } from 'knex';

export const seed = async (knex: Knex): Promise<void> => {
  await knex('usuarios_perfis').del();
  await knex('usuarios').del();
  await knex('perfis').del();

  await knex('perfis').insert([
    { nome: 'admin', descricao: 'Administrador' },
    { nome: 'comum', descricao: 'Comum' },
  ]);

  await knex('usuarios').insert([
    {
      nome: 'Admin Usuário',
      email: 'admin@exemplo.com',
      senha: 'senhaAdmin',
      ativo: true,
    },
    {
      nome: 'Usuário Comum',
      email: 'usuario@exemplo.com',
      senha: 'senhaComum',
      ativo: true,
    },
  ]);

  await knex('usuarios_perfis').insert([
    { usuario_id: 1, perfil_id: 1 },
    { usuario_id: 2, perfil_id: 2 },
  ]);
};
