// import { collection, doc, getDoc, getDocs } from "firebase/firestore";
// import { Product } from "../types/Product";
// import { db } from "../api/firebase";

// // 예시로 Firebase Firestore에서 데이터를 가져오는 함수
// export const fetchProducts = async (): Promise<Product[]> => {
//   const productsCollection = collection(db, "products");
//   const querySnapshot = await getDocs(productsCollection);
//   return querySnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//     createdAt: doc.data().createdAt.toDate(),
//   })) as Product[];
// };

// export const fetchProductById = async (id: string): Promise<Product> => {
//   const productDocRef = doc(db, "products", id);
//   const productDoc = await getDoc(productDocRef);
//   if (!productDoc.exists()) {
//     throw new Error("Product not found");
//   }
//   return {
//     id: productDoc.id,
//     ...productDoc.data(),
//     createdAt: productDoc.data().createdAt.toDate(),
//   } as Product;
// };
