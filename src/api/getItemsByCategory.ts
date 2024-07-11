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
    where("productCategory", "==", category),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  const products: Product[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    products.push({
      productId: doc.id, // Firestore 문서 ID를 productId로 사용
      sellerId: data.sellerId,
      productName: data.productName,
      productStock: data.productStock,
      productPrice: Number(data.productPrice),
      productCategory: data.productCategory,
      productDescription: data.productDescription,
      productOptions: data.productOptions,
      productImageUrls: data.productImageUrls,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as Product);
  });

  return products;
};
