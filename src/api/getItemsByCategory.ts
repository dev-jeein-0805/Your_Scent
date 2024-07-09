import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { Product } from "../types/Product";
import { db } from "./firebase";

// 특정 카테고리의 상품을 가져오는 함수
export const getItemsByCategory = async (
  category: string
): Promise<Product[]> => {
  const productsRef = collection(db, "products");
  const q = query(
    productsRef,
    where("category", "==", category),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  const products: Product[] = [];

  querySnapshot.forEach((doc) => {
    products.push({
      id: doc.id,
      ...doc.data(),
      price: Number(doc.data().price),
    } as Product);
  });

  return products;
};
