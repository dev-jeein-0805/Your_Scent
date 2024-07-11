import { Timestamp } from "firebase/firestore";

export interface Order {
  orderId: string;
  sellerId: string;
  buyerId: string;
  productId: string;
  productQuantity: number;
  // status: []; // 주문 완료/발송 대기/발송 시작/주문 취소
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
