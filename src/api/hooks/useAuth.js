import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, logout } from "@/store/authSlice";
import { useRouter } from "next/router";

const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const setLogIn = (userDetails, JWT_Token) => {
    dispatch(login({ userDetails, jwtToken: JWT_Token }));
  };

  const setLogOut = () => {
    dispatch(logout());
    // Redirect to login page after logout
    router.push("/auth/login");
  };

  return { user, isAuthenticated, setLogIn, setLogOut };
};

export default useAuth;
