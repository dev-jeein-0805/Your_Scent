import { Link } from "react-router-dom";
import { useAuthState } from "../contexts/AuthContext";

export default function MyPage() {
  const { user } = useAuthState();
  const isSeller = user ? user.isSeller : false;

  return (
    <>
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
    </>
  );
}
