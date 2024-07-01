import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { updateProduct } from "../api/products";
import { Product } from "../types/Product";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RiDeleteBin5Fill } from "react-icons/ri";
import FileUpload from "../components/FileUpload";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const queryClient = useQueryClient();

  useEffect(() => {
    const state = location.state as { product: Product };
    if (state && state.product) {
      setProduct(state.product);
      setFormData(state.product);
    }
  }, [location]);

  const mutation = useMutation<void, Error, Partial<Product>, unknown>({
    mutationFn: async (newData: Partial<Product>) => {
      if (product) {
        await updateProduct(product.id, newData);
      } else {
        throw new Error("Product is undefined");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const updatedImages = prev.imageUrls ? [...prev.imageUrls] : [];
      updatedImages.splice(index, 1);
      return { ...prev, imageUrls: updatedImages };
    });
  };

  const handleFileSelect = (files: File[] | null) => {
    if (files) {
      const fileArray = files.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        imageUrls: prev.imageUrls
          ? [...prev.imageUrls, ...fileArray]
          : fileArray,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <section className="w-full text-center">
      <h2 className="text-2xl font-bold my-4">판매 상품 수정</h2>
      <div className="flex justify-center">
        <div className="w-1/2 border-2 ml-10 relative">
          <div className="flex flex-wrap">
            {formData.imageUrls && formData.imageUrls.length > 0 ? (
              formData.imageUrls.map((url, index) => (
                <div className="relative w-48 mx-2 my-2" key={index}>
                  <img
                    className="w-full"
                    src={url}
                    alt={`uploaded file ${index}`}
                  />
                  <button
                    className="absolute top-1.5 right-1.5 bg-black text-white rounded-full p-1"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <RiDeleteBin5Fill />
                  </button>
                </div>
              ))
            ) : (
              <div>No images uploaded</div>
            )}
          </div>
          <div className="absolute bottom-0 right-0 mb-2 mr-2">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        </div>
        <div className="w-1/2">
          <form className="flex flex-col px-12" onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="상품명"
              value={formData.title || ""}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="amount"
              placeholder="상품 수량"
              value={formData.amount || ""}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="상품 가격"
              value={formData.price || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="category"
              placeholder="카테고리"
              value={formData.category || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="description"
              placeholder="제품 설명"
              value={formData.description || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="options"
              placeholder="옵션들(콤마(,)로 구분)"
              value={formData.options || ""}
              onChange={handleChange}
              required
            />
            <button type="submit">상품 수정하기</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditProduct;
