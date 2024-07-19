import { useState } from "react";
import { join } from "../api/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthDispatch } from "../contexts/AuthContext";

const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [isSeller, setIsSeller] = useState<boolean>(false);
  const [nicknameFocused, setNicknameFocused] = useState<boolean>(false);
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] =
    useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();

  const onChange = (event: any) => {
    const {
      target: { name, value },
    } = event;
    if (name === "nickname") {
      setNickname(value);
    }
    if (name === "email") {
      setEmail(value);
      validateEmail(value);
    }
    if (name === "password") {
      setPassword(value);
      validatePassword(value);
    }
    if (name === "confirmPassword") {
      setConfirmPassword(value);
      validateConfirmPassword(value);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      setEmailError("이메일 형식이 올바르지 않습니다.");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자리여야 합니다."
      );
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleCheckboxChange = (event: any) => {
    setIsSeller(event.target.checked);
    dispatch({ type: "SET_IS_SELLER", payload: event.target.checked });
  };

  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (emailError || passwordError || confirmPasswordError) {
      return;
    }
    await join(nickname, email, password, isSeller, navigate);
  };

  return (
    <div className="flex items-center justify-center max-h-screen">
      <div className="w-full max-w-md rounded-xl bg-loginBgColor p-8 md:p-12 mt-24">
        <div className="text-3xl text-center mt-8">회원가입</div>
        <form onSubmit={onSubmit}>
          <div className="mt-2 flex items-center justify-center">
            <input
              className={`w-100 h-14 pl-2 pb-2 border-l-0 border-r-0 border-t-0 border-b-2 ${
                nicknameFocused ? "border-blue-500" : "border-white"
              } bg-loginBgColor focus:outline-none`}
              type="text"
              value={nickname}
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
                emailFocused ? "border-blue-500" : "border-white"
              } bg-loginBgColor focus:outline-none`}
              type="email"
              value={email}
              name="email"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              onChange={onChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="flex ml-8">
            {emailError && (
              <div className="text-red-500 text-sm mt-1">{emailError}</div>
            )}
          </div>

          <div className="flex items-center justify-center">
            <input
              className={`w-100 h-14 pl-2 pb-2 border-l-0 border-r-0 border-t-0 border-b-2 ${
                passwordFocused ? "border-blue-500" : "border-white"
              } bg-loginBgColor focus:outline-none`}
              type="password"
              value={password}
              name="password"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              onChange={onChange}
              placeholder="Password"
              required
            />
          </div>
          <div className="flex ml-8">
            {passwordError && (
              <div className="text-red-500 text-sm mt-1">{passwordError}</div>
            )}
          </div>
          <div className="flex items-center justify-center">
            <input
              className={`w-100 h-14 pl-2 pb-2 border-l-0 border-r-0 border-t-0 border-b-2 ${
                confirmPasswordFocused ? "border-blue-500" : "border-white"
              } bg-loginBgColor focus:outline-none`}
              type="password"
              value={confirmPassword}
              name="confirmPassword"
              onFocus={() => setConfirmPasswordFocused(true)}
              onBlur={() => setConfirmPasswordFocused(false)}
              onChange={onChange}
              placeholder="Reconfirm password"
              required
            />
          </div>
          <div className="flex ml-8">
            {confirmPasswordError && (
              <div className="text-red-500 text-sm mt-1">
                {confirmPasswordError}
              </div>
            )}
          </div>
          <div
            className="flex items-center justify-center mt-6 mb-2"
            onChange={handleCheckboxChange}
          >
            <input
              type="checkbox"
              id="isSeller"
              name="isSeller"
              checked={isSeller}
              className="w-5 h-5 mr-2"
              readOnly
            />
            <label htmlFor="isSeller" className="cursor-pointer">
              판매자 계정
            </label>
          </div>
          <div className="flex items-center justify-center mt-6 mb-4">
            <button className="w-100 h-14 hover:outline-none" type="submit">
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

// 회원가입 전체 박스 크기조절 안됨
// button 에 마우스 hover 될 때 outline-none 적용이 안됨
