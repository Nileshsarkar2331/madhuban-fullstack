import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Leaf, LogOut, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { count: cartItemsCount } = useCart();
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "Account"
  );
  const [openProfile, setOpenProfile] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("profile_avatar");
    if (saved) setAvatar(saved);
  }, []);
  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      setAvatar(result);
      localStorage.setItem("profile_avatar", result);
    };
    reader.readAsDataURL(file);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];
  if (token && !isAdmin) {
    navItems.push({ name: "My Orders", path: "/my-orders" });
  }
  if (isAdmin) {
    navItems.push({ name: "Admin", path: "/admin" });
  }

  const isActivePage = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="w-full mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <Leaf className="h-6 w-6 text-secondary" />
            <span className="text-xl sm:text-2xl font-bold text-gradient truncate">
              Madhu<span className="text-primary">वन</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative text-sm font-medium transition-colors ${
                  isActivePage(item.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.name}
                {isActivePage(item.path) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* AUTH */}
            {!token ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/login")}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Sign In
              </Button>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setOpenProfile((v) => !v)}
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-border/60 bg-white overflow-hidden flex items-center justify-center"
                  aria-label="Open profile menu"
                >
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>

                {openProfile && (
                  <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-border/60 bg-white shadow-xl p-4 z-50 sm:w-72">
                    <div className="flex items-center gap-3 pb-4 border-b border-border/60">
                      <div className="h-12 w-12 rounded-full overflow-hidden border border-primary/20 bg-primary/5 flex items-center justify-center">
                        {avatar ? (
                          <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground">
                          Signed in as
                        </div>
                        <div className="text-lg font-semibold">{username}</div>
                      </div>
                    </div>

                    <div className="py-4 space-y-3">
                      <div>
                        <div className="text-sm font-medium text-foreground mb-2">
                          Profile photo
                        </div>
                        <label className="inline-flex items-center justify-center w-full px-3 py-2 rounded-lg border border-border/60 bg-white text-sm font-medium hover:bg-muted/50 cursor-pointer">
                          Choose photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center gap-2"
                        onClick={() => navigate("/login")}
                      >
                        <KeyRound className="h-4 w-4" />
                        Edit Password
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center gap-2"
                        onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("username");
                          localStorage.removeItem("isAdmin");
                          setOpenProfile(false);
                          navigate("/login");
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MOBILE MENU LINK */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden border-primary text-primary hover:bg-primary/5"
              onClick={() => navigate("/menu")}
            >
              Menu
            </Button>

            {/* CART */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 text-xs flex items-center justify-center">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* MOBILE MENU BUTTON */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* MOBILE NAV */}
        {isMenuOpen && (
          <div className="md:hidden border-t pt-4 pb-6 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="block px-2 text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {item.name}
              </Link>
            ))}

            {!token ? (
              <Button
                variant="outline"
                className="w-full mt-3"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/login");
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full mt-3"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("username");
                  localStorage.removeItem("isAdmin");
                  setIsMenuOpen(false);
                  navigate("/login");
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
