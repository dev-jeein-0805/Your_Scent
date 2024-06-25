import { Link, useNavigate } from "react-router-dom";
import { BsFillPencilFill } from "react-icons/bs";
import { RiFlowerFill } from "react-icons/ri";
import { logOut } from "../api/firebase";
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { useAuthDispatch, useAuthState } from "../contexts/AuthContext";
import { UserInfo } from "../contexts/AuthContext";

export default function Navbar() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const navigate = useNavigate();
  const dispatch = useAuthDispatch();
  const authState = useAuthState();

  console.log(user);

  // Firebase 인증 상태 변화를 감지하여 user 상태를 업데이트
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const user: UserInfo = { email: firebaseUser.email || "" };
        dispatch({ type: "SET_USER", payload: user }); // authState.user를 업데이트
      } else {
        setUser(null);
        dispatch({ type: "LOGOUT" }); // authState.user를 null로 업데이트
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  console.log(authState.user); // 로그인 상태 확인

  const handleLogout = async () => {
    try {
      await logOut(dispatch, navigate);
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  return (
    <header className="flex justify-between border-b border-gray-300 p-2">
      <Link to="/" className="flex items-center text-1xl text-brand">
        <RiFlowerFill />
        <h1>Your Scent</h1>
      </Link>
      <nav className="flex items-center gap-4 font-semibold">
        <Link to="/products">Products</Link>
        <Link to="/carts">Carts</Link>
        <Link to="/products/new" className="text-2xl">
          <BsFillPencilFill />
        </Link>
        {authState.user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}
