import { Timestamp } from "firebase/firestore";

// 데이터 타입 정의
export interface Product {
  id: string;
  title: string;
  amount: number;
  price: number;
  category: string;
  description: string;
  options: string[];
  imageUrls?: string[];
  createdAt: Timestamp;
}
