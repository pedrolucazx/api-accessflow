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

  const token = req.headers.authorization || '';

  if (token) {
    try {
      const actualToken = token.replace('Bearer ', '');
      user = jwt.verify(
        actualToken,
        process.env.JWT_SECRET!,
      ) as AuthenticatedUser;
    } catch (error) {
      console.error(error);
      throw new GraphQLError('Token inválido ou expirado', {
        extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
      });
    }
  }

  const isAdmin = () => {
    return user?.perfis?.some((profile) => profile.nome === 'admin');
  };

  const validateAdmin = () => {
    if (!user || !isAdmin()) {
      throw new GraphQLError(
        'Acesso negado: apenas administradores podem realizar essa ação.',
        {
          extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
        },
      );
    }
  };

  const validateUserAccess = (userId: number) => {
    if (!isAdmin() && user?.id !== userId) {
      throw new GraphQLError(
        'Acesso negado: você não tem permissão para acessar esses dados.',
        {
          extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
        },
      );
    }
  };

  return { user, validateAdmin, validateUserAccess };
}
