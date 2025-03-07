export interface UserData {
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    user_profile_links: {
      facebook: string;
      twitter: string;
      instagram: string;
    };
  };

  date_of_birth: string;
  phone_number: string;
  avatar: string;
  banner: string;
}