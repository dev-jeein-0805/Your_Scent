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
  // collection,
  doc,
  setDoc,
  getDoc,
  Timestamp,
  // collection,
  // getDocs,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Dispatch } from "react";
import { AuthAction } from "../contexts/AuthContext";
import { UserInfo } from "../contexts/AuthContext";

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
// const USER_COLLECTION = collection(db, "users");
export const storage = getStorage(app);

// console.log("app", app);

// 회원가입
export const join = async (
  username: string,
  email: string,
  password: string,
  isSeller: boolean,
  navigate: Function
) => {
  if (!email || !password || !username) {
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
      email: user.email,
      isSeller,
      username,
      createdAt: Timestamp.now().toDate(),
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
  dispatch: Dispatch<AuthAction>,
  navigate: Function
) => {
  if (!email || !password) {
    alert("이메일 또는 비밀번호를 모두 입력해 주세요.");
    return;
  }

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    // 유저정보 가져오기

    // 'users'라는 db에 있는 user.uid에 해당되는 문서를 찾고
    const docRef = doc(db, "users", user.uid);
    // 찾은 문서를 가지고 온다.
    const docSnap = await getDoc(docRef);
    // 문서가 존재하는지 확인
    if (docSnap.exists()) {
      dispatch({ type: "SET_USER", payload: docSnap.data() as UserInfo }); // 타입 캐스팅
    } else {
      console.log("No such document!");
    }

    // 메인페이지 이동
    navigate("/");
  } catch (error) {
    alert("이메일, 비밀번호를 다시 확인해 주세요.");
  }
};

// 로그아웃
export const logOut = async (
  dispatch: Dispatch<AuthAction>,
  navigate: Function
) => {
  try {
    await signOut(auth);
    dispatch({ type: "SET_USER", payload: null });
    dispatch({ type: "SET_EMAIL", payload: "" }); // 이메일 상태 초기화
    dispatch({ type: "SET_PASSWORD", payload: "" }); // 비밀번호 상태 초기화
    localStorage.removeItem("user"); // 로컬 스토리지에서 사용자 정보 제거
    navigate("/");
    alert("로그아웃 되었습니다. 메인 페이지로 이동합니다.");
  } catch (error) {
    alert("로그아웃 실패");
  }
};
