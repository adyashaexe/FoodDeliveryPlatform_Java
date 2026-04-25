import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, LayoutGrid, ClipboardList, ShieldCheck, Sun, Moon, LogOut, User } from "lucide-react";
import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { showToast } from "../App";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = cart.items?.length || 0;

  function handleLogout() {
    logout();
    setMenuOpen(false);
    showToast("Signed out successfully", "info");
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "var(--ember)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 18 }}>🍽</span>
            </div>
            <span style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 900,
              fontSize: 22,
              letterSpacing: "-0.04em",
              color: "var(--text-primary)",
            }}>
              Byte<span style={{ color: "var(--ember)" }}>Bite</span>
            </span>
          </Link>

          {/* Center nav */}
          <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <NavItem to="/" icon={<LayoutGrid size={15} />} label="Explore" />
            {isAuthenticated && (
              <NavItem to="/orders" icon={<ClipboardList size={15} />} label="Orders" />
            )}
            {isAdmin && (
              <NavItem to="/admin" icon={<ShieldCheck size={15} />} label="Admin" />
            )}
          </nav>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="btn-icon"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              style={{ border: "none" }}
            >
              {isDark
                ? <Sun size={16} style={{ color: "var(--gold)" }} />
                : <Moon size={16} />}
            </button>

            {/* Cart */}
            {isAuthenticated && (
              <Link to="/cart" style={{ position: "relative", textDecoration: "none" }}>
                <button className="btn-icon" style={{ border: "none" }}>
                  <ShoppingBag size={16} />
                </button>
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Link>
            )}

            {/* Auth */}
            {isAuthenticated ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 12px 6px 6px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    borderRadius: 12, cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "var(--ember)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <User size={14} color="white" />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                </button>

                {menuOpen && (
                  <div style={{
                    position: "absolute", right: 0, top: "calc(100% + 8px)",
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: 14, padding: 6, minWidth: 180,
                    boxShadow: "var(--shadow-card-hover)", zIndex: 200,
                  }}>
                    <div style={{ padding: "8px 12px 10px", borderBottom: "1px solid var(--border)" }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{user?.name}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        width: "100%", padding: "10px 12px",
                        background: "none", border: "none",
                        borderRadius: 10, cursor: "pointer",
                        color: "#dc2626", fontSize: 13, fontWeight: 500,
                        marginTop: 4,
                      }}
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 6 }}>
                <Link to="/login" className="btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }}>
                  Login
                </Link>
                <Link to="/signup" className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
      end={to === "/"}
    >
      {icon}
      {label}
    </NavLink>
  );
}