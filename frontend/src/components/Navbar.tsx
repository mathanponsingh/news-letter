import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Bars3Icon, 
  XMarkIcon, 
  MagnifyingGlassIcon,
  EnvelopeIcon,
  UserIcon,
  ChevronDownIcon,
  BookmarkIcon,
  Cog6ToothIcon,
  ArrowRightEndOnRectangleIcon
} from "@heroicons/react/24/outline";
import { useSession, signOut } from "../lib/auth-client";
import { toast } from "react-toastify";

export function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  // Check for OAuth redirect success flag
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "success") {
      toast.success("Signed in successfully!");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Scroll effect for subtle header elevation styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu and user menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  const navLinks = [
    { name: "Latest Issues", href: "/" },
    { name: "Topics", href: "/#topics" },
    { name: "Archive", href: "/#archive" },
    { name: "About", href: "/#about" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-xs"
          : "bg-white border-b border-stone-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className="group flex items-center gap-2 text-stone-900 transition-opacity hover:opacity-85"
            >
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-1">
                NewsLetter
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`px-3 py-1.5 text-sm tracking-tight font-normal transition-all duration-200 rounded-full ${
                      isActive
                        ? "text-stone-900 font-medium bg-stone-100"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions: Search & Auth CTAs */}
          <div className="flex items-center gap-3">
            
            {/* Quick Search Toggle / Input */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-stone-50 border border-stone-300 rounded-full px-3 py-1 text-sm w-44 sm:w-64 transition-all duration-200">
                  <MagnifyingGlassIcon className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent outline-none text-stone-800 placeholder-stone-400 text-xs sm:text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="text-stone-400 hover:text-stone-600 ml-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
                  aria-label="Search"
                  title="Search newsletters"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Profile Dropdown or Sign In / Subscribe */}
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-3 pr-2 text-stone-800 hover:text-stone-900 bg-stone-100/90 hover:bg-stone-200/80 border border-stone-200/90 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-stone-900/20"
                  aria-expanded={userMenuOpen}
                >
                  <div className="w-7 h-7 rounded-full bg-stone-900 text-white font-medium text-xs flex items-center justify-center uppercase shadow-xs overflow-hidden shrink-0">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User profile"}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      session.user.name ? session.user.name.charAt(0) : "U"
                    )}
                  </div>
                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {session.user.name || "Account"}
                  </span>
                  <ChevronDownIcon className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 py-2 transition-all">
                      {/* User Header Info */}
                      <div className="px-4 py-3 border-b border-stone-100 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-stone-900 text-white font-medium text-sm flex items-center justify-center uppercase shadow-xs overflow-hidden shrink-0">
                          {session.user.image ? (
                            <img
                              src={session.user.image}
                              alt={session.user.name || "User profile"}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            session.user.name ? session.user.name.charAt(0) : "U"
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-stone-900 truncate">
                            {session.user.name || "User Account"}
                          </p>
                          <p className="text-xs text-stone-500 truncate mt-0.5">
                            {session.user.email}
                          </p>
                        </div>
                      </div>

                      {/* Dropdown Navigation Links */}
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-stone-500" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/saved"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                        >
                          <BookmarkIcon className="w-4 h-4 text-stone-500" />
                          <span>Saved Articles</span>
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                        >
                          <Cog6ToothIcon className="w-4 h-4 text-stone-500" />
                          <span>Settings</span>
                        </Link>
                      </div>

                      {/* Sign Out Action */}
                      <div className="pt-1 border-t border-stone-100">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <ArrowRightEndOnRectangleIcon className="w-4 h-4 text-red-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-stone-900 bg-transparent border border-stone-300 hover:border-stone-900 rounded-full transition-all duration-200 hover:bg-stone-50"
                >
                  Sign In
                </Link>

                <Link
                  to="/auth/register"
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-full transition-all duration-200 shadow-xs hover:shadow-md active:scale-95"
                >
                  <EnvelopeIcon className="w-4 h-4" />
                  <span>Subscribe</span>
                </Link>
              </>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="px-4 py-2.5 text-base font-medium text-stone-800 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            {session?.user ? (
              <>
                <div className="px-4 py-3 bg-stone-50 rounded-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-stone-900 text-white font-medium text-sm flex items-center justify-center uppercase shadow-xs overflow-hidden shrink-0">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User profile"}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      session.user.name ? session.user.name.charAt(0) : "U"
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-stone-900 truncate">{session.user.name}</p>
                    <p className="text-xs text-stone-500 truncate">{session.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-center py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth/login"
                className="w-full text-center py-2.5 text-sm font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}