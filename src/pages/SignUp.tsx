import { useState } from "react";
import { join } from "../api/firebase";

const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const onChange = (event: any) => {
    const {
      target: { name, value },
    } = event;
    if (name === "username") {
      setUsername(value);
    }
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event: any) => {
    event.preventDefault();
    await join(username, email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-90 h-80 rounded-xl bg-loginColor">
        <div className="text-2xl text-center pt-4 pb-2">회원가입</div>
        <form onSubmit={onSubmit}>
          <div className="p-2">
            <input
              className="w-80 h-8 pl-2 pb-2 border-b-2 border-white-500 bg-loginColor focus:outline-none focus:border-red-500"
              type="text"
              value={username}
              name="username"
              onChange={onChange}
              placeholder="Name"
              required
            />
          </div>
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
          <div className="p-2">
            <input
              className="w-80 h-8 pl-2 pb-2 border-b-2 border-white-500 bg-loginColor focus:outline-none focus:border-red-500"
              type="password"
              placeholder="Reconfirm password"
            />
          </div>
          <div className="flex items-center justify-center mt-2">
            <button className="hover:outline-none" type="submit">
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
