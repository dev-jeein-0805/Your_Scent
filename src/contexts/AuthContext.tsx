// import { ReactNode, useEffect } from "react";
// import { CartProvider, useCart } from "./CartContext";
// import { UserInfo } from "../types/UserInfo";
// import { atom, useRecoilState, useSetRecoilState } from "recoil";

// // 상태 타입 정의
// interface AuthState {
//   email: string;
//   password: string;
//   user: UserInfo | null;
//   isSeller: boolean;
// }

// // 초기 상태 정의
// const initialAuthState: AuthState = {
//   email: "",
//   password: "",
//   user: null,
//   isSeller: false,
// };

// // Recoil Atom 생성
// export const authStateAtom = atom<AuthState>({
//   key: "authState",
//   default: initialAuthState,
// });

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [authState, setAuthState] = useRecoilState(authStateAtom);
//   const { setCart } = useCart();

//   // 로컬 스토리지에서 사용자 정보 로드
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedCart = localStorage.getItem("cart");

//     if (storedUser) {
//       setAuthState((prevState) => ({
//         ...prevState,
//         user: JSON.parse(storedUser),
//         isSeller: JSON.parse(storedUser)?.isSeller || false,
//       }));
//     }

//     if (storedCart) {
//       setCart(JSON.parse(storedCart));
//     }
//   }, [setAuthState, setCart]);

//   // 사용자 정보가 변경될 때 로컬 스토리지 업데이트
//   useEffect(() => {
//     setLocalStorage("user", authState.user);
//   }, [authState.user]);

//   const setLocalStorage = (key: any, value: any) => {
//     if (value) {
//       localStorage.setItem(key, JSON.stringify(value));
//     } else {
//       localStorage.removeItem(key);
//     }
//   };

//   return <CartProvider>{children}</CartProvider>;
// };

// // Auth 상태를 가져오는 커스텀 훅
// export const useAuthState = () => {
//   const authState = useRecoilState(authStateAtom)[0];
//   return authState;
// };

// // Auth 상태를 업데이트하는 커스텀 훅
// export const useSetAuthState = () => {
//   const setAuthState = useSetRecoilState(authStateAtom);
//   return setAuthState;
// };
