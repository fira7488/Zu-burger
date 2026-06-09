import { Navigate, Route, Routes, useParams } from "react-router-dom";
import AdminLayout from "../admin/components/AdminLayout";
import AdminAnalytics from "../admin/pages/AdminAnalytics";
import AdminDashboard from "../admin/pages/AdminDashboard";
import AdminLogin from "../admin/pages/AdminLogin";
import AdminMenu from "../admin/pages/AdminMenu";
import AdminOrders from "../admin/pages/AdminOrders";
import AdminPayments from "../admin/pages/AdminPayments";
import AdminSettings from "../admin/pages/AdminSettings";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Home from "../pages/Home";
import Menu from "../pages/Menu";
import OrderSuccess from "../pages/OrderSuccess";
import OrderTracking from "../pages/OrderTracking";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Customer experience */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        <Route path="/order-tracking" element={<OrderTracking />} />
        <Route
          path="/success/:orderId"
          element={<LegacySuccessRedirect />}
        />
      </Route>

      {/* Admin authentication */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Protected admin dashboard */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/menu" element={<AdminMenu />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      {/* Legacy admin route redirect */}
      <Route path="/admin/login" element={<Navigate to="/admin-login" replace />} />
    </Routes>
  );
}

function LegacySuccessRedirect() {
  const { orderId } = useParams();
  return <Navigate to={`/order-success/${orderId}`} replace />;
}
