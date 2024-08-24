import { atom } from "recoil";
import { UserInfo } from "../../types/UserInfo";

// 상태 타입 정의
export interface AuthState {
  email: string;
  password: string;
  user: UserInfo | null;
  isSeller: boolean;
}

// 초기 상태 정의
const initialState: AuthState = {
  email: "",
  password: "",
  user: null,
  isSeller: false,
};

// Auth 상태 atom 정의
export const authStateAtom = atom<AuthState>({
  key: "authState",
  default: initialState,
});
