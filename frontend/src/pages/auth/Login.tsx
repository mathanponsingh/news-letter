import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EnvelopeIcon, LockClosedIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { signIn } from "../../lib/auth-client";
import { toast } from "react-toastify";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const {data, error} = await signIn.email({
      email: email,
      password: password,
      callbackURL: window.location.origin,
    })
    if(error){
      console.error('login error', error);
      toast.error(error.message || "Login failed");
    }
    if(data){
      console.log("Login success", data);
      toast.success("Login successful");
      navigate("/");
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/?auth=success`,
      });
      if (error) {
        console.error("Google login error:", error);
        toast.error(error.message || "Google sign in failed");
      }
    } catch (err) {
      console.error("Google login failed:", err);
      toast.error("Google sign in failed");
    } finally {
      setIsGoogleLoading(false);
    }
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

          {/* Secondary Google Authentication Option */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-3 px-6 bg-white text-stone-800 font-medium text-sm rounded-full border border-stone-300 hover:border-black hover:bg-stone-50 transition-all duration-200 flex items-center justify-center gap-3 shadow-xs disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <span className="w-5 h-5 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
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