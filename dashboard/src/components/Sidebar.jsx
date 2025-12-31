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

              <button className="w-full flex items-center justify-between px-4 py-2 text-sm text-[#e3e3e3] hover:bg-[#2d2e30]">
                <div className="flex items-center gap-3">
                  <Palette size={18} className="text-[#9aa0a6]" /> Theme
                </div>
                <ChevronRight size={14} className="text-[#9aa0a6]" />
              </button>

              <div className="my-1 border-t border-[#3c4043]"></div>

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
            <div className="flex items-center justify-between gap-3 p-1 rounded-lg group">
              <div className="min-w-[32px] h-8 rounded-full bg-[#c2185b] flex items-center justify-center text-[11px] font-bold text-white">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              {!isCollapsed && (
                <span className="text-[13px] font-medium truncate text-[#e3e3e3]">
                  User {user?.email}
                </span>
              )}
              <button
                onClick={() => {
                  logout();
                  window.location.reload();
                }}
                className="text-[11px] text-[#9aa0a6] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                Logout
              </button>

            </div>

          ) : (
            <Link
              to="/signin"
              className="flex items-center gap-3 p-1 rounded-lg hover:bg-[#1a1a1a]"
            >
              <div className="min-w-[32px] h-8 rounded-full bg-[#c2185b] flex items-center justify-center text-[10px] font-bold text-white">
                LARC
              </div>
              {!isCollapsed && (
                <span className="text-[13px] font-medium text-[#e3e3e3]">
                  Sign In
                </span>
              )}
            </Link>
          )}

        </div>
      </div>
    </aside>
  );
};

export default Sidebar;