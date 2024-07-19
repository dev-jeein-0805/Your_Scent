import { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return <div>장바구니가 비어 있습니다.</div>;
  }

  const { cart, dispatch } = cartContext;
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  // const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    setTotalAmount(calculateSelectedItemsTotal());
    const shippingCost = totalAmount >= 50000 ? 0 : 3000;
    setShippingCost(shippingCost);
    // setFinalAmount(totalAmount + shippingCost);
  }, [selectedItems, cart, totalAmount]);

  const calculateSelectedItemsTotal = () => {
    return selectedItems.reduce((total, itemId) => {
      const item = cart.find((i) => i.id === itemId);
      if (item) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const increaseQuantity = (id: string) => {
    const item = cart.find((i) => i.id === id);
    if (item && item.quantity < item.productStock) {
      dispatch({ type: "INCREASE_QUANTITY", payload: { id } });
    }
  };

  const decreaseQuantity = (id: string) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: { id } });
  };

  const handleRemove = (id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
    setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
  };

  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((item) => item.id));
    }
    setIsSelectAll(!isSelectAll);
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
    if (selectedItems.length === cart.length - 1) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  };

  const handleMoveToOrder = () => {
    // navigate("/order");
    const selectedItemsDetails = cart.filter((item) =>
      selectedItems.includes(item.id)
    );
    const totalPaymentAmount =
      totalAmount + (totalAmount > 0 ? shippingCost : 0);

    navigate("/order", {
      state: { selectedItems: selectedItemsDetails, totalPaymentAmount },
    });
  };

  return (
    <div className="w-full sm:w-130 md:w-300 mx-auto">
      <div className="text-2xl mt-4 ml-2">장바구니</div>
      <div className="flex justify-between items-center mb-4"></div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelectAll}
                    onChange={handleSelectAll}
                    className="mr-2"
                  />
                  <span>{isSelectAll ? "전체 해제" : "전체 선택"}</span>
                </label>
              </div>
            </th>
            <th className="py-2 px-4 text-center">수량</th>
            <th className="py-2 px-4 text-center">가격</th>
            <th className="py-2 px-4 text-center">총 금액</th>
            <th className="py-2 px-4 text-center">삭제</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-4 px-4 flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                  className="mr-4"
                />
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-20 h-20 mr-4"
                />
                <div>{item.title}</div>
              </td>
              <td className="py-4 px-4 text-center">
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="mr-2"
                  >
                    -
                  </button>
                  <div className="mx-2">{item.quantity}</div>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="ml-2"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="py-4 px-4 text-center">
                {item.price.toLocaleString()}원
              </td>
              <td className="py-4 px-4 text-center">
                {(item.price * item.quantity).toLocaleString()}원
              </td>
              <td className="py-4 px-4 text-center">
                <button onClick={() => handleRemove(item.id)}>
                  <RiDeleteBin5Fill />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end">
        <table className="max-w-sm my-6">
          <tbody>
            <tr>
              <th className="pl-4 py-2 text-gray-500 font-normal text-left">
                상품 총 금액
              </th>
              <td className="px-4 font-bold text-right">
                {totalAmount.toLocaleString()}원
              </td>
            </tr>
            <tr>
              <th className="px-4 pb-2 text-gray-500 font-normal text-left">
                배송비
              </th>
              <td className="px-4 font-bold text-right">
                {totalAmount > 0 ? shippingCost.toLocaleString() : "0"}원
              </td>
            </tr>
            <tr>
              <th className="px-4 pb-2 text-black font-bold text-left">
                총 결제 금액
              </th>
              <td className="px-4 font-bold text-right text-blue-600">
                {(
                  totalAmount + (totalAmount > 0 ? shippingCost : 0)
                ).toLocaleString()}
                원
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <button
          className="px-20 py-2 mx-auto rounded-md bg-blue-400"
          onClick={handleMoveToOrder}
        >
          주문하기
        </button>
      </div>
    </div>
  );
};

export default Cart;
