import { ReactNode, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import cartAtom from "./cartAtom";
import orderNameSelector from "./orderNameSelector";
import { CartItem } from "../../types/CartItem";

const useCart = () => {
  const [cart, setCart] = useRecoilState(cartAtom);
  const orderName = useRecoilValue(orderNameSelector);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const clearCart = () => {
    setCart([]);
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartItem = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const increaseQuantity = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity < item.productStock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  return {
    cart,
    setCart,
    orderName,
    clearCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    increaseQuantity,
    decreaseQuantity,
  };
};

const CartProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export { CartProvider, useCart };
