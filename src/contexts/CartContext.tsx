import {
  createContext,
  useReducer,
  useEffect,
  ReactNode,
  Dispatch,
  useState,
} from "react";

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  sellerId: string;
}

type CartState = CartItem[];

interface AddToCartAction {
  type: "ADD_TO_CART";
  payload: CartItem;
}

interface RemoveFromCartAction {
  type: "REMOVE_FROM_CART";
  payload: { id: string };
}

interface UpdateCartItemAction {
  type: "UPDATE_CART_ITEM";
  payload: { id: string; quantity: number };
}

interface IncreaseQuantityAction {
  type: "INCREASE_QUANTITY";
  payload: { id: string };
}

interface DecreaseQuantityAction {
  type: "DECREASE_QUANTITY";
  payload: { id: string };
}

interface LoadCartAction {
  type: "LOAD_CART";
  payload: CartState;
}

interface ClearCartAction {
  type: "CLEAR_CART";
}

type CartAction =
  | AddToCartAction
  | RemoveFromCartAction
  | UpdateCartItemAction
  | IncreaseQuantityAction
  | DecreaseQuantityAction
  | LoadCartAction
  | ClearCartAction;

export interface CartContextType {
  cart: CartState;
  dispatch: Dispatch<CartAction>;
  totalAmount: number;
  shippingCost: number;
  finalAmount: number;
  orderName: string;
  clearCart: () => void;
}

// const CartContext = createContext<
//   { cart: CartState; dispatch: Dispatch<CartAction> } | undefined
// >(undefined);

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      return [...state, action.payload];
    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload.id);
    case "UPDATE_CART_ITEM":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    case "INCREASE_QUANTITY":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    case "DECREASE_QUANTITY":
      return state.map((item) =>
        item.id === action.payload.id && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    case "LOAD_CART":
      return action.payload;
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

const clearCart = (dispatch: Dispatch<CartAction>) => {
  dispatch({ type: "CLEAR_CART" });
};

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    const storedUser = localStorage.getItem("user");
    const localData = storedUser ? localStorage.getItem("cart") : null;
    return localData ? JSON.parse(localData) : [];
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [orderName, setOrderName] = useState("");

  // useEffect(() => {
  //   localStorage.setItem("cart", JSON.stringify(cart));
  // }, [cart]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));

    const totalAmount = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const shippingCost = totalAmount >= 50000 ? 0 : 3000;
    setTotalAmount(totalAmount);
    setShippingCost(shippingCost);
    setFinalAmount(totalAmount + shippingCost);

    const totalQuantity = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
    const firstItemTitle = cart.length > 0 ? cart[0].title : "";
    setOrderName(`${firstItemTitle} 외 총 ${totalQuantity} 개`);
  }, [cart]);

  const handleClearCart = () => clearCart(dispatch);

  return (
    <CartContext.Provider
      value={{
        cart,
        dispatch,
        totalAmount,
        shippingCost,
        finalAmount,
        orderName,
        clearCart: handleClearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export { CartContext, CartProvider };
