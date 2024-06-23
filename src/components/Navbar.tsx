import { Link } from "react-router-dom";
import { BsFillPencilFill } from "react-icons/bs";
import { RiFlowerFill } from "react-icons/ri";

export default function Navbar() {
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
        <Link to="/signup">Sign Up</Link>
      </nav>
    </header>
  );
}
