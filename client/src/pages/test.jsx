import React, { useState } from 'react';
import { 
  GitBranch, Users, Activity, ExternalLink, 
  MoreHorizontal, Plus, Trash2, Shield, 
  ChevronRight, Terminal, Search, Bell
} from 'lucide-react';

const ProjectTerminal = ({ projectData, onBack }) => {
  // Mapping members from your form input
  const [operatives, setOperatives] = useState(
    projectData.members.map(email => ({
      email: email,
      role: "Engineer",
      status: "Active",
      workload: Math.floor(Math.random() * 40) + 60 + "%",
      lastActive: "Just now"
    }))
  );

  const removeMember = (index) => {
    setOperatives(operatives.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#a1a1aa] font-sans selection:bg-cyan-500/30">
      {/* Top Navigation Bar */}
      <nav className="h-14 border-b border-white/5 bg-black/40 backdrop-blur-md fixed top-0 w-full z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={onBack}>
            <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center text-black font-bold text-xs">A</div>
            <span className="text-white font-semibold text-sm tracking-tight">AXON <span className="text-white/40 font-normal">/</span> {projectData.ProjectName}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-md px-3 py-1 gap-2">
            <Search size={14} />
            <input className="bg-transparent border-none outline-none text-xs w-40" placeholder="Search terminal..." />
          </div>
          <Bell size={16} className="hover:text-white cursor-pointer transition" />
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 border border-white/20" />
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-[1400px] mx-auto grid grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Project Intelligence */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Header Section */}
          <header>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500 mb-4">
              <Terminal size={12} /> System Deployment Node
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-4 uppercase italic">
              {projectData.ProjectName}
            </h1>
            <p className="text-lg text-[#71717a] max-w-2xl leading-relaxed">
              {projectData.ProjectDetail}
            </p>
            
            <div className="flex flex-wrap gap-3 mt-8">
              <a href={projectData.RepoName} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-md text-sm text-white hover:bg-white/10 transition">
                <GitBranch size={16} className="text-purple-500" />
                {projectData.RepoName.replace('https://github.com/', '')}
                <ExternalLink size={12} className="text-white/20" />
              </a>
              <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-md text-sm text-cyan-400">
                <Activity size={16} />
                System Health: 98.2%
              </div>
            </div>
          </header>

          {/* Members Matrix */}
          <section className="bg-[#09090b] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">Project Operatives</h3>
              <button className="text-[10px] font-bold bg-white text-black px-3 py-1 rounded hover:bg-cyan-400 transition">ADD_MEMBER</button>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[#52525b] border-b border-white/5">
                  <th className="px-6 py-4 font-medium uppercase text-[10px]">Identifier</th>
                  <th className="px-6 py-4 font-medium uppercase text-[10px]">Deployment</th>
                  <th className="px-6 py-4 font-medium uppercase text-[10px]">Capacity</th>
                  <th className="px-6 py-4 font-medium uppercase text-[10px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {operatives.map((op, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{op.email.split('@')[0]}</span>
                        <span className="text-[11px] text-[#52525b]">{op.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                        <span className="text-xs uppercase font-bold text-[#71717a] tracking-wider">{op.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-purple-400">{op.workload}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => removeMember(idx)} className="opacity-0 group-hover:opacity-100 p-2 text-rose-500/50 hover:text-rose-500 transition">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* RIGHT COLUMN: Telemetry & Activity */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="p-6 bg-[#09090b] border border-white/5 rounded-xl">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
              <Shield size={14} className="text-cyan-500" /> Security Protocol
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs text-[#71717a]">Build Consistency</span>
                <span className="text-white text-sm font-mono">PASS</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[94%] bg-gradient-to-r from-cyan-500 to-purple-500" />
              </div>
              <div className="pt-4 mt-4 border-t border-white/5">
                <p className="text-[11px] leading-relaxed text-[#52525b] italic">
                  "Core v2.4 initialized. All sub-systems report nominal functionality within parameters."
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#09090b] border border-white/5 rounded-xl">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-6">Recent Reports</h4>
            <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
              {operatives.slice(0, 3).map((op, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-[#09090b] border-2 border-cyan-500 rounded-full" />
                  <p className="text-xs text-white font-medium">{op.email.split('@')[0]} pushed to main</p>
                  <p className="text-[10px] text-[#52525b] mt-1 uppercase tracking-tighter">Commit: 7a2b9f {i+1}m ago</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectTerminal;