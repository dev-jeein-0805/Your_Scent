import { useRecoilState, useSetRecoilState } from "recoil";
import { authStateAtom, AuthStateType } from "./authAtom";

// Auth 상태를 가져오는 커스텀 훅
export const useAuthState = (): AuthStateType => {
  const authState = useRecoilState(authStateAtom)[0];
  return authState;
};

// Auth 상태를 업데이트하는 커스텀 훅
export const useSetAuthState = () => {
  const setAuthState = useSetRecoilState(authStateAtom);
  return setAuthState;
};
