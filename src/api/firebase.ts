import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { UserInfo } from "../types/UserInfo";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_APP_FIREBASE_DB_URL,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore 초기화 코드
export const storage = getStorage(app);

// 회원가입
export const join = async (
  nickname: string,
  email: string,
  password: string,
  isSeller: boolean,
  navigate: Function
) => {
  if (!email || !password || !nickname) {
    alert("이름과 이메일, 비밀번호를 필수로 입력해 주세요.");
    return;
  }

  try {
    console.log("회원가입 시도 중..."); // 디버깅 로그 추가
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = credential.user;
    console.log("Firebase에 회원가입 성공:", user); // 디버깅 로그 추가

    // Firestore에 사용자 데이터 저장
    await setDoc(doc(db, "users", user.uid), {
      userId: user.uid,
      email: user.email,
      password,
      isSeller,
      nickname,
      createdAt: Timestamp.now().toDate(),
      updatedAt: Timestamp.now().toDate(),
    });
    console.log("Firestore에 사용자 정보 저장 성공"); // 디버깅 로그 추가

    // 저장이 성공하면 성공 alert를 사용자에게 보여준다.
    alert("회원가입에 성공하셨습니다.");

    // 자동 로그인 후 메인 페이지로 이동
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });
  } catch (error) {
    console.error(error);
    console.error("회원가입 중 오류 발생:", error); // 디버깅 로그 추가
    const firebaseError = error as FirebaseError; // 타입 단언
    switch (firebaseError.code) {
      case "auth/invalid-email":
        alert("이메일을 바르게 입력해주세요.");
        break;
      case "auth/weak-password":
        alert("비밀번호가 너무 쉬워요.");
        break;
      case "auth/email-already-in-use":
        alert("등록된 이메일 입니다.");
        break;
      default:
        alert("회원가입 실패");
        break;
    }
  }
};

// 로그인
export const signIn = async (
  email: string,
  password: string,
  navigate: Function,
  setAuthState: Function
) => {
  if (!email || !password) {
    alert("이메일 또는 비밀번호를 모두 입력해 주세요.");
    return {
      user: null,
      isSeller: false,
    };
  }

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    // 유저정보 가져오기
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    let isSeller = false;
    if (docSnap.exists()) {
      isSeller = docSnap.data().isSeller;
      const userInfo = docSnap.data() as UserInfo;

      // Recoil 상태 업데이트
      setAuthState((prevState: any) => ({
        ...prevState,
        user: userInfo,
        isSeller,
      }));

      // 메인페이지 이동
      navigate("/");
    } else {
      console.log("No such document!");
    }

    return { user, isSeller };
  } catch (error) {
    console.error("로그인 에러:", error);
    return {
      user: null,
      isSeller: false,
      errorMessage: "이메일과 비밀번호를 다시 확인해 주세요.",
    };
  }
};

// 로그아웃
export const logOut = async (navigate: Function, setAuthState: Function) => {
  try {
    await signOut(auth);

    // Recoil 상태 초기화
    setAuthState((prevState: any) => ({
      ...prevState,
      user: null,
      isSeller: false,
    })); // 사용자 정보 초기화

    // 로컬 스토리지에서 사용자 정보 제거
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    navigate("/");
    alert("로그아웃 되었습니다. 메인 페이지로 이동합니다.");
  } catch (error) {
    alert("로그아웃 실패");
  }
};
