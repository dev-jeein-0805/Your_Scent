import { Timestamp } from "firebase/firestore";

export enum OrderStatus {
  COMPLETED = "주문 완료",
  PENDING = "발송 대기",
  SHIPPED = "발송 시작",
  CANCELLED = "주문 취소",
}

export interface Order {
  orderId: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  orderedQuantity: number;
  orderStatus: OrderStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
