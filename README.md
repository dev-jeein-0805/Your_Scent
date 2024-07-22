# 🌷 프로젝트 소개

다양한 필터링 기능으로 사용자의 취향에 따라 알맞은 향을 추천 드립니다.

https://your-scent.vercel.app/

- 판매자 계정 : email : broad@casting.com / pw : tvnews1004!
- 구매자 계정 : email : animal@peace.com / pw : rabbit5959@
  <br>

## 🕰️ 개발 기간

- 24.06.19일 - 24.07.16일 (4주)

## ⚙️ 기술 스택

<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white"> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white"> <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"> <img src="https://img.shields.io/badge/Tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">

<img src="https://img.shields.io/badge/React Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"> <img src="https://img.shields.io/badge/React Hook Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white">

<img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white">

<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=netlify&logoColor=white">

<br/>

### 서비스 아키텍쳐

## 📌 주요 기능

<details>
<summary>회원가입</summary>
<img src="./src/utils/Signup.png" className="w-96">
- 이메일 주소와 비밀번호 유효성 검사
- 판매자 계정 유무에 대한 선택 옵션 제시
</details>

<details>
<summary>로그인</summary>
<img src="./src/utils/Login.png" className="w-96">
- 소셜 로그인(구글)과 이메일 로그인
- 로그인 시 회원정보를 Context API 로 관리
</details>

<details>
<summary>메인 페이지</summary>
<img src="./src/utils/Main.png" className="w-96">
- 카테고리 별 4개씩 이미지 배치 및 캐러셀 적용
- 더보기 클릭으로 카테고리 별 페이지 이동 유도
</details>

<details>
<summary>카테고리 별 상품 페이지</summary>
<img src="./src/utils/Category.png" className="w-96">
- react-query의 useInfiniteQuery와 Intersection Obeserver API를 사용한 무한 스크롤 구현
- 최신 순/가격 순으로 상품 정렬
</details>

<details>
<summary>상품 상세 페이지</summary>
<img src="./src/utils/ProductDetail.png" className="w-96">
- 동일한 카테고리 내 추천상품을 캐러셀 형태로 구현
- 상품 재고 및 장바구니에 담긴 상태에 따라 다른 버튼 제시
</details>

<details>
<summary>장바구니 페이지</summary>
<img src="./src/utils/CartDrawer.png" className="w-96">
<img src="./src/utils/Cart.png" className="w-96">
- 전체 선택/상품 별 선택에 따라 상태값으로 관리하여 주문/결제 페이지에 전달
- 기본 장바구니 페이지 외에 Drawer 형태로도 추가 구현하여 사용자가 페이지 이동 없이 아이콘 클릭만으로 상시 장바구니 확인이 가능하게 함
</details>

<details>
<summary>주문/결제 페이지</summary>
<img src="./src/utils/Order.png" className="w-96">
<img src="./src/utils/Dialog.png" className="w-96">
<img src="./src/utils/Pay.png" className="w-96">
- 포트원 SDK 을 결제모듈을 적용
- 결제 성공/실패에 따라 상품 재고를 Firestore Database 에 전달하도록 구현
</details>

<details>
<summary>마이 페이지</summary>
<img src="./src/utils/OrderHistory.png" className="w-96">
- 상품 구매 내역에서 주문 취소 가능
- 구매 내역은 최신순으로 정렬
</details>

<details>
<summary>판매자 상품관리 페이지</summary>
<img src="./src/utils/NewProductUpload.png" className="w-96">
<img src="./src/utils/EditProduct.png" className="w-96">
<img src="./src/utils/SalesHistory.png" className="w-96">
- 신규 판매 상품 등록 및 판매 상품 정보 조회/수정/삭제 가능
- 상품 이미지를 최소 1개 이상 등록하도록 제한
</details>

## 트러블 슈팅

- 프로젝트에서 작성한 5분 기록보드를 활용하여 트러블 슈팅 경험에 대해 기술해 주세요.
