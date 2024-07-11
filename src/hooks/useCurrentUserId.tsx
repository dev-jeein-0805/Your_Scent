import { useEffect, useState } from "react";
import { auth } from "../api/firebase";
import { onAuthStateChanged } from "firebase/auth";

const useCurrentUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    // 컴포넌트가 언마운트될 때 구독 해제
    return () => unsubscribe();
  }, []);

  return userId;
};

export default useCurrentUserId;
