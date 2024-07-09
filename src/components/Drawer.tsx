import { useEffect } from "react";
import Cart from "./Cart";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const Drawer = ({ isOpen, onClose }: DrawerProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-y-0 right-0 w-130 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}
      >
        <div className="relative p-4">
          <button onClick={onClose} className="absolute top-6 right-4">
            Close
          </button>
          <h2 className="absolute top-8 left-6 text-2xl font-semibold">
            장바구니
          </h2>
          <Cart />
        </div>
      </div>
    </>
  );
};

export default Drawer;
