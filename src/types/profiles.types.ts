export type Profile = {
  id?: number;
  nome: string;
  descricao?: string;
};

export interface ProfileModel {
  getAllProfiles(): Promise<Profile[]>;
  getProfileByParams(params: Partial<Profile>): Promise<Profile>;
  createProfile(profile: Profile): Promise<number[]>;
  updateProfile(id: number, profile: Partial<Profile>): Promise<number>;
  deleteProfile(id: number): Promise<number>;
}

export interface ProfileService {
  getAllProfiles: () => Promise<Profile[]>;
  getProfileByParams: (params: Partial<Profile>) => Promise<Profile>;
  createProfile: (profile: Profile) => Promise<Profile>;
  updateProfile: (id: number, profile: Partial<Profile>) => Promise<Profile>;
  deleteProfile: (id: number) => Promise<string>;
}

export type argsType = {
  id: number;
  input: Profile;
  filter: Partial<Profile>;
};
