import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../api/products";
import { Product } from "../types/Product";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const navigate = useNavigate();

  const handleProductClick = (product: Product) => {
    navigate(`/mypage/products/edit/${product.id}`, { state: { product } });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg-grid-cols-4 gap-4 p-4">
      {data && data.length > 0 ? (
        data.map((product: Product) => (
          <li
            className="rounded-lg shadow-md overflow-hidden cursor-pointer"
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
    </ul>
  );
};

export default Products;
