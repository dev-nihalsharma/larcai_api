import React from 'react';
import { FileText, Plus, Copy, CircleDollarSign, BarChart3, MoreVertical } from 'lucide-react';

const APIKeysView = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full text-[#e3e3e3]">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-semibold">API Keys</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-[#2a2a2a] rounded-lg transition-colors">
            <FileText size={18} />
            API quickstart
          </button>
          <button className="flex items-center gap-2 bg-[#2d2e30] border border-[#3c4043] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#3c4043] transition-colors">
            <Plus size={18} />
            Create API key
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#9aa0a6]">Group by</span>
          <div className="flex bg-[#1e1f20] rounded-full p-1 border border-[#3c4043]">
            <button className="px-4 py-1 text-xs bg-[#2d2e30] rounded-full flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-white"></div> API key
            </button>
            
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#9aa0a6]">Filter by</span>
          <button className="bg-[#1e1f20] border border-[#3c4043] px-3 py-1.5 rounded-lg flex items-center gap-10">
            All projects <span className="text-[10px]">▼</span>
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 px-4 py-3 text-xs font-medium text-[#9aa0a6] border-b border-[#2a2a2a]">
        <div>Key</div>
        <div>Project</div>
        <div>Created on</div>
        <div>Quota tier</div>
      </div>

      {/* Table Row (Sample Data) */}
      <div className="grid grid-cols-4 px-4 py-6 text-sm border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors group">
        <div className="text-[#8ab4f8] cursor-pointer underline underline-offset-4">...Spx8<br/><span className="text-[#9aa0a6] text-xs no-underline inline-block mt-1">Default Gemini API Key</span></div>
        <div className="text-[#8ab4f8] cursor-pointer underline underline-offset-4">Default Gemini Project<br/><span className="text-[#9aa0a6] text-xs no-underline inline-block mt-1">gen-lang-client-0758454406</span></div>
        <div className="text-[#9aa0a6]">Dec 17, 2025</div>
        <div className="flex items-center justify-between">
          <div className="text-[#8ab4f8] cursor-pointer underline underline-offset-4">Set up billing<br/><span className="text-[#9aa0a6] text-xs no-underline inline-block mt-1">Unavailable</span></div>
          <div className="flex items-center gap-4 text-[#9aa0a6]">
            <Copy size={16} className="hover:text-white cursor-pointer" />
            <CircleDollarSign size={16} className="hover:text-white cursor-pointer" />
            <BarChart3 size={16} className="hover:text-white cursor-pointer" />
            <MoreVertical size={16} className="hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Bottom Information Section */}
      <div className="mt-20 flex flex-col items-center text-center">
        <div className="mb-6 opacity-30">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="text-white">
             <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-3">Can't find your API keys here?</h3>
        <p className="text-sm text-[#9aa0a6] max-w-md leading-relaxed mb-8">
          This list only shows API keys for projects imported into Google AI Studio. 
          Import other projects to manage their associated API Keys. You can also 
          create a new API Key above. <span className="text-[#8ab4f8] cursor-pointer">Learn more</span>
        </p>
        <button className="bg-[#2d2e30] border border-[#3c4043] px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#3c4043] transition-colors">
          Import projects
        </button>
      </div>
    </div>
  );
};

export default APIKeysView;