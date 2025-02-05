import { userProfileModel } from '@/repositories/user_profile.repository';

describe('User Profile Model Integration Tests', () => {
  it('should associate the profile with the user successfully', async () => {
    expect(await userProfileModel.associate(1, 2)).toBeDefined();
  });

  it('should disassociate the profile with the user successfully', async () => {
    expect(await userProfileModel.disassociate(1, 2)).toBeDefined();
  });
});
