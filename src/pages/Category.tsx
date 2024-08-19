import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getByCategoryForScroll } from "../api/getByCategoryForScroll";
import { Product } from "../types/Product";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState, useMemo } from "react";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { FadeLoader } from "react-spinners";
import Skeleton from "react-loading-skeleton";

type PageData = {
  products: Product[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
};

const Category = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [orderByField, setOrderByField] = useState<
    "createdAtDesc" | "createdAtAsc" | "priceAsc" | "priceDesc"
  >("createdAtDesc");

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<PageData, Error>({
    queryKey: ["productsByCategoryForScroll", category, orderByField],
    queryFn: async ({ pageParam }) => {
      const result = await getByCategoryForScroll(
        category ?? "",
        pageParam as QueryDocumentSnapshot<DocumentData> | null,
        orderByField
      );
      return result;
    },
    getNextPageParam: (lastPage) => lastPage?.lastVisible || undefined,
    initialPageParam: null,
  });

  const handleProductClick = (product: Product) => {
    navigate(`/products/${product.productId}`, { state: { product } });
  };

  const filteredProducts = useMemo(() => {
    const products =
      data?.pages.flatMap((page) =>
        page.products.filter(
          (product: Product) => product.productCategory === category
        )
      ) || [];

    switch (orderByField) {
      case "priceAsc":
        return products.sort((a, b) => a.productPrice - b.productPrice);
      case "priceDesc":
        return products.sort((a, b) => b.productPrice - a.productPrice);
      default:
        return products;
    }
  }, [data, orderByField, category]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef, hasNextPage, fetchNextPage]);

  const handleOrderChange = (
    orderBy: "createdAtDesc" | "createdAtAsc" | "priceAsc" | "priceDesc"
  ) => {
    setOrderByField(orderBy);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <h2 className="ml-4 mt-5 mb-2 text-2xl font-semibold">
          <Skeleton width={200} />
        </h2>
        <div className="flex flex-wrap justify-end mb-4">
          <Skeleton height={40} width={150} />
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <li key={index} className="rounded-lg shadow-md overflow-hidden">
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
    );
  }
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="ml-4 mt-5 mb-2 text-2xl font-semibold">{category}</h2>
      <div className="flex flex-wrap justify-end mb-4">
        <select
          onChange={(e) =>
            handleOrderChange(
              e.target.value as
                | "createdAtDesc"
                | "createdAtAsc"
                | "priceAsc"
                | "priceDesc"
            )
          }
          className="mx-2 mb-2 p-2 border rounded cursor-pointer"
        >
          <option value="createdAtDesc">최신 등록 순</option>
          <option value="createdAtAsc">오래된 등록 순</option>
          <option value="priceAsc">낮은 가격 순</option>
          <option value="priceDesc">높은 가격 순</option>
        </select>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product: Product) => (
            <li
              className="rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-500 ease-in-out transform hover:scale-105"
              key={product.productId}
              onClick={() => handleProductClick(product)}
            >
              {product.productImageUrls &&
                product.productImageUrls.length > 0 && (
                  <img
                    className="w-full h-10vh object-cover" // 이미지의 높이를 조정
                    src={product.productImageUrls[0]}
                    alt={product.productName}
                  />
                )}
              <div className="mt-2 px-2 text-lg flex justify-between items-center">
                <h3 className="truncate">{product.productName}</h3>
                <p>{`₩${product.productPrice.toLocaleString()}`}</p>
              </div>
              <p className="mb-2 px-2 text-gray-600">
                {product.productCategory}
              </p>
            </li>
          ))
        ) : (
          <div>No products found</div>
        )}
        <div ref={loadMoreRef} />
      </ul>
      {isFetchingNextPage && <FadeLoader />}
    </div>
  );
};

export default Category;
