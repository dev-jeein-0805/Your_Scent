import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  deleteImagesFromStorage,
  deleteProduct,
  updateProduct,
} from "../api/products";
import { Product } from "../types/Product";
import { useLocation, useNavigate } from "react-router-dom";
import { RiDeleteBin5Fill } from "react-icons/ri";
import FileUpload, { uploadFiles } from "../components/FileUpload";

interface DeleteProductArgs {
  id: string;
  imageUrls: string[];
}

const EditProduct = () => {
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

  const updateMutation = useMutation<void, Error, Partial<Product>, unknown>({
    mutationFn: async (newData: Partial<Product>) => {
      if (product) {
        await updateProduct(product.productId, newData);
      } else {
        throw new Error("Product is undefined");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/");
    },
  });

  const deleteMutation = useMutation<void, Error, DeleteProductArgs, unknown>({
    mutationFn: async ({ id, imageUrls }: DeleteProductArgs) => {
      await deleteProduct(id, imageUrls);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/");
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const updatedImages = prev.productImageUrls
        ? [...prev.productImageUrls]
        : [];
      updatedImages.splice(index, 1);
      return { ...prev, imageUrls: updatedImages };
    });
  };

  const handleFileSelect = async (files: File[] | null) => {
    if (files) {
      // 파일을 Firestore Storage에 업로드하고 URL을 가져옴
      const fileUrls = await uploadFiles(files);
      setFormData((prev) => ({
        ...prev,
        imageUrls: prev.productImageUrls
          ? [...prev.productImageUrls, ...fileUrls]
          : fileUrls,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (product && formData.productImageUrls) {
      const removedImages = product.productImageUrls?.filter(
        (url) => !formData.productImageUrls?.includes(url)
      );
      if (removedImages && removedImages.length > 0) {
        await deleteImagesFromStorage(removedImages);
      }
    }
    updateMutation.mutate(formData);
    alert("상품 정보가 수정되었어요!");
  };

  // const handleDelete = () => {
  //   if (product) {
  //     deleteMutation.mutate(product.id);
  //   }
  // };

  const handleDelete = () => {
    if (product && formData.productId && formData.productImageUrls) {
      deleteMutation.mutate(
        { id: formData.productId, imageUrls: formData.productImageUrls },
        {
          onSuccess: () => {
            setProduct(null); // 상태에서 삭제
            alert("삭제 되었습니다!");
          },
          onError: (error) => {
            console.error("Failed to delete document:", error);
          },
        }
      );
    }
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <section className="w-full text-center">
      <h2 className="text-2xl font-bold my-4">판매 상품 수정/삭제</h2>
      <div className="flex justify-center">
        <div className="w-1/2 border-2 ml-10 relative">
          <div className="flex flex-wrap">
            {formData.productImageUrls &&
            formData.productImageUrls.length > 0 ? (
              formData.productImageUrls.map((url, index) => (
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
              name="productName"
              placeholder="상품명"
              value={formData.productName || ""}
              onChange={handleInputChange}
              className="border-b-1 border-t-0 border-x-0 p-2 mb-6 mt-4"
              required
            />
            <input
              type="number"
              name="productStock"
              placeholder="상품 재고"
              value={formData.productStock || ""}
              onChange={handleInputChange}
              className="border-b-1 border-t-0 border-x-0 p-2 mb-6"
              required
            />
            <input
              type="number"
              name="productPrice"
              placeholder="상품 가격"
              value={formData.productPrice || ""}
              onChange={handleInputChange}
              className="border-b-1 border-t-0 border-x-0 p-2 mb-6"
              required
            />
            <select
              name="productCategory"
              value={formData.productCategory || ""}
              onChange={handleSelectChange}
              className="border p-3 mb-4 h-18 rounded-lg cursor-pointer"
              required
            >
              <option value="" disabled>
                카테고리
              </option>
              <option value="Spray type">Spray type</option>
              <option value="Oil type">Oil type</option>
              <option value="Balm type">Balm type</option>
              <option value="Textile perfume">Textile perfume</option>
            </select>
            <input
              type="text"
              name="productDescription"
              placeholder="제품 설명"
              value={formData.productDescription || ""}
              onChange={handleInputChange}
              className="border-b-1 border-t-0 border-x-0 p-2 mb-6"
              required
            />
            <input
              type="text"
              name="productOptions"
              placeholder="옵션들(콤마(,)로 구분)"
              value={formData.productOptions || ""}
              onChange={handleInputChange}
              className="border-b-1 border-t-0 border-x-0 p-2 mb-6"
              required
            />
            <div className="flex">
              <button
                className="w-1/2 bg-blue-400 text-white py-3 mt-2 mr-1"
                type="submit"
              >
                수정하기
              </button>
              <button
                className="w-1/2 bg-gray-500 text-white py-3 mt-2 mr-1"
                type="button"
                onClick={handleDelete}
              >
                삭제하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditProduct;
