import {
  createContext,
  useReducer,
  useEffect,
  ReactNode,
  Dispatch,
} from "react";

interface CartItem {
  id: string;
  imageUrl: string;
  title: string;
  price: number;
  quantity: number;
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

type CartAction =
  | AddToCartAction
  | RemoveFromCartAction
  | UpdateCartItemAction
  | IncreaseQuantityAction
  | DecreaseQuantityAction
  | LoadCartAction;

const CartContext = createContext<
  { cart: CartState; dispatch: Dispatch<CartAction> } | undefined
>(undefined);

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
    default:
      return state;
  }
};

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    const storedUser = localStorage.getItem("user");
    const localData = storedUser ? localStorage.getItem("cart") : null;
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
export { CartContext, CartProvider };
