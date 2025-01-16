import { userModel } from '../../models/user.model';
import { User } from '../../types/users.types';
import { executeQuery } from '../../utils/executeQuery';

jest.setTimeout(50000);
jest.mock('../../utils/executeQuery');

describe('Profile Model Unit Tests', () => {
  const mockedExecuteQuery = executeQuery as jest.Mock;
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all profiles successfully', async () => {
    const mockUsers: User[] = [
      {
        id: 1,
        nome: 'Admin Usuário',
        email: 'admin@exemplo.com',
        ativo: true,
        data_criacao: '2025-01-16T02:54:02.311Z',
        data_update: '2025-01-16T02:54:02.311',
        senha: 'senhaAdmin',
      },
      {
        id: 2,
        nome: 'Usuário Comum',
        email: 'usuario@exemplo.com',
        ativo: true,
        data_criacao: '2025-01-16T02:54:02.311Z',
        data_update: '2025-01-16T02:54:02.311',
        senha: 'senhaComum',
      },
    ];

    mockedExecuteQuery.mockResolvedValueOnce(mockUsers);

    expect(await userModel.getAllUsers()).toEqual(mockUsers);
    expect(executeQuery).toHaveBeenCalledTimes(1);
  });
});
