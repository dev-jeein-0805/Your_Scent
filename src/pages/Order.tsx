import React, { useContext, useEffect, useState } from "react";
import { CartContext, CartContextType } from "../contexts/CartContext";
import { auth, db } from "../api/firebase";
import {
  collection,
  doc,
  increment,
  runTransaction,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import OrderConfirmModal from "../components/OrderConfirmModal";

// window 객체에 IMP를 추가
declare global {
  interface Window {
    IMP: any;
  }
}

// response 타입 정의
interface IResponse {
  success: boolean;
  merchant_uid: string;
  error_msg: string;
}

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  sellerId: string;
  productStock: number;
}

const Order = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems, totalPaymentAmount } = location.state || {
    selectedItems: [],
    totalPaymentAmount: 0,
  };

  // 현재 로그인한 사용자의 정보를 가져옴
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.uid) {
        setUserId(user.uid);
      }
    });
  }, []);

  const cartContext = useContext<CartContextType | undefined>(CartContext);

  if (!cartContext) {
    return <div>장바구니가 비어 있습니다.</div>;
  }

  const { cart, orderName, clearCart } = cartContext;

  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBuyerInfo({
      ...buyerInfo,
      [name]: value,
    });
  };

  const handleCheckout = async () => {
    try {
      await runTransaction(db, async (transaction) => {
        selectedItems.forEach((item: CartItem) => {
          const productRef = doc(db, "products", item.id);
          transaction.update(productRef, {
            productStock: increment(-item.quantity),
          });
        });
      });

      console.log("상품 재고가 성공적으로 업데이트되었습니다.");

      // 결제 로직 호출
      onClickPayment();
    } catch (error) {
      console.error("상품 재고 업데이트 중 오류가 발생했습니다: ", error);
    }
  };

  const onClickPayment = () => {
    const { IMP } = window;
    IMP.init(import.meta.env.VITE_APP_PORTONE_IMP);

    const data = {
      pg: "kcp.T0000", // PG사
      pay_method: "card", // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      // amount: finalAmount, // 결제금액
      amount: totalPaymentAmount, // 테스트용
      name: orderName, // 주문명
      buyer_name: buyerInfo.name, // 구매자 이름
      buyer_tel: buyerInfo.phone, // 구매자 전화번호
      buyer_email: buyerInfo.email, // 구매자 이메일
      buyer_addr: buyerInfo.address, // 구매자 주소
    };

    IMP.request_pay(data, callback);
  };

  const callback = async (response: IResponse) => {
    const { success, merchant_uid, error_msg } = response;

    if (success) {
      try {
        // Firestore에 주문 정보 추가
        const ordersCollection = collection(db, "orders");

        await Promise.all(
          selectedItems.map(async (item: CartItem) => {
            const orderDocRef = doc(ordersCollection); // 문서 참조를 먼저 생성합니다.
            const orderId = orderDocRef.id; // 문서 ID를 가져옵니다.

            await setDoc(orderDocRef, {
              orderId,
              buyerId: userId,
              sellerId: item.sellerId,
              productId: item.id,
              orderedQuantity: item.quantity,
              orderStatus: "주문 완료",
              createdAt: Timestamp.now().toDate(),
              updatedAt: Timestamp.now().toDate(),
            });
          })
        );

        // 장바구니 비우기
        clearCart();
        alert("결제 성공! 메인페이지도 이동합니다.");
        navigate("/");
      } catch (error) {
        console.error("주문 정보 저장 중 오류가 발생했습니다: ", error);
        alert("주문 정보 저장 중 오류가 발생했습니다.");
      }
    } else {
      alert(`결제 실패: ${error_msg}`);
      // 결제가 실패하면 재고 복구
      try {
        await runTransaction(db, async (transaction) => {
          selectedItems.forEach((item: CartItem) => {
            const productRef = doc(db, "products", item.id);
            transaction.update(productRef, {
              productStock: increment(item.quantity),
            });
          });
        });
        console.log("상품 재고가 성공적으로 복구되었습니다.");
      } catch (error) {
        console.error("상품 재고 복구 중 오류가 발생했습니다: ", error);
      }
    }
  };

  return (
    <>
      <div className="w-200 mx-auto">
        <div className="text-2xl pt-10 pb-2">배송지 정보</div>
        <form>
          <table className="w-full">
            <tbody>
              <tr>
                <th className="border bg-gray-200 p-2 text-left w-1/4">
                  받는 분
                </th>
                <td className="border border-gray-400 p-2 w-3/4">
                  <input
                    type="text"
                    name="name"
                    value={buyerInfo.name}
                    onChange={handleInputChange}
                    className="border border-gray-400 p-2 w-50 rounded-md"
                  />
                </td>
              </tr>
              <tr>
                <th className="bg-gray-200 p-2 text-left w-1/4">연락처</th>
                <td className="border border-gray-400 p-2 w-3/4">
                  <input
                    type="text"
                    name="phone"
                    value={buyerInfo.phone}
                    onChange={handleInputChange}
                    className="border border-gray-400 p-2 w-50 rounded-md"
                  />
                </td>
              </tr>
              <tr>
                <th className="bg-gray-200 p-2 text-left w-1/4">이메일</th>
                <td className="border border-gray-400 p-2 w-3/4">
                  <input
                    type="email"
                    name="email"
                    value={buyerInfo.email}
                    onChange={handleInputChange}
                    className="border border-gray-400 p-2 w-60 rounded-md"
                  />
                </td>
              </tr>
              <tr>
                <th className="bg-gray-200 p-2 text-left w-1/4">주소</th>
                <td className="border border-gray-400 p-2 w-3/4">
                  <input
                    type="text"
                    name="address"
                    value={buyerInfo.address}
                    onChange={handleInputChange}
                    className="border border-gray-400 p-2 w-50 rounded-md"
                  />
                  <input
                    type="text"
                    name="address"
                    value={buyerInfo.address}
                    onChange={handleInputChange}
                    className="border border-gray-400 p-2 w-full rounded-md"
                  />
                  <input
                    type="text"
                    name="address"
                    value={buyerInfo.address}
                    onChange={handleInputChange}
                    className="border border-gray-400 p-2 w-full rounded-md"
                  />
                </td>
              </tr>
              <tr>
                <th className="bg-gray-200 p-2 text-left w-1/4">
                  최종 결제 금액
                </th>
                <td className="border border-gray-400 p-2 w-3/4">
                  <span>{totalPaymentAmount.toLocaleString()}원</span>
                  <span className="text-red-600">
                    &nbsp;(50,000원 미만 배송비 3,000원 추가)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <div className="flex items-center justify-center">
          <OrderConfirmModal onCheckout={handleCheckout} />
        </div>
      </div>

      <div className="w-200 mx-auto text-2xl pt-10 pb-2">주문 정보</div>
      <table className="w-200 mx-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">
              <div className="pl-2 flex items-center">상품</div>
            </th>
            <th className="py-2 px-4 text-center">수량</th>
            <th className="py-2 px-4 text-center">가격</th>
            <th className="py-2 px-4 text-center">총 금액</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.map((item: CartItem) => (
            <tr key={item.id} className="border-b">
              <td className="py-4 px-4 flex items-center">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-20 h-20 mr-4"
                />
                <div>{item.title}</div>
              </td>
              <td className="py-4 px-4 text-center">
                <div className="flex items-center justify-center">
                  <div className="mx-2">{item.quantity}</div>
                </div>
              </td>
              <td className="py-4 px-4 text-center">
                {item.price.toLocaleString()}원
              </td>
              <td className="py-4 px-4 text-center">
                {(item.price * item.quantity).toLocaleString()}원
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Order;
