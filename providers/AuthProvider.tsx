import { useRouter } from "expo-router";
import { useAuthStore } from "../store/auth";
import { PropsWithChildren, useEffect } from "react";
import { APP_ROUTES, AUTH_ROUTES, LOADER_ROUTES } from "../constants/routes";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const { status, checkToken } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      checkToken();

      console.log({ status });

      if (status === "authenticated") {
        router.replace(APP_ROUTES.home);
      } else if (status === "unauthenticated") {
        router.replace(AUTH_ROUTES.login);
      } else {
        router.replace(LOADER_ROUTES.loader);
      }
    };

    checkAuth();
  }, [status]);

  return <>{children}</>;
};
