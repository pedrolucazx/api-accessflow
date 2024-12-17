export type Profile = {
  id?: number;
  nome: string;
  descricao?: string;
};

export interface ProfileModel {
  getAllProfiles(): Promise<Profile[] | undefined>;
  getProfileByParams(params: Partial<Profile>): Promise<Profile | undefined>;
  createProfile(profile: Profile): Promise<number | undefined>;
  updateProfile(
    id: number,
    profile: Partial<Profile>,
  ): Promise<number | undefined>;
  deleteProfile(id: number): Promise<number | undefined>;
}

export interface ProfileService {
  getAllProfiles(): Promise<Profile[] | undefined>;
  getProfileByParams(params: Partial<Profile>): Promise<Profile | undefined>;
  createProfile(profile: Profile): Promise<Profile | undefined>;
  updateProfile(
    id: number,
    profile: Partial<Profile>,
  ): Promise<Profile | undefined>;
  deleteProfile(id: number): Promise<string | undefined>;
}

export type argsType = {
  id: number;
  input: Profile;
  filter: Partial<Profile>;
};
