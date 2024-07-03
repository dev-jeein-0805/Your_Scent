import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getProductsByCategory } from "../api/getProductsByCategory";
import { Product } from "../types/Product";
import { useNavigate } from "react-router-dom";
import banner from "../utils/banner.png";

const Home = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["productsByCategory"],
    queryFn: getProductsByCategory,
  });

  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleProductClick = (product: Product) => {
    navigate(`/mypage/products/edit/${product.id}`, { state: { product } });
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
      if (grouped[product.category]) {
        grouped[product.category].push(product);
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
                data.filter((product) => product.category === category).length -
                4
            )
          );
          return prevIndex + 1 > maxIndex ? 0 : prevIndex + 1;
        }
        return prevIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const groupedProducts = data ? groupByCategory(data) : {};

  return (
    <>
      <div className="mt-10">
        <img src={banner} />
      </div>
      <div>
        {Object.keys(groupedProducts).length > 0 ? (
          Object.keys(groupedProducts).map((category) => (
            <div key={category}>
              <h2 className="ml-4 mt-5 mb-2 text-xl font-semibold flex justify-between items-center">
                {category}
                <button
                  className="text-blue-500"
                  onClick={() => handleViewMoreClick(category)}
                >
                  더보기
                </button>
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {groupedProducts[category]
                  .slice(currentIndex, currentIndex + 4)
                  .map((product: Product) => (
                    <li
                      className="rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-500 ease-in-out transform hover:scale-105"
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                    >
                      {product.imageUrls && product.imageUrls.length > 0 && (
                        <img
                          className="w-full"
                          src={product.imageUrls[0]}
                          alt={product.title}
                        />
                      )}
                      <div className="mt-2 px-2 text-lg flex justify-between items-center">
                        <h3 className="truncate">{product.title}</h3>
                        <p>{`₩${product.price.toLocaleString()}`}</p>
                      </div>
                      <p className="mb-2 px-2 text-gray-600">
                        {product.category}
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
