import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LogsView from './components/Rightbar';
import APIKeysView from './components/APIKeysView';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import DocumentationView from './components/DocumentationView'
import BillingView from './components/BillingView'
function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // State to manage modal visibility
  
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black text-white font-sans">
      {}
      <Sidebar 
        isCollapsed={isCollapsed} 
        toggleSidebar={toggleSidebar} 
        onSignInClick={() => setIsSignInOpen(true)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-auto bg-[#0e0e0e]">
        <Routes>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<Navigate to="/logs" />} />
          <Route path="/api-keys" element={<APIKeysView />} />

          {/* Settings Menu Routes */}
          <Route path="/status" element={<div className="p-10 text-gray-400">System Status Page</div>} />
          <Route path="/terms" element={<div className="p-10 text-gray-400">Terms of Service Page</div>} />
          <Route path="/privacy" element={<div className="p-10 text-gray-400">Privacy Policy Page</div>} />
          <Route path="/feedback" element={<div className="p-10 text-gray-400">Feedback Page</div>} />
          <Route path="/billing-support" element={<div className="p-10 text-gray-400">Billing Support Page</div>} />
          
          <Route path="/logs" element={<DocumentationView />} />
          <Route path="/billing" element={<BillingView />} />
          
          <Route path="*" element={<Navigate to="/logs" />} />
        </Routes>
      </div>

     
    </div>
  );
}

export default App;