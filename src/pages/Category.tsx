import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getByCategoryForScroll } from "../api/getByCategoryForScroll";
import { Product } from "../types/Product";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { FadeLoader } from "react-spinners";

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
    navigate(`/products/${product.id}`, { state: { product } });
  };

  const filteredProducts =
    data?.pages.flatMap((page) =>
      page.products.filter((product: Product) => product.category === category)
    ) || [];

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

  if (isLoading) return <FadeLoader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2 className="ml-4 mt-5 mb-2 text-xl font-semibold">{category}</h2>
      <div className="flex justify-end mr-4 mb-4">
        <button
          onClick={() => handleOrderChange("createdAtDesc")}
          className="mx-2"
        >
          최신 등록 순
        </button>
        <button
          onClick={() => handleOrderChange("createdAtAsc")}
          className="mx-2"
        >
          오래된 등록 순
        </button>
        <button onClick={() => handleOrderChange("priceAsc")} className="mx-2">
          낮은 가격 순
        </button>
        <button onClick={() => handleOrderChange("priceDesc")} className="mx-2">
          높은 가격 순
        </button>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product: Product) => (
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
              <p className="mb-2 px-2 text-gray-600">{product.category}</p>
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
