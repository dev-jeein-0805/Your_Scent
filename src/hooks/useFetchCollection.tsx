// import {
//   collection,
//   DocumentData,
//   onSnapshot,
//   orderBy,
//   query,
//   QuerySnapshot,
//   Timestamp,
// } from "firebase/firestore";
// import { useCallback, useEffect, useState } from "react";
// import { db } from "../api/firebase";

// // 데이터 타입 정의
// interface Product {
//   id: string;
//   title: string;
//   amount: number;
//   price: number;
//   category: string;
//   description: string;
//   options: string[];
//   imageUrls?: string[];
//   createdAt: Timestamp;
// }

// const useFetchCollection = (collectionName: string) => {
//   const [data, setData] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const getCollection = useCallback(() => {
//     setIsLoading(true);
//     try {
//       // 1. DB 컬렉션에서 데이터 가져오기
//       const docRef = collection(db, collectionName);
//       // 2. 내림차순(desc) 으로 정렬
//       const q = query(docRef, orderBy("createdAt", "desc"));
//       // 3. onSnapshot() => 컬렉션 모든 데이터 정보 불러오기
//       onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
//         const allData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as Product[];

//         setData(allData);
//         setIsLoading(false);
//       });
//     } catch (error) {
//       setIsLoading(false);
//       console.error(error);
//     }
//   }, [collectionName]);

//   useEffect(() => {
//     getCollection();
//   }, [getCollection]);

//   return { data, isLoading };
// };
// export default useFetchCollection;
