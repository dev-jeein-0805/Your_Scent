import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getProductsByCategory } from "../api/getProductsByCategory";
import { Product } from "../types/Product";
import { useNavigate } from "react-router-dom";
import banner from "../utils/banner.webp";
import Skeleton from "react-loading-skeleton";

const Home = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["productsByCategory"],
    queryFn: getProductsByCategory,
  });

  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);

  const handleProductClick = (product: Product) => {
    navigate(`/products/${product.productId}`, { state: { product } });
  };

  const handleViewMoreClick = (category: string) => {
    navigate(`/products/category/${category}`);
  };

  const fixedCategories = [
    "Spray type",
    "Oil type",
    "Balm type",
    "Textile perfume",
  ];

  const groupByCategory = (products: Product[]) => {
    const grouped: Record<string, Product[]> = {};

    fixedCategories.forEach((category) => {
      grouped[category] = [];
    });

    products.forEach((product) => {
      if (grouped[product.productCategory]) {
        grouped[product.productCategory].push(product);
      }
    });

    return grouped;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (data) {
          // 각 카테고리의 제품 수를 기준으로 마지막 4개 남았을 때 처음으로 돌아가도록 설정
          const maxIndex = Math.max(
            ...fixedCategories.map(
              (category) =>
                data.filter((product) => product.productCategory === category)
                  .length - 4
            )
          );
          return prevIndex + 1 > maxIndex ? 0 : prevIndex + 1;
        }
        return prevIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="mt-10 flex items-center justify-center">
          <Skeleton height={200} width={350} />
        </div>
        {fixedCategories.map((category) => (
          <div key={category}>
            <h2 className="ml-4 mt-5 mb-2 text-xl font-semibold flex justify-between items-center">
              <Skeleton width={100} />
              <Skeleton width={70} />
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <li
                  key={index}
                  className="rounded-lg shadow-md overflow-hidden"
                >
                  <Skeleton height={150} />
                  <div className="mt-2 px-2 text-lg flex justify-between items-center">
                    <Skeleton width={100} />
                    <Skeleton width={50} />
                  </div>
                  <p className="mb-2 px-2 text-gray-600">
                    <Skeleton width={80} />
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  if (error) return <div>Error: {error.message}</div>;

  const groupedProducts = data ? groupByCategory(data) : {};

  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  return (
    <>
      <div className="mt-10 flex items-center justify-center">
        <img className="w-330 mx-auto" src={banner} alt="banner" />
      </div>
      <div className="w-full max-w-6xl mx-auto">
        {Object.keys(groupedProducts).length > 0 ? (
          Object.keys(groupedProducts).map((category) => (
            <div key={category}>
              <h2 className="ml-4 mt-5 mb-2 text-xl font-semibold flex justify-between items-center">
                {category}
                <button
                  className="text-blue-500 mr-6"
                  onClick={() => handleViewMoreClick(category)}
                >
                  더보기
                </button>
              </h2>
              <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {groupedProducts[category]
                  .slice(currentIndex, currentIndex + 4)
                  .map((product: Product) => (
                    <li
                      className="rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-500 ease-in-out transform hover:scale-105"
                      key={product.productId}
                      onClick={() => handleProductClick(product)}
                    >
                      {product.productImageUrls &&
                        product.productImageUrls.length > 0 && (
                          <img
                            className={`w-full h-10vh object-cover ${imagesLoaded ? "" : "hidden"}`}
                            src={product.productImageUrls[0]}
                            alt={product.productName}
                            onLoad={handleImageLoad}
                          />
                        )}
                      {!imagesLoaded && <Skeleton height={150} />}
                      <div className="mt-2 px-2 text-lg flex justify-between items-center">
                        {imagesLoaded ? (
                          <>
                            <h3 className="truncate">{product.productName}</h3>
                            <p>{`₩${product.productPrice.toLocaleString()}`}</p>
                          </>
                        ) : (
                          <>
                            <Skeleton width={100} />
                            <Skeleton width={50} />
                          </>
                        )}
                      </div>
                      <p className="mb-2 px-2 text-gray-600">
                        {imagesLoaded ? (
                          product.productCategory
                        ) : (
                          <Skeleton width={80} />
                        )}
                      </p>
                    </li>
                  ))}
              </ul>
            </div>
          ))
        ) : (
          <div>No products found</div>
        )}
      </div>
    </>
  );
};

export default Home;
