import { useEffect, useState } from "react";
import { auth, db } from "../api/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Order, OrderStatus } from "../types/Order";
import { Product } from "../types/Product";

interface User {
  nickname: string;
}

const SalesHistory = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [sales, setSales] = useState<
    (Order & { product: Product; buyerNickname: string })[]
  >([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.uid) {
        setUserId(user.uid);
        fetchSales(user.uid);
      }
    });
  }, []);

  const fetchSales = async (uid: string) => {
    const salesSnapshot = await getDocs(collection(db, "orders"));
    const salesData: Order[] = salesSnapshot.docs
      .map((doc) => ({ ...doc.data(), orderId: doc.id }) as Order)
      .filter((order) => order.sellerId === uid);

    const enrichedSales = await Promise.all(
      salesData.map(async (sale) => {
        const productDoc = await getDoc(doc(db, "products", sale.productId));
        const productData = productDoc.data() as Product;
        console.log("productData : ", productData);

        const buyerDoc = await getDoc(doc(db, "users", sale.buyerId));
        const buyerData = buyerDoc.data() as User;
        console.log("buyerData : ", buyerData);

        return {
          ...sale,
          product: productData,
          buyerNickname: buyerData.nickname,
        };
      })
    );

    // 판매일 최신 순으로 정렬
    enrichedSales.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

    setSales(enrichedSales);
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const orderDocRef = doc(db, "orders", orderId);
      await updateDoc(orderDocRef, { orderStatus: newStatus });

      setSales((prevSales) =>
        prevSales.map((sale) =>
          sale.orderId === orderId ? { ...sale, orderStatus: newStatus } : sale
        )
      );
    } catch (error) {
      console.error("상태 업데이트에 실패했습니다:", error);
    }
  };

  if (!userId) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <div className="w-350 mx-auto">
      <div className="text-3xl my-3">판매 내역</div>
      {sales.map((sale) => (
        <div
          className="border border-solid border-black mt-2 p-2 mx-40"
          key={sale.orderId}
        >
          <div>구매자: {sale.buyerNickname}</div>

          <div className="flex">
            <div className="flex">
              <div>
                {sale.product.productImageUrls &&
                sale.product.productImageUrls[0] ? (
                  <img
                    className="w-20"
                    src={sale.product.productImageUrls[0]}
                    alt={sale.product.productName}
                  />
                ) : (
                  <div>이미지가 없습니다</div>
                )}
              </div>
              <div className="ml-4">
                <div>상품명: {sale.product.productName}</div>
                <div>수량: {sale.orderedQuantity}</div>
                <div>
                  총 판매 금액:{" "}
                  {sale.product.productPrice * sale.orderedQuantity}원
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end ml-auto">
              <div>판매일: {sale.createdAt.toDate().toLocaleString()}</div>
              <div>판매 상태:</div>
              <select
                value={sale.orderStatus}
                onChange={(e) =>
                  updateOrderStatus(sale.orderId, e.target.value as OrderStatus)
                }
              >
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <div>판매 상태: {sale.orderStatus}</div>
              {sale.orderStatus !== OrderStatus.CANCELLED && (
                <button
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() =>
                    updateOrderStatus(sale.orderId, OrderStatus.CANCELLED)
                  }
                >
                  판매 취소하기
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalesHistory;
