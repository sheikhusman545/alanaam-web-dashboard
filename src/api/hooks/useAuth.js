import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, logout } from "@/store/authSlice";

const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const setLogIn = (userDetails, JWT_Token) => {
    dispatch(login({ userDetails, jwtToken: JWT_Token }));
  };

  const setLogOut = () => {
    dispatch(logout());
  };

  return { user, isAuthenticated, setLogIn, setLogOut };
};

export default useAuth;
