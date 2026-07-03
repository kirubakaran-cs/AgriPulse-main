import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { initials } from "../lib/format";

export default function TopNav({ onMenuClick }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the dropdown when clicking outside.
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fullName = user?.fullName || "User";
  const email = user?.email || "";

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink-200 bg-white/80 px-4 backdrop-blur lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 text-ink-600 hover:bg-ink-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm text-ink-500">Welcome back,</p>
        <p className="text-sm font-semibold text-ink-800">{fullName}</p>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-ink-100"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-sm font-semibold text-white">
            {initials(fullName)}
          </div>
          <ChevronDown className="h-4 w-4 text-ink-500" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 animate-fade-in rounded-xl border border-ink-200 bg-white py-2 shadow-cardHover">
            <div className="border-b border-ink-100 px-4 py-2">
              <p className="truncate text-sm font-semibold text-ink-800">{fullName}</p>
              <p className="truncate text-xs text-ink-500">{email}</p>
            </div>
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/profile");
              }}
              className="block w-full px-4 py-2 text-left text-sm text-ink-600 hover:bg-ink-50"
            >
              Profile & Settings
            </button>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
