import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuthState } from "../contexts/AuthContext";

export default function MyPage() {
  const { user } = useAuthState();
  const isSeller = user ? user.isSeller : false;
  const location = useLocation();

  // MyPage의 기본 경로인지 확인
  const isBasePath = location.pathname === "/mypage";

  return (
    <>
      {isBasePath && (
        <div className="flex flex-col">
          <Link to="editProfile">내 정보 수정</Link>
          <Link to="orderHistory">구매 내역</Link>
          <Link to="cart">장바구니</Link>
          {isSeller ? (
            <>
              <Link to="products/new">판매 상품 등록/수정</Link>
              <Link to="products">판매 중인 상품 리스트</Link>
            </>
          ) : null}
        </div>
      )}
      <Outlet /> {/* 자식 라우트가 렌더링될 위치 */}
    </>
  );
}
