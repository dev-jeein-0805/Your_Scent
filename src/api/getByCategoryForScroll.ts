import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { Product } from "../types/Product";
import { db } from "./firebase";

interface GetByCategoryForScrollResult {
  products: Product[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
}

type OrderBy = "createdAtDesc" | "createdAtAsc" | "priceAsc" | "priceDesc";

// Category 페이지 사용
export const getByCategoryForScroll = async (
  category: string,
  pageParam: QueryDocumentSnapshot<DocumentData> | null = null,
  orderByField: OrderBy = "createdAtDesc"
): Promise<GetByCategoryForScrollResult> => {
  const productsRef = collection(db, "products");

  let orderField: string;
  let orderDirection: "asc" | "desc";

  switch (orderByField) {
    case "createdAtAsc":
      orderField = "createdAt";
      orderDirection = "asc";
      break;
    case "priceAsc":
      orderField = "productPrice";
      orderDirection = "asc";
      break;
    case "priceDesc":
      orderField = "productPrice";
      orderDirection = "desc";
      break;
    case "createdAtDesc":
    default:
      orderField = "createdAt";
      orderDirection = "desc";
      break;
  }

  let q = query(
    productsRef,
    where("productCategory", "==", category),
    orderBy(orderField, orderDirection),
    limit(10)
  );

  if (pageParam) {
    q = query(
      productsRef,
      where("productCategory", "==", category),
      orderBy(orderField, orderDirection),
      startAfter(pageParam),
      limit(10)
    );
  }

  try {
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

    const lastVisible =
      querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    return { products, lastVisible };
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};
