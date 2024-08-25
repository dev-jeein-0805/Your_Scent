import { atom } from "recoil";
import { CartItem } from "../../types/CartItem";

type CartState = CartItem[];

const cartAtom = atom<CartState>({
  key: "cartAtom",
  default: JSON.parse(localStorage.getItem("cart") || "[]"),
});

export default cartAtom;
