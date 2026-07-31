import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EnvelopeIcon, LockClosedIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { signIn } from "../../lib/auth-client";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const {data, error} = await signIn.email({
      email: email,
      password: password,
    })
    if(error){
      console.error('login error', error);
    }
    if(data){
      console.log("Login success", data)
      navigate("/")
    }
    setIsLoading(false);
    
  };

  return (
    <div className="min-h-screen w-full bg-[#fafaf9] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Background Pastel Atmospheric Gradient (Anytype Style) */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-[#ffedbe]/40 via-[#cdffea]/30 to-[#b9eeff]/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-br from-[#e7d4ff]/40 via-[#ffbcc3]/30 to-[#f1ffc9]/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-md space-y-8">
        
        {/* Brand & Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-serif font-bold text-xl leading-none shadow-sm group-hover:scale-105 transition-transform">
              N
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-black flex items-center gap-1.5">
              NewsLetter
              <span className="w-2 h-2 rounded-full bg-[#3cd9b3]" />
            </span>
          </Link>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 pt-2">
            Welcome back
          </h1>
          <p className="text-stone-600 text-sm font-light">
            Sign in to access your subscriber edition & private archive
          </p>
        </div>

        {/* Login Form Box */}
        <div className="bg-white border border-black rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-mono font-semibold uppercase tracking-wider text-stone-700">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#fafaf9] text-stone-900 placeholder-stone-400 pl-11 pr-4 py-3.5 text-sm rounded-2xl border border-stone-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-mono font-semibold uppercase tracking-wider text-stone-700">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-stone-500 hover:text-black font-light transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <LockClosedIcon className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#fafaf9] text-stone-900 placeholder-stone-400 pl-11 pr-4 py-3.5 text-sm rounded-2xl border border-stone-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-black border-stone-300 rounded-none focus:ring-black accent-black cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2.5 block text-xs text-stone-600 cursor-pointer">
                Keep me signed in on this device
              </label>
            </div>

            {/* Primary CTA Button (Pill Radius as per Anytype spec) */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 bg-black text-white font-medium text-sm rounded-full hover:bg-stone-800 transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>

          </form>

          {/* Hairline Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="w-full border-t border-stone-200" />
            <span className="bg-white px-3 text-xs font-mono text-stone-400 uppercase tracking-widest absolute">
              or
            </span>
          </div>

          {/* Secondary Passkey / Magic Link Option */}
          <button
            type="button"
            className="w-full py-3 px-6 bg-transparent text-stone-900 font-medium text-sm rounded-full border border-stone-300 hover:border-black hover:bg-stone-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#3cd9b3]" />
            <span>Continue with Passkey</span>
          </button>

        </div>

        {/* Footer Switch to Register */}
        <p className="text-center text-xs text-stone-500 font-light">
          Don't have a newsletter subscription?{" "}
          <Link to="/auth/register" className="font-medium text-black underline underline-offset-4 hover:text-[#3cd9b3] transition-colors">
            Subscribe now
          </Link>
        </p>

      </div>
    </div>
  );
}