import React, { useContext, useState } from "react";
import { CartContext, CartContextType } from "../contexts/CartContext";
import { db } from "../api/firebase";
import { doc, increment, runTransaction } from "firebase/firestore";

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

const Order = () => {
  const cartContext = useContext<CartContextType | undefined>(CartContext);

  if (!cartContext) {
    return <div>장바구니가 비어 있습니다.</div>;
  }

  const { cart, finalAmount, orderName } = cartContext;

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
        cart.forEach((item) => {
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
      amount: finalAmount, // 결제금액
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
      alert("결제 성공");
    } else {
      alert(`결제 실패: ${error_msg}`);
      // 결제가 실패하면 재고 복구
      try {
        await runTransaction(db, async (transaction) => {
          cart.forEach((item) => {
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
    <div>
      <h2>결제 페이지</h2>
      <form>
        <div>
          <label>이름:</label>
          <input
            type="text"
            name="name"
            value={buyerInfo.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>연락처:</label>
          <input
            type="text"
            name="phone"
            value={buyerInfo.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>이메일:</label>
          <input
            type="email"
            name="email"
            value={buyerInfo.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>주소:</label>
          <input
            type="text"
            name="address"
            value={buyerInfo.address}
            onChange={handleInputChange}
          />
        </div>
      </form>
      <button onClick={handleCheckout}>결제하기</button>
    </div>
  );
};

export default Order;
