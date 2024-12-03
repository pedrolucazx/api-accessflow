export type Profile = {
  id?: number;
  nome: string;
  descricao?: string;
};

export interface ProfileMethods {
  getAllProfiles(): Promise<Profile[]>;
  getProfileByParams(params: Partial<Profile>): Promise<Profile>;
  createProfile(profile: Profile): Promise<number[]>;
  updateProfile(id: number, profile: Partial<Profile>): Promise<number>;
  deleteProfile(id: number): Promise<number>;
}
