import { useRecoilState } from "recoil";
import { UserInfo } from "../../types/UserInfo";
import { AuthState, authStateAtom } from "./authAtoms";

const initialState: AuthState = {
  email: "",
  password: "",
  user: null,
  isSeller: false,
};

export const useAuth = () => {
  const [authState, setAuthState] = useRecoilState(authStateAtom);

  const setUser = (user: UserInfo | null) => {
    setAuthState((prev) => ({
      ...prev,
      user,
      isSeller: user?.isSeller || false,
    }));
  };

  const logout = () => {
    setAuthState(initialState);
  };

  const setEmail = (email: string) => {
    setAuthState((prev) => ({ ...prev, email }));
  };

  const setPassword = (password: string) => {
    setAuthState((prev) => ({ ...prev, password }));
  };

  const setIsSeller = (isSeller: boolean) => {
    setAuthState((prev) => ({ ...prev, isSeller }));
  };

  return {
    authState,
    setUser,
    logout,
    setEmail,
    setPassword,
    setIsSeller,
  };
};
