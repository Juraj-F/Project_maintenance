
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../stores/authStore";

export default function Navbar() {
  const user = useAuthStore((s) => s.user )
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  const email = user?.user?.email;

  const closeMobile = () => setMobileOpen(false);
  const toggleMobile = () => setMobileOpen((v) => !v);


  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeMobile();
    };

    const onMouseDown = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) closeMobile();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [mobileOpen]);

  const go = (path) => {
    navigate(path);
    closeMobile();
  };

  const handleLogout = () => {
    logout();
    go("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 justify-items-center lg:justify-items-stretch gap-3 lg:gap-0 lg:grid-cols-[auto_1fr_auto] items-center py-3">
          {/* Logo */}
          <div className="flex justify-center lg:justify-start">
            <img
              onClick={() => go("/")}
              src="/logo_gripper.jpg"
              alt="logo"
              className="rounded-full h-14 w-14 border-4 border-gray-600 cursor-pointer"
            />
          </div>

          {/* Title */}
          <div className="text-center select-none">
            <span className="text-lg md:text-xl lg:text-4xl font-medium">
              <span className="text-white">Assembly </span>
              <span className="text-white">Line </span>
              <span className="text-gray-500">Maintenance</span>
            </span>
          </div>

          {/* Right side */}


          <div className="relative flex items-center justify-end gap-4" ref={menuRef}>
            {/* Desktop actions */}
            {user?.user?.role==="admin" && 
              <>
                <button
                  className="hidden lg:block text-gray-300 hover:text-white text-sm bg-amber-600/50 rounded-2xl px-2"
                  onClick={()=>go(`/admin/${user.user.role}`)}
                >
                  Admin Dashboard
                </button>
              </>
            }

            {user ? (
              <>
                <span className="hidden lg:block text-gray-300 text-sm">
                  {email}
                </span>
                <button
                  className="hidden lg:block text-gray-300 hover:text-white text-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="text-gray-300 hover:text-white text-sm"
                  onClick={() => go("/login")}
                >
                  Login
                </button>
                <button
                  className="text-gray-300 hover:text-white text-sm"
                  onClick={() => go("/register")}
                >
                  Register
                </button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={toggleMobile}
              className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-300 hover:text-white hover:bg-white/5"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile dropdown */}
            {mobileOpen && (
            <div className="lg:hidden absolute right-0 top-full mt-2 w-56 rounded-xl bg-slate-900/90 backdrop-blur border border-white/10 shadow-xl overflow-hidden">

                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="text-xs text-gray-400">Signed in as</div>
                      <div className="text-sm text-amber-200 truncate">{email}</div>
                    </div>

            {user?.user?.role==="admin" && 
              <>
                <button
                  className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-white/5"
                  onClick={()=>go(`/admin/${user.user.role}`)}
                >
                  Admin Dashboard
                </button>
              </>
            }

                    <button
                      className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-white/5"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-white/5"
                      onClick={() => go("/login")}
                    >
                      Login
                    </button>
                    <button
                      className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-white/5"
                      onClick={() => go("/register")}
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

