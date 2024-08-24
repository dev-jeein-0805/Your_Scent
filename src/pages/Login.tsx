import { signIn } from "../api/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState, useAuthDispatch } from "../contexts/AuthContext";
import { useState } from "react";

const Login = () => {
  const { email, password } = useAuthState();
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "email") {
      dispatch({ type: "SET_EMAIL", payload: value });
    } else if (name === "password") {
      dispatch({ type: "SET_PASSWORD", payload: value });
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const { user, isSeller, errorMessage } = await signIn(
        email,
        password,
        dispatch,
        navigate
      );
      if (user) {
        dispatch({ type: "SET_USER", payload: { email, isSeller } });
        alert("로그인 성공! 메인페이지로 이동합니다.");
        window.location.reload();
      } else if (errorMessage) {
        setErrorMessage(errorMessage);
      }
    } catch (error) {
      // 로그인 실패 시 아무 작업도 하지 않음
    }
  };

  return (
    <>
      <div className="flex items-center justify-center max-h-screen">
        <div className="w-full max-w-md rounded-xl bg-loginBgColor p-8 md:p-12 mt-24">
          <div className="text-3xl text-center mt-8 pb-2">로그인</div>
          <form onSubmit={onSubmit}>
            <div className="mt-2 p-2 flex items-center justify-center">
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
                placeholder="아이디(이메일)를 입력해 주세요."
                required
              />
            </div>
            <div className="px-2 pt-2 flex items-center justify-center">
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
                placeholder="영문+숫자+특수문자 조합 8~16자리를 입력해 주세요."
                required
              />
            </div>
            <div className="flex ml-8">
              {errorMessage && (
                <div className="text-red-500 text-sm mt-1">{errorMessage}</div>
              )}
            </div>
            <div className="flex items-center justify-center mt-5">
              <button className="w-100 h-14 hover:outline-none" type="submit">
                로그인
              </button>
            </div>
            <div className="flex items-center justify-center mt-3">
              <button className="w-100 h-14 hover:outline-none">
                구글 계정으로 로그인
              </button>
            </div>
            <div className="flex items-center justify-center mt-8">
              <div className="mr-5">아직 회원이 아니신가요?</div>
              <Link to="/signup">회원가입</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
