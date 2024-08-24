import { ReactNode, useEffect } from "react";
import { useAuth } from "./useAuth"; // 위에서 만든 훅 경로에 맞게 수정

interface AuthContextProviderProps {
  children: ReactNode; // children의 타입 정의
}

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const { authState, setUser } = useAuth();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  useEffect(() => {
    if (authState.user) {
      localStorage.setItem("user", JSON.stringify(authState.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [authState.user]);

  return <>{children}</>;
};

export default AuthContextProvider;
