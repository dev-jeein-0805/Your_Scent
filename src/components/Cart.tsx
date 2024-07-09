import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

const Cart = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return <div>장바구니가 비어 있습니다.</div>;
  }

  const { cart, dispatch } = cartContext;

  const increaseQuantity = (id: string) => {
    dispatch({ type: "INCREASE_QUANTITY", payload: { id } });
  };

  const decreaseQuantity = (id: string) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: { id } });
  };

  const handleRemove = (id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const totalAmount = calculateTotal();
  const shippingCost = totalAmount >= 50000 ? 0 : 3000;
  const finalAmount = totalAmount + shippingCost;

  return (
    <div>
      <ul className="mt-20">
        {cart.map((item) => (
          <li key={item.id} className="border mb-4 flex items-center">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-45 h-60 mr-4"
            />
            <div className="flex-grow">
              <div className="text-3xl">{item.title}</div>
              <div>{(item.price * item.quantity).toLocaleString()}원</div>
              <div className="flex items-center">
                <div>수량: {item.quantity}</div>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="ml-2"
                >
                  +
                </button>
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="ml-2"
                >
                  -
                </button>
                <button onClick={() => handleRemove(item.id)} className="ml-2">
                  삭제
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div>
        <p>상품 총액: {totalAmount.toLocaleString()}원</p>
        <p>배송비: {shippingCost.toLocaleString()}원</p>
        <p>총 합계: {finalAmount.toLocaleString()}원</p>
      </div>
      <button>결제하기</button>
    </div>
  );
};

export default Cart;
