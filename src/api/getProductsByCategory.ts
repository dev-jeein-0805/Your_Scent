// api/getProductsByCategory.ts
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Product } from "../types/Product";
import { db } from "./firebase";

export const getProductsByCategory = async () => {
  const productsRef = collection(db, "products");
  const q = query(productsRef, orderBy("createdAt", "desc"));
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
