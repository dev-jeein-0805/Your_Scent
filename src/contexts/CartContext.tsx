// import { ReactNode, useEffect } from "react";
// import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
// import { CartItem } from "../types/CartItem";

// type CartState = CartItem[];

// const cartAtom = atom<CartState>({
//   key: "cartAtom",
//   default: JSON.parse(localStorage.getItem("cart") || "[]"),
// });

// const orderNameSelector = selector<string>({
//   key: "orderNameSelector",
//   get: ({ get }) => {
//     const cart = get(cartAtom);
//     const totalQuantity = cart.reduce(
//       (total, item) => total + item.quantity,
//       0
//     );
//     const firstItemTitle = cart.length > 0 ? cart[0].title : "";
//     return `${firstItemTitle} 외 총 ${totalQuantity} 개`;
//   },
// });

// const useCart = () => {
//   const [cart, setCart] = useRecoilState(cartAtom);
//   const orderName = useRecoilValue(orderNameSelector);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   const clearCart = () => {
//     setCart([]);
//   };

//   const addToCart = (item: CartItem) => {
//     setCart((prev) => [...prev, item]);
//   };

//   const removeFromCart = (id: string) => {
//     setCart((prev) => prev.filter((item) => item.id !== id));
//   };

//   const updateCartItem = (id: string, quantity: number) => {
//     setCart((prev) =>
//       prev.map((item) => (item.id === id ? { ...item, quantity } : item))
//     );
//   };

//   const increaseQuantity = (id: string) => {
//     setCart((prev) =>
//       prev.map((item) =>
//         item.id === id && item.quantity < item.productStock
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       )
//     );
//   };

//   const decreaseQuantity = (id: string) => {
//     setCart((prev) =>
//       prev.map((item) =>
//         item.id === id && item.quantity > 1
//           ? { ...item, quantity: item.quantity - 1 }
//           : item
//       )
//     );
//   };

//   return {
//     cart,
//     setCart,
//     orderName,
//     clearCart,
//     addToCart,
//     removeFromCart,
//     updateCartItem,
//     increaseQuantity,
//     decreaseQuantity,
//   };
// };

// const CartProvider = ({ children }: { children: ReactNode }) => {
//   return <>{children}</>;
// };

// export { CartProvider, useCart };
