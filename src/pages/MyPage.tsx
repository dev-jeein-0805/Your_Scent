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
        <div className="w-300 mx-auto my-8 flex flex-col gap-4 text-3xl">
          <Link to="editProfile">내 정보 수정</Link>
          <Link to="orderHistory">구매 내역</Link>
          <Link to="cart">장바구니</Link>
          {isSeller ? (
            <>
              <Link to="products/new">판매 상품 등록하기</Link>
              <Link to="products">판매 등록된 상품 리스트(수정/삭제)</Link>
              <Link to="products/salesHistory">판매 상품 상세 내역</Link>
            </>
          ) : null}
        </div>
      )}
      <Outlet /> {/* 자식 라우트가 렌더링될 위치 */}
    </>
  );
}
