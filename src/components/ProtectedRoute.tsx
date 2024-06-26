// 로그인 여부와 사용자 유형(판매자/일반)에 따라 접근을 제어하는 컴포넌트
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  allowedRoles?: string[];
  userRole?: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  allowedRoles,
  userRole,
  children,
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
