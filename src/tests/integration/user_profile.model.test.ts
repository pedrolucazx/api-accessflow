import { userProfileModel } from '@/models/user_profile.model';

describe('User Profile Model Integration Tests', () => {
  it('should associate the profile with the user successfully', async () => {
    expect(await userProfileModel.associate(1, 2)).toBeDefined();
  });

  it('should disassociate the profile with the user successfully', async () => {
    expect(await userProfileModel.disassociate(1, 2)).toBeDefined();
  });
});
