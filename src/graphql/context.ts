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
    }
  }

  const isAdmin = () => {
    return user?.perfis?.some((profile) => profile.nome === 'admin');
  };

  const validateAdmin = () => {
    if (!user || !isAdmin()) {
      throw new Error(
        'Acesso negado: apenas administradores podem realizar essa ação.',
      );
    }
  };

  const validateUserAccess = (userId: number) => {
    if (!user) {
      throw new Error('Usuário não autenticado.');
    }

    if (!isAdmin() && user.id !== userId) {
      throw new Error(
        'Acesso negado: você não tem permissão para acessar esses dados.',
      );
    }
  };

  return { user, validateAdmin, validateUserAccess };
}
