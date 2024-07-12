import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { CartContext, CartProvider } from "./CartContext";

export interface UserInfo {
  email: string;
  isSeller: boolean;
  nickname: string;
  // password: string;
}

// 상태 타입 정의
interface AuthState {
  email: string;
  password: string;
  user: UserInfo | null;
  isSeller: boolean;
}

// 액션 타입 정의
export type AuthAction =
  | { type: "SET_USER"; payload: UserInfo | null } // user 상태 업데이트
  | { type: "LOGOUT" }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_IS_SELLER"; payload: boolean }
  | { type: "RESET_AUTH" }; // user 상태 초기화

// 초기 상태 정의
const initialState: AuthState = {
  email: "",
  password: "",
  user: null,
  isSeller: false,
};

// 리듀서 정의
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  // console.log("Action received in reducer:", action);
  switch (action.type) {
    case "SET_USER": // 로그인 이후 user 상태 업데이트
      return {
        ...state,
        user: action.payload,
        isSeller: action.payload?.isSeller || false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isSeller: false,
      };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_IS_SELLER":
      return { ...state, isSeller: action.payload };
    case "RESET_AUTH": // 상태 초기화(로그아웃)
      return { email: "", password: "", user: null, isSeller: false }; // user 속성 초기화
    default:
      return state;
  }
};

// Context 생성
const AuthStateContext = createContext<AuthState | undefined>(undefined);
const AuthDispatchContext = createContext<
  React.Dispatch<AuthAction> | undefined
>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const cartContext = useContext(CartContext);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedCart = localStorage.getItem("cart");
    if (storedUser) {
      dispatch({ type: "SET_USER", payload: JSON.parse(storedUser) });
    }
    if (cartContext && storedCart) {
      cartContext.dispatch({
        type: "LOAD_CART",
        payload: JSON.parse(storedCart),
      });
    }
  }, [dispatch, cartContext]);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  useEffect(() => {
    if (cartContext) {
      localStorage.setItem("cart", JSON.stringify(cartContext.cart));
    }
  }, [cartContext?.cart]);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        <CartProvider>{children}</CartProvider>
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

// 커스텀 훅 생성
export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error("useAuthState must be used within a AuthContextProvider");
  }
  return context;
};

export const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useAuthDispatch must be used within a AuthContextProvider"
    );
  }
  return context;
};
