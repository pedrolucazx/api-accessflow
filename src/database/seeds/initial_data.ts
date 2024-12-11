import { Knex } from 'knex';

export const seed = async (knex: Knex): Promise<void> => {
  await knex('usuarios_perfis').del();
  await knex('usuarios').del();
  await knex('perfis').del();

  await knex('perfis').insert([
    { id: 1, nome: 'admin', descricao: 'Administrador' },
    { id: 2, nome: 'comum', descricao: 'Comum' },
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
