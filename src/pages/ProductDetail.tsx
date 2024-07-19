import { useLocation, useNavigate } from "react-router-dom";
import { Product } from "../types/Product";
import { useState, useEffect, useContext } from "react";
import { getItemsByCategory } from "../api/getItemsByCategory";
import { CartContext } from "../contexts/CartContext";
import { auth } from "../api/firebase";
import { onAuthStateChanged } from "firebase/auth";

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product as Product;
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const cartContext = useContext(CartContext);
  const [userId, setUserId] = useState<string | null>(null);

  // 장바구니에 현재 상품이 담겨 있는지 확인
  const isInCart = cartContext?.cart?.some(
    (item) => item.id === product.productId
  );

  useEffect(() => {
    // 현재 로그인한 사용자의 정보를 가져옴
    onAuthStateChanged(auth, (user) => {
      if (user && user.uid) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    if (product) {
      getItemsByCategory(product.productCategory).then((products) => {
        setRecommendedProducts(
          products.filter((p) => p.productId !== product.productId)
        );
      });
    }
  }, [product]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % recommendedProducts.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [recommendedProducts]);

  if (!product) {
    return <div>Product not found</div>;
  }

  const displayedProducts = recommendedProducts.slice(
    currentIndex,
    currentIndex + 4
  );

  const handleAddToCart = async () => {
    if (userId) {
      // 로그인한 사용자인 경우
      if (cartContext?.dispatch) {
        cartContext.dispatch({
          type: "ADD_TO_CART",
          payload: {
            id: product.productId,
            title: product.productName,
            price: product.productPrice,
            quantity,
            imageUrl: product.productImageUrls
              ? product.productImageUrls[0]
              : "",
            sellerId: product.sellerId,
            productStock: product.productStock,
          },
        });
      }
    } else {
      // 로그인하지 않은 사용자인 경우
      navigate("/login");
    }
  };

  const handleGoToCart = () => {
    navigate("/mypage/cart");
  };

  const handleProductClick = (recommendedProduct: Product) => {
    navigate(`/products/${product.productId}`, {
      state: { product: recommendedProduct },
    });
    window.scrollTo(0, 0); // 페이지 이동 후 스크롤을 상단으로 이동
  };

  return (
    <>
      <section className="w-350 mx-auto flex flex-col md:flex-row p-4 justify-center mt-10 mb-4">
        {product.productImageUrls && product.productImageUrls.length > 0 && (
          <div className="w-full px-4 basis-4/12">
            <img
              className="w-80"
              src={product.productImageUrls[0]}
              alt={product.productName}
            />
            {/* <div className="grid grid-cols-3 gap-2 mt-4">
              {product.productImageUrls.slice(1).map((url, index) => (
                <img
                  className="w-full"
                  key={index}
                  src={url}
                  alt={`${product.productName} ${index + 1}`}
                />
              ))}
            </div> */}
          </div>
        )}
        <div className="w-full basis-5/12 flex flex-col p-4">
          <h1 className="text-3xl font-bold py-2">{product.productName}</h1>
          <p className="mt-2 text-gray-600">{product.productDescription}</p>
          <p className="text-2xl font-bold py-2 border-gray-400">
            ₩{product.productPrice.toLocaleString()}
          </p>
          <p className="mt-4 text-gray-700">{product.productCategory}</p>
          <p className="mt-2 text-gray-600">재고: {product.productStock}</p>
          <p className="mt-2 text-gray-600">
            수량:
            <button
              onClick={() => setQuantity(quantity - 1)}
              disabled={quantity === 1}
            >
              -
            </button>
            {quantity}
            <button
              onClick={() => setQuantity(quantity + 1)}
              disabled={quantity >= product.productStock} // 수량 버튼 비활성화 조건 추가
            >
              +
            </button>
          </p>
          {product.productStock <= 0 ? (
            <button className="mt-4 text-red-700" disabled>
              Sold Out
            </button>
          ) : isInCart ? (
            <button className="mt-4" onClick={handleGoToCart}>
              장바구니 보기
            </button>
          ) : (
            <button className="mt-4" onClick={handleAddToCart}>
              {userId ? "장바구니 담기" : "로그인 후 장바구니 담기"}
            </button>
          )}
        </div>
      </section>
      <section className="p-4 mt-0 w-350 mx-auto">
        <h2 className="text-2xl font-bold py-2">추천상품</h2>
        <div className="flex flex-wrap">
          {displayedProducts.map((recommendedProduct, index) => (
            <div
              key={index}
              className="border w-full sm:w-1/2 lg:w-1/4 p-4 cursor-pointer"
              onClick={() => handleProductClick(recommendedProduct)}
            >
              <img
                className="w-full"
                src={
                  recommendedProduct.productImageUrls &&
                  recommendedProduct.productImageUrls[0]
                }
                alt={recommendedProduct.productName}
              />
              <h3 className="text-xl font-bold mt-2">
                {recommendedProduct.productName}
              </h3>
              <p className="text-gray-600">
                {recommendedProduct.productCategory}
              </p>
              <p className="text-2xl font-bold">
                ₩{recommendedProduct.productPrice.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
