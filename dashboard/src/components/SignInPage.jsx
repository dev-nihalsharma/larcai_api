import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0e0e0e] text-white px-4 font-sans">
      <div className="w-full max-w-md p-8 bg-[#1e1f20] border border-[#3c4043] rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Sign in to Larc AI</h1>
          <p className="text-[#9aa0a6] text-sm">Enter your credentials to continue</p>
        </div>

        <form className="space-y-4">
          {/* Email Field */}
          <div className="text-left">
            <label className="block text-xs font-medium text-[#9aa0a6] mb-1 ml-1">Email address</label>
            <input 
              type="email" 
              className="w-full bg-[#0e0e0e] border border-[#3c4043] text-white rounded-lg px-4 py-2.5 focus:border-[#8ab4f8] outline-none transition-colors placeholder:text-[#3c4043]"
              placeholder="email@example.com"
            />
          </div>

          {/* Password Field with Eye Toggle */}
          <div className="text-left">
            <div className="flex justify-between items-center mb-1 ml-1">
              <label className="block text-xs font-medium text-[#9aa0a6]">Password</label>
              <Link to="/forgot-password" size="sm" className="text-xs text-[#8ab4f8] hover:underline">
                Forgot password?
              </Link>
            </div>
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full bg-[#0e0e0e] border border-[#3c4043] text-white rounded-lg px-4 py-2.5 focus:border-[#8ab4f8] outline-none transition-colors placeholder:text-[#3c4043] pr-12"
                placeholder="••••••••"
              />
              
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa0a6] hover:text-[#e3e3e3] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="w-full mt-2 py-2.5 bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#0e0e0e] font-bold rounded-lg transition-colors shadow-lg active:scale-[0.98]">
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#9aa0a6]">
          Don't have an account? <Link to="/signup" className="text-[#8ab4f8] hover:underline ml-1">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;