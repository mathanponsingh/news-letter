import { useState } from "react";
import { Link } from "react-router-dom";
import { EnvelopeIcon, ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-black text-white border-t border-stone-800 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter CTA Banner (Anytype Black Surface with Mint Accent) */}
        <div className="bg-stone-950 border border-stone-800 rounded-3xl p-8 sm:p-12 mb-16 relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Pastel Glow Background */}
          <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-gradient-to-br from-[#3cd9b3]/15 via-[#cdffea]/10 to-[#e7d4ff]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-[#3cd9b3] text-xs font-mono uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-[#3cd9b3] animate-pulse" />
              Weekly Digest
            </div>
            
            <h3 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
              Never miss a thoughtful publication.
            </h3>
            <p className="text-stone-400 text-base font-light mb-8 leading-relaxed max-w-xl">
              Join over 24,000+ engineers, designers, and thinkers receiving long-form reflections on quiet software, digital minimalism, and engineering culture every Thursday.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-3 text-[#3cd9b3] bg-stone-900 border border-[#3cd9b3]/40 px-6 py-3.5 rounded-full text-sm font-medium w-fit">
                <CheckCircleIcon className="w-5 h-5 shrink-0" />
                <span>You're subscribed! Welcome to the ThoughtStream digest.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md">
                <div className="relative flex-1">
                  <EnvelopeIcon className="w-5 h-5 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-900 text-white placeholder-stone-500 pl-11 pr-4 py-3.5 text-sm rounded-full border border-stone-800 focus:outline-none focus:border-[#3cd9b3] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-7 py-3.5 bg-white text-black font-medium text-sm rounded-full hover:bg-[#3cd9b3] hover:text-black transition-all duration-200 inline-flex items-center justify-center gap-2 group shrink-0 active:scale-95 shadow-md"
                >
                  <span>Subscribe</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & Mission Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-serif font-bold text-xl leading-none group-hover:scale-105 transition-transform">
                N
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight flex items-center gap-1.5">
                NewsLetter
                <span className="w-2 h-2 rounded-full bg-[#3cd9b3]" title="Live Edition" />
              </span>
            </Link>
            <p className="text-stone-400 text-sm font-light leading-relaxed max-w-sm">
              A contemplative digital publication embracing generous white space, typographic restraint, and calm technological discourse.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 text-stone-300 text-xs font-mono border border-stone-800">
                <span className="w-2 h-2 rounded-full bg-[#3cd9b3]" />
                Independent Publishing
              </span>
              <span className="text-xs text-stone-500 font-mono">v1.0.0</span>
            </div>
          </div>

          {/* Navigation Column 1: Publication */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold text-stone-400 uppercase tracking-widest">
              Publication
            </h4>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <Link to="/" className="text-stone-400 hover:text-white transition-colors">
                  Latest Issues
                </Link>
              </li>
              <li>
                <Link to="/#topics" className="text-stone-400 hover:text-white transition-colors">
                  Topics & Categories
                </Link>
              </li>
              <li>
                <Link to="/#archive" className="text-stone-400 hover:text-white transition-colors">
                  Full Archive
                </Link>
              </li>
              <li>
                <a href="#rss" className="text-stone-400 hover:text-white transition-colors">
                  RSS Feed
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Authors & Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold text-stone-400 uppercase tracking-widest">
              Community
            </h4>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <Link to="/#about" className="text-stone-400 hover:text-white transition-colors">
                  About the Author
                </Link>
              </li>
              <li>
                <Link to="/#manifesto" className="text-stone-400 hover:text-white transition-colors">
                  Writing Philosophy
                </Link>
              </li>
              <li>
                <Link to="/auth/login" className="text-stone-400 hover:text-white transition-colors">
                  Subscriber Portal
                </Link>
              </li>
              <li>
                <a href="#podcast" className="text-stone-400 hover:text-white transition-colors">
                  Audio Edition
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3: Legal & System */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold text-stone-400 uppercase tracking-widest">
              Legal & Privacy
            </h4>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <a href="#privacy" className="text-stone-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-stone-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#ethics" className="text-stone-400 hover:text-white transition-colors">
                  Editorial Ethics
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Status & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-stone-500">
          <p>© {new Date().getFullYear()} NewsLetter. Built with restraint & precision.</p>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3cd9b3]" />
              <span className="text-stone-400">All Systems Operational</span>
            </div>
            <span>•</span>
            <span className="text-stone-400">Distraction-Free</span>
          </div>
        </div>

      </div>
    </footer>
  );
}