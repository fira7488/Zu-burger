import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import AdminDashboard from "../pages/AdminDashboard";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Home from "../pages/Home";
import Menu from "../pages/Menu";
import OrderSuccess from "../pages/OrderSuccess";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success/:orderId" element={<OrderSuccess />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}
