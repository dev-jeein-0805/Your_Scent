import { atom } from "recoil";
import { UserInfo } from "../../types/UserInfo";

// 상태 타입 정의
export interface AuthStateType {
  email: string;
  password: string;
  user: UserInfo | null;
  isSeller: boolean;
}

// 초기 상태 정의
const initialAuthState: AuthStateType = {
  email: "",
  password: "",
  user: null,
  isSeller: false,
};

// Recoil Atom 생성
export const authStateAtom = atom<AuthStateType>({
  key: "authState",
  default: initialAuthState,
});
