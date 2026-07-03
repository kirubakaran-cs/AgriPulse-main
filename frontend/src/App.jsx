import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Farmers from "./pages/farmers/Farmers";
import FarmerForm from "./pages/farmers/FarmerForm";
import FarmerDetails from "./pages/farmers/FarmerDetails";
import Buyers from "./pages/buyers/Buyers";
import BuyerForm from "./pages/buyers/BuyerForm";
import Products from "./pages/products/Products";
import ProductForm from "./pages/products/ProductForm";
import Transactions from "./pages/transactions/Transactions";
import TransactionForm from "./pages/transactions/TransactionForm";
import Payments from "./pages/payments/Payments";
import PaymentForm from "./pages/payments/PaymentForm";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "10px",
              background: "#fff",
              color: "#111827",
              border: "1px solid #E5E7EB",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#22C55E", secondary: "#fff" } },
          }}
        />
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Protected app routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/farmers" element={<Farmers />} />
            <Route path="/farmers/new" element={<FarmerForm />} />
            <Route path="/farmers/:id/edit" element={<FarmerForm />} />
            <Route path="/farmers/:id" element={<FarmerDetails />} />

            <Route path="/buyers" element={<Buyers />} />
            <Route path="/buyers/new" element={<BuyerForm />} />
            <Route path="/buyers/:id/edit" element={<BuyerForm />} />

            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/:id/edit" element={<ProductForm />} />

            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/new" element={<TransactionForm />} />
            <Route path="/transactions/:id/edit" element={<TransactionForm />} />

            <Route path="/payments" element={<Payments />} />
            <Route path="/payments/new" element={<PaymentForm />} />
            <Route path="/payments/:id/edit" element={<PaymentForm />} />

            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
