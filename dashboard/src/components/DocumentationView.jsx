import React from 'react';
import { 
  Search, BookOpen, Code2, Terminal, 
  Cpu, ShieldCheck, Globe, HelpCircle, 
  ArrowRight, ExternalLink, PlayCircle 
} from 'lucide-react';

const DocumentationView = () => {
  const categories = [
    { title: 'Core Concepts', icon: <Cpu className="text-blue-400" />, items: ['Models', 'Tokens', 'Context Windows'] },
    { title: 'Security', icon: <ShieldCheck className="text-green-400" />, items: ['Encryption', 'Safety filters', 'Compliance'] },
    { title: 'Deployment', icon: <Globe className="text-purple-400" />, items: ['Cloud hosting', 'Edge runtime', 'Rate limits'] },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#e3e3e3] font-sans selection:bg-[#8ab4f8]/30">
      {/* Hero Section */}
      <div className="bg-[#1e1f20] border-b border-[#3c4043] py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 tracking-tight">Documentation</h1>
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9aa0a6] group-focus-within:text-[#8ab4f8] transition-colors" size={22} />
            <input 
              type="text" 
              placeholder="Search guides, libraries, and API references..." 
              className="w-full bg-[#0e0e0e] border border-[#3c4043] rounded-2xl py-4 pl-14 pr-6 text-lg outline-none focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] transition-all placeholder:text-[#5f6368]"
            />
          </div>
          <div className="flex gap-3 mt-4 text-sm text-[#9aa0a6]">
            <span>Popular:</span>
            {['API Authentication', 'SDK Installation', 'Fine-tuning'].map((tag) => (
              <button key={tag} className="hover:text-[#8ab4f8] underline decoration-[#3c4043] underline-offset-4">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8 lg:p-12">
        {/* Getting Started Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0e0e0e] border border-[#3c4043] p-8 rounded-3xl hover:border-[#8ab4f8]/50 transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <PlayCircle className="text-[#8ab4f8]" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Quickstart Guide</h3>
            <p className="text-[#9aa0a6] leading-relaxed mb-6">Learn how to integrate Larc AI into your application in less than 5 minutes.</p>
            <span className="flex items-center gap-2 text-[#8ab4f8] font-medium group-hover:gap-4 transition-all">
              Start Building <ArrowRight size={18} />
            </span>
          </div>

          <div className="bg-[#1e1f20] border border-[#3c4043] p-8 rounded-3xl hover:border-[#8ab4f8]/50 transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
              <Code2 className="text-purple-400" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">API Reference</h3>
            <p className="text-[#9aa0a6] leading-relaxed mb-6">Explore our REST API endpoints, request schemas, and response formats.</p>
            <span className="flex items-center gap-2 text-[#8ab4f8] font-medium">
              View Specs <ExternalLink size={16} />
            </span>
          </div>

          <div className="bg-[#1e1f20] border border-[#3c4043] p-8 rounded-3xl hover:border-[#8ab4f8]/50 transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
              <Terminal className="text-green-400" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">SDKs & Libraries</h3>
            <p className="text-[#9aa0a6] leading-relaxed mb-6">Official client libraries for Python, Node.js, Go, and Ruby.</p>
            <span className="flex items-center gap-2 text-[#8ab4f8] font-medium">
              Browse Github <ExternalLink size={16} />
            </span>
          </div>
        </div>

        {/* Resources Section */}
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <BookOpen className="text-[#8ab4f8]" /> Explore by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {categories.map((cat, i) => (
            <div key={i} className="space-y-4">
              <div className="flex items-center gap-3 font-semibold text-lg border-b border-[#3c4043] pb-4 mb-4">
                {cat.icon} {cat.title}
              </div>
              <ul className="space-y-3">
                {cat.items.map((item) => (
                  <li key={item} className="text-[#9aa0a6] hover:text-white cursor-pointer flex items-center gap-2 text-sm">
                    <div className="w-1 h-1 bg-[#3c4043] rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Support Banner */}
        <div className="bg-[#1a1a1a] border border-[#3c4043] p-1 rounded-[2.5rem] p-1">
            <div className="bg-[#0e0e0e] rounded-[2.2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#3c4043]/30">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#1e1f20] rounded-full flex items-center justify-center border border-[#3c4043]">
                        <HelpCircle size={32} className="text-[#8ab4f8]" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold">Can't find what you're looking for?</h4>
                        <p className="text-[#9aa0a6]">Join our developer community or chat with our support team.</p>
                    </div>
                </div>
                <button className="px-8 py-3 bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#0e0e0e] font-bold rounded-full transition-all whitespace-nowrap">
                    Get Support
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationView;