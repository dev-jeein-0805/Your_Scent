import Products from "../components/Products";

export default function AllProducts() {
  return (
    <div className="w-350 mx-auto">
      <div className="text-3xl ml-4 mt-5 mb-2">판매 상품 리스트</div>
      <Products />
    </div>
  );
}
