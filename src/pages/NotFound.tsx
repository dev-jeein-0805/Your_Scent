export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-500">404 Error🥲</h1>
      <p className="mt-4 text-xl text-gray-600">
        죄송하지만 요청하신 페이지를 찾을 수 없습니다.
      </p>
      <p className="mt-2 text-lg text-gray-600">
        아래 버튼을 클릭하여 홈으로 돌아가세요!
      </p>
      <a
        href="/"
        className="mt-6 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        홈으로 가기
      </a>
    </div>
  );
}
