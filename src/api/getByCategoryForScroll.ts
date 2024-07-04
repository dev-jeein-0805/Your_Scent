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
      orderField = "price";
      orderDirection = "asc";
      break;
    case "priceDesc":
      orderField = "price";
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
    where("category", "==", category),
    orderBy(orderField, orderDirection),
    limit(10)
  );

  if (pageParam) {
    q = query(
      productsRef,
      where("category", "==", category),
      orderBy(orderField, orderDirection),
      startAfter(pageParam),
      limit(10)
    );
  }

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
    throw error;
  }
};
