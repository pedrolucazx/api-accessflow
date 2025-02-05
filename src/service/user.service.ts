import { userRepository } from '../repositories/user.repository';
import { User } from '../types/users.types';

export const userService = {
  getAllUsers: async (): Promise<Omit<User, 'senha'>[] | undefined> => {
    try {
      const users = await userRepository.getAllUsers();
      if (!users?.length) throw new Error('No users found');
      return users?.map(({ senha, ...user }) => user);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  },
};
