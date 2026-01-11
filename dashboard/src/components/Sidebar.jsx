import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutGrid,
  Key,
  CreditCard,
  Menu,
  Settings,
  Palette,
  ChevronRight,
  ClipboardList,
  ShieldCheck,
  Flag,
  Wallet,
  ExternalLink
} from 'lucide-react';
import { getUserFromToken } from "../utils/user";
import { isAuthenticated, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const user = getUserFromToken();
const loggedIn = isAuthenticated();

// Removed onSignInClick from props as we are now using a direct link
const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutGrid size={20} /> },
    { name: 'API keys', path: '/api-keys', icon: <Key size={20} /> },
    { name: 'Usage and Billing', path: '/billing', icon: <CreditCard size={20} /> },
    { name: 'Documentation', path: '/logs', icon: <ExternalLink size={20} /> },
  ];

  return (
    <aside className={`h-screen flex flex-col justify-between py-4 transition-all duration-300 
      bg-[#0e0e0e] border-r border-[#2a2a2a] text-[#e3e3e3] 
      ${isCollapsed ? 'w-[72px]' : 'w-[280px]'}`}>

      {/* Top Section */}
      <div>
        <div className={`px-5 mb-8 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <h1 className="text-[22px] font-medium tracking-tight text-[#e3e3e3]">
              Larc <span className="font-normal opacity-70">AI</span>
            </h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-[#2a2a2a] rounded-full text-[#9aa0a6] transition-colors"
          >
            <Menu size={22} />
          </button>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                w-full flex items-center gap-4 px-4 py-[12px] rounded-full text-[14px] font-medium transition-all
                ${isActive
                  ? 'bg-[#2d2e30] text-[#e3e3e3]'
                  : 'text-[#9aa0a6] hover:bg-[#1a1a1a] hover:text-[#e3e3e3]'}
                ${isCollapsed ? 'justify-center px-0 w-[48px] mx-auto' : ''}
              `}
            >
              <span className="min-w-[24px] flex justify-center">{item.icon}</span>
              {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="px-3">
        <div className="space-y-1">
          {/* Settings Section with Hover Menu */}
          <div className="relative group">
            <button className={`w-full flex items-center gap-4 px-4 py-2.5 text-sm rounded-full transition-colors 
              hover:bg-[#1a1a1a] text-[#9aa0a6] group-hover:text-[#e3e3e3]
              ${isCollapsed ? 'justify-center' : ''}`}>
              <Settings size={20} />
              {!isCollapsed && <span className="whitespace-nowrap">Settings</span>}
            </button>

            {/* Hover Menu Popup */}
            <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#1e1f20] border border-[#3c4043] rounded-xl shadow-2xl py-2 z-50
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">


              <Link to="/terms" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#e3e3e3] hover:bg-[#2d2e30]">
                <ClipboardList size={18} className="text-[#9aa0a6]" /> Terms of service
              </Link>

              <Link to="/privacy" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#e3e3e3] hover:bg-[#2d2e30]">
                <ShieldCheck size={18} className="text-[#9aa0a6]" /> Privacy policy
              </Link>

              <Link to="/feedback" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#e3e3e3] hover:bg-[#2d2e30]">
                <Flag size={18} className="text-[#9aa0a6]" /> Send feedback
              </Link>

              <Link to="/billing-support" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#e3e3e3] hover:bg-[#2d2e30]">
                <Wallet size={18} className="text-[#9aa0a6]" /> Billing Support
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Info - Now linked to the dedicated Sign In page */}
        <div className={`mt-4 pt-4 border-t border-[#2a2a2a] mb-2 ${isCollapsed ? 'flex justify-center' : 'px-2'}`}>
          {loggedIn ? (
            <div className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${isCollapsed ? 'justify-center' : 'hover:bg-[#1a1a1a]'
              } group`}>
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c2185b] to-[#e91e63] flex items-center justify-center text-xs font-semibold text-white shadow-md">
                  {user?.first_name?.[0]?.toUpperCase() || user?.last_name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#121212]"></div>
              </div>

              {/* User Info & Logout */}
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-[#e3e3e3] truncate">
                      {user?.first_name} {user?.last_name}
                    </div>
                    <div className="text-[11px] text-[#9aa0a6] truncate">
                      {user?.email || 'Account'}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      window.location.reload();
                    }}
                    className="flex-shrink-0 p-1.5 rounded-md text-[#9aa0a6] hover:text-red-400 hover:bg-[#2a2a2a] transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Logout"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/signin"
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${isCollapsed ? 'justify-center' : 'hover:bg-[#1a1a1a]'
                } group`}
            >
              {/* Logo/Icon */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c2185b] to-[#e91e63] flex items-center justify-center shadow-md">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              {/* Sign In Text */}
              {!isCollapsed && (
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-[#e3e3e3] group-hover:text-white transition-colors">
                    Sign In
                  </div>
                  <div className="text-[11px] text-[#9aa0a6]">
                    Access your account
                  </div>
                </div>
              )}

              {/* Arrow Icon */}
              {!isCollapsed && (
                <svg
                  className="w-4 h-4 text-[#9aa0a6] group-hover:text-[#e3e3e3] group-hover:translate-x-0.5 transition-all duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;