import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // Import icons for show/hide
import { signup } from '../api/auth';
const SignUpPage = () => {
  // 1. States for form data and visibility
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  // 2. Validation Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try{
      const res = await signup({
        fullName: formData.fullName,
        email:formData.email,
        password:formData.password
      })
      console.log("signup success",res);
      window.location.href="/signin";
    }catch(e){
      setError(e.error||"failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0e0e0e] text-white px-4 font-sans">
      <div className="w-full max-w-md p-8 bg-[#1e1f20] border border-[#3c4043] rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Create an account</h1>
          <p className="text-[#9aa0a6] text-sm">Join Larc AI and start building today</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="text-left">
            <label className="block text-xs font-medium text-[#9aa0a6] mb-1 ml-1">Full Name</label>
            <input 
              type="text" 
              name="fullName"
              required
              onChange={handleChange}
              className="w-full bg-[#0e0e0e] border border-[#3c4043] text-white rounded-lg px-4 py-2.5 focus:border-[#8ab4f8] outline-none transition-colors"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div className="text-left">
            <label className="block text-xs font-medium text-[#9aa0a6] mb-1 ml-1">Email address</label>
            <input 
              type="email" 
              name="email"
              required
              onChange={handleChange}
              className="w-full bg-[#0e0e0e] border border-[#3c4043] text-white rounded-lg px-4 py-2.5 focus:border-[#8ab4f8] outline-none transition-colors"
              placeholder="email@example.com"
            />
          </div>

          {/* Password with Eye Button */}
          <div className="text-left">
            <label className="block text-xs font-medium text-[#9aa0a6] mb-1 ml-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                required
                onChange={handleChange}
                className="w-full bg-[#0e0e0e] border border-[#3c4043] text-white rounded-lg px-4 py-2.5 focus:border-[#8ab4f8] outline-none transition-colors"
                placeholder="Create a password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa0a6] hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password with Eye Button */}
          <div className="text-left">
            <label className="block text-xs font-medium text-[#9aa0a6] mb-1 ml-1">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                name="confirmPassword"
                required
                onChange={handleChange}
                className={`w-full bg-[#0e0e0e] border rounded-lg px-4 py-2.5 focus:border-[#8ab4f8] outline-none transition-colors ${error ? 'border-red-500' : 'border-[#3c4043]'}`}
                placeholder="Repeat your password"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa0a6] hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Error Message */}
            {error && <p className="text-red-500 text-[11px] mt-1 ml-1 animate-pulse">{error}</p>}
          </div>

          <button className="w-full mt-4 py-2.5 bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#0e0e0e] font-bold rounded-lg transition-colors shadow-lg">
            Create account
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#9aa0a6]">
          Already have an account? <Link to="/signin" className="text-[#8ab4f8] hover:underline ml-1">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;