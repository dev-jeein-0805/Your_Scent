import { ReactNode, useEffect } from "react";
import { useRecoilState } from "recoil";
import { authStateAtom } from "./authAtom";
import { CartProvider, useCart } from "../cart/CartProvider";

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useRecoilState(authStateAtom);
  const { setCart } = useCart();

  // 로컬 스토리지에서 사용자 정보 로드
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedCart = localStorage.getItem("cart");

    if (storedUser) {
      setAuthState((prevState) => ({
        ...prevState,
        user: JSON.parse(storedUser),
        isSeller: JSON.parse(storedUser)?.isSeller || false,
      }));
    }

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, [setAuthState, setCart]);

  // 사용자 정보가 변경될 때 로컬 스토리지 업데이트
  useEffect(() => {
    setLocalStorage("user", authState.user);
  }, [authState.user]);

  const setLocalStorage = (key: any, value: any) => {
    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  };

  return <CartProvider>{children}</CartProvider>;
};
