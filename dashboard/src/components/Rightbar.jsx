import React from 'react';
import { HelpCircle } from 'lucide-react';

const LogsView = () => {
  return (
    <main className="flex-1 bg-[#131314] text-[#e3e3e3] overflow-y-auto">
      {/* Top Bar / Filters Area */}
      <div className="p-6 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-medium">Gemini API Logs and Datasets</h2>
          <HelpCircle size={16} className="text-[#9aa0a6] cursor-pointer" />
        </div>

        {/* Mock Filter Controls */}
        <div className="flex gap-4">
          <div className="text-xs text-[#9aa0a6]">Project <span className="bg-[#2a2a2a] px-2 py-1 rounded ml-1 text-white">Default Gemini Project... ▾</span></div>
          <div className="text-xs text-[#9aa0a6]">Dataset <span className="bg-[#2a2a2a] px-2 py-1 rounded ml-1 text-white">All datasets ▾</span></div>
        </div>
      </div>

      {/* Empty State / Billing Prompt */}
      <div className="flex flex-col items-center justify-center h-[70%]">
        <div className="relative mb-8">
            {/* Custom SVG for the star-like icon in your screenshot */}
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-[#3c4043]">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke="currentColor" strokeWidth="1" />
            </svg>
        </div>
        
        <h3 className="text-[18px] font-medium mb-2">Set up billing to enable LarcAI API logging</h3>
        <p className="text-[#9aa0a6] text-sm mb-8 text-center max-w-md">
          You can then view your LarcAI API history and create datasets.
        </p>
        
        <button className="bg-[#e3e3e3] text-[#131314] px-6 py-2 rounded-full font-medium hover:bg-white transition-colors">
          Set up billing
        </button>
      </div>
    </main>
  );
};

export default LogsView;