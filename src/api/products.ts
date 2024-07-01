import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Product } from "../types/Product";

// 컬렉션의 모든 문서 가져오기
export const getAllProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as Product; // 명시적으로 Product 타입으로 변환
    return { ...data, id: doc.id };
  });
};

// 판매 상품 정보 수정
export const updateProduct = async (
  id: string,
  productData: Partial<Product>
): Promise<void> => {
  const productRef = doc(db, "products", id);
  try {
    await updateDoc(productRef, productData);
  } catch (error) {
    console.error("Failed to update product:", error);
    throw error;
  }
};
