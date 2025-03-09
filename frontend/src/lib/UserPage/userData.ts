export interface UserData {
  date_of_birth: string | null;
  phone_number: string;
  avatar: string;
  banner: string;
  user: {
      id: number;
      username: string;
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      role: 'customer' | 'admin' | 'moderator';
      user_profile_links: {
        facebook: string;
        twitter: string;
        instagram: string;  
      };
  };
}