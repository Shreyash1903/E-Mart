import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Signup from "./components/login/Signup";
import Products from "./components/products/Products";
import Cart from "./components/cart/Cart";
import Profile from "./components/profile/Profile";
import ChangePassword from "./components/ChangePassword";
import OrderSuccess from "./components/OrderSuccess";
import AddAddress from "./components/address/AddAddress";
import Checkout from "./components/checkout/Checkout";
import Payment from "./components/payments/Payment";
import ProductDetail from "./components/products/ProductDetail";
import MyAddress from "./components/my addresses/MyAddress";
import EditAddress from "./components/edit address/EditAddress";
import ForgotPassword from "./components/forgot password/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import VerifyOTP from "./components/verify otp/VerifyOTP";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import PrivateRoute from "./components/PrivateRoute";
import MyOrders from "./components/my orders/MyOrders";
import Wishlist from "./components/wishlist/Wishlist";
import About from "./components/about/About";

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <Navbar />
          <div className="container">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Login />} />{" "}
              {/* 👈 Default is now Login */}
              <Route path="/home" element={<Home />} />{" "}
              {/* 👈 Home moved here */}
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />{" "}
              {/* Optional: Keep or remove */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/password/reset/confirm/:uid/:token"
                element={<ResetPassword />}
              />
              {/* Protected Routes */}
              <Route
                path="/products"
                element={
                  <PrivateRoute>
                    <Products />
                  </PrivateRoute>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <PrivateRoute>
                    <ProductDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <PrivateRoute>
                    <Cart />
                  </PrivateRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <PrivateRoute>
                    <Wishlist />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <PrivateRoute>
                    <MyOrders />
                  </PrivateRoute>
                }
              />
              <Route
                path="/order-success"
                element={
                  <PrivateRoute>
                    <OrderSuccess />
                  </PrivateRoute>
                }
              />
              <Route
                path="/add-address"
                element={
                  <PrivateRoute>
                    <AddAddress />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-address"
                element={
                  <PrivateRoute>
                    <MyAddress />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit-address"
                element={
                  <PrivateRoute>
                    <EditAddress />
                  </PrivateRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <Checkout />
                  </PrivateRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <PrivateRoute>
                    <Payment />
                  </PrivateRoute>
                }
              />
              {/* 404 fallback */}
              <Route path="*" element={<h2>404 Page Not Found</h2>} />
            </Routes>
          </div>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
