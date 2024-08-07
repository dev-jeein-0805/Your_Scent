import { Link, useNavigate } from "react-router-dom";
import { RiFlowerFill } from "react-icons/ri";
import { auth, logOut } from "../api/firebase";
import {
  // getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { useState, useEffect, useContext } from "react";
import { useAuthDispatch, useAuthState } from "../contexts/AuthContext";
import { UserInfo } from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../api/firebase";
import ShopperBag from "../utils/ShopperBag";
import Drawer from "./Drawer";
import { CartContext } from "../contexts/CartContext";

export default function Navbar() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [isSeller, setIsSeller] = useState<boolean>(false);
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAuthDispatch();
  const authState = useAuthState();
  const cartContext = useContext(CartContext);

  // Firebase 인증 상태 변화를 감지하여 user 상태를 업데이트
  useEffect(() => {
    // const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Firestore에서 사용자 데이터 가져오기
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsSeller(userData.isSeller);
          setNickname(userData.nickname);

          const user: UserInfo = {
            email: firebaseUser.email || "",
            isSeller: userData.isSeller,
            nickname: userData.nickname,
          };
          dispatch({ type: "SET_USER", payload: user }); // authState.user를 업데이트
        }
      } else {
        setUser(null);
        setIsSeller(false);
        setNickname(null);
        dispatch({ type: "LOGOUT" }); // authState.user를 null로 업데이트
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await logOut(dispatch, navigate);
    } catch (error) {
      console.error("Logout error: ", error, user, isSeller);
    }
  };

  if (!cartContext) {
    throw new Error("CartContext를 찾을 수 없습니다.");
  }

  const { cart } = cartContext;

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="w-350 flex justify-between border-b border-gray-300 mx-auto p-2">
      <Link to="/" className="flex items-center text-1xl text-brand">
        <RiFlowerFill />
        <h1>Your Scent</h1>
      </Link>
      <nav className="flex items-center gap-4 font-semibold">
        {authState.user ? (
          <>
            <div>{nickname} 님, 안녕하세요!</div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-10 h-12 relative text-2xl bg-transparent"
            >
              <ShopperBag />
              {totalQuantity > 0 && (
                <div className="absolute top-0.5 right-0.5 text-white rounded-full bg-red-500 px-2 py-1 text-xs">
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
