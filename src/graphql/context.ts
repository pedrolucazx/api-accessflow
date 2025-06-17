import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import { AuthenticatedUser } from '../types/users.types';

export interface Context {
  user?: AuthenticatedUser | null;
  validateAdmin: () => void;
  validateUserAccess: (userId: number) => void;
}

export async function createContext({
  req,
}: {
  req: { headers: { authorization?: string } };
}): Promise<Context> {
  let user: AuthenticatedUser | null = null;
  const authHeader = req.headers.authorization || '';

  if (authHeader) {
    try {
      const token = authHeader.replace('Bearer ', '');
      user = jwt.verify(token, process.env.JWT_SECRET!) as AuthenticatedUser;
    } catch (error) {
      console.error(error);
      throw new GraphQLError('Token inválido ou expirado.', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }
  }

  const isAdmin = () => user?.perfis?.some((p) => p.nome === 'admin');

  const validateAdmin = () => {
    if (!user) {
      throw new GraphQLError(
        'Você precisa estar logado para realizar essa ação.',
        {
          extensions: { code: 'UNAUTHENTICATED' },
        },
      );
    }

    if (!isAdmin()) {
      throw new GraphQLError(
        'Acesso negado: apenas administradores podem realizar essa ação.',
        {
          extensions: { code: 'FORBIDDEN' },
        },
      );
    }
  };

  const validateUserAccess = (userId?: number) => {
    if (!user) {
      throw new GraphQLError(
        'Você precisa estar logado para realizar essa ação.',
        {
          extensions: { code: 'UNAUTHENTICATED' },
        },
      );
    }

    if (user?.id !== userId && !isAdmin()) {
      throw new GraphQLError(
        'Acesso negado: você não tem permissão para acessar esses dados.',
        {
          extensions: { code: 'FORBIDDEN' },
        },
      );
    }
  };

  return { user, validateAdmin, validateUserAccess };
}
