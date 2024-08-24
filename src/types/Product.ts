import { Timestamp } from "firebase/firestore";

export interface Product {
  productId: string;
  sellerId: string;
  productName: string;
  productStock: number;
  productPrice: number;
  productCategory: string;
  productDescription: string;
  productOptions: string[];
  productImageUrls?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
