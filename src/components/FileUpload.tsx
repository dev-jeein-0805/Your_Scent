import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ChangeEvent, useRef, useState } from "react";
import { auth, storage } from "../api/firebase";
import { ImUpload2 } from "react-icons/im";

interface FileUploadProps {
  onFileSelect: (files: File[] | null) => void;
}

export const uploadFiles = async (files: File[]): Promise<string[]> => {
  const imageUrls: string[] = [];

  for (const file of files) {
    const imageRef = ref(storage, `${auth.currentUser?.uid}/${file.name}`);
    await uploadBytes(imageRef, file);

    // 파일 URL 가져오기
    const downloadURL = await getDownloadURL(imageRef);
    imageUrls.push(downloadURL);
  }

  return imageUrls;
};

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const filesArray = Array.from(fileList); // FileList를 File[]로 변환
      setSelectedFiles(filesArray);
      onFileSelect(filesArray);
    } else {
      onFileSelect(null);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        name="file"
        onChange={handleFileSelect}
        ref={fileInputRef}
        className="hidden" // 기본 내장된 파일 입력 버튼 숨기기
        required
      />
      <button onClick={() => fileInputRef.current?.click()}>
        <ImUpload2 />
      </button>
    </div>
  );
};

export default FileUpload;
