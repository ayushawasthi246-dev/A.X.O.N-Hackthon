import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  ExternalLink, 
  Folder,
  Code2 // Using Code2 as a reliable alternative to Github
} from 'lucide-react';
import { ProjectStore } from '../store/Projectstore';
import { userInfo } from '../store/authstore';
import { useNavigate } from 'react-router-dom';

export default function ProjectList() {
  const navigate = useNavigate()
  const { ProjectList: fetchProjects, projects } = ProjectStore();
  const { checkLeaderAuth, accessToken } = userInfo();

  useEffect(() => {
    const AuthenticationCheck = async () => {
      await checkLeaderAuth();
    };
    AuthenticationCheck();
  }, [accessToken, checkLeaderAuth]);

  useEffect(() => {
    if (accessToken) {
      fetchProjects();
    }
  }, [accessToken, fetchProjects]);

  return (
    <div className="p-8 min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase flex items-center gap-3">
              <ClipboardList className="text-blue-500 w-10 h-10" />
              Project Pipeline
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-mono uppercase tracking-widest">
              Manage and track active developments
            </p>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-full border border-white/5 text-xs font-bold text-slate-400">
            TOTAL: {projects?.length || 0}
          </div>
        </div>

        {/* Project List Container */}
        <div className="grid gap-4">
          {projects && projects.length > 0 ? (
            projects.map((project, index) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={project._id || index}
                onClick={()=>navigate(`/Project/${project._id}`)}
                className="group bg-slate-950 border border-white/5 hover:border-blue-500/50 p-6 rounded-3xl flex items-center justify-between transition-all duration-300"
              >
                {/* Left Side: Info */}
                <div className="flex items-center gap-6">
                  <div className="bg-blue-500/10 p-4 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
                    <Folder className="text-blue-500" size={24} />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {project.ProjectName || "Untitled Project"}
                    </h3>
                    <a 
                      href={project.RepoLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-500 hover:text-white text-sm mt-1 transition-colors font-mono"
                    >
                      <Code2 size={14} />
                      {project.RepoLink ? project.RepoLink.replace('https://github.com/', '') : 'No repo linked'}
                    </a>
                  </div>
                </div>

                {/* Right Side: Action */}
                <div className="flex items-center gap-3">
                  <button className="bg-slate-900 hover:bg-white hover:text-black p-3 rounded-xl transition-all border border-white/5">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-slate-950 rounded-[2rem] border border-dashed border-white/10">
              <p className="text-slate-500 font-mono italic">No projects found in the database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}