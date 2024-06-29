import { Timestamp } from "firebase/firestore";
import useFetchCollection from "../hooks/useFetchCollection";

// 데이터 타입 정의
interface Product {
  id: string;
  title: string;
  amount: number;
  price: number;
  category: string;
  description: string;
  options: string[];
  imageUrls?: string[];
  createdAt: Timestamp;
}

const Products = () => {
  const { data, isLoading } = useFetchCollection("products");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg-grid-cols-4 gap-4 p-4">
      {data.length > 0 ? (
        data.map((product: Product) => (
          <li
            className="rounded-lg shadow-md overflow-hidden cursor-pointer"
            key={product.id}
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
              <p>{`₩${product.price}`}</p>
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
