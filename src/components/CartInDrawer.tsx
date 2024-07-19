import { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const CartInDrawer = ({ onClose }: { onClose: () => void }) => {
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
  const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    setTotalAmount(calculateSelectedItemsTotal());
    const shippingCost = totalAmount >= 50000 ? 0 : 3000;
    setShippingCost(shippingCost);
    setFinalAmount(totalAmount + shippingCost);
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

  const handleMoveToCart = () => {
    onClose(); // Close the drawer
    navigate("/mypage/cart");
  };

  return (
    <div className="w-full mx-auto">
      <div className="text-2xl mt-4 ml-2">장바구니</div>
      <div className="flex justify-between items-center mb-4"></div>
      <div className="space-y-2">
        <div className="bg-gray-200 rounded-xs pl-4 flex justify-between items-center">
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
        </div>
        {cart.map((item) => (
          <div
            key={item.id}
            className="border rounded-md p-4 flex justify-between items-center"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => handleSelectItem(item.id)}
                className="mr-4"
              />
              <div className="flex items-center">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-20 h-20 mr-4"
                />
                <div>{item.title}</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center justify-center mr-4">
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
              <div className="mr-4">
                {(item.price * item.quantity).toLocaleString()}원
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <RiDeleteBin5Fill />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <table className="max-w-sm my-6">
          <tbody>
            <tr>
              <th className="px-4 py-2 text-gray-500 font-normal text-left">
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
              <td className="px-4 font-bold text-right text-blue-700">
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
          className="w-full px-4 py-2 rounded-md bg-blue-400"
          onClick={handleMoveToCart}
        >
          장바구니 보기
        </button>
      </div>
    </div>
  );
};

export default CartInDrawer;
