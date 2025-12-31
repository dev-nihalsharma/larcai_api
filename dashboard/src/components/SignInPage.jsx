import React, { useState } from 'react'; // 1. Added useState
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // 2. Added Icons
import { login } from '../api/auth';
const SignInPage = () => {
  // 3. State to track if password is shown or hidden
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0e0e0e] text-white px-4 font-sans">
      <div className="w-full max-w-md p-8 bg-[#1e1f20] border border-[#3c4043] rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Sign in to Larc AI</h1>
          <p className="text-[#9aa0a6] text-sm">Use your Google Account to continue</p>
        </div>

        {/* Google Sign-In Button */}
        <button className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-100 text-black font-medium rounded-full transition-all mb-6">
          <img
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <div className="relative mb-6 flex items-center py-1">
          <div className="flex-grow border-t border-[#3c4043]"></div>
          <span className="mx-4 text-xs text-[#5f6368] uppercase font-bold tracking-wider">or</span>
          <div className="flex-grow border-t border-[#3c4043]"></div>
        </div>

        <form className="space-y-4" 
          onSubmit={async (e)=>{
            e.preventDefault()
            try {
              const res = await login({email,password})
              console.log("login success",res);
              if(res.token){
                localStorage.setItem("token",res.token);
              }
              window.location.href="/";
            } catch (error) {
              setError(error.error||"Invalid cred..")
            }
          }}
        >
          {/* Email Field */}
          <div className="text-left">
            <label className="block text-xs font-medium text-[#9aa0a6] mb-1 ml-1">Email address</label>
            <input
              type="email"
              className="w-full bg-[#0e0e0e] border border-[#3c4043] text-white rounded-lg px-4 py-2.5 focus:border-[#8ab4f8] outline-none transition-colors placeholder:text-[#3c4043]"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

            {/* Wrapper div must be 'relative' to position the eye icon inside */}
            <div className="relative">
              <input
                // Toggle type between 'password' and 'text'
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0e0e0e] border border-[#3c4043] text-white rounded-lg px-4 py-2.5 focus:border-[#8ab4f8] outline-none transition-colors placeholder:text-[#3c4043] pr-12"
                placeholder="••••••••"
              />

              {/* The Eye Button */}
              <button
                type="button" // Important: set to button so it doesn't submit the form
                onClick={() => setShowPassword(!showPassword)} // Toggle state
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