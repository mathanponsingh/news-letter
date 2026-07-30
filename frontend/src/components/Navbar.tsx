import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Bars3Icon, 
  XMarkIcon, 
  MagnifyingGlassIcon,
  EnvelopeIcon 
} from "@heroicons/react/24/outline";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

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
                <span className="w-2 h-2 rounded-full bg-[#3cd9b3] inline-block animate-pulse" title="Live Edition"></span>
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

            {/* Secondary CTA: Log in */}
            <Link
              to="/auth/login"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-stone-900 bg-transparent border border-stone-300 hover:border-stone-900 rounded-full transition-all duration-200 hover:bg-stone-50"
            >
              Sign In
            </Link>

            {/* Primary CTA: Subscribe */}
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-full transition-all duration-200 shadow-xs hover:shadow-md active:scale-95"
            >
              <EnvelopeIcon className="w-4 h-4" />
              <span>Subscribe</span>
            </Link>

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
            <Link
              to="/auth/login"
              className="w-full text-center py-2.5 text-sm font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}