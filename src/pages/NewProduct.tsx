import { useState, ChangeEvent } from "react";
import FileUpload, { uploadFiles } from "../components/FileUpload";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../api/firebase";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { deleteObject, ref } from "firebase/storage";

interface Product {
  title: string;
  amount: number;
  price: number;
  category: string;
  description: string;
  options: string[];
  imageUrls?: string[];
  // 다른 필요한 속성들...
}

export default function NewProduct() {
  const [product, setProduct] = useState<Product>({
    title: "",
    amount: 0,
    price: 0,
    category: "",
    description: "",
    options: [],
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: name === "options" ? value.split(",") : value,
    }));
  };

  // 이미지 여러 장을 함께 나열
  const handleFileSelect = async (files: File[] | null) => {
    if (files) {
      try {
        const newSelectedFiles = [...selectedFiles, ...files];
        setSelectedFiles(newSelectedFiles);

        // 새 파일들만 업로드
        const imageUrls = await uploadFiles(files);
        setUploadedUrls((prevUrls) => [...prevUrls, ...imageUrls]);
      } catch (error) {
        console.error("File upload failed", error);
      }
    }
  };

  // Firebase Storage에서 이미지를 삭제하는 함수
  const deleteImage = async (imageUrl: string) => {
    const imageRef = ref(storage, imageUrl);

    try {
      await deleteObject(imageRef);
      console.log("이미지가 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("이미지 삭제 실패", error);
    }
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = (index: number) => {
    const imageUrlToRemove = uploadedUrls[index];

    // Firebase Storage에서 이미지 삭제
    deleteImage(imageUrlToRemove);

    // Client 단 이미지 업로드 상태 업데이트
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setUploadedUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  // 제품 등록 로직
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 이미지가 하나도 첨부되지 않았을 때
    if (uploadedUrls.length === 0) {
      alert("상품 이미지를 1개 이상 추가해 주세요.");
      return;
    }

    setIsUploading(true);

    try {
      const productData = { ...product, imageUrls: uploadedUrls };

      // Firestore에 제품 데이터 저장
      await addDoc(collection(db, "products"), productData);

      setSuccess("제품이 성공적으로 등록되었습니다!");
      setProduct({
        title: "",
        amount: 0,
        price: 0,
        category: "",
        description: "",
        options: [],
      });
      setSelectedFiles([]);
      setUploadedUrls([]);
    } catch (error) {
      console.error("제품 등록 실패", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="w-full text-center">
      <h2 className="text-2xl font-bold my-4">판매 상품 추가/수정</h2>
      {success && <p className="my-2">✅{success}</p>}
      <div className="flex justify-center">
        <div className="w-1/2 border-2 ml-10 relative">
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative w-48 mx-2 my-2">
                  <img
                    className="w-full"
                    src={URL.createObjectURL(file)}
                    alt={`local file ${index + 1}`}
                  />
                  <button
                    className="absolute top-1.5 right-1.5 bg-black text-white rounded-full p-1"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <RiDeleteBin5Fill />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="absolute bottom-0 right-0 mb-2 mr-2">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        </div>
        <div className="w-1/2">
          <form className="flex flex-col px-12" onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              value={product?.title ?? ""}
              placeholder="상품명"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="amount"
              value={product?.amount ?? ""}
              placeholder="상품 수량"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="price"
              value={product?.price ?? ""}
              placeholder="가격"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="category"
              value={product?.category ?? ""}
              placeholder="카테고리"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="description"
              value={product?.description ?? ""}
              placeholder="제품 설명"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="options"
              value={product?.options.join(", ") ?? ""}
              placeholder="옵션들(콤마(,)로 구분)"
              onChange={handleChange}
              required
            />
            <button className="bg-brand mt-2" disabled={isUploading}>
              {isUploading ? "업로드 중..." : "제품 등록하기"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
