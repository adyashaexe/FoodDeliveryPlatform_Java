import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Store, ReceiptText, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="page-shell pb-0">
      <div className="paper-card flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-coral px-3 py-2 font-display text-xl font-bold text-white">
            FF
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-ink">Foodly Flow</p>
            <p className="text-sm text-stone-500">Fresh UX for a full-stack delivery app</p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-stone-600">
          <NavItem to="/" icon={<Store size={16} />} label="Explore" />
          {isAuthenticated && <NavItem to="/cart" icon={<ShoppingBag size={16} />} label={`Cart (${cart.items?.length || 0})`} />}
          {isAuthenticated && <NavItem to="/orders" icon={<ReceiptText size={16} />} label="Orders" />}
          {isAdmin && <NavItem to="/admin" icon={<ShieldCheck size={16} />} label="Admin" />}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="text-right">
                <p className="text-sm font-semibold text-ink">{user?.name}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{user?.role}</p>
              </div>
              <button type="button" className="secondary-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="secondary-button">
                Login
              </Link>
              <Link to="/signup" className="primary-button">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `inline-flex items-center gap-2 rounded-full px-4 py-2 transition ${
          isActive ? "bg-ink text-white" : "bg-white text-stone-600 hover:text-coral"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
