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

const OrderConfirmModal = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/order");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>결제하기</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 바로 결제하시겠어요?</AlertDialogTitle>
          <AlertDialogDescription>
            (내용 추가할 게 있을까?)
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>쇼핑 계속하기</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            결제하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OrderConfirmModal;
