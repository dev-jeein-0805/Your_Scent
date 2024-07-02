import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "./firebase";
import { Product } from "../types/Product";
import { deleteObject, ref } from "firebase/storage";

// 컬렉션의 모든 문서 가져오기
export const getAllProducts = async (): Promise<Product[]> => {
  // const querySnapshot = await getDocs(collection(db, "products"));
  const productsRef = collection(db, "products");
  const q = query(productsRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

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

// 판매 상품 정보 삭제
export const deleteProduct = async (
  id: string,
  imageUrls: string[]
): Promise<void> => {
  const productRef = doc(db, "products", id);
  try {
    // Firestore에서 해당 collection 삭제
    await deleteDoc(productRef);

    // Storage에서 이미지 삭제
    for (const url of imageUrls) {
      const imageRef = ref(storage, url);
      try {
        await deleteObject(imageRef);
      } catch (error) {
        console.error("Failed to delete image from storage:", error);
      }
    }
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw error;
  }
};

// 수정하기 옵션에서 이미지 변경 시 사용
export const deleteImagesFromStorage = async (imageUrls: string[]) => {
  const deletePromises = imageUrls.map((url) => {
    const imageRef = ref(storage, url);
    return deleteObject(imageRef);
  });
  await Promise.all(deletePromises);
};
