import React, { useState } from 'react';
import { 
  Compass, 
  HelpCircle, 
  ArrowRight, 
  Search, 
  FileText, 
  Check, 
  Sparkles, 
  Send, 
  Layers, 
  Volume2, 
  Smile, 
  Clock, 
  TrendingUp, 
  SlidersHorizontal,
  ChevronRight,
  BookOpen,
  X
} from 'lucide-react';
import { AI_TOOLS, BLOG_POSTS } from '../data';
import { AITool, BlogPost, LeadSubmission } from '../types';
import { sendSlackMessage } from '../slack';

interface OtdServicesSiteProps {
  brandTheme?: 'cyan' | 'multicolor';
}

export default function OtdServicesSite({ brandTheme = 'multicolor' }: OtdServicesSiteProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'blog' | 'packages'>('home');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Interactive Tool Selector widget states
  const [selectedDept, setSelectedDept] = useState<string>('Operations');
  const [selectedComplexity, setSelectedComplexity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [companyStaffSize, setCompanyStaffSize] = useState<number>(15);
  const [isCalculated, setIsCalculated] = useState(true);

  // Lead Submission Form
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    companyName: '',
    websiteScope: 'both_connected' as any,
    interestArea: 'automation' as any,
    message: ''
  });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Active educational blog expander
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Department choices for selector
  const DEPARTMENTS = [
    'Operations',
    'Customer Support',
    'Marketing agencies',
    'E-commerce logistics',
    'Legal departments',
    'Technical compliance'
  ];

  // Logic to dynamically filter tools based on selectors
  const filteredTools = AI_TOOLS.filter(tool => {
    // Check if department matches any recommended target
    const matchesDept = tool.recommendedFor.some(target => 
      target.toLowerCase().includes(selectedDept.toLowerCase()) || 
      selectedDept.toLowerCase().includes(target.toLowerCase())
    );
    // matches complexity or is lower
    const complexityMap = { Low: 1, Medium: 2, High: 3 };
    const matchesComplexity = complexityMap[tool.complexity] <= complexityMap[selectedComplexity];
    
    return matchesDept || matchesComplexity;
  }).slice(0, 3); // top 3 recommendations

  // Operational ROI calculations
  const calculateHoursSaved = () => {
    const baselineMult = selectedComplexity === 'Low' ? 1.2 : selectedComplexity === 'Medium' ? 1.8 : 2.5;
    return Math.round(companyStaffSize * baselineMult * 4); // monthly savings
  };

  const calculateDollarsSaved = () => {
    return calculateHoursSaved() * 45; // hourly blended rate
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email) return;
    setLeadSubmitted(true);

    // Stream lead metrics directly to Slack Router instantly
    sendSlackMessage('lead_form', leadForm);
  };

  const handleResetLead = () => {
    setLeadForm({
      name: '',
      email: '',
      companyName: '',
      websiteScope: 'both_connected',
      interestArea: 'automation',
      message: ''
    });
    setLeadSubmitted(false);
  };

  return (
    <div className="bg-editorial-bg text-slate-100 min-h-screen font-sans border border-white/10 rounded-none overflow-hidden shadow-2xl relative" id="secondary-services-site">
      
      {/* Mock Browser URL Bar */}
      <div className="bg-editorial-dark px-4 py-3 flex items-center justify-between border-b border-white/10 text-[10px] font-mono select-none text-slate-400">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-2 h-2 bg-white/20"></span>
          <span className="w-2 h-2 bg-white/20"></span>
          <span className="w-2 h-2 bg-white/20"></span>
        </div>
        <div className="bg-editorial-bg border border-white/5 px-4 py-1.5 w-1/2 text-center text-[9px] text-slate-300 flex items-center justify-center gap-1.5 uppercase tracking-wider">
          <Compass className="w-3 h-3 text-editorial-accent" />
          <span>oceantidedropaisurfer.services</span>
        </div>
        <div className="flex items-center gap-1 font-mono uppercase text-[9px]">
          <span className="px-2 py-0.5 bg-editorial-accent/10 text-editorial-accent border border-editorial-accent/20 tracking-widest font-black">ACTIVE CAMPAIGN</span>
        </div>
      </div>

      {/* Campaign Site Header */}
      <nav className="bg-editorial-dark sticky top-0 z-35 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={brandTheme === 'multicolor' ? "/src/assets/images/otd_ai_logo_multicolor_1780618812326.png" : "/src/assets/images/otd_ai_logo_1780441811431.png"} 
              alt="OTD Services Logo" 
              className={`w-8 h-8 border bg-editorial-bg object-contain p-0.5 shrink-0 transition-all duration-300 ${brandTheme === 'multicolor' ? 'border-pink-500/50 shadow-[0_0_8px_rgba(236,72,153,0.25)]' : 'border-white/15'}`}
              referrerPolicy="no-referrer"
            />
            <span className={`text-sm font-mono font-black tracking-widest uppercase transition-all duration-300 ${brandTheme === 'multicolor' ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-pink-500 font-extrabold' : 'text-white'}`}>
              OTD SERVICES CO
            </span>
            <span className="text-[9px] uppercase font-mono bg-white/5 border border-white/10 text-editorial-accent px-2 py-0.5 tracking-widest">
              Campaigns Portal
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase font-mono tracking-wider">
            <button 
              type="button"
              onClick={() => { setActiveTab('home'); setSelectedArticleId(null); }}
              className={`px-3 py-1.5 border transition-colors cursor-pointer ${activeTab === 'home' ? 'bg-editorial-accent text-black border-editorial-accent font-black' : 'text-slate-400 hover:text-white border-transparent'}`}
            >
              Tool Selector
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab('blog'); }}
              className={`px-3 py-1.5 border transition-colors cursor-pointer ${activeTab === 'blog' ? 'bg-editorial-accent text-black border-editorial-accent font-black' : 'text-slate-400 hover:text-white border-transparent'}`}
            >
              Waves Knowledge
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab('packages'); setSelectedArticleId(null); }}
              className={`px-3 py-1.5 border transition-colors cursor-pointer ${activeTab === 'packages' ? 'bg-editorial-accent text-black border-editorial-accent font-black' : 'text-slate-400 hover:text-white border-transparent'}`}
            >
              Pricing Audit
            </button>
          </div>
        </div>
      </nav>

      {/* Main Framework Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* TAB 1: HOME (HERO + INTERACTIVE CALCULATOR) */}
        {activeTab === 'home' && (
          <div className="space-y-12 animate-fade-in">
            
            {/* LITERALLY SPECIFIED COPY HERO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-editorial-dark border border-white/10 p-6 md:p-8">
              
              <div className="lg:col-span-7 space-y-5">
                <span className="inline-flex items-center gap-1.5 bg-editorial-accent/10 border border-editorial-accent/20 px-3 py-1 text-[9px] font-mono font-black uppercase tracking-widest text-editorial-accent">
                  Lead & Tactical Discovery Center
                </span>
                
                {/* STRICT VISUAL HIERARCHY ACCORDING TO USER'S WORDS */}
                <h1 className="text-3xl md:text-4.5xl font-display font-black tracking-wider text-white uppercase">
                  🌊 Ocean Tide Drop AI Surfer
                </h1>
                <h2 className="text-sm md:text-base font-mono uppercase tracking-[0.15em] text-editorial-accent font-black">
                  Ride the Wave of AI
                </h2>
                
                <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-xl">
                  Stop overpaying for bloated multi-agent systems and broken chat boxes that hallucinates client policies. We analyze your core business tide, assess your tech resistance, and map exact automated workflows that yield real, verified operating savings.
                </p>

                <div className="pt-2">
                  <a 
                    href="#tool-selection-engine"
                    className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-widest uppercase text-editorial-accent hover:text-white border-b border-dashed border-editorial-accent pb-0.5 transition-colors"
                  >
                    Scroll to Tool Navigator &darr;
                  </a>
                </div>
              </div>

              {/* Quick Funnel Pitch Cards */}
              <div className="lg:col-span-5 space-y-4 bg-editorial-bg p-6 border border-white/10">
                <h3 className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">The Tidal Value Recipe</h3>
                
                <div className="grid grid-cols-1 gap-3 font-sans">
                  <div className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className="w-5 h-5 bg-white/5 border border-white/10 text-editorial-accent flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">✔</span>
                    <div>
                      <strong className="text-white block font-mono text-[10px] uppercase tracking-wider">100% Deterministic Pipelines</strong>
                      <span className="text-[11px] block mt-0.5">We replace complex code guessworks with rigid API rules.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className="w-5 h-5 bg-white/5 border border-white/10 text-editorial-accent flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">✔</span>
                    <div>
                      <strong className="text-white block font-mono text-[10px] uppercase tracking-wider">Clear Integration Budgets</strong>
                      <span className="text-[11px] block mt-0.5">We establish clear pricing models mapped to operations savings.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className="w-5 h-5 bg-white/5 border border-white/10 text-editorial-accent flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">✔</span>
                    <div>
                      <strong className="text-white block font-mono text-[10px] uppercase tracking-wider">Rapid ROI-Driven Systems</strong>
                      <span className="text-[11px] block mt-0.5">Custom tool results mapped, calculated, and deployed.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DYNAMIC TOOL BUILDER BLOCK - PICK THE RIGHT TOOLS WIDGET */}
            <div className="bg-editorial-dark border border-white/10 p-6 md:p-8 space-y-6 relative scroll-mt-20" id="tool-selection-engine">
              <span className="absolute top-4 right-4 text-[8px] font-mono text-editorial-accent uppercase tracking-widest bg-editorial-accent/10 px-2.5 py-1 border border-editorial-accent/30 font-black">
                Playground Asset V2
              </span>
              
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-editorial-accent" />
                  Interactive AI Surfboard Tool Picker
                </h3>
                <p className="text-xs text-zinc-450 font-sans max-w-2xl">
                  Adjust your operational coordinates underneath. The recommendation wave router will dynamically filter and output the exact software components and monthly overhead saving estimates.
                </p>
              </div>

              {/* Selector Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-editorial-bg p-5 border border-white/10">
                
                {/* Selector 1: Department */}
                <div className="space-y-1.5">
                  <label htmlFor="dept-picker" className="text-[9px] font-mono text-slate-400 uppercase font-black tracking-widest block">1. Department Focus</label>
                  <select 
                    id="dept-picker"
                    value={selectedDept}
                    onChange={(e) => { setSelectedDept(e.target.value); setIsCalculated(true); }}
                    className="w-full bg-editorial-dark border border-white/10 text-slate-200 text-xs px-3 py-3 rounded-none focus:outline-none focus:border-editorial-accent cursor-pointer uppercase font-mono tracking-wider font-medium text-[10px]"
                  >
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Selector 2: Wave Complexity */}
                <div className="space-y-1.5">
                  <label htmlFor="complexity-picker" className="text-[9px] font-mono text-slate-400 uppercase font-black tracking-widest block">2. Tide Complexity</label>
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono uppercase tracking-wider font-bold">
                    {(['Low', 'Medium', 'High'] as const).map(level => (
                       <button 
                        key={level}
                        type="button"
                        onClick={() => { setSelectedComplexity(level); setIsCalculated(true); }}
                        className={`py-2 px-1 rounded-none text-2xs transition-all cursor-pointer ${
                          selectedComplexity === level 
                            ? 'bg-editorial-accent text-black font-black border border-editorial-accent' 
                            : 'bg-editorial-dark text-slate-400 border border-white/10 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selector 3: Scaler size slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="staff-size" className="text-[9px] font-mono text-slate-400 uppercase font-black tracking-widest">3. Operations Staff</label>
                    <span className="text-[10px] font-mono text-editorial-accent font-black tracking-wider uppercase">{companyStaffSize} FTEs</span>
                  </div>
                  <input 
                    type="range" 
                    id="staff-size"
                    min="3" 
                    max="100" 
                    value={companyStaffSize}
                    onChange={(e) => { setCompanyStaffSize(Number(e.target.value)); setIsCalculated(true); }}
                    className="w-full h-1 bg-editorial-dark appearance-none border border-white/15 cursor-pointer accent-editorial-accent"
                  />
                  <div className="flex justify-between text-[8px] text-zinc-500 font-mono uppercase tracking-wider">
                    <span>3 Users</span>
                    <span>50 Users</span>
                    <span>100 Users</span>
                  </div>
                </div>

              </div>

              {/* Dynamic Results Display */}
              {isCalculated && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 animate-fade-in">
                  
                  {/* Recommended Tools results block */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/15 pb-2">
                      <h4 className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-widest">Recommended Software Swells ({filteredTools.length})</h4>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-editorial-accent">Active Filtered Index</span>
                    </div>

                    <div className="space-y-3">
                      {filteredTools.map((tool) => (
                        <div key={tool.id} className="p-4 bg-editorial-bg border border-white/10 space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <span className="px-2 py-0.5 text-[8px] font-mono bg-white/5 border border-white/15 text-editorial-accent uppercase tracking-widest font-black inline-block">
                                {tool.category}
                              </span>
                              <h5 className="text-[11px] font-mono uppercase tracking-wider text-white font-bold pt-1">{tool.name}</h5>
                            </div>
                            <span className="text-[8px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 font-bold uppercase shrink-0">
                              {tool.complexity} complexity
                            </span>
                          </div>
                          
                          <p className="text-xs text-zinc-400 font-normal leading-relaxed font-sans">
                            {tool.description}
                          </p>

                          <div className="pt-2.5 grid grid-cols-2 gap-2 text-[9px] font-mono border-t border-white/5 uppercase tracking-wider text-slate-400">
                            <div>
                              <span className="text-slate-500 block text-[7.5px] font-black">Est. Setup:</span>
                              <span className="text-slate-350">{tool.estimatedEffort}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[7.5px] font-black">ROI Profile:</span>
                              <span className="text-editorial-accent font-black">{tool.roiEstimate}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calculations Stat Summary card */}
                  <div className="lg:col-span-5 bg-editorial-bg p-6 border border-white/10 flex flex-col justify-between space-y-6">
                    <div className="space-y-5">
                      
                      <div className="space-y-1 border-b border-white/10 pb-3">
                        <span className="text-[9px] font-mono text-editorial-accent font-black uppercase tracking-widest">Calculated Operations Output</span>
                        <h4 className="text-lg font-mono font-black uppercase text-white tracking-widest">Custom TCO Audit Outline</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-editorial-dark p-4 border border-white/10">
                          <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500 block font-black">Weekly Hours Saved</span>
                          <span className="text-sm font-mono font-black tracking-wider text-white flex items-center gap-1 uppercase block mt-1">
                            ~ {Math.round(calculateHoursSaved() / 4)} Hrs
                          </span>
                        </div>

                        <div className="bg-editorial-dark p-4 border border-white/10">
                          <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500 block font-black">FTE Asset Value</span>
                          <span className="text-sm font-mono font-black tracking-wider text-editorial-accent block mt-1">
                            ${calculateDollarsSaved().toLocaleString()} / MO
                          </span>
                        </div>
                      </div>

                      <div className="p-4 bg-editorial-dark border border-white/5 space-y-1.5 text-[11px] leading-relaxed text-zinc-400 font-sans">
                        <strong className="text-white block font-mono text-[9px] uppercase tracking-widest">Alignment Insights:</strong>
                        Your team size and selected complexity indicates high potential bottlenecks in automated webhook structures. We recommend deploying <strong className="text-white text-[11px]">DropWave Webhook Router</strong> and launching immediate employee audits.
                      </div>

                    </div>

                    <a 
                      href="#lead-capture-form"
                      className="w-full py-4.5 bg-editorial-accent text-black font-mono font-black text-xs uppercase tracking-widest transition-colors hover:bg-white hover:text-black hover:border-white text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Lock In Free Audit Checklist
                      <ChevronRight className="w-4 h-4" />
                    </a>

                  </div>

                </div>
              )}

            </div>

            {/* HIGH-CONVERSION LEAD CAPTURE SYSTEM */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start scroll-mt-20" id="lead-capture-form">
              <div className="md:col-span-5 space-y-4">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-black">Secure Funnel Submission</span>
                <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-wider">Let's Audit Your Operations Environment Today</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-sm font-sans">
                  We review your custom tool recommendations, design a draft architecture document, and provide absolute cost transparency. No sales presentation garbage—just pure tech diagrams.
                </p>
                
                <div className="space-y-2 pt-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-editorial-accent"></span>
                    <span>NDA Protected specifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-editorial-accent"></span>
                    <span>Grounded compliance audits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-editorial-accent"></span>
                    <span>No multi-week retainer commitment</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 bg-editorial-dark border border-white/10 p-6">
                {leadSubmitted ? (
                  <div className="text-center p-6 space-y-4 animate-fade-in">
                    <div className="w-12 h-12 bg-editorial-accent/10 border border-editorial-accent/25 text-editorial-accent flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-white">Operational Intake Complete</h3>
                      <p className="text-[11px] text-zinc-450 leading-relaxed font-sans pt-1">
                        A system engineer from OTD AI has scheduled an automated indexing scan of your recommendations category. Expect a written blueprint to go to <strong className="text-slate-200">{leadForm.email}</strong> shortly.
                      </p>
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={handleResetLead} 
                      className="text-[9px] font-mono uppercase tracking-widest text-editorial-accent hover:underline cursor-pointer"
                    >
                      Submit revised operational bounds
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label htmlFor="lead-name" className="text-[9px] font-mono text-slate-400 block font-bold uppercase tracking-widest">Contact Name</label>
                        <input 
                          type="text" 
                          id="lead-name"
                          required
                          value={leadForm.name}
                          onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                          placeholder="e.g. Kai Vance"
                          className="w-full bg-editorial-bg border border-white/10 px-4 py-3 text-xs focus:outline-none focus:border-editorial-accent text-slate-200 placeholder:text-slate-650"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="lead-email" className="text-[9px] font-mono text-slate-400 block font-bold uppercase tracking-widest">Business E-Mail *</label>
                        <input 
                          type="email" 
                          id="lead-email"
                          required
                          value={leadForm.email}
                          onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                          placeholder="kai@tidedistributions.corp"
                          className="w-full bg-editorial-bg border border-white/10 px-4 py-3 text-xs focus:outline-none focus:border-editorial-accent text-slate-200 placeholder:text-slate-655"
                        />
                      </div>

                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="lead-company" className="text-[9px] font-mono text-slate-400 block font-bold uppercase tracking-widest">Company Name</label>
                      <input 
                        type="text" 
                        id="lead-company"
                        required
                        value={leadForm.companyName}
                        onChange={(e) => setLeadForm({ ...leadForm, companyName: e.target.value })}
                        placeholder="e.g. Tide Distributions"
                        className="w-full bg-editorial-bg border border-white/10 px-4 py-3 text-xs focus:outline-none focus:border-editorial-accent text-slate-200 placeholder:text-slate-650"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-slate-400 block font-bold uppercase tracking-widest">Website Goal Scope</span>
                        <select 
                          value={leadForm.websiteScope}
                          onChange={(e) => setLeadForm({ ...leadForm, websiteScope: e.target.value as any })}
                          className="w-full bg-editorial-bg border border-white/10 px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-editorial-accent cursor-pointer rounded-none uppercase font-mono tracking-wider text-[10px]"
                        >
                          <option value="brand_site">OTDAISurfer.surf Flagship Only</option>
                          <option value="lead_gen">OceanTideDrop.services Only</option>
                          <option value="both_connected">Dual-Linked Dynamic Setup</option>
                          <option value="not_sure">Help Us Decide Strategic Split</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-slate-400 block font-bold uppercase tracking-widest">Integration Area</span>
                        <select 
                          value={leadForm.interestArea}
                          onChange={(e) => setLeadForm({ ...leadForm, interestArea: e.target.value as any })}
                          className="w-full bg-editorial-bg border border-white/10 px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-editorial-accent cursor-pointer rounded-none uppercase font-mono tracking-wider text-[10px]"
                        >
                          <option value="consulting">High-Level Strategic Audit</option>
                          <option value="automation">Autonomous Bot Workflows</option>
                          <option value="full_setup">Complete Dual Website Setup</option>
                          <option value="other">General Platform Questions</option>
                        </select>
                      </div>

                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="lead-message" className="text-[9px] font-mono text-slate-400 block font-bold uppercase tracking-widest">Operations Context / Notes</label>
                      <textarea 
                        id="lead-message"
                        rows={3}
                        value={leadForm.message}
                        onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                        placeholder="Tell us what file structure or repetitive workflow you want automated first..."
                        className="w-full bg-editorial-bg border border-white/10 px-4 py-3 text-xs focus:outline-none focus:border-editorial-accent text-slate-200 placeholder:text-slate-650 resize-none font-sans"
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      className="w-full mt-3 py-4 bg-editorial-accent text-black font-mono font-black text-xs uppercase tracking-widest transition-colors hover:bg-white hover:text-black hover:border-white cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Transmit Audit Request
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: EDUCATIONAL BLOG */}
        {activeTab === 'blog' && (
          <div className="space-y-12 animate-fade-in" id="education-articles">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl md:text-3.5xl font-display font-black text-white uppercase tracking-wider">
                Waves of AI Education Hub
              </h2>
              <p className="text-xs md:text-sm text-zinc-400 font-sans">
                Approachably clarifying compliance documentation, retrieval vector math, and dual funnel architectures.
              </p>
            </div>

            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {BLOG_POSTS.map((post) => (
                <div 
                  key={post.id}
                  onClick={() => setSelectedArticleId(selectedArticleId === post.id ? null : post.id)}
                  className={`p-6 border transition-colors cursor-pointer text-left flex flex-col justify-between h-full bg-editorial-dark rounded-none relative group ${
                    selectedArticleId === post.id 
                      ? 'border-editorial-accent' 
                      : 'border-white/10 hover:border-editorial-accent/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[8px] font-mono uppercase tracking-wider text-zinc-400">
                      <span>{post.date}</span>
                      <span className="bg-editorial-bg border border-white/10 px-1.5 py-0.5 tracking-widest font-black text-editorial-accent">
                        {post.category}
                      </span>
                    </div>

                    <h3 className="text-xs font-mono tracking-wider uppercase text-white leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-zinc-450 leading-relaxed font-sans line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-slate-500">
                    <span className="flex items-center gap-1.5 font-bold">
                      <BookOpen className="w-3.5 h-3.5 text-editorial-accent" />
                      {post.readTime}
                    </span>
                    <span className="text-editorial-accent inline-flex items-center gap-1 font-black tracking-widest text-[8px]">
                      {selectedArticleId === post.id ? 'Collapse Guide' : 'Read Ocean Guide'}
                      <ChevronRight className={`w-3 h-3 transition-transform ${selectedArticleId === post.id ? 'rotate-90' : ''}`} />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Read expanded content */}
            {selectedArticleId && (
              <div className="bg-editorial-dark border border-white/10 p-6 md:p-8 space-y-6 max-w-4xl mx-auto text-xs md:text-sm leading-relaxed animate-fade-in relative">
                {(() => {
                  const post = BLOG_POSTS.find(p => p.id === selectedArticleId)!;
                  return (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <span className="text-[9px] font-mono font-black tracking-widest bg-editorial-accent/10 border border-editorial-accent/20 px-2 py-1 text-editorial-accent uppercase">
                          {post.category}
                        </span>
                        <h3 className="text-base md:text-lg font-mono tracking-wider uppercase text-white pt-2 font-black">{post.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-[9px] font-mono uppercase tracking-wide text-zinc-500">
                          <span>By {post.author.name}</span>
                          <span>&bull;</span>
                          <span>{post.readTime}</span>
                          <span>&bull;</span>
                          <span>{post.date}</span>
                        </div>
                      </div>

                      <div className="space-y-4 text-zinc-300 font-sans leading-relaxed text-xs md:text-sm border-t border-white/5 pt-4">
                        <p>{post.content}</p>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-editorial-accent font-black">
                          "This article covers how Ocean Tide Drop structures its dual ecosystem. To see premium implementations on high compliance systems, transition your inquiry to the flagship OTDAISurfer.surf site."
                        </p>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-editorial-bg border border-white/10">
                        <div className="w-10 h-10 bg-editorial-dark text-white border border-white/15 font-black flex items-center justify-center font-mono">
                          {post.author.avatarInitials}
                        </div>
                        <div>
                          <strong className="text-white font-mono text-[10px] block uppercase tracking-wider">{post.author.name}</strong>
                          <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-widest">{post.author.role}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: PACKAGES / PRICING & AUDITING */}
        {activeTab === 'packages' && (
          <div className="space-y-12 animate-fade-in" id="packages-scope">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl md:text-3.5xl font-display font-black text-white uppercase tracking-wider">
                Sourced Service Packages
              </h2>
              <p className="text-xs md:text-sm text-zinc-400 font-sans">
                Clear scope lists, predictable pricing timelines, and straightforward deliverables.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              <div className="bg-editorial-dark border border-white/10 p-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-[8px] font-mono text-zinc-400 uppercase font-black tracking-widest block bg-white/5 px-2.5 py-1 border border-white/10 w-max">
                    Discovery Tier
                  </span>
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Full Architectural Operations Audit</h3>
                    <p className="text-xs text-zinc-450 pt-1 leading-relaxed font-sans mt-1">
                      Ideal for companies seeking map blueprints without doing code transformations themselves.
                    </p>
                  </div>
                  
                  <div className="border-t border-white/5 pt-4 space-y-2 text-xs font-sans text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span className="text-editorial-accent font-mono font-black">&bull;</span>
                      <span>3 Employee workflow observation logs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-editorial-accent font-mono font-black">&bull;</span>
                      <span>3 Recommended software configuration specs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-editorial-accent font-mono font-black">&bull;</span>
                      <span>Direct written compliance & security audit review</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500 font-black">Fixed Cost setup:</span>
                    <span className="text-sm font-mono font-black text-white uppercase tracking-widest">$2,400</span>
                  </div>
                  <a 
                    href="#lead-capture-form"
                    onClick={() => {
                      setLeadForm({ ...leadForm, interestArea: 'consulting' });
                    }}
                    className="w-full py-3 bg-editorial-bg border border-white/10 hover:border-white/30 text-white font-mono font-black text-xs uppercase tracking-widest transition-colors text-center block cursor-pointer"
                  >
                    Select Audit Tier
                  </a>
                </div>
              </div>

              <div className="bg-editorial-dark border border-editorial-accent p-6 space-y-6 flex flex-col justify-between relative shadow-lg">
                <span className="absolute top-4 right-4 text-[8px] font-mono font-black bg-editorial-accent text-black px-2 py-1 uppercase tracking-wider">
                  POPULAR
                </span>

                <div className="space-y-4">
                  <span className="text-[8px] font-mono text-editorial-accent uppercase font-black tracking-widest block bg-editorial-accent/10 px-2 py-1 border border-editorial-accent/20 w-max">
                    Integration Tier
                  </span>
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Full-Stack Dual Site Architecture</h3>
                    <p className="text-xs text-zinc-455 pt-1 leading-relaxed font-sans mt-0.5">
                      We provision your flagship (.surf) and your marketing campaign (.services) properties fully.
                    </p>
                  </div>
                  
                  <div className="border-t border-white/5 pt-4 space-y-2 text-xs font-sans text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span className="text-editorial-accent font-mono font-black">&bull;</span>
                      <span>Durable corporate portfolio structure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-editorial-accent font-mono font-black">&bull;</span>
                      <span>Operational tool selector widgets setup</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-editorial-accent font-mono font-black">&bull;</span>
                      <span>Cloud deployment validation & HTTPS keys</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/15">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500 font-black">Starting integration from:</span>
                    <span className="text-sm font-mono font-black text-editorial-accent uppercase tracking-widest">$6,500</span>
                  </div>
                  <a 
                    href="#lead-capture-form"
                    onClick={() => {
                      setLeadForm({ ...leadForm, interestArea: 'full_setup' });
                    }}
                    className="w-full py-3 bg-editorial-accent text-black hover:bg-white hover:text-black font-mono font-black text-xs uppercase tracking-widest transition-colors text-center block cursor-pointer"
                  >
                    Select Integration Tier
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Campaign footer */}
      <footer className="border-t border-white/10 bg-editorial-dark py-8 text-center text-[9px] font-mono text-slate-500 uppercase tracking-widest">
        <div className="max-w-7xl mx-auto px-8 space-y-2">
          <p>&copy; 2026 OceanTideDrop AI Surfer (OceanTideDropAISurfer.services). All rights reserved.</p>
          <div className="flex justify-center gap-4 text-slate-400">
            <span className="hover:text-editorial-accent transition-colors cursor-pointer">Unsubscribe Newsletter</span>
            <span>&bull;</span>
            <span className="hover:text-editorial-accent transition-colors cursor-pointer">Visitor cookie guidelines</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
