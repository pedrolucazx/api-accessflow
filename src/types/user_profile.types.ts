export interface UserProfileModel {
  associate: (userId: number, profileId: number) => Promise<number | undefined>;
  disassociate: (userId: number, profileId: number) => Promise<number>;
}
