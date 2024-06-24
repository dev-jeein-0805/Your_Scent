import { signIn } from "../api/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState, useAuthDispatch } from "../contexts/AuthContext";

const Login = () => {
  const { email, password } = useAuthState();
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();

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
    await signIn(email, password, dispatch, navigate);
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-90 h-80 rounded-xl bg-loginColor">
          <div className="text-2xl text-center pt-4 pb-2">로그인</div>
          <form onSubmit={onSubmit}>
            <div className="p-2">
              <input
                className="w-80 h-8 pl-2 pb-2 border-b-2 border-white-500 bg-loginColor focus:outline-none focus:border-red-500"
                type="email"
                value={email}
                name="email"
                onChange={onChange}
                placeholder="Email"
                required
              />
            </div>
            <div className="p-2">
              <input
                className="w-80 h-8 pl-2 pb-2 border-b-2 border-white-500 bg-loginColor focus:outline-none focus:border-red-500"
                type="password"
                value={password}
                name="password"
                onChange={onChange}
                placeholder="Password"
                required
              />
            </div>
            <div className="flex items-center justify-center mt-2">
              <button className="hover:outline-none" type="submit">
                로그인
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
