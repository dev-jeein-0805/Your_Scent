import { useState, ChangeEvent, useEffect } from "react";
import FileUpload, { uploadFiles } from "../components/FileUpload";
import { addDoc, collection, Timestamp, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../api/firebase";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { deleteObject, ref } from "firebase/storage";
import { Product } from "../types/Product";
import { onAuthStateChanged } from "firebase/auth";

const NewProduct = () => {
  const [product, setProduct] = useState<Product>({
    productId: "",
    sellerId: "",
    productName: "",
    productStock: 0,
    productPrice: 0,
    productCategory: "",
    productDescription: "",
    productImageUrls: [],
    productOptions: [],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // 현재 로그인한 사용자의 정보를 가져옴
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.uid) {
        setUserId(user.uid);
      }
    });
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]:
        name === "productOptions"
          ? value.split(",")
          : name === "productPrice"
            ? Number(value)
            : value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
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
    try {
      console.log("삭제할 이미지 URL:", imageUrl);
      if (!imageUrl) {
        throw new Error("올바르지 않은 이미지 URL입니다.");
      }
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      console.log("이미지가 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("이미지 삭제 실패", error);
    }
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = async (index: number) => {
    const imageUrlToRemove = uploadedUrls[index];

    // URL이 설정되었는지 확인
    if (!imageUrlToRemove) {
      console.error("이미지 URL이 설정되지 않았습니다.");
      return;
    }

    // Firebase Storage에서 이미지 삭제
    await deleteImage(imageUrlToRemove);

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
      const productData = {
        ...product,
        sellerId: userId,
        productImageUrls: uploadedUrls,
        createdAt: Timestamp.now().toDate(),
      };

      // Firestore에 제품 데이터 저장
      const docRef = await addDoc(collection(db, "products"), productData);

      // Firestore에서 생성된 문서 ID를 productId로 설정
      await updateDoc(docRef, { productId: docRef.id });

      setSuccess("제품이 성공적으로 등록되었습니다!");
      setProduct({
        productId: "",
        sellerId: "",
        productName: "",
        productStock: 0,
        productPrice: 0,
        productCategory: "",
        productDescription: "",
        productImageUrls: [],
        productOptions: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
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
    <section className="w-350 mx-auto text-center">
      <h2 className="text-2xl font-bold my-4">판매 상품 등록</h2>
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
              name="productName"
              value={product?.productName ?? ""}
              placeholder="상품명"
              onChange={handleInputChange}
              className="border-b-1 border-t-0 border-x-0 p-2 mb-6 mt-4"
              required
            />
            <input
              type="number"
              name="productStock"
              value={product?.productStock ?? ""}
              placeholder="상품 재고"
              onChange={handleInputChange}
              className="border-b-1 border-t-0 border-x-0 p-2 mb-6"
              required
            />
            <input
              type="number"
              name="productPrice"
              value={product?.productPrice ?? ""}
              placeholder="상품 가격"
              onChange={handleInputChange}
              className="border-b-1 border-t-0 border-x-0 p-2 mb-6"
              required
            />
            <select
              name="productCategory"
              value={product?.productCategory ?? ""}
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
              value={product?.productDescription ?? ""}
              placeholder="제품 설명"
              onChange={handleInputChange}
              className="border-b-1 border-t-0 border-x-0 p-2 mb-6"
              required
            />
            <input
              type="text"
              name="productOptions"
              value={product?.productOptions.join(", ") ?? ""}
              placeholder="옵션들(콤마(,)로 구분)"
              onChange={handleInputChange}
              className="border-b-1 border-t-0 border-x-0 p-2 mb-6"
              required
            />
            <button
              className="bg-blue-300 mt-2 py-4 rounded-lg font-bold text-xl"
              disabled={isUploading}
            >
              {isUploading ? "업로드 중..." : "제품 등록하기"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewProduct;
