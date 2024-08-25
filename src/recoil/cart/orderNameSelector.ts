import { selector } from "recoil";
import cartAtom from "./cartAtom";

const orderNameSelector = selector<string>({
  key: "orderNameSelector",
  get: ({ get }) => {
    const cart = get(cartAtom);
    const totalQuantity = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
    const firstItemTitle = cart.length > 0 ? cart[0].title : "";
    return `${firstItemTitle} 외 총 ${totalQuantity} 개`;
  },
});

export default orderNameSelector;
