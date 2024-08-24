import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Product } from "../types/Product";
import { db } from "./firebase";

// Home 페이지 사용 (함수명 변경할 것 - 내용이 카테고리별 정렬x)
export const getProductsByCategory = async () => {
  const productsRef = collection(db, "products");
  const q = query(productsRef, orderBy("createdAt", "desc"));
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
