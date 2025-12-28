import React from 'react';
import { Plus, Folder, MoreVertical, Search } from 'lucide-react';

const ProjectsView = () => {
  const projects = [
    { id: 1, name: 'Gemini Chat App', date: 'Created 2 days ago', status: 'Active' },
    { id: 2, name: 'Vision API Test', date: 'Created 1 week ago', status: 'Active' },
    { id: 3, name: 'LarcAI Core', date: 'Created 1 month ago', status: 'Active' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-[#e3e3e3]">Projects</h2>
          <p className="text-[#9aa0a6] text-sm">Manage your AI Studio environments and API configurations.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#e3e3e3] text-[#131314] px-4 py-2 rounded-full font-medium hover:bg-white transition-colors text-sm">
          <Plus size={18} />
          Create Project
        </button>
      </div>

      {/* Search/Filter Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa0a6]" size={16} />
        <input 
          type="text" 
          placeholder="Filter projects..." 
          className="w-full bg-[#1e1f20] border border-[#3c4043] rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#8ab4f8] transition-colors"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="bg-[#1e1f20] border border-[#3c4043] p-5 rounded-xl hover:border-[#5f6368] transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[#2a2b2f] rounded-lg text-[#8ab4f8]">
                <Folder size={20} />
              </div>
              <button className="text-[#9aa0a6] hover:text-white">
                <MoreVertical size={18} />
              </button>
            </div>
            <h3 className="font-medium text-[#e3e3e3] mb-1 group-hover:text-[#8ab4f8] transition-colors">
              {project.name}
            </h3>
            <p className="text-xs text-[#9aa0a6]">{project.date}</p>
            
            <div className="mt-4 pt-4 border-t border-[#3c4043] flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[#34a853] bg-[#34a8531a] px-2 py-0.5 rounded">
                {project.status}
              </span>
              <span className="text-xs text-[#8ab4f8] opacity-0 group-hover:opacity-100 transition-opacity">
                Open Project →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsView;