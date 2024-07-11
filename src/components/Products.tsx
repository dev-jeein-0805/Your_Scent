import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../api/products";
import { Product } from "../types/Product";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../api/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Products = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const [userId, setUserId] = useState<string | null>(null);

  // 현재 로그인한 사용자의 정보를 가져옴
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.uid) {
        setUserId(user.uid);
      }
    });
  }, []);

  const navigate = useNavigate();

  const handleProductClick = (product: Product) => {
    navigate(`/mypage/products/edit/${product.productId}`, {
      state: { product },
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // userId와 sellerId가 일치하는 제품만 필터링
  const filteredProducts = data?.filter(
    (product: Product) => product.sellerId === userId
  );

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg-grid-cols-4 gap-4 p-4">
      {filteredProducts && filteredProducts.length > 0 ? (
        filteredProducts.map((product: Product) => (
          <li
            className="rounded-lg shadow-md overflow-hidden cursor-pointer"
            key={product.productId}
            onClick={() => handleProductClick(product)}
          >
            {product.productImageUrls &&
              product.productImageUrls.length > 0 && (
                <img
                  className="w-full"
                  src={product.productImageUrls[0]}
                  alt={product.productName}
                />
              )}
            <div className="mt-2 px-2 text-lg flex justify-between items-center">
              <h3 className="truncate">{product.productName}</h3>
              <p>{`₩${product.productPrice.toLocaleString()}`}</p>
            </div>
            <p className="mb-2 px-2 text-gray-600">{product.productCategory}</p>
          </li>
        ))
      ) : (
        <div>No products found</div>
      )}
    </ul>
  );
};

export default Products;
