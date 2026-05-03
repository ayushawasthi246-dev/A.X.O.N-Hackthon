import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, Zap, Mail, Phone, ChevronRight, Shield, 
  Database, Calendar, Layout, Brain, Workflow 
} from 'lucide-react';
import { useState } from 'react';
import SignUpPage from '../components/Signup.jsx';
import MemberSignup from '../components/MemberSignup.jsx';

export default function LandingPage() {
  const [openLeaderModal, setopenLeaderModal] = useState(false);
  const [openMemberModal, setopenMemberModal] = useState(false);
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-cyan-500 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 backdrop-blur-xl border-b border-white/5 bg-[#020617]/40">
        <div className="flex justify-between items-center p-6 max-w-7xl mx-auto">
          <div className="text-2xl font-black tracking-tighter italic uppercase text-cyan-500">
            A.X.O.N
          </div>
          <div className="hidden md:flex space-x-10 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">
            <a href="#home" className="hover:text-cyan-400 transition">System</a>
            <a href="#workflow" className="hover:text-cyan-400 transition">Workflow</a>
            <a href="#contact" className="hover:text-cyan-400 transition">Contact</a>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section id="home" className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" 
            alt="Cyber Tech Background" 
            className="w-full h-full object-cover opacity-6 grayscale"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#020617] via-transparent to-[#020617]" />
        </div>

        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="relative translate-y-5 flex flex-col justify-center items-center z-10 max-w-5xl">
          <h1 className="text-5xl md:text-8xl font-black mb-5 tracking-tighter leading-none uppercase">
            Welcome to <span className="text-cyan-500 italic">A.X.O.N</span>
          </h1>
          <p className="text-slate-400 text-lg flex flex-col gap-10 md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed font-semibold">
            {/* Engineered by <strong>Phantom Troupe</strong>. <br /> */}
            <p className="text-bold font-mono text-2xl">Autonomous Execution & Orchestration Network</p>
            <p className="">Transforming ideas into structured execution through intelligent planning, real-time orchestration, and seamless clarity.</p>
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button onClick={() => setopenLeaderModal(true)} className="group flex items-center gap-3 px-12 py-5 bg-cyan-600 hover:bg-cyan-800 text-white rounded-full font-black uppercase tracking-widest transition-all duration-300 cursor-pointer">
              Login Team Leader <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => setopenMemberModal(true)} className="px-12 py-5 border-2 border-slate-700 hover:border-white hover:bg-white/10 rounded-full font-black uppercase tracking-widest transition-all duration-300 cursor-pointer">
              Login Team Member
            </button>
          </div>
        </motion.div>
      </section>

      {/* 2. THE FIVE CORE WORKFLOW SECTIONS */}
      <section id="workflow" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-4 italic uppercase tracking-tighter">The Execution Engine</h2>
            <p className="text-cyan-500 font-bold uppercase tracking-[0.3em] text-[10px]">Strategic Workflow by Phantom Troupe</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            <WorkflowCard 
              image="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800"
              icon={<Layout className="text-cyan-400" size={24} />}
              title="Project Injection"
              desc="Team Leaders upload comprehensive project blueprints. AXON analyzes scope, tech stacks, and requirements instantly."
            />
            <WorkflowCard 
              image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
              icon={<Brain className="text-cyan-400" size={24} />}
              title="AI Decomposition"
              desc="Our proprietary AI breaks down massive projects into granular, manageable modules, ensuring zero logic gaps."
            />
            <WorkflowCard 
              image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
              icon={<Workflow className="text-cyan-400" size={24} />}
              title="Smart Assignment"
              desc="Modules are intelligently matched to team members based on their specific skill ratings and current bandwidth."
            />
            <WorkflowCard 
              image="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800"
              icon={<Calendar className="text-cyan-400" size={24} />}
              title="Calendar Sync"
              desc="Deadlines are automatically injected into team members' Google Calendars, creating an immutable schedule of execution."
            />
            <WorkflowCard 
              image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
              icon={<Database className="text-cyan-400" size={24} />}
              title="Real-time Records"
              desc="The Team Leader monitors live progress through a unified dashboard, tracking every milestone and status in real-time."
            />
          </div>
        </div>
      </section>

      {/* 3. CONTACT SECTION */}
      <section id="contact" className="py-32 bg-slate-900/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-5xl font-black mb-8 italic uppercase">Get in Touch</h2>
            <p className="text-slate-400 text-lg mb-12">
              Questions regarding integration or project onboarding? Our team at Phantom Troupe is standing by.
            </p>
            <div className="space-y-8 text-white">
              <ContactItem icon={<Mail />} label="Official Support" value="priyanshukannojia2004@gmail.com" />
              <ContactItem icon={<Phone />} label="Direct Support" value="+91 8005261642" />
            </div>
          </motion.div>
          <div className="rounded-3xl overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000" 
              alt="Support Team" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 text-center border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-3xl font-black italic tracking-tighter text-cyan-500 mb-2 uppercase">A.X.O.N</p>
          <p className="text-slate-500 uppercase tracking-[0.5em] text-[10px] mb-10 font-bold tracking-widest">Autonomous Execution System</p>
          <div className="text-[10px] text-slate-700 font-bold uppercase tracking-widest pt-8 border-t border-white/5">
            © 2026 AXON PROTOCOLS. CREATED BY <span className="text-white">PHANTOM TROUPE</span>.
          </div>
        </div>
      </footer>

      {openLeaderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[#020617] border border-white/10 rounded-3xl p-10 w-[90%] max-w-md"
          >
            <h2 className="text-2xl w-full font-black mb-6 text-center uppercase">
              Team Leader Login
            </h2>

            <SignUpPage/>

            <button
              onClick={() => setopenLeaderModal(false)}
              className="absolute top-4 right-6 text-slate-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}

      {openMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[#020617] border border-white/10 rounded-3xl p-10 w-[90%] max-w-md"
          >
            <h2 className="text-2xl font-black mb-6 text-center uppercase">
              Team Member Login
            </h2>

            <MemberSignup/>

            <button
              onClick={() => setopenMemberModal(false)}
              className="absolute top-4 right-6 text-slate-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Workflow Card Component
const WorkflowCard = ({ image, icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-slate-900/60 rounded-3xl overflow-hidden border border-white/5 hover:border-cyan-500/40 transition-all duration-100 flex flex-col"
  >
    <div className="h-48 relative overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-500" />
      <div className="absolute inset-0 bg-linear-to-t from-slate-900 to-transparent" />
      <div className="absolute top-4 right-4 p-3 bg-cyan-600 rounded-xl shadow-2xl text-white">
        {icon}
      </div>
    </div>
    <div className="p-8">
      <h3 className="text-xl font-bold mb-4 uppercase italic tracking-tight">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm antialiased">{desc}</p>
    </div>
  </motion.div>
);

// Contact Item Component
const ContactItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-6 group">
    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{label}</p>
      <p className="text-xl font-bold text-white tracking-tight leading-tight">{value}</p>
    </div>
  </div>
)