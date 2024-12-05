# Projeto de Gerenciamento de Usuários e Perfis

Este projeto é uma API de gerenciamento de usuários e perfis com GraphQL, construída utilizando **Node.js**, **TypeScript**, **Apollo Server**, **Knex**, e **PostgreSQL**. A aplicação oferece operações de CRUD (criar, ler, atualizar e excluir) para usuários e perfis, com suporte a associações entre eles.

## ⚙️ Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Apollo Server**: Framework para criação de servidores GraphQL.
- **Knex.js**: Query builder para interação com o banco de dados.
- **PostgreSQL**: Banco de dados relacional utilizado.
- **Docker**: Configuração do ambiente de banco de dados.
- **ESLint** e **Prettier**: Qualidade e formatação do código.
- **Husky**, **Commitizen**, **lint-staged** e **commitlint**: Boas práticas para controle de versões.
- **Jest** e **Supertest**: Ferramentas para testes automatizados.

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)
![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Knex.js](https://img.shields.io/badge/Knex.js-orange?style=for-the-badge&logo=data:image/svg+xml;base64,<base64-da-imagem>&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black)
![Husky](https://img.shields.io/badge/Husky-%23454A64.svg?style=for-the-badge&logo=husky&logoColor=white)
![Commitizen](https://img.shields.io/badge/Commitizen-%23FE6B37.svg?style=for-the-badge&logo=commitizen&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-%23C21325.svg?style=for-the-badge&logo=jest&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-%23007ACC.svg?style=for-the-badge&logo=testing-library&logoColor=white)

## 🛠️ Funcionalidades

### **CRUD de Perfis**

- **Criar**: Adicionar novos perfis com nome e descrição.
- **Editar**: Modificar informações de perfis existentes.
- **Listar**: Buscar todos os perfis ou um específico.
- **Excluir**: Remover perfis da base de dados.

### **CRUD de Usuários**

- **Criar**: Adicionar usuários com nome, email, senha e status de ativo.
- **Editar**: Alterar informações de usuários.
- **Listar**: Buscar todos os usuários ou um específico.
- **Excluir**: Remover usuários da base de dados.

### **Relacionamento Usuários-Perfis**

- Utilização da tabela intermediária `usuarios_perfis` para associar usuários a múltiplos perfis.

---

## 🚀 Instruções de Execução

### **Configuração do Ambiente**

1. Clone o repositório:

   ```bash
   git clone https://github.com/pedrolucazx/auth-graphql.git
   cd auth-graphql
   ```

2. Instale as dependências:

   ```bash
   yarn install
   ```

3. Configure as variáveis de ambiente:

   - Crie um arquivo `.env` a partir do exemplo `.env.example` e ajuste as configurações necessárias.

4. Suba o banco de dados no ambiente de desenvolvimento:

   ```bash
   yarn docker:dev
   ```

5. Execute as migrations e seeds:

   ```bash
   yarn knex migrate:latest
   yarn knex seed:run
   ```

6. Inicie o servidor:

   ```bash
   yarn start:dev
   ```

---

## 🎨 Contribuição e Commits

### **Fluxo de Commit**

Este projeto utiliza **Husky**, **Commitizen**, **lint-staged**, e **commitlint** para padronizar os commits e melhorar a qualidade do código.

1. **Pré-requisitos**:

   - Ao criar um commit, o Husky garante que:
     - O código passe por linters configurados com **lint-staged**.
     - A mensagem de commit esteja no formato correto, validada pelo **commitlint**.

2. **Criação de Commits com Commitizen**:

   - Use o comando a seguir para criar commits de forma interativa:
     ```bash
     yarn commit
     ```
   - Escolha o tipo de mudança, adicione uma descrição curta e outros detalhes.

3. **Formato de Mensagem de Commit**:
   A mensagem segue o padrão **Conventional Commits**, como:

   ```
   feat: adiciona funcionalidade de associação de usuários a perfis
   fix: corrige validação de email ao criar usuários
   ```

4. **Validação Antes do Commit**:
   - Antes de concluir o commit, o Husky roda scripts configurados em **lint-staged**, como:
     - Checagem de lint com **ESLint**.
     - Formatação automática com **Prettier**.
   - Apenas arquivos aprovados serão adicionados ao commit.
