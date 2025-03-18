import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants";

interface AuthValues {
  username: string;
  email?: string;
  password: string;
  first_name?: string;
  last_name?: string;
  passwordConfirm?: string;
  role?: string;
}

const useAuthMutation = (
  isLogin: boolean,
  navigate: (path: string) => void,
  openConfirmation: (config: {
    title: string;
    description: string;
    cancelLabel: string;
    actionLabel: string;
    onAction: () => void;
    onCancel: () => void;
  }) => void,
) => {
  return useMutation({
    mutationFn: (values: AuthValues) => authApi.loginOrRegister(values, isLogin),
    onSuccess: (res) => {
      if (isLogin) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
        openConfirmation({
          title: "Login Successful!",
          description: "Redirecting to homepage...",
          cancelLabel: "Go immediately!",
          actionLabel: "Delete",
          onAction: () => {},
          onCancel: () => {},
        });
      } else {
        navigate("/login");
      }
    },
    onError: () => {
      openConfirmation({
        title: "Login Failed",
        description: "Incorrect username or password",
        cancelLabel: "Cancel",
        actionLabel: "Go to Home",
        onAction: () => {
          navigate("/");
        },
        onCancel: () => {},
      });
    },
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (refreshToken: string) => authApi.refreshToken(refreshToken),
    onSuccess: (res) => {
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
    },
    onError: () => {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      window.location.href = "/login";
    },
  });
};

export default useAuthMutation;
