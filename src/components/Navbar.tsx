import { Link, useNavigate } from "react-router-dom";
import { RiFlowerFill } from "react-icons/ri";
import { auth, logOut } from "../api/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../api/firebase";
import ShopperBag from "../utils/ShopperBag";
import Drawer from "./Drawer";
import { UserInfo } from "../types/UserInfo";
import cartAtom from "../recoil/cart/cartAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { authStateAtom } from "../recoil/auth/authAtom";

export default function Navbar() {
  const [authState, setAuthState] = useRecoilState(authStateAtom);
  const cart = useRecoilValue(cartAtom);
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // Firebase 인증 상태 변화를 감지하여 user 상태를 업데이트
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          // Firestore에서 사용자 데이터 가져오기
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const user: UserInfo = {
              email: firebaseUser.email || "",
              isSeller: userData.isSeller || false,
              nickname: userData.nickname || "",
            };
            // authState에 user 정보를 설정
            setAuthState((prevState) => ({
              ...prevState,
              user: user,
            }));
          }
        } else {
          // 인증되지 않은 경우 authState를 null로 설정
          setAuthState((prevState) => ({
            ...prevState,
            user: null,
          }));
        }
      }
    );

    return () => unsubscribe();
  }, [setAuthState]);

  const handleLogout = async () => {
    try {
      await logOut(navigate, setAuthState);
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="w-full max-w-6xl flex justify-between items-center border-b border-gray-300 mx-auto p-4 bg-white z-50">
      <Link to="/" className="flex items-center text-md text-brand">
        <RiFlowerFill />
        <h1 className="ml-2">Your Scent</h1>
      </Link>
      <nav className="flex items-center gap-4 font-semibold">
        {authState.user ? (
          <>
            <div className="hidden md:block">
              {authState.user.nickname} 님, 안녕하세요!
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative text-2xl bg-transparent"
            >
              <ShopperBag />
              {totalQuantity > 0 && (
                <div className="absolute -top-3 -right-3 text-white rounded-full bg-red-500 px-2 py-1 text-xs">
                  {totalQuantity}
                </div>
              )}
            </button>
            <Link to="/mypage">My Page</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
