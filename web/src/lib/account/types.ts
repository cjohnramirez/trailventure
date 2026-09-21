/** Account shapes from the API (api/apps/accounts/serializers.py). */

import type { Role } from "@/lib/auth/session";

export type Profile = {
  phone: string;
  date_of_birth: string | null;
  bio: string;
  avatar: string;
  banner: string;
  avatar_url: string;
  banner_url: string;
  facebook_url: string;
  x_url: string;
  instagram_url: string;
};

export type Account = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  role: Role;
  email_verified: boolean;
  date_joined: string;
  profile: Profile;
};

export type ProfilePatch = {
  first_name?: string;
  last_name?: string;
  profile?: Partial<
    Pick<Profile, "phone" | "date_of_birth" | "bio" | "facebook_url" | "x_url" | "instagram_url">
  >;
};

export type PhotoKind = "avatar" | "banner";

export type UploadSignature = {
  public_id: string;
  timestamp: number;
  overwrite: string;
  invalidate: string;
  signature: string;
  api_key: string;
  cloud_name: string;
  upload_url: string;
};
