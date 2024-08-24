// 로그인 여부와 사용자 유형(판매자/구매자)에 따라 접근을 제어하는 컴포넌트
import { Navigate } from "react-router-dom";
import { useAuthState } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { user, isSeller } = useAuthState();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  console.log(isLoading);
  //  AuthContext 초기화 관여
  useEffect(() => {
    if (user !== null) {
      setIsLoading(false);
    }
  }, [user]);

  // 로그인 상태 확인
  const isAuthenticated = user !== null;

  // 사용자 역할 지정
  const userRole = isSeller ? "seller" : "consumer";

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
