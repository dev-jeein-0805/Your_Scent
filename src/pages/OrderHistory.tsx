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

const OrderHistory = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<
    (Order & { product: Product; sellerNickname: string })[]
  >([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.uid) {
        setUserId(user.uid);
        fetchOrders(user.uid);
      }
    });
  }, []);

  const fetchOrders = async (uid: string) => {
    const ordersSnapshot = await getDocs(collection(db, "orders"));
    const ordersData: Order[] = ordersSnapshot.docs
      .map((doc) => ({ ...doc.data(), orderId: doc.id }) as Order)
      .filter((order) => order.buyerId === uid);

    const enrichedOrders = await Promise.all(
      ordersData.map(async (order) => {
        const productDoc = await getDoc(doc(db, "products", order.productId));
        const productData = productDoc.data() as Product;

        const sellerDoc = await getDoc(doc(db, "users", order.sellerId));
        const sellerData = sellerDoc.data() as User;

        return {
          ...order,
          product: productData,
          sellerNickname: sellerData.nickname,
        };
      })
    );

    // 주문일 최신 순으로 정렬
    enrichedOrders.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

    setOrders(enrichedOrders);
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const orderDocRef = doc(db, "orders", orderId);
      await updateDoc(orderDocRef, { orderStatus: "주문 취소" });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? { ...order, orderStatus: OrderStatus.CANCELLED }
            : order
        )
      );
    } catch (error) {
      console.error("주문 취소에 실패했습니다:", error);
    }
  };

  if (!userId) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <div>
      <h2>구매 내역</h2>
      {orders.map((order) => (
        <div
          className="border border-solid border-black mt-2 p-2 mx-40"
          key={order.orderId}
        >
          <div>판매자: {order.sellerNickname}</div>

          <div className="flex">
            <div className="flex">
              <div>
                {order.product.productImageUrls &&
                order.product.productImageUrls[0] ? (
                  <img
                    className="w-20"
                    src={order.product.productImageUrls[0]}
                    alt={order.product.productName}
                  />
                ) : (
                  <div>이미지가 없습니다</div>
                )}
              </div>
              <div className="ml-4">
                <div>상품명: {order.product.productName}</div>
                <div>수량: {order.orderedQuantity}</div>
                <div>
                  총 결제 금액:{" "}
                  {order.product.productPrice * order.orderedQuantity}원
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end ml-auto">
              <div>주문일: {order.createdAt.toDate().toLocaleString()}</div>
              <div>주문 상태: {order.orderStatus}</div>
              {order.orderStatus !== "주문 취소" && (
                <button
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => cancelOrder(order.orderId)}
                >
                  주문 취소하기
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
