# 🌷 프로젝트 소개

다양한 필터링 기능으로 사용자의 취향에 따라 알맞은 향을 추천 드립니다.

https://your-scent.vercel.app/

- 판매자 계정 : email : broad@casting.com / pw : tvnews1004!
- 구매자 계정 : email : animal@peace.com / pw : rabbit5959@
  <br>

## 🕰️ 개발 기간

- 24.06.19일 - 24.07.16일 (4주)

### ⚙️ 기술 스택

- `TypeScript`
- `Vite`
- **IDE** : VS Code
- **Framework** : React
- **State Management** : React Context API (Client) / @tanstack - react Query (Server)
- `Tailwind css`
- `Firebase`
- `React hook form`
- `shadcn/ui`
- `React Router`

### 서비스 아키텍쳐

📦src
┣ 📂api
┃ ┣ 📜firebase.ts
┃ ┣ 📜getByCategoryForScroll.ts
┃ ┣ 📜getItemsByCategory.ts
┃ ┣ 📜getProductsByCategory.ts
┃ ┗ 📜products.ts
┣ 📂components
┃ ┣ 📂lib
┃ ┃ ┗ 📜utils.ts
┃ ┣ 📂ui
┃ ┃ ┣ 📜alert-dialog.tsx
┃ ┃ ┣ 📜Button.tsx
┃ ┃ ┗ 📜shadcnButton.tsx
┃ ┣ 📜Cart.tsx
┃ ┣ 📜CartInDrawer.tsx
┃ ┣ 📜Drawer.tsx
┃ ┣ 📜FileUpload.tsx
┃ ┣ 📜Navbar.tsx
┃ ┣ 📜OrderConfirmModal.tsx
┃ ┣ 📜Products.tsx
┃ ┗ 📜ProtectedRoute.tsx
┣ 📂contexts
┃ ┣ 📜AuthContext.tsx
┃ ┗ 📜CartContext.tsx
┣ 📂hooks
┃ ┣ 📜CheckoutFunction.tsx
┃ ┗ 📜useCurrentUserId.tsx
┣ 📂pages
┃ ┣ 📜AllProducts.tsx
┃ ┣ 📜Category.tsx
┃ ┣ 📜EditProduct.tsx
┃ ┣ 📜EditProfile.tsx
┃ ┣ 📜Home.tsx
┃ ┣ 📜Login.tsx
┃ ┣ 📜MyPage.tsx
┃ ┣ 📜NewProduct.tsx
┃ ┣ 📜NotFound.tsx
┃ ┣ 📜Order.tsx
┃ ┣ 📜OrderHistory.tsx
┃ ┣ 📜ProductDetail.tsx
┃ ┣ 📜SalesHistory.tsx
┃ ┗ 📜SignUp.tsx
┣ 📂routers
┣ 📂styles
┣ 📂types
┃ ┣ 📜Order.ts
┃ ┗ 📜Product.ts
┣ 📂utils
┃ ┣ 📜banner.png
┃ ┗ 📜ShopperBag.tsx
┣ 📜App.tsx
┣ 📜custom.d.ts
┣ 📜index.css
┣ 📜main.tsx
┗ 📜vite-env.d.ts

## 📌 주요 기능

    - 프로젝트에서 제공하는 주요한 기능들에 대해 설명해 주세요.
    - 프론트의 경우 이미지를 함께 첨부해 주셔도 좋습니다.

#### 로그인

#### 회원가입

#### 마이 페이지

#### 메인 페이지

#### 카테고리 별 상품 페이지

#### 상품 상세 페이지

#### 장바구니 페이지

#### 주문/결제 페이지

#### 관리자 상품관리 페이지

## 트러블 슈팅

- 프로젝트에서 작성한 5분 기록보드를 활용하여 트러블 슈팅 경험에 대해 기술해 주세요.
