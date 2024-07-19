import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import NotFound from "./pages/NotFound.tsx";
import Home from "./pages/Home.tsx";
import AllProducts from "./pages/AllProducts.tsx";
import NewProduct from "./pages/NewProduct.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Cart from "./components/Cart.tsx";
import SignUp from "./pages/SignUp.tsx";
import Login from "./pages/Login.tsx";
import { AuthContextProvider } from "./contexts/AuthContext.tsx";
import Category from "./pages/Category.tsx";
import Order from "./pages/Order.tsx";
import MyPage from "./pages/MyPage.tsx";
import EditProfile from "./pages/EditProfile.tsx";
import OrderHistory from "./pages/OrderHistory.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import EditProduct from "./pages/EditProduct.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "./contexts/CartContext.tsx";
import SalesHistory from "./pages/SalesHistory.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, path: "/", element: <Home /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/login", element: <Login /> },
      { path: "/products/category/:category", element: <Category /> },
      {
        path: "products/:id",
        element: <ProductDetail />,
      },

      { path: "/order", element: <Order /> },
      {
        path: "/mypage",
        element: (
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        ),
        children: [
          { path: "editProfile", element: <EditProfile /> },
          { path: "orderHistory", element: <OrderHistory /> },
          {
            path: "cart",
            element: (
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            ),
          },
          {
            path: "products/new",
            element: (
              <ProtectedRoute allowedRoles={["seller"]}>
                <NewProduct />
              </ProtectedRoute>
            ),
          },
          {
            path: "products",
            element: (
              <ProtectedRoute allowedRoles={["seller"]}>
                <AllProducts />
              </ProtectedRoute>
            ),
          },
          {
            path: "products/edit/:id",
            element: (
              <ProtectedRoute allowedRoles={["seller"]}>
                <EditProduct />
              </ProtectedRoute>
            ),
          },
          {
            path: "products/salesHistory",
            element: (
              <ProtectedRoute allowedRoles={["seller"]}>
                <SalesHistory />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
