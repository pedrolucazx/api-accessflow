export type Profile = {
  id: number;
  nome: string;
  descricao?: string;
};

export type ProfileFilter = {
  id?: number;
  nome?: string;
  descricao?: string;
};

export type ProfileInput = {
  nome: string;
  descricao?: string;
};

export interface ProfileRepository {
  getAllProfiles(): Promise<Profile[] | undefined>;
  getProfileByParams(filters: ProfileFilter): Promise<Profile | undefined>;
  createProfile(profile: ProfileInput): Promise<Profile | undefined>;
  updateProfile(
    id: number,
    profile: Partial<Profile>,
  ): Promise<Profile | undefined>;
  deleteProfile(id: number): Promise<number | undefined>;
  countProfiles(): Promise<number>;
}

export interface ProfileService {
  getAllProfiles(): Promise<Profile[] | undefined>;
  getProfileByParams(filters: ProfileFilter): Promise<Profile | undefined>;
  createProfile(profile: ProfileInput): Promise<Profile | undefined>;
  updateProfile(
    id: number,
    profile: Partial<Profile>,
  ): Promise<Profile | undefined>;
  deleteProfile(id: number): Promise<string | undefined>;
}

export type argsType = {
  id: number;
  input: ProfileInput;
  filter: ProfileFilter;
};
