import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import APIKeysView from './components/APIKeysView';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import DocumentationView from './components/DocumentationView'; // Import new views
import BillingView from './components/BillingView';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <Routes>
      {/* 1. Auth Routes - These render without the Sidebar */}
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* 2. Dashboard Layout - Sidebar is only included here */}
      <Route
        path="/*"
        element={
          <div className="flex h-screen w-full overflow-hidden bg-black text-white font-sans">
            <Sidebar 
              isCollapsed={isCollapsed} 
              toggleSidebar={toggleSidebar} 
            />
            
            <div className="flex-1 flex flex-col min-w-0 overflow-auto bg-[#0e0e0e]">
              <Routes>
                <Route path="/" element={<Navigate to="/logs" />} />
                <Route path="/api-keys" element={<APIKeysView />} />

                {/* Settings Menu Routes */}
                <Route path="/status" element={<div className="p-10 text-gray-400">System Status Page</div>} />
                <Route path="/terms" element={<div className="p-10 text-gray-400">Terms of Service Page</div>} />
                <Route path="/privacy" element={<div className="p-10 text-gray-400">Privacy Policy Page</div>} />
                <Route path="/feedback" element={<div className="p-10 text-gray-400">Feedback Page</div>} />
                <Route path="/billing-support" element={<div className="p-10 text-gray-400">Billing Support Page</div>} />
                
                {/* Updated Documentation and Billing Views */}
                <Route path="/logs" element={<DocumentationView />} />
                <Route path="/billing" element={<BillingView />} />
                
                {/* Fallback redirect */}
                <Route path="*" element={<Navigate to="/logs" />} />
              </Routes>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;