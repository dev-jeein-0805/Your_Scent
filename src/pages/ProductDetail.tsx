import { useLocation } from "react-router-dom";
import { Product } from "../types/Product";

const ProductDetail = () => {
  const location = useLocation();
  const product = location.state?.product as Product;

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <section className="flex flex-col md:flex-row p-4 justify-center min-h-screen">
        {product.imageUrls && product.imageUrls.length > 0 && (
          <div className="w-full px-4 basis-4/12">
            <img
              className="w-full"
              src={product.imageUrls[0]}
              alt={product.title}
            />
            <div className="grid grid-cols-3 gap-2 mt-4">
              {product.imageUrls.slice(1).map((url, index) => (
                <img
                  className="w-full"
                  key={index}
                  src={url}
                  alt={`${product.title} ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
        <div className="w-full basis-5/12 flex flex-col p-4">
          <h1 className="text-3xl font-bold py-2">{product.title}</h1>
          <p className="mt-2 text-gray-600">{product.description}</p>
          <p className="text-2xl font-bold py-2 border-gray-400">
            ₩{product.price.toLocaleString()}
          </p>
          <p className="mt-4 text-gray-700">{product.category}</p>
          <p className="mt-2 text-gray-600">재고: {product.amount}</p>
          <p className="mt-2 text-gray-600">수량: </p>
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
