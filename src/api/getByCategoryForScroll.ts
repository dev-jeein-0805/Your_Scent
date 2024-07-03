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

// Category 페이지 사용
export const getByCategoryForScroll = async (
  category: string,
  pageParam: QueryDocumentSnapshot<DocumentData> | null = null
): Promise<GetByCategoryForScrollResult> => {
  const productsRef = collection(db, "products");
  let q = query(
    productsRef,
    where("category", "==", category),
    orderBy("createdAt", "desc"),
    limit(10)
  );

  if (pageParam) {
    q = query(
      productsRef,
      where("category", "==", category),
      orderBy("createdAt", "desc"),
      startAfter(pageParam),
      limit(10)
    );
  }

  console.log("Query: ", q);
  try {
    const querySnapshot = await getDocs(q);
    console.log("QuerySnapshot: ", querySnapshot);
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
        price: Number(doc.data().price),
      } as Product);
    });

    const lastVisible =
      querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    return { products, lastVisible };
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error; // 필요시 에러를 다시 던질 수 있습니다.
  }
};
