import { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import RestaurantPage from "./pages/RestaurantPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AdminPage from "./pages/AdminPage";

/* ─── Toast system ─────────────────────────────────────────────── */
export let showToast = () => {};

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    showToast = (msg, type = "info") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    };
  }, []);

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ─── Splash screen ────────────────────────────────────────────── */
function Splash() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <div id="splash">
      <div className="splash-logo">
        Byte<span>Bite</span>
      </div>
      <div className="splash-tagline">Fresh food · Fast delivery</div>
      <div className="splash-bar-wrap">
        <div className="splash-bar" />
      </div>
    </div>
  );
}

/* ─── Page wrapper with entry animation ────────────────────────── */
function PageWrapper({ children }) {
  const location = useLocation();
  const [key, setKey] = useState(location.pathname);
  const [animClass, setAnimClass] = useState("fade-up");

  useEffect(() => {
    setAnimClass("");
    const t = setTimeout(() => {
      setKey(location.pathname);
      setAnimClass("fade-up");
    }, 10);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div key={key} className={animClass} style={{ animationDuration: "0.45s" }}>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <>
      <Splash />
      <div className="page-enter" style={{ minHeight: "100vh" }}>
        <Navbar />
        <PageWrapper>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route path="/restaurants/:restaurantId" element={<RestaurantPage />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </PageWrapper>
      </div>
      <ToastContainer />
    </>
  );
}