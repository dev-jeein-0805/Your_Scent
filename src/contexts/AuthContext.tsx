import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { User } from "firebase/auth";

// 상태 타입 정의
interface AuthState {
  email: string;
  password: string;
  user: User | null;
}

// 액션 타입 정의
export type AuthAction =
  | { type: "SET_USER" | "LOGOUT"; payload: User | null }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string };

// 초기 상태 정의
const initialState: AuthState = {
  email: "",
  password: "",
  user: null,
};

// 리듀서 정의
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload || null,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    // case "SET_EMAIL":
    //   return { ...state, email: action.payload };
    // case "SET_PASSWORD":
    //   return { ...state, password: action.payload };
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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch({ type: "SET_USER", payload: JSON.parse(storedUser) });
    }
  }, []);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
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
