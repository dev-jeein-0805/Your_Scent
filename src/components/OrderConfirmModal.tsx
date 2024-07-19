import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

interface OrderConfirmModalProps {
  onCheckout: () => void; // onCheckout 함수 타입 정의
}

const OrderConfirmModal = ({ onCheckout }: OrderConfirmModalProps) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    onCheckout();
    navigate("/order");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="my-4 py-2 font-bold w-full bg-blue-200">
        &nbsp;&nbsp;결제하기&nbsp;&nbsp;
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>결제 정보를 정확히 확인하셨나요?</AlertDialogTitle>
          <AlertDialogDescription>
            아래 [결제하기]를 누르면 바로 결제창으로 넘어갑니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-200 p-2 rounded-md">
            쇼핑 계속하기
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-blue-500 p-2 rounded-md"
          >
            결제하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OrderConfirmModal;
