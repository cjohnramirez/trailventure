import api from '@/api/api';

interface AuthValues {
  username: string;
  email?: string;
  password: string;
  first_name?: string;
  last_name?: string;
  passwordConfirm?: string;
  role?: string;
}

export const authApi = {
  loginOrRegister: async (values: AuthValues, isLogin: boolean) => {
    if (!isLogin && "passwordConfirm" in values) {
      const { passwordConfirm, ...filteredValues } = values;
      filteredValues.role = "customer";
      values = { ...filteredValues };
    }
    return api.post(
      isLogin ? "/apps/token/" : "/register",
      isLogin ? { username: values.username, password: values.password } : values
    );
  },

  refreshToken: async (refreshToken: string) => {
    return api.post("/apps/token/refresh/", { refresh: refreshToken });
  },
};
