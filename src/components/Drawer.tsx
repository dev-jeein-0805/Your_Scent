import { useEffect, useRef } from "react";
import CartInDrawer from "./CartInDrawer";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const Drawer = ({ isOpen, onClose }: DrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const handleClickOutside = (event: MouseEvent) => {
        if (
          drawerRef.current &&
          !drawerRef.current.contains(event.target as Node)
        ) {
          onClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "auto";
      };
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen, onClose]);

  return (
    <>
      <div
        ref={drawerRef}
        className={`fixed inset-y-0 right-0 w-130 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}
      >
        <div className="relative h-full p-4">
          <button onClick={onClose} className="absolute top-6 right-4">
            Close
          </button>
          <h2 className="absolute top-8 left-6 text-2xl font-semibold">
            장바구니
          </h2>

          <CartInDrawer onClose={onClose} />
        </div>
      </div>
    </>
  );
};

export default Drawer;
