import { useEffect, useState } from "react";
import { auth, db } from "../api/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditProfile = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [nickname, setNickname] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [nicknameFocused, setNicknameFocused] = useState<boolean>(false);
  const [currentPasswordError, setCurrentPasswordError] = useState<
    string | null
  >(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [currentPasswordFocused, setCurrentPasswordFocused] =
    useState<boolean>(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState<boolean>(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "nickname":
        setNickname(value);
        break;
      case "currentPassword":
        setCurrentPassword(value);
        break;
      case "newPassword":
        setNewPassword(value);
        break;
      default:
        break;
    }
  };

  // 현재 로그인한 사용자의 정보를 가져옴
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid) {
        setUserId(user.uid);
        getUserProfile(user.uid);
      }
    });

    return unsubscribe;
  }, []);

  // 사용자 프로필 정보 가져오기
  const getUserProfile = async (uid: string) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      setEmail(userDoc.data().email);
      setNickname(userDoc.data().nickname);
    }
  };

  // 비밀번호 변경 함수
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // 기존 비밀번호 확인
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        currentPassword
      );

      console.log("signInWithEmailAndPassword result:", credential);

      if (credential.user) {
        const passwordRegex =
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
        if (!passwordRegex.test(newPassword)) {
          setNewPasswordError(
            "비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자리여야 합니다."
          );
          console.log("newPassword does not match the regex");
          return;
        }
        // 새로운 비밀번호 설정
        await updatePassword(credential.user, newPassword);
        console.log("updatePassword completed");

        // Firestore에 변경된 닉네임 업데이트
        await updateDoc(doc(db, "users", userId || ""), {
          nickname,
          password: newPassword,
        });
        console.log("updateDoc completed");

        alert("프로필이 성공적으로 업데이트되었습니다.");
        console.log("onSubmit completed successfully");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("onSubmit error:", error);
        if (error.message.includes("wrong-password")) {
          setCurrentPasswordError("현재 비밀번호가 일치하지 않습니다.");
        } else {
          setNewPasswordError("새로운 비밀번호가 안전하지 않습니다.");
        }
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center max-h-screen">
        <div className="w-full max-w-md rounded-xl bg-loginBgColor p-8 md:p-12 mt-24">
          <div className="text-3xl text-center mt-8">내 정보 수정</div>
          <form onSubmit={onSubmit}>
            <div className="mt-2 flex items-center justify-center">
              <input
                className={`w-100 h-14 pl-2 pb-2 border-l-0 border-r-0 border-t-0 border-b-2 border-white bg-loginBgColor focus:outline-none`}
                type="email"
                value={email ?? ""}
                name="email"
                disabled
                placeholder="Email"
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <input
                className={`w-100 h-14 pl-2 pb-2 border-l-0 border-r-0 border-t-0 border-b-2 ${
                  nicknameFocused ? "border-blue-500" : "border-white"
                } bg-loginBgColor focus:outline-none`}
                type="text"
                value={nickname ?? ""}
                name="nickname"
                onFocus={() => setNicknameFocused(true)}
                onBlur={() => setNicknameFocused(false)}
                onChange={onChange}
                placeholder="Nickname"
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <input
                className={`w-100 h-14 pl-2 pb-2 border-l-0 border-r-0 border-t-0 border-b-2 ${
                  currentPasswordFocused ? "border-blue-500" : "border-white"
                } bg-loginBgColor focus:outline-none`}
                type="password"
                value={currentPassword}
                name="currentPassword"
                onFocus={() => setCurrentPasswordFocused(true)}
                onBlur={() => setCurrentPasswordFocused(false)}
                onChange={onChange}
                placeholder="Current Password"
                required
              />
            </div>
            <div className="flex ml-8">
              {currentPasswordError && (
                <div className="text-red-500 text-sm mt-1">
                  {currentPasswordError}
                </div>
              )}
            </div>
            <div className="flex items-center justify-center">
              <input
                className={`w-100 h-14 pl-2 pb-2 border-l-0 border-r-0 border-t-0 border-b-2 ${
                  newPasswordFocused ? "border-blue-500" : "border-white"
                } bg-loginBgColor focus:outline-none`}
                type="password"
                value={newPassword}
                name="newPassword"
                onFocus={() => setNewPasswordFocused(true)}
                onBlur={() => setNewPasswordFocused(false)}
                onChange={onChange}
                placeholder="New Password"
                required
              />
            </div>
            <div className="flex ml-8">
              {newPasswordError && (
                <div className="text-red-500 text-sm mt-1">
                  {newPasswordError}
                </div>
              )}
            </div>
            <div className="flex items-center justify-center mt-6 mb-4">
              <button className="w-100 h-14 hover:outline-none" type="submit">
                변경하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
