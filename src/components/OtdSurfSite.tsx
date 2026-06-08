import React, { useState } from 'react';
import { 
  Building2, 
  Cpu, 
  Workflow, 
  FolderGit2, 
  Sparkles, 
  Send, 
  Briefcase, 
  Boxes, 
  Check, 
  Menu, 
  X,
  ArrowRight,
  ShieldAlert,
  Copy,
  Lock,
  Unlock,
  Download,
  Palette,
  Type,
  FileDown,
  Activity,
  Sliders,
  Loader2,
  LogIn,
  LogOut,
  CheckSquare,
  Mail,
  Calendar,
  Notebook,
  Play,
  BookOpen
} from 'lucide-react';
import { PORTFOLIO_PROJECTS, BRAND_ASSETS, AI_TOOLS } from '../data';
import { PortfolioProject } from '../types';
import { sendSlackMessage } from '../slack';
import GoogleWorkspaceControl from './GoogleWorkspaceControl';
import { 
  googleSignIn, 
  getAccessToken, 
  logout, 
  initAuth,
  handleFirestoreError,
  OperationType
} from '../lib/firebase';
import { User } from 'firebase/auth';
import { supabaseDb } from '../lib/supabase';

interface OtdSurfSiteProps {
  brandTheme?: 'cyan' | 'multicolor';
}

export default function OtdSurfSite({ brandTheme = 'multicolor' }: OtdSurfSiteProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'portfolio' | 'contact' | 'branding' | 'members'>('home');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  
  // Members Area authentication and state
  const [memberUser, setMemberUser] = useState<User | null>(null);
  const [memberToken, setMemberToken] = useState<string | null>(null);
  const [memberAuthLoading, setMemberAuthLoading] = useState<boolean>(true);
  const [memberAuthError, setMemberAuthError] = useState<string | null>(null);
  const [memberActiveSuiteTab, setMemberActiveSuiteTab] = useState<'workspace' | 'labs'>('workspace');
  
  // 6 Cool Lab Tools state variables
  const [selectedLabToolId, setSelectedLabToolId] = useState<string>('tool-autonomous-agent');
  
  // TidalAgent States
  const [agentTaskTitle, setAgentTaskTitle] = useState<string>('');
  const [agentTaskNotes, setAgentTaskNotes] = useState<string>('');
  const [agentTaskRunning, setAgentTaskRunning] = useState<boolean>(false);
  
  // ReefSense States
  const [ragQuery, setRagQuery] = useState<string>('');
  const [ragSearching, setRagSearching] = useState<boolean>(false);
  const [ragResults, setRagResults] = useState<any[]>([]);
  const [ragSummary, setRagSummary] = useState<string>('');
  
  // DropWave States
  const [webhookEvent, setWebhookEvent] = useState<string>('lead_form');
  const [webhookDetails, setWebhookDetails] = useState<string>('');
  const [webhookSending, setWebhookSending] = useState<boolean>(false);
  const [webhookLogs, setWebhookLogs] = useState<string[]>(['[SYSTEM] DropWave webhook router initialized. Ready for dispatch telemetry.']);
  
  // SwellRespond Review Pilot States
  const [responderComment, setResponderComment] = useState<string>('');
  const [respondTone, setRespondTone] = useState<string>('Enterprise Polite');
  const [respondDraft, setRespondDraft] = useState<string>('');
  const [savingRespondNote, setSavingRespondNote] = useState<boolean>(false);
  const [sendingDraft, setSendingDraft] = useState<boolean>(false);
  
  // SurfDraft SEO States
  const [seoKeywords, setSeoKeywords] = useState<string>('');
  const [seoCategory, setSeoCategory] = useState<string>('E-commerce');
  const [seoOutline, setSeoOutline] = useState<string>('');
  const [savingSeoNote, setSavingSeoNote] = useState<boolean>(false);
  const [schedulingSeoMeeting, setSchedulingSeoMeeting] = useState<boolean>(false);
  
  // BreakerAudio States
  const [audioTranscript, setAudioTranscript] = useState<string>('');
  const [audioSnippetName, setAudioSnippetName] = useState<string>('');
  const [audioActions, setAudioActions] = useState<string>('');
  const [parsingAudio, setParsingAudio] = useState<boolean>(false);
  const [schedulingAudioMeeting, setSchedulingAudioMeeting] = useState<boolean>(false);

  // Subscribe to persistent Firebase user tokens elegantly
  React.useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setMemberUser(user);
        setMemberToken(token);
        setMemberAuthLoading(false);
      },
      () => {
        setMemberUser(null);
        setMemberToken(null);
        setMemberAuthLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);
  
  // Interactive Brand State
  const [isBrandLocked, setIsBrandLocked] = useState<boolean>(true);
  const [lockTimestamp, setLockTimestamp] = useState<string>('2026-06-02 23:14:48 UTC');
  const [copiedColorText, setCopiedColorText] = useState<string | null>(null);
  const [logoVariant, setLogoVariant] = useState<'glow' | 'minimal' | 'solid'>('glow');
  const [lockProcessState, setLockProcessState] = useState<'idle' | 'sealing' | 'done'>('idle');
  
  // Contact Form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    organization: '',
    serviceInterest: 'AI Strategy & Architecture Integration',
    budget: '$50k - $100k',
    proposalRequest: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;
    setFormSubmitted(true);
    
    // Dispatch telemetry report directly to Slack Router
    sendSlackMessage('contact_form', contactForm);
  };

  const handleResetForm = () => {
    setContactForm({
      name: '',
      email: '',
      organization: '',
      serviceInterest: 'AI Strategy & Architecture Integration',
      budget: '$50k - $100k',
      proposalRequest: ''
    });
    setFormSubmitted(false);
  };

  return (
    <div className="bg-editorial-bg text-slate-100 min-h-screen font-sans border border-white/10 rounded-none overflow-hidden relative" id="primary-surf-site">
      
      {/* Mock Browser Top bar */}
      <div className="bg-editorial-dark px-6 py-3 flex items-center justify-between border-b border-white/10 text-[10px] font-mono select-none text-slate-450 tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-white/10"></span>
          <span className="w-2 h-2 bg-white/10"></span>
          <span className="w-2 h-2 bg-white/10"></span>
        </div>
        <div className="bg-editorial-bg/85 py-1.5 px-4 w-1/2 text-center text-[9px] text-editorial-accent tracking-widest border border-white/5 flex items-center justify-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-editorial-accent shrink-0" />
          <span>HTTPS://WWW.OTDAISURFER.SURF</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="px-2 py-0.5 bg-editorial-accent/10 text-editorial-accent border border-editorial-accent/20 text-[8px] font-bold tracking-widest">SECURE BLUEPRINT CORE</span>
        </div>
      </div>

      {/* Flagship Site Header */}
      <nav className="border-b border-white/10 bg-editorial-dark sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={brandTheme === 'multicolor' ? "/src/assets/images/otd_ai_logo_multicolor_1780618812326.png" : "/src/assets/images/otd_ai_logo_1780441811431.png"} 
              alt="OTD AI Surfer Logo" 
              className={`w-9 h-9 border bg-editorial-dark object-contain p-0.5 shrink-0 transition-all duration-300 ${brandTheme === 'multicolor' ? 'border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.3)]' : 'border-editorial-accent'}`}
              referrerPolicy="no-referrer"
            />
            <div>
              <span className={`font-display font-black text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 ${brandTheme === 'multicolor' ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-pink-500 font-extrabold' : 'text-white'}`}>OTD AI Surfer</span>
              <span className="text-[9px] font-mono text-editorial-muted block -mt-1 font-bold tracking-wider">ENTERPRISE CORE BLUEPRINT</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
            <button 
              type="button"
              onClick={() => { setActiveTab('home'); setSelectedProject(null); }}
              className={`hover:text-editorial-accent transition-colors cursor-pointer ${activeTab === 'home' ? 'text-editorial-accent font-bold border-b border-editorial-accent pb-1' : ''}`}
            >
              Overview
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab('services'); setSelectedProject(null); }}
              className={`hover:text-editorial-accent transition-colors cursor-pointer ${activeTab === 'services' ? 'text-editorial-accent font-bold border-b border-editorial-accent pb-1' : ''}`}
            >
              Solutions
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab('portfolio'); }}
              className={`hover:text-editorial-accent transition-colors cursor-pointer ${activeTab === 'portfolio' ? 'text-editorial-accent font-bold border-b border-editorial-accent pb-1' : ''}`}
            >
              Audit Cases
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab('branding'); setSelectedProject(null); }}
              className={`hover:text-editorial-accent transition-colors cursor-pointer ${activeTab === 'branding' ? 'text-editorial-accent font-bold border-b border-editorial-accent pb-1' : ''}`}
            >
              Brand System
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab('members'); setSelectedProject(null); }}
              className={`hover:text-editorial-accent transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'members' ? 'text-pink-400 font-extrabold border-b border-pink-400 pb-1' : ''}`}
            >
              🔒 Members Portal
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab('contact'); setSelectedProject(null); }}
              className="px-4 py-2 border border-editorial-accent text-editorial-accent hover:bg-editorial-accent hover:text-black transition-colors font-bold cursor-pointer"
            >
              Submit RFP
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-8 py-12">

        {/* ACTIVE TAB: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-16 animate-fade-in">
            {/* Elegant Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6 pt-6 mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 font-mono text-[9px] tracking-widest bg-white/5 text-editorial-accent border border-white/10 uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                PREMIUM ARTIFICIAL INTELLIGENCE ENGINEERING
              </div>
              
              <h1 className="text-3.5xl md:text-5xl font-display font-black text-white tracking-wider leading-[1.1] uppercase">
                Autonomous Systems <br/>
                <span className="editorial-outline-text-accent text-transparent">For Critical Shorelines</span>
              </h1>
              
              <p className="text-xs md:text-sm text-zinc-400 font-sans tracking-wide leading-relaxed max-w-2xl mx-auto">
                We engineer bulletproof corporate AI infrastructure that processes, summarizes, and takes actions at scale. No experimental fluff—only durable algorithms grounded in absolute data safety rules.
              </p>

              <div className="flex items-center justify-center gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setActiveTab('portfolio')}
                  className="px-8 py-4 bg-editorial-accent text-black font-mono font-black text-[11px] tracking-widest uppercase transition-colors hover:bg-white hover:text-black rounded-none border border-editorial-accent cursor-pointer inline-flex items-center gap-2"
                >
                  Inspect Case Studies
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveTab('services')}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-[11px] border border-white/10 tracking-widest uppercase transition-colors rounded-none cursor-pointer"
                >
                  Solutions Matrix
                </button>
              </div>
            </div>

            {/* Strategic Value Proposition Matrix */}
            {/* Strategic Value Proposition Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 animate-fade-in">
              <div className="p-6 bg-editorial-dark border border-white/10 space-y-3 relative overflow-hidden">
                <div className="w-10 h-10 border border-editorial-accent/30 bg-editorial-bg flex items-center justify-center text-editorial-accent">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Determinism Over Guesswork</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  We specialize in hybrid document vector indexes (RAG) and structured guardrails that force AI brains to answer using strict regulatory source files or 0% hallucination rates.
                </p>
              </div>

              <div className="p-6 bg-editorial-dark border border-white/10 space-y-3 relative overflow-hidden">
                <div className="w-10 h-10 border border-editorial-accent/30 bg-editorial-bg flex items-center justify-center text-editorial-accent">
                  <Workflow className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Autonomous Workflows</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Our custom built system workers run unattended background operations, processing invoices, listening to zoom recordings, and writing structured compliance reports automatically.
                </p>
              </div>

              <div className="p-6 bg-editorial-dark border border-white/10 space-y-3 relative overflow-hidden">
                <div className="w-10 h-10 border border-editorial-accent/30 bg-editorial-bg flex items-center justify-center text-editorial-accent">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Data Privacy Compliance</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Every pipeline is architected to keep user keys and organizational knowledge completely isolated. No leaks, no global training dumps—strict sandboxed private database security.
                </p>
              </div>
            </div>

            {/* Featured Case Study preview block */}
            <div className="bg-editorial-dark border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
              <div className="space-y-4 md:w-3/5">
                <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-editorial-accent bg-editorial-accent/10 px-2.5 py-1 border border-editorial-accent/20 inline-block uppercase">
                  Featured Operation Success
                </span>
                <h2 className="text-lg md:text-xl font-display font-black text-white uppercase tracking-wider">
                  Maritime Cargo Tide Scheduler Saving $3.4 Million Annually
                </h2>
                <p className="text-xs text-zinc-450 leading-relaxed font-sans">
                  A classic showcase of the OTD AI engineering philosophy. Instead of hoping for static results, we built an active agent queueing scheduler that processes wave surges, weather profiles, and live global cargo manifests in real-time.
                </p>
                <div className="flex gap-2 font-mono text-[9px] uppercase tracking-wider">
                  <span className="px-2 py-1 bg-editorial-bg border border-white/10 text-slate-400">TensorFlow</span>
                  <span className="px-2 py-1 bg-editorial-bg border border-white/10 text-slate-400">Google Cloud BigQuery</span>
                  <span className="px-2 py-1 bg-editorial-bg border border-white/10 text-slate-400">Tidewater Agents</span>
                </div>
                <div className="pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      const proj = PORTFOLIO_PROJECTS.find(p => p.id === 'proj-ocean-cargo') || PORTFOLIO_PROJECTS[0];
                      setSelectedProject(proj);
                      setActiveTab('portfolio');
                    }}
                    className="text-[10px] font-bold font-mono uppercase tracking-widest text-editorial-accent flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                  >
                    Read FULL compliance case study &rarr;
                  </button>
                </div>
              </div>
              <div className="w-full md:w-2/5 p-6 bg-editorial-bg border border-white/10 space-y-4 text-center">
                <span className="text-4xl md:text-5xl font-display font-black text-white block">
                  -12%
                </span>
                <p className="text-[9px] font-mono uppercase text-editorial-muted tracking-widest">
                  Global Port Congestion Waiting Times
                </p>
                <div className="h-2 bg-editorial-dark border border-white/5 overflow-hidden">
                  <div className="h-full bg-editorial-accent w-[88%]"></div>
                </div>
                <span className="text-[9px] font-mono tracking-wider text-slate-500 uppercase block">Verified by maritime auditors</span>
              </div>
            </div>
          </div>
        )}


        {/* ACTIVE TAB: SOLUTIONS */}
        {activeTab === 'services' && (
          <div className="space-y-12 animate-fade-in" id="solutions-matrix">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl md:text-3.5xl font-display font-black text-white uppercase tracking-wider">
                Corporate Solutions Matrix
              </h2>
              <p className="text-xs md:text-sm text-zinc-400 font-sans">
                Deployable, robust framework templates custom-engineered for specific regulatory and operational environments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-editorial-dark border border-white/10 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-editorial-accent/30 bg-editorial-bg flex items-center justify-center text-editorial-accent">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Enterprise AI Architecture</h3>
                    <span className="text-[8px] font-mono text-zinc-300 bg-white/5 border border-white/10 px-2 py-0.5 uppercase tracking-widest inline-block">Level 3 Integration</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-350 leading-relaxed font-sans">
                  We auditing existing technology stacks and engineer customized software overlays that connect core CRM data to proprietary LLMs safely. We provide direct execution mapping, cloud container deployment protocols, and full security auditing checklists.
                </p>
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-slate-350 font-sans">
                    <Check className="w-4 h-4 text-editorial-accent shrink-0" />
                    Custom API deployment & load managers
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-350 font-sans">
                    <Check className="w-4 h-4 text-editorial-accent shrink-0" />
                    Deterministic prompt-chain safety routers
                  </div>
                </div>
              </div>

              <div className="bg-editorial-dark border border-white/10 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-editorial-accent/30 bg-editorial-bg flex items-center justify-center text-editorial-accent">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Autonomous Workflows</h3>
                    <span className="text-[8px] font-mono text-zinc-300 bg-white/5 border border-white/10 px-2 py-0.5 uppercase tracking-widest inline-block">Self-governed Systems</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-350 leading-relaxed font-sans">
                  Converting manual repetitive team actions into lightning fast event routers. Our system bots listen to compliance triggers, pull databases, summarize files with contextual intelligence, and alert administrators automatically.
                </p>
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-slate-350 font-sans">
                    <Check className="w-4 h-4 text-editorial-accent shrink-0" />
                    Automated document parsing & categorization
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-350 font-sans">
                    <Check className="w-4 h-4 text-editorial-accent shrink-0" />
                    Seamless hooks into standard ERP databases
                  </div>
                </div>
              </div>

              <div className="bg-editorial-dark border border-white/10 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-editorial-accent/30 bg-editorial-bg flex items-center justify-center text-editorial-accent">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Deterministic RAG (Grounding)</h3>
                    <span className="text-[8px] font-mono text-zinc-300 bg-white/5 border border-white/10 px-2 py-0.5 uppercase tracking-widest inline-block">Verified Compliance</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-350 leading-relaxed font-sans">
                  RAG is standard, but keeping answers locked into corporate guidelines requires precise semantic metadata chunking and strict prompt gating. We build custom citation algorithms showing raw contract links for every answer.
                </p>
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-slate-350 font-sans">
                    <Check className="w-4 h-4 text-editorial-accent shrink-0" />
                    Dynamic search overlap tuning
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-350 font-sans">
                    <Check className="w-4 h-4 text-editorial-accent shrink-0" />
                    Automatic citation linking index
                  </div>
                </div>
              </div>

              <div className="bg-editorial-dark border border-white/10 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-editorial-accent/30 bg-editorial-bg flex items-center justify-center text-editorial-accent">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Private Model Fine-Tuning</h3>
                    <span className="text-[8px] font-mono text-zinc-300 bg-white/5 border border-white/10 px-2 py-0.5 uppercase tracking-widest inline-block">Custom Weights</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-350 leading-relaxed font-sans">
                  When general conversational LLMs understand your niche vocabulary poorly, we engineer fine-tuning matrices that train smaller, highly compact, incredibly cheap open weighting structures inside your private VPC.
                </p>
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-slate-350 font-sans">
                    <Check className="w-4 h-4 text-editorial-accent shrink-0" />
                    Specialized jargon training modules
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-350 font-sans">
                    <Check className="w-4 h-4 text-editorial-accent shrink-0" />
                    Drastic reduction in active API tokens burning
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}


        {/* ACTIVE TAB: PORTFOLIO / CASE STUDIES */}
        {activeTab === 'portfolio' && (
          <div className="space-y-12 animate-fade-in" id="portfolio-showcase">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl md:text-3.5xl font-display font-black text-white uppercase tracking-wider">
                Enterprise Engineering Cases
              </h2>
              <p className="text-xs md:text-sm text-zinc-400 font-sans">
                Explore real, audited operation overhauls and strategic technical deployment outcomes.
              </p>
            </div>

            {/* Case list / interactive modal container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PORTFOLIO_PROJECTS.map((project) => (
                <div 
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`p-6 border transition-colors cursor-pointer text-left relative overflow-hidden rounded-none ${
                    selectedProject?.id === project.id 
                      ? 'bg-editorial-dark border-editorial-accent' 
                      : 'bg-editorial-dark border-white/10 hover:border-editorial-accent/50'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono uppercase bg-white/5 border border-white/10 text-editorial-accent px-2 py-0.5 tracking-widest font-bold">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="text-xs font-mono tracking-wider text-white uppercase leading-snug">
                      {project.title}
                    </h3>

                    <p className="text-xs text-zinc-450 line-clamp-3 leading-relaxed font-sans">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2 font-mono text-[8px] uppercase tracking-wider">
                      {project.techStack.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="bg-editorial-bg border border-white/5 px-1.5 py-0.5 text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>

                    <span className="text-[9px] font-mono text-editorial-accent block pt-1 uppercase tracking-widest">
                      Read full study details &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed case-view drawer */}
            {selectedProject ? (
              <div className="p-6 md:p-8 bg-editorial-dark border border-white/10 space-y-6 animate-fade-in relative">
                <button 
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 bg-editorial-bg border border-white/10 text-slate-400 hover:text-white cursor-pointer"
                  title="Close Details"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[9px] font-mono tracking-widest bg-editorial-accent/10 text-editorial-accent px-2.5 py-1 border border-editorial-accent/20 uppercase font-bold">
                      {selectedProject.category}
                    </span>
                    <h3 className="text-xs font-mono tracking-wider text-white uppercase bg-white/5 border border-white/10 px-3 py-1">
                      {selectedProject.title}
                    </h3>
                  </div>

                  <p className="text-zinc-300 text-xs leading-relaxed max-w-4xl font-sans">
                    {selectedProject.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    
                    <div className="p-5 bg-editorial-bg border border-white/10 space-y-2">
                      <h4 className="text-[9px] font-mono text-white uppercase font-black tracking-widest border-b border-white/5 pb-1 block">The Hard Challenge:</h4>
                      <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                        {selectedProject.challenge}
                      </p>
                    </div>

                    <div className="p-5 bg-editorial-bg border border-white/10 space-y-2">
                      <h4 className="text-[9px] font-mono text-editorial-accent uppercase font-black tracking-widest border-b border-white/5 pb-1 block">The OTD Solution Built:</h4>
                      <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                        {selectedProject.solution}
                      </p>
                    </div>

                    <div className="p-5 bg-editorial-bg border border-white/10 space-y-2">
                      <h4 className="text-[9px] font-mono text-white uppercase font-black tracking-widest border-b border-white/5 pb-1 block">Verified Strategic Impact:</h4>
                      <p className="text-xs text-zinc-300 font-sans font-medium leading-relaxed">
                        {selectedProject.impact}
                      </p>
                    </div>

                  </div>

                  <div className="pt-2">
                    <span className="text-[9px] font-mono text-slate-450 uppercase block mb-1 tracking-wider">Architecture Weights Deployment Stack:</span>
                    <div className="flex flex-wrap gap-2 text-[10px] font-mono tracking-wider uppercase">
                      {selectedProject.techStack.map((t, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-editorial-bg border border-white/10 text-zinc-300 animate-fade-in">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-editorial-bg/50 border border-white/10 border-dashed text-center text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Select one of our technical case-studies above to unpack active integrations.
              </div>
            )}

          </div>
        )}

        {/* ACTIVE TAB: CONTACT / RFP SUBMISSION */}
        {activeTab === 'contact' && (
          <div className="space-y-12 animate-fade-in" id="contact-gate">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-2.5xl md:text-3.5xl font-display font-bold text-white tracking-tight">
                Initiate Architecture Audit
              </h2>
              <p className="text-xs md:text-sm text-slate-450">
                Submit a high-level operational request. Our team reviews existing codebases and provides written technology alignment reports within 5 working days.
              </p>
            </div>

            <div className="max-w-2xl mx-auto bg-editorial-dark border border-white/10 p-6 md:p-8">
              {formSubmitted ? (
                <div className="text-center p-6 space-y-4 animate-fade-in">
                  <div className="w-12 h-12 bg-editorial-accent/10 border border-editorial-accent/25 text-editorial-accent flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-white">RFP Submitted Intact</h3>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Receipt has been cryptographic logged inside OTD AI systems. We have dispatched confirmation status to <strong className="text-white">{contactForm.email}</strong>.
                    </p>
                  </div>
                  <div className="p-4 bg-editorial-bg border border-white/5 text-left space-y-1.5 font-mono text-[10px] text-slate-400 max-w-md mx-auto uppercase tracking-wider">
                    <div><span className="text-slate-500">CLIENT:</span> {contactForm.name}</div>
                    <div><span className="text-slate-500">ORGANIZATION:</span> {contactForm.organization || 'Proprietary Broker'}</div>
                    <div><span className="text-slate-500">INTEREST:</span> {contactForm.serviceInterest}</div>
                    <div><span className="text-slate-500">DECISION BUDGET:</span> {contactForm.budget}</div>
                  </div>
                  <div className="pt-4">
                    <button 
                      type="button"
                      onClick={handleResetForm}
                      className="text-[9px] font-mono uppercase tracking-widest text-editorial-accent hover:underline cursor-pointer"
                    >
                      Fill another request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name-input" className="text-[9px] font-mono text-slate-400 uppercase block font-bold tracking-widest">Your Official Name *</label>
                      <input 
                        type="text" 
                        id="name-input"
                        name="name"
                        required
                        value={contactForm.name}
                        onChange={handleFormChange}
                        placeholder="e.g. Admiral John Vance"
                        className="w-full bg-editorial-bg border border-white/10 px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-editorial-accent transition-colors placeholder:text-slate-650"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email-input" className="text-[9px] font-mono text-slate-400 uppercase block font-bold tracking-widest">E-Mail Endpoint *</label>
                      <input 
                        type="email" 
                        id="email-input"
                        name="email"
                        required
                        value={contactForm.email}
                        onChange={handleFormChange}
                        placeholder="vance@coastalholdings.corp"
                        className="w-full bg-editorial-bg border border-white/10 px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-editorial-accent transition-colors placeholder:text-slate-655"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="org-input" className="text-[9px] font-mono text-slate-400 uppercase block font-bold tracking-widest">Organization / Corporation</label>
                      <input 
                        type="text" 
                        id="org-input"
                        name="organization"
                        value={contactForm.organization}
                        onChange={handleFormChange}
                        placeholder="Coastal Holdings Ltd."
                        className="w-full bg-editorial-bg border border-white/10 px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-editorial-accent transition-colors placeholder:text-slate-650"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="interest-select" className="text-[9px] font-mono text-slate-400 uppercase block font-bold tracking-widest">Primary Solutions Interest</label>
                      <select 
                        id="interest-select"
                        name="serviceInterest"
                        value={contactForm.serviceInterest}
                        onChange={handleFormChange}
                        className="w-full bg-editorial-bg border border-white/10 px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-editorial-accent transition-all cursor-pointer rounded-none uppercase font-mono tracking-wider text-[10px]"
                      >
                        <option>AI Strategy & Architecture Integration</option>
                        <option>Deterministic RAG / Guardrails fine-tune</option>
                        <option>Autonomous Document Workers</option>
                        <option>Unattended operations pipelines</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="budget-select" className="text-[9px] font-mono text-slate-400 uppercase block font-bold tracking-widest">Estimated Implementation Budget</label>
                    <select 
                      id="budget-select"
                      name="budget"
                      value={contactForm.budget}
                      onChange={handleFormChange}
                      className="w-full bg-editorial-bg border border-white/10 px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-editorial-accent transition-all cursor-pointer rounded-none uppercase font-mono tracking-wider text-[10px]"
                    >
                      <option>$25,000 - $50,000</option>
                      <option>$50,000 - $100,000</option>
                      <option>$100,000 - $250,000</option>
                      <option>$250,000+</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="specs-area" className="text-[9px] font-mono text-slate-400 uppercase block font-bold tracking-widest">Core Specifications & Workflow Pain-points</label>
                    <textarea 
                      id="specs-area"
                      name="proposalRequest"
                      rows={4}
                      value={contactForm.proposalRequest}
                      onChange={handleFormChange}
                      placeholder="e.g. Vetting document compliance manually for our audit team..."
                      className="w-full bg-editorial-bg border border-white/10 px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-editorial-accent transition-colors placeholder:text-slate-650 resize-none font-sans"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full mt-3 py-4 bg-editorial-accent text-black font-mono font-black text-xs uppercase tracking-widest transition-colors hover:bg-white hover:text-black hover:border-white cursor-pointer flex items-center justify-center gap-2"
                  >
                    Transmit Architecture Request
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ACTIVE TAB: BRANDING SYSTEM */}
        {activeTab === 'branding' && (
          <div className="space-y-12 animate-fade-in" id="branding-identity-manual">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl md:text-3.5xl font-display font-black text-white uppercase tracking-wider">
                Brand System & Design Identity
              </h2>
              <p className="text-xs md:text-sm text-zinc-400 font-sans">
                The visual framework, geometric properties, and design variables defining the Ocean Tide Drop AI Surfer representation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Interactive Logo Showroom */}
              <div className="lg:col-span-7 bg-editorial-dark border border-white/10 p-6 md:p-8 space-y-8">
                <div className="space-y-2 border-b border-white/10 pb-4">
                  <span className="text-[9px] font-mono tracking-widest text-editorial-accent uppercase bg-editorial-accent/10 px-2.5 py-1 border border-editorial-accent/25 inline-block font-black">
                    Brand Emblem Geometry
                  </span>
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    Core Symbol Presentation Grid
                  </h3>
                  <p className="text-xs text-slate-450 font-sans">
                    The corporate mark merges a breaking marine tide, electronic microchip architecture, and modern mathematical vectors in high-contrast clean spaces.
                  </p>
                </div>

                {/* Main Interactive Preview Window */}
                <div className="bg-editorial-bg border border-white/10 p-10 flex flex-col items-center justify-center relative group min-h-[320px] transition-all">
                  
                  {/* Grid background markers */}
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10 pointer-events-none select-none font-mono text-[7px] text-slate-450">
                    {Array.from({ length: 36 }).map((_, idx) => (
                      <div key={idx} className="border-r border-b border-dashed border-white/40 flex items-center justify-center p-0.5">
                        {String(idx).padStart(2, '0')}
                      </div>
                    ))}
                  </div>

                  {/* Render Variant depending on selected brand presets */}
                  <div className={`p-8 border relative transition-all duration-300 ${
                    logoVariant === 'glow' 
                      ? brandTheme === 'multicolor'
                        ? 'border-pink-500/40 bg-editorial-dark shadow-[0_0_25px_rgba(236,72,153,0.3)] scale-105'
                        : 'border-editorial-accent/40 bg-editorial-dark shadow-[0_0_25px_rgba(0,240,255,0.15)] scale-105' 
                      : logoVariant === 'minimal' 
                      ? 'border-transparent bg-transparent scale-100' 
                      : 'border-white/20 bg-slate-100 text-black scale-102 shadow-lg'
                  }`}>
                    {/* Bounding box annotations */}
                    <div className="absolute -top-3.5 -left-3 px-2 py-0.5 border border-dashed border-slate-600 bg-editorial-dark text-[7px] font-mono font-bold tracking-widest text-slate-400 uppercase select-none rounded-none">
                      X: 0.00
                    </div>
                    <div className="absolute -bottom-3.5 -right-3 px-2 py-0.5 border border-dashed border-slate-600 bg-editorial-dark text-[7px] font-mono font-bold tracking-widest text-slate-400 uppercase select-none rounded-none">
                      Y: 1.00
                    </div>

                    <img 
                      src={brandTheme === 'multicolor' ? "/src/assets/images/otd_ai_logo_multicolor_1780618812326.png" : "/src/assets/images/otd_ai_logo_1780441811431.png"} 
                      alt="OTD Mascot Emblem Render Target" 
                      className={`w-32 h-32 object-contain transition-all duration-300 ${
                        logoVariant === 'solid' ? 'brightness-90 contrast-125' : ''
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="mt-8 text-center space-y-1.5 z-10">
                    <span className="text-[10px] font-mono text-white block uppercase tracking-[0.2em] font-black">OTD AI Surfer Emblem Spec.</span>
                    <span className={`text-[9px] font-mono uppercase tracking-widest block font-bold bg-editorial-dark px-3 py-1 border border-white/10 ${brandTheme === 'multicolor' ? 'text-pink-400' : 'text-editorial-accent'}`}>
                      Aspect Ratio: 1:1 Square &bull; Render Frame: Active HTML5 Ingress
                    </span>
                  </div>
                </div>

                {/* Variant Switchers */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLogoVariant('glow')}
                    className={`py-2 px-3 border font-mono text-[9px] tracking-widest uppercase transition-colors rounded-none cursor-pointer ${
                      logoVariant === 'glow'
                        ? 'bg-editorial-accent text-black font-black border-editorial-accent'
                        : 'bg-editorial-bg text-slate-400 border-white/10 hover:text-white hover:border-white/30'
                    }`}
                  >
                    Glow Preset
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoVariant('minimal')}
                    className={`py-2 px-3 border font-mono text-[9px] tracking-widest uppercase transition-colors rounded-none cursor-pointer ${
                      logoVariant === 'minimal'
                        ? 'bg-editorial-accent text-black font-black border-editorial-accent'
                        : 'bg-editorial-bg text-slate-400 border-white/10 hover:text-white hover:border-white/30'
                    }`}
                  >
                    Minimal Flat
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoVariant('solid')}
                    className={`py-2 px-3 border font-mono text-[9px] tracking-widest uppercase transition-colors rounded-none cursor-pointer ${
                      logoVariant === 'solid'
                        ? 'bg-editorial-accent text-black font-black border-editorial-accent'
                        : 'bg-editorial-bg text-slate-400 border-white/10 hover:text-white hover:border-white/30'
                    }`}
                  >
                    Light Canvas
                  </button>
                </div>

                {/* Specs list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-editorial-bg border border-white/5 p-4 space-y-1 text-xs">
                    <strong className="text-white font-mono text-[10px] block uppercase tracking-wider">Symbol Safe Boundary</strong>
                    <p className="text-slate-450 leading-relaxed font-sans text-[11px]">
                      Ensure at least 1/4 the emblem width of empty protective white-space surrounds all margins to guarantee optimal high-contrast clarity.
                    </p>
                  </div>
                  <div className="bg-editorial-bg border border-white/5 p-4 space-y-1 text-xs">
                    <strong className="text-white font-mono text-[10px] block uppercase tracking-wider">Asset Lock Verification</strong>
                    <p className="text-slate-450 leading-relaxed font-sans text-[11px]">
                      Never compress, warp, filter, or re-color the corporate icon vectors outside verified Ocean Blue and Tidal White color configurations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side: Identity Guideline controls */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. Interactive Color Swatches */}
                <div className="bg-editorial-dark border border-white/10 p-6 space-y-4">
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Palette className="w-4 h-4 text-editorial-accent" />
                    Color Palette Swatches
                  </h4>
                  <p className="text-xs text-slate-450 font-sans leading-relaxed">
                    Click any color swatch box to instantly copy the hexadecimal color string for CSS configurations.
                  </p>

                  <div className="space-y-2 pt-2">
                    {/* Swatch 1: Foam & Teal Glow */}
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('#00F0FF');
                        setCopiedColorText('#00F0FF');
                        setTimeout(() => setCopiedColorText(null), 1500);
                      }}
                      className="w-full flex items-center justify-between p-3.5 bg-editorial-bg hover:bg-white/5 border border-white/10 transition-colors text-left rounded-none group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-none border border-white/15 bg-editorial-accent inline-block shrink-0"></span>
                        <div>
                          <strong className="text-xs font-mono text-white block uppercase tracking-wider">TEAL GLOW</strong>
                          <span className="text-[10px] text-slate-400 font-mono">Accent Variable / #00F0FF</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono uppercase bg-white/5 text-editorial-accent px-2 py-1 border border-white/10 tracking-widest font-black shrink-0">
                        {copiedColorText === '#00F0FF' ? 'Copied!' : 'Copy Hex'}
                      </span>
                    </button>

                    {/* Show new colorful gradient variables if multicolor */}
                    {brandTheme === 'multicolor' && (
                      <>
                        {/* Swatch: Hot Magenta */}
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('#EC4899');
                            setCopiedColorText('#EC4899');
                            setTimeout(() => setCopiedColorText(null), 1500);
                          }}
                          className="w-full flex items-center justify-between p-3.5 bg-editorial-bg hover:bg-white/5 border border-white/10 transition-colors text-left rounded-none group cursor-pointer animate-fade-in"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-none border border-white/15 bg-[#EC4899] inline-block shrink-0"></span>
                            <div>
                              <strong className="text-xs font-mono text-white block uppercase tracking-wider">HOT MAGENTA</strong>
                              <span className="text-[10px] text-slate-400 font-mono">Chroma Spectrum Accent / #EC4899</span>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono uppercase bg-white/5 text-pink-400 px-2 py-1 border border-white/10 tracking-widest font-black shrink-0">
                            {copiedColorText === '#EC4899' ? 'Copied!' : 'Copy Hex'}
                          </span>
                        </button>

                        {/* Swatch: Electric Violet */}
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('#A855F7');
                            setCopiedColorText('#A855F7');
                            setTimeout(() => setCopiedColorText(null), 1500);
                          }}
                          className="w-full flex items-center justify-between p-3.5 bg-editorial-bg hover:bg-white/5 border border-white/10 transition-colors text-left rounded-none group cursor-pointer animate-fade-in"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-none border border-white/15 bg-[#A855F7] inline-block shrink-0"></span>
                            <div>
                              <strong className="text-xs font-mono text-white block uppercase tracking-wider">ELECTRIC VIOLET</strong>
                              <span className="text-[10px] text-slate-400 font-mono">Chroma Spectrum Accent / #A855F7</span>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono uppercase bg-white/5 text-purple-400 px-2 py-1 border border-white/10 tracking-widest font-black shrink-0">
                            {copiedColorText === '#A855F7' ? 'Copied!' : 'Copy Hex'}
                          </span>
                        </button>
                      </>
                    )}

                    {/* Swatch 2: Ocean Deep Obsidian */}
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('#020B14');
                        setCopiedColorText('#020B14');
                        setTimeout(() => setCopiedColorText(null), 1500);
                      }}
                      className="w-full flex items-center justify-between p-3.5 bg-editorial-bg hover:bg-white/5 border border-white/10 transition-colors text-left rounded-none group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-none border border-white/15 bg-[#020B14] inline-block shrink-0"></span>
                        <div>
                          <strong className="text-xs font-mono text-white block uppercase tracking-wider">DEEP OBSIDIAN</strong>
                          <span className="text-[10px] text-slate-400 font-mono">Background Base / #020B14</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono uppercase bg-white/5 text-editorial-accent px-2 py-1 border border-white/10 tracking-widest font-black shrink-0">
                        {copiedColorText === '#020B14' ? 'Copied!' : 'Copy Hex'}
                      </span>
                    </button>

                    {/* Swatch 3: Pitch Dark */}
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('#000307');
                        setCopiedColorText('#000307');
                        setTimeout(() => setCopiedColorText(null), 1500);
                      }}
                      className="w-full flex items-center justify-between p-3.5 bg-editorial-bg hover:bg-white/5 border border-white/10 transition-colors text-left rounded-none group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-none border border-white/15 bg-[#000307] inline-block shrink-0"></span>
                        <div>
                          <strong className="text-xs font-mono text-white block uppercase tracking-wider">CORE DARK</strong>
                          <span className="text-[10px] text-slate-400 font-mono">Containers Dark / #000307</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono uppercase bg-white/5 text-editorial-accent px-2 py-1 border border-white/10 tracking-widest font-black shrink-0">
                        {copiedColorText === '#000307' ? 'Copied!' : 'Copy Hex'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 2. Brand Typography standards */}
                <div className="bg-editorial-dark border border-white/10 p-6 space-y-4">
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Type className="w-4 h-4 text-editorial-accent" />
                    Strategic Typography Pairs
                  </h4>
                  <p className="text-xs text-slate-450 font-sans leading-relaxed">
                    Our fonts convey editorial structure, mathematical precision, and technical confidence.
                  </p>

                  <div className="bg-editorial-bg border border-white/5 p-4 space-y-4 font-sans text-[11px] leading-relaxed">
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">A. Heading Font (Display)</span>
                      <h5 className="font-display font-black text-white text-base tracking-wider uppercase">SPACE GROTESK REGULAR</h5>
                      <p className="text-slate-450 text-[10px] font-mono tracking-wide -mt-0.5">Tracking: tracking-wider / Style: uppercase</p>
                    </div>

                    <div className="space-y-1 border-t border-white/10 pt-3">
                      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">B. Body Font (Technical sans-serif)</span>
                      <h5 className="font-sans font-medium text-slate-200 text-xs text-slate-350">PLUS JAKARTA SANS FONT</h5>
                      <p className="text-slate-450 text-[10px] font-mono tracking-wide -mt-0.5">Weight: 400 &bull; 500 &bull; 600 / Leading: relaxed</p>
                    </div>

                    <div className="space-y-1 border-t border-white/10 pt-3">
                      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">C. Code Font (Technical parameters)</span>
                      <h5 className="font-mono text-editorial-accent text-xs">JETBRAINS MONO FONT &lt;CORE&gt;</h5>
                      <p className="text-slate-450 text-[10px] font-mono tracking-wide -mt-0.5">Weight: medium &bull; font-bold / Spacing: normal</p>
                    </div>
                  </div>
                </div>

                {/* 3. Cryptographic Lock & Seal control panel */}
                <div className="bg-editorial-dark border border-white/10 p-6 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-editorial-accent/5 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12"></div>
                  
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      DNS Asset Cryptographic Lock
                    </h4>
                    <span className={`w-2 h-2 rounded-full ${isBrandLocked ? 'bg-editorial-accent animate-pulse' : 'bg-red-500'}`}></span>
                  </div>

                  <p className="text-[11px] leading-relaxed text-slate-400 font-sans">
                    Locking enforces strict CSS variables and seals the SVG aspect ratios at DNS levels, protecting the assets from unsolicited changes or visual drift.
                  </p>

                  {lockProcessState === 'sealing' ? (
                    <div className="p-4 bg-editorial-bg border border-white/15 space-y-3">
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="text-white animate-pulse uppercase tracking-wider">Cryptographically Sealing Asset Coordinates...</span>
                        <span className="text-editorial-accent font-black">ACTIVE</span>
                      </div>
                      <div className="h-1.5 bg-editorial-dark border border-white/10 overflow-hidden relative">
                        <div className="h-full bg-editorial-accent rounded-none w-1/2 animate-[wave-flow_2s_ease_infinite] wave-animate-bg"></div>
                      </div>
                    </div>
                  ) : lockProcessState === 'done' ? (
                    <div className="p-4 bg-editorial-bg/30 border border-editorial-accent/30 space-y-2 animate-fade-in">
                      <div className="flex items-center gap-2 text-xs text-white">
                        <Check className="w-4 h-4 text-editorial-accent shrink-0" />
                        <span className="font-mono text-[10px] uppercase font-bold tracking-wider">Brand Secured & Locked</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans">
                        Assets, colors, and layouts cryptographically sealed on domains.
                      </p>
                      <div className="text-[8.5px] font-mono text-slate-500 uppercase tracking-wide">
                        SEAL_KEY: OTD_SURF_DNS_KEY_178044_SEC
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-editorial-bg border border-white/5 space-y-1 text-slate-400 font-mono text-[9px] uppercase tracking-wider">
                      <div className="flex justify-between">
                        <span>DNS Proxy Lock State:</span>
                        <span className="text-editorial-accent font-bold">LOCKED</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Aspect Ratio Constraints:</span>
                        <span className="text-slate-300">1:1 STRICT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protected Target:</span>
                        <span className="text-slate-300">OTDAISurfer.surf</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      disabled={lockProcessState === 'sealing'}
                      onClick={() => {
                        setLockProcessState('sealing');
                        setTimeout(() => {
                          setLockProcessState('done');
                          setIsBrandLocked(true);
                          setLockTimestamp(new Date().toUTCString().replace('GMT', 'UTC'));
                        }, 2200);
                      }}
                      className="flex-1 py-3 bg-editorial-accent text-black hover:bg-white hover:text-black font-mono font-black text-[10px] uppercase tracking-widest transition-colors rounded-none cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40"
                    >
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      Seal Brand Rules
                    </button>

                    <button
                      type="button"
                      disabled={lockProcessState === 'sealing'}
                      onClick={() => {
                        setIsBrandLocked(false);
                        setLockProcessState('idle');
                      }}
                      className="py-3 px-4 bg-editorial-bg border border-white/10 hover:border-white/30 text-white font-mono font-bold text-[10px] uppercase tracking-wider transition-colors rounded-none cursor-pointer flex items-center justify-center"
                      title="Unlock for Modifications"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ACTIVE TAB: MEMBERS PORTAL */}
        {activeTab === 'members' && (
          <div className="space-y-8 animate-fade-in text-sans" id="members-restricted-arena">
            
            {/* Header branding lock */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-white/10 bg-editorial-dark p-6 rounded-none">
              <div className="space-y-1">
                <span className="text-[10px] bg-pink-500/10 text-pink-400 border border-pink-500/20 py-0.5 px-2.5 font-mono font-black tracking-widest uppercase inline-block">
                  RESTRICTED PARTNER SUITE
                </span>
                <h2 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-wider">
                  OceanTide Members Portal
                </h2>
                <p className="text-xs text-slate-400 font-sans">
                  Secure ingress console validating multi-ocean data streams, API networks, and operational automation boards.
                </p>
              </div>

              {memberUser && (
                <div className="flex items-center gap-3 bg-editorial-bg border border-white/5 py-2 px-4 rounded-none font-mono text-[10px] tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-slate-350">OPERATOR: <strong className="text-white">{memberUser.email}</strong></span>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await logout();
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="ml-3 text-pink-400 hover:text-white transition-colors uppercase font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Disconnect Port
                  </button>
                </div>
              )}
            </div>

            {/* UN-AUTHENTICATED LOGIN GATE */}
            {!memberUser ? (
              <div className="max-w-md mx-auto bg-editorial-dark border border-pink-500/20 shadow-[0_0_30px_rgba(236,72,153,0.1)] p-8 space-y-6 text-center animate-fade-in">
                <div className="mx-auto w-12 h-12 bg-pink-500/10 border border-pink-500/30 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-pink-400" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-display font-black text-white uppercase tracking-widest text-sm">
                    LOCKBOX INTEGRITY VERIFICATION
                  </h3>
                  <p className="text-[11px] leading-relaxed text-slate-400 font-sans">
                    Authentication is strictly authenticated via authorized Google Workspace domains. This guarantees direct database syncing and workspace tool authorization.
                  </p>
                </div>

                {memberAuthError && (
                  <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 font-mono text-[10px] leading-normal uppercase">
                    Handshake failure: {memberAuthError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={async () => {
                    setMemberAuthError(null);
                    try {
                      await googleSignIn();
                    } catch (e: any) {
                      setMemberAuthError(e.message || String(e));
                    }
                  }}
                  className="w-full py-4 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-500 text-black font-mono font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Authenticate Node
                </button>

                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider space-y-1">
                  <div>PORT: 3000 / PERSISTENCE: FIRESTORE SECURE</div>
                  <div>AUTHORIZED CO: OCEANTIDE DROP AI SURFER GROUP</div>
                </div>
              </div>
            ) : (
              /* AUTHENTICATED PARTNER WORKSPACE */
              <div className="space-y-6">
                
                {/* SUB-TABS SELECTOR */}
                <div className="flex border-b border-white/10 text-[11px] font-mono uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setMemberActiveSuiteTab('workspace')}
                    className={`px-6 py-4.5 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                      memberActiveSuiteTab === 'workspace'
                        ? 'border-pink-500 text-pink-400 bg-white/5 font-extrabold'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-pink-400" />
                    💼 Integrated Workspace Hub
                  </button>
                  <button
                    type="button"
                    onClick={() => setMemberActiveSuiteTab('labs')}
                    className={`px-6 py-4.5 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                      memberActiveSuiteTab === 'labs'
                        ? 'border-pink-500 text-pink-400 bg-white/5 font-extrabold'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <Cpu className="w-4 h-4 text-pink-400" />
                    ⚡ AI Engineering Labs
                  </button>
                </div>

                {/* AREA 1: INTEGRATED WORKSPACE HUB (GOOGLE WORKSPACE CONTROL - THE OTHER APP!) */}
                {memberActiveSuiteTab === 'workspace' && (
                  <div className="border border-white/10 animate-fade-in bg-editorial-bg">
                    <div className="p-4 bg-editorial-dark border-b border-white/10 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-pink-400 uppercase tracking-widest font-bold">WORKSPACE INTERFACE</span>
                        <h4 className="text-xs font-mono uppercase text-white tracking-widest">Google Workspace Control Console</h4>
                      </div>
                      <span className="text-[9px] bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 py-0.5 px-2 font-mono tracking-widest">
                        CONNECTED V2
                      </span>
                    </div>

                    {/* Rendering the custom other app component cleanly */}
                    <div className="p-4">
                      <GoogleWorkspaceControl />
                    </div>
                  </div>
                )}

                {/* AREA 2: AI ENGINEERING LABS HUB (6 COOL LAB TOOLS) */}
                {memberActiveSuiteTab === 'labs' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
                    
                    {/* Left: 6 Tool selector cards list */}
                    <div className="lg:col-span-4 space-y-3.5">
                      <div className="p-4 bg-editorial-dark border border-white/10 mb-2">
                        <h4 className="text-xs font-mono text-white uppercase tracking-wider font-bold">
                          Active Lab AI Modules
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1 font-sans leading-relaxed">
                          Deploy and test advanced agency pipeline modules using pre-authenticated system variables.
                        </p>
                      </div>

                      {AI_TOOLS.map((tool) => {
                        const isChosen = selectedLabToolId === tool.id;
                        return (
                          <button
                            key={tool.id}
                            type="button"
                            onClick={() => setSelectedLabToolId(tool.id)}
                            className={`w-full p-4 border text-left rounded-none transition-all cursor-pointer group flex items-start gap-3 ${
                              isChosen
                                ? 'bg-editorial-dark border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.15)] ring-1 ring-pink-500/20'
                                : 'bg-editorial-dark/40 border-white/5 hover:border-white/15'
                            }`}
                          >
                            <span className={`p-2 shrink-0 ${isChosen ? 'bg-pink-500/10 border border-pink-500/30' : 'bg-white/5 border border-white/10 group-hover:bg-white/10'} text-pink-400`}>
                              {tool.category === 'Agents' && <Cpu className="w-4 h-4" />}
                              {tool.category === 'Data & Analytics' && <BookOpen className="w-4 h-4" />}
                              {tool.category === 'Workflow' && <Workflow className="w-4 h-4" />}
                              {tool.category === 'Customer Experience' && <Sparkles className="w-4 h-4" />}
                              {tool.category === 'Content & Design' && <Type className="w-4 h-4" />}
                            </span>
                            <div className="space-y-1">
                              <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-widest block">{tool.category}</span>
                              <strong className={`font-mono text-xs block transition-colors ${isChosen ? 'text-pink-400 font-extrabold' : 'text-white border-transparent'}`}>
                                {tool.name}
                              </strong>
                              <p className="text-[10px] text-slate-400 leading-relaxed font-sans line-clamp-2">
                                {tool.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right: Active sandbox playground container */}
                    <div className="lg:col-span-8 bg-editorial-dark border border-white/10 p-6 md:p-8 space-y-6">
                      
                      {/* Active tool general statistics & data */}
                      {(() => {
                        const tool = AI_TOOLS.find(t => t.id === selectedLabToolId);
                        if (!tool) return null;
                        
                        return (
                          <div className="space-y-6">
                            
                            {/* Summary Metadata */}
                            <div className="border-b border-white/10 pb-4 space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-[9px] font-mono text-pink-400 uppercase tracking-widest bg-pink-500/5 px-2 py-0.5 border border-pink-500/10 font-bold">
                                  Category: {tool.category}
                                </span>
                                <span className="text-[9px] font-mono text-slate-500 uppercase">
                                  COMPLEXITY: <strong className="text-white">{tool.complexity}</strong> | ROI: <strong className="text-white">{tool.roiEstimate}</strong>
                                </span>
                              </div>
                              <h3 className="text-lg font-display font-black text-white uppercase tracking-wider">
                                {tool.name}
                              </h3>
                              <p className="text-xs text-slate-350 font-sans leading-relaxed">
                                {tool.description}
                              </p>
                              <div className="p-3 bg-editorial-bg border border-white/5 text-[10.5px] font-sans text-emerald-400 flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                                <span className="font-mono text-[9px] uppercase tracking-wide text-slate-400 font-bold">OPERATIONAL DIRECT BENEFIT:</span>
                                <strong>{tool.benefit}</strong>
                              </div>
                            </div>

                            {/* 1. TIDALAGENT TASK ORCHESTRATOR PLAYGROUND */}
                            {tool.id === 'tool-autonomous-agent' && (
                              <div className="space-y-4 font-sans animate-fade-in">
                                <div className="space-y-3">
                                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">Configure Task Intent</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Sync Stripe customer events with Supabase database"
                                    value={agentTaskTitle}
                                    onChange={(e) => setAgentTaskTitle(e.target.value)}
                                    className="w-full bg-editorial-bg border border-white/10 px-4 py-3 text-xs text-white font-mono rounded-none focus:outline-none focus:border-pink-500/50"
                                  />
                                </div>

                                <div className="space-y-3">
                                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">Operational Pipeline Handshake Instructions</label>
                                  <textarea
                                    rows={3}
                                    placeholder="e.g. When a Stripe payload hits the Supabase webhook (https://cctobgbyxjfabksnokbe.supabase.co/functions/v1/stripe-webhook), invoke an OpenAI orchestration node to generate a tailored response, and stream telemetry blocks to Slack."
                                    value={agentTaskNotes}
                                    onChange={(e) => setAgentTaskNotes(e.target.value)}
                                    className="w-full bg-editorial-bg border border-white/10 px-4 py-3 text-xs text-zinc-300 leading-relaxed rounded-none focus:outline-none focus:border-pink-500/50"
                                  />
                                </div>

                                <div className="pt-2">
                                  <button
                                    type="button"
                                    disabled={agentTaskRunning || !agentTaskTitle}
                                    onClick={() => {
                                      setAgentTaskRunning(true);
                                      setTimeout(() => {
                                        setAgentTaskRunning(false);
                                      }, 3500);
                                    }}
                                    className="px-6 py-3.5 bg-pink-500 text-black hover:bg-white font-mono font-black text-xs uppercase tracking-widest transition-colors rounded-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
                                  >
                                    {agentTaskRunning ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Running Daemon Handshakes...
                                      </>
                                    ) : (
                                      <>
                                        <Play className="w-4 h-4 shrink-0" />
                                        Deploy Task Orchestrator
                                      </>
                                    )}
                                  </button>
                                </div>

                                {/* Active simulated console logs */}
                                {(agentTaskRunning || agentTaskTitle) && (
                                  <div className="bg-editorial-bg border border-white/10 p-4 space-y-2 font-mono text-[9px] uppercase tracking-wider leading-relaxed text-slate-400 select-none max-h-48 overflow-y-auto">
                                    <div className="text-pink-400 font-bold">[TIDAL_AGENT DAEMON ENGINE ACTIVE]</div>
                                    <div>[INIT] Spawning autonomous orchestration thread...</div>
                                    <div>[HANDSHAKE] Handshaking with OpenAI agent credentials... sk-proj-GvLCuLD...</div>
                                    {agentTaskRunning ? (
                                      <>
                                        <div className="text-cyan-400 animate-pulse">[SECURE] Hooking Supabase dynamic endpoint: VITE_SUPABASE_URL</div>
                                        <div className="text-amber-400 animate-pulse">[ROUTER] Binding Stripe secret key signatures: sk_live_51SFQu...</div>
                                        <div>[COMM] Synchronizing secure webhook router...</div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="text-emerald-400 font-bold">[SUCCESS] Deployment stabilized on Cloud Run cluster!</div>
                                        <div className="text-emerald-400">[LISTENER] Listening live at: https://cctobgbyxjfabksnokbe.supabase.co/functions/v1/stripe-webhook</div>
                                        <div className="mt-3 flex gap-2">
                                          <button
                                            type="button"
                                            onClick={async () => {
                                              try {
                                                await supabaseDb.addNote({
                                                  note_id: 'agent-' + Date.now(),
                                                  user_id: memberUser.uid,
                                                  title: `🛸 TidalAgent: ${agentTaskTitle}`,
                                                  content: `Orchestrator specification summary:\n\nTask Intent: ${agentTaskTitle}\nPipeline Instructions: ${agentTaskNotes || 'Default automated loop'}\nEndpoint: https://cctobgbyxjfabksnokbe.supabase.co/functions/v1/stripe-webhook\nStripe API Key Node: Active (sk_live_5ap)\nOpenAI Engine: GPT-4 Orchestrator (sk-proj)\nStatus: DEPLOYED ACTIVE`,
                                                  color: '#1e1b4b'
                                                });
                                                alert('Success! TidalAgent spec blueprint has been exported directly to Keep. Switch to the Workspace Hub to view it live!');
                                                // Trigger send telemetry block
                                                sendSlackMessage('system', { 
                                                  text: `Autonomous TidalAgent task orchestration deployed: ${agentTaskTitle}`, 
                                                  domain: 'otdaisurfer.surf/labs', 
                                                  agent: 'TidalAgent Task Suite' 
                                                });
                                              } catch (err: any) {
                                                handleFirestoreError(err, OperationType.WRITE, 'notes');
                                              }
                                            }}
                                            className="px-3 py-1.5 bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500 hover:text-black font-mono text-[8.5px] uppercase tracking-wider transition-all cursor-pointer font-black"
                                          >
                                            Export Spec to Workspace Keep Notes
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* 2. REEFSENSE RAG PILOT PLAYGROUND */}
                            {tool.id === 'tool-smart-rag' && (
                              <div className="space-y-4 font-sans animate-fade-in">
                                <div className="space-y-3">
                                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">Natural Retrieve Query</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Refund conditions for beachfront WaveWear store sales"
                                    value={ragQuery}
                                    onChange={(e) => setRagQuery(e.target.value)}
                                    className="w-full bg-editorial-bg border border-white/10 px-4 py-3 text-xs text-white font-mono rounded-none focus:outline-none focus:border-pink-500/50"
                                  />
                                </div>

                                <div className="pt-2">
                                  <button
                                    type="button"
                                    disabled={ragSearching || !ragQuery}
                                    onClick={() => {
                                      setRagSearching(true);
                                      setRagResults([]);
                                      setRagSummary('');
                                      setTimeout(() => {
                                        setRagSearching(false);
                                        setRagResults([
                                          { docName: 'doc_coastal_legal_3.pdf-chunk_41', relevance: 0.94, snippet: 'Beachfront sales are covered under ocean-tide environmental policies. Refund cycles permit up to 14 days when local water high limits trigger shop closures.' },
                                          { docName: 'doc_wavewear_customer_policies.pdf', relevance: 0.88, snippet: 'Customers claiming defects in wet apparel or surfboard straps are entitled to rapid replacement, bypassing standard 30-day retail backlogs.' }
                                        ]);
                                        setRagSummary('Synthesized RAG Audit result:\nBased on beach compliance policy index doc_coastal_legal_3.pdf (#41) and general apparel guidelines, customers at WaveWear storefront locations are entitled to full refund benefits within 14 calendar days during high-tide extreme weather triggers or local closures. Replacing defective wet gears or straps does not require typical wait cycles.');
                                      }, 2200);
                                    }}
                                    className="px-6 py-3.5 bg-pink-500 text-black hover:bg-white font-mono font-black text-xs uppercase tracking-widest transition-colors rounded-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
                                  >
                                    {ragSearching ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Querying Vector Index...
                                      </>
                                    ) : (
                                      <>
                                        <Sparkles className="w-4 h-4" />
                                        Retrieve & Summarize
                                      </>
                                    )}
                                  </button>
                                </div>

                                {ragSearching && (
                                  <div className="bg-editorial-bg border border-white/10 p-4 text-[9px] font-mono text-slate-400 space-y-1 select-none">
                                    <div className="text-pink-400 animate-pulse">[RAG SCANNING...]</div>
                                    <div>[CONNECT] Embedding query parameters using OpenAI embedding client...</div>
                                    <div>[QUERY] Searching Index namespaces... BM25 + Vector hybrid alignment...</div>
                                    <div>[PINECONE] Resolving metadata tags indices...</div>
                                  </div>
                                )}

                                {ragSummary && (
                                  <div className="space-y-4 animate-fade-in">
                                    <div className="border border-white/10 bg-editorial-bg p-4 space-y-3">
                                      <h5 className="font-mono text-[10px] text-pink-400 uppercase tracking-wider font-bold">Synthesized Insights Output</h5>
                                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">{ragSummary}</p>
                                    </div>

                                    <div className="border border-white/10 bg-editorial-bg p-4 space-y-2">
                                      <h5 className="font-mono text-[9px] text-slate-400 uppercase tracking-wider">Associated Document Nodes Clustered</h5>
                                      <div className="space-y-2">
                                        {ragResults.map((r, i) => (
                                          <div key={i} className="text-[10px] font-mono border-l-2 border-pink-500/55 pl-3.5 py-1 text-slate-450 bg-white/2">
                                            <div className="flex justify-between font-bold text-white uppercase text-[9px]">
                                              <span>{r.docName}</span>
                                              <span className="text-pink-400">SCORE: {r.relevance}</span>
                                            </div>
                                            <p className="text-slate-400 text-[9.5px] leading-relaxed mt-0.5">{r.snippet}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div>
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          try {
                                            await supabaseDb.addNote({
                                              note_id: 'rag-' + Date.now(),
                                              user_id: memberUser.uid,
                                              title: `🔍 ReefSense RAG: ${ragQuery}`,
                                              content: `Query: ${ragQuery}\n\n${ragSummary}\n\nRetrieved Nodes:\n- doc_coastal_legal_3.pdf (Relevance: 0.94)\n- doc_wavewear_customer_policies.pdf (Relevance: 0.88)`,
                                              color: '#1e1b4b'
                                            });
                                            alert('Success! ReefSense RAG report exported directly to Workspace Keep notes.');
                                          } catch (err: any) {
                                            handleFirestoreError(err, OperationType.WRITE, 'notes');
                                          }
                                        }}
                                        className="px-4 py-2 bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500 hover:text-black font-mono text-[8.5px] uppercase tracking-wider transition-all cursor-pointer font-black"
                                      >
                                        Export Summary Report to Keep Notes
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* 3. DROPWAVE WEBHOOK ROUTER PLAYGROUND */}
                            {tool.id === 'tool-workflow-automate' && (
                              <div className="space-y-4 font-sans animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">Trigger Source Event</label>
                                    <select
                                      value={webhookEvent}
                                      onChange={(e) => {
                                        const event = e.target.value;
                                        setWebhookEvent(event);
                                        // Update parameters template
                                        if (event === 'stripe_dispute') {
                                          setWebhookDetails(JSON.stringify({ id: "evt_dispute_123", type: "charge.dispute.created", data: { object: { amount: 25000, charge: "ch_live_99831", reason: "unrecognized" } } }, null, 2));
                                        } else if (event === 'stripe_payment_success') {
                                          setWebhookDetails(JSON.stringify({ id: "evt_success_7718", type: "charge.succeeded", data: { object: { amount: 120000, customer: "cus_tidal_001", receipt_url: "https://stripe.com/receipt" } } }, null, 2));
                                        } else if (event === 'lead_form') {
                                          setWebhookDetails(JSON.stringify({ source_domain: "OceanTideDropAISurfer.services", lead_name: "Sarah Connor", company: "Skynet Logistics", interest: "Tidal Agent Task Orchestrator" }, null, 2));
                                        } else {
                                          setWebhookDetails(JSON.stringify({ ref: "refs/heads/main", repository: "otdaisurfer-monorepo", pusher: "kaibrooks-dev", commits: [{"message": "Sealed DNS asset configurations with Cloudflare proxy"}] }, null, 2));
                                        }
                                      }}
                                      className="w-full bg-editorial-bg border border-white/10 px-3.5 py-3 text-xs text-white font-mono rounded-none focus:outline-none focus:border-pink-500/50"
                                    >
                                      <option value="stripe_dispute">charge.dispute.created (Stripe Dispute)</option>
                                      <option value="stripe_payment_success">charge.succeeded (Stripe Pay Success)</option>
                                      <option value="lead_form">lead_captured (Lead Lander Submission)</option>
                                      <option value="github_push">git.push (GitHub Repository Workflows)</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">JSON Event Parameters Payload</label>
                                  <textarea
                                    rows={5}
                                    value={webhookDetails || JSON.stringify({ id: "evt_dispute_123", type: "charge.dispute.created", data: { object: { amount: 25000, charge: "ch_live_99831", reason: "unrecognized" } } }, null, 2)}
                                    onChange={(e) => setWebhookDetails(e.target.value)}
                                    className="w-full bg-editorial-bg border border-white/10 p-3 text-xs font-mono text-zinc-300 rounded-none focus:outline-none focus:border-pink-500/50"
                                  />
                                </div>

                                <div className="pt-2">
                                  <button
                                    type="button"
                                    disabled={webhookSending}
                                    onClick={() => {
                                      setWebhookSending(true);
                                      const timestamp = new Date().toLocaleTimeString();
                                      const logsCopy = [...webhookLogs];
                                      logsCopy.push(`[${timestamp}] 📥 Received webhook dispatch request: ${webhookEvent}`);
                                      logsCopy.push(`[${timestamp}] [SECURITY] Fingerprinted signature check passed using whsec_Gd3UlfeFWpYvZxCjLUOwmdKd`);
                                      
                                      setTimeout(() => {
                                        logsCopy.push(`[${timestamp} +1.2s] [ORCHESTRATOR] Routing payload triggers to: https://cctobgbyxjfabksnokbe.supabase.co/functions/v1/stripe-webhook`);
                                        logsCopy.push(`[${timestamp} +1.8s] [ACTION] Triggering OpenAI Node GPT filter sk-proj-GvLCuLDbHN9V...`);
                                        logsCopy.push(`[${timestamp} +2.4s] [SLACK] Stream payload alert posted on #otd-surfer-leads channels!`);
                                        logsCopy.push(`[${timestamp} +2.8s] [SUCCESS] Router stabilized execution complete (200 OK)`);
                                        setWebhookLogs(logsCopy);
                                        setWebhookSending(false);
                                      }, 1500);
                                    }}
                                    className="px-6 py-3.5 bg-pink-500 text-black hover:bg-white font-mono font-black text-xs uppercase tracking-widest transition-colors rounded-none cursor-pointer flex items-center justify-center gap-2"
                                  >
                                    {webhookSending ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Pushing Telemetry...
                                      </>
                                    ) : (
                                      <>
                                        <Send className="w-4 h-4" />
                                        Post Webhook Telemetry
                                      </>
                                    )}
                                  </button>
                                </div>

                                {/* Terminal output log */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Real-time Telemetry logs</span>
                                    <button
                                      type="button"
                                      onClick={() => setWebhookLogs(['[SYSTEM] DropWave webhook router initialized. Ready for dispatch telemetry.'])}
                                      className="text-[9px] font-mono text-pink-400 hover:underline hover:text-white"
                                    >
                                      Clear Logs
                                    </button>
                                  </div>
                                  <div className="bg-editorial-bg border border-white/10 p-4 space-y-1.5 font-mono text-[9px] uppercase tracking-wide leading-relaxed text-slate-400 h-40 overflow-y-auto select-none rounded-none">
                                    {webhookLogs.map((log, i) => (
                                      <div key={i} className={log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : log.includes('[SECURITY]') ? 'text-cyan-400' : log.includes('Received') ? 'text-pink-400' : 'text-slate-400'}>
                                        {log}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Save to keep */}
                                <div>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      try {
                                        await supabaseDb.addNote({
                                          note_id: 'webhook-' + Date.now(),
                                          user_id: memberUser.uid,
                                          title: `⚙️ DropWave: Webhook Telemetry Stream`,
                                          content: `Webhook router activity checklist:\n\nTrigger Event: ${webhookEvent}\nPayload Details: ${webhookDetails || 'None'}\n\nHistoric Logs:\n${webhookLogs.join('\n')}`,
                                          color: '#1e1b4b'
                                        });
                                        alert('Success! DropWave telemetry log exported directly to Workspace Keep notes.');
                                      } catch (err: any) {
                                        handleFirestoreError(err, OperationType.WRITE, 'notes');
                                      }
                                    }}
                                    className="px-4 py-2 bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500 hover:text-black font-mono text-[8.5px] uppercase tracking-wider transition-all cursor-pointer font-black"
                                  >
                                    Export Router Logs to Keep Notes
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* 4. SWELLRESPOND REVIEW PILOT PLAYGROUND */}
                            {tool.id === 'tool-sentiment-responder' && (
                              <div className="space-y-4 font-sans animate-fade-in">
                                <div className="space-y-2">
                                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">Source Customer Feedback Comment</label>
                                  <textarea
                                    rows={3}
                                    placeholder="e.g. OTD AI is cool, but their services app has no stripe subscription portal. The team is friendly though!"
                                    value={responderComment}
                                    onChange={(e) => setResponderComment(e.target.value)}
                                    className="w-full bg-editorial-bg border border-white/10 px-4 py-3 text-xs text-white font-mono rounded-none focus:outline-none focus:border-pink-500/50"
                                  />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">Tone Presets</label>
                                    <select
                                      value={respondTone}
                                      onChange={(e) => setRespondTone(e.target.value)}
                                      className="w-full bg-editorial-bg border border-white/10 px-3.5 py-3 text-xs text-white font-mono rounded-none focus:outline-none focus:border-pink-500/50"
                                    >
                                      <option value="Enterprise Polite">Enterprise Polite & Technical</option>
                                      <option value="Sunset Beach Casual">Sunset Beach Casual</option>
                                      <option value="Apologetic & Proactive">Apologetic & Urgent</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="pt-2">
                                  <button
                                    type="button"
                                    disabled={savingRespondNote || !responderComment}
                                    onClick={() => {
                                      setSavingRespondNote(true);
                                      setTimeout(() => {
                                        const formal = `Dear Partner,\n\nThank you for sharing your experience riding the automation waves with OTD AI Surfer. We are thrilled to hear that our tools are helpful! Regarding the membership billing portal, we appreciate your prompt feedback. We have actively configured our Stripe webhook architecture pointing to our Supabase database functions under secure endpoints to protect customer data. Our technical director is looking forward to scheduling onboarding for your subscription flows.\n\nWarm regards,\nSwellRespond Support Principal`;
                                        const casual = `Aloha Friend,\n\nStoked to hear you are loving the OTD AI wave! We appreciate the feedback on the Stripe portal—we are actually integrating it with our backend right now on the Members Portal. The high-tide pipelines are fully connected now. Hang loose, and we'll hit you up on our Slack channel shortly!\n\nCheers,\nSurf Team`;
                                        const urgent = `Dear Authorized Partner,\n\nThank you for raising these interface specifications regarding our Stripe payment configurations. We apologize for any confusion and have proactively activated our DropWave routers to verify and audit current telemetry pipelines. An operations engineer is checking the Stripe Webhook secret limits (whsec_G) immediately to expedite portal resolutions.\n\nSincere apologies,\nCritical Ops Node`;
                                        
                                        setRespondDraft(respondTone === 'Enterprise Polite' ? formal : respondTone === 'Sunset Beach Casual' ? casual : urgent);
                                        setSavingRespondNote(false);
                                      }, 1500);
                                    }}
                                    className="px-6 py-3.5 bg-pink-500 text-black hover:bg-white font-mono font-black text-xs uppercase tracking-widest transition-colors rounded-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
                                  >
                                    {savingRespondNote ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Fusing Sentiment Draft...
                                      </>
                                    ) : (
                                      <>
                                        <Sparkles className="w-4 h-4 shrink-0" />
                                        Draft Sentiment Reply
                                      </>
                                    )}
                                  </button>
                                </div>

                                {respondDraft && (
                                  <div className="space-y-4 animate-fade-in">
                                    <div className="border border-white/10 bg-editorial-bg p-4 space-y-3">
                                      <h5 className="font-mono text-[10px] text-pink-400 uppercase tracking-wider font-bold">Generated Brand Reply Draft</h5>
                                      <textarea
                                        rows={6}
                                        value={respondDraft}
                                        onChange={(e) => setRespondDraft(e.target.value)}
                                        className="w-full bg-editorial-dark border border-white/10 p-3 text-xs leading-relaxed text-zinc-200 font-sans rounded-none focus:outline-none focus:border-pink-500/50"
                                      />
                                    </div>

                                    <div className="flex gap-3">
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          try {
                                            await supabaseDb.addNote({
                                              note_id: 'reply-' + Date.now(),
                                              user_id: memberUser.uid,
                                              title: `💬 SwellRespond Tone [${respondTone}]`,
                                              content: `Source Review: ${responderComment}\n\nDraft Reply:\n${respondDraft}`,
                                              color: '#064e3b'
                                            });
                                            alert('Success! Response blueprint exported directly to your Workspace Keep Notes.');
                                          } catch (err: any) {
                                            handleFirestoreError(err, OperationType.WRITE, 'notes');
                                          }
                                        }}
                                        className="px-4 py-2 bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500 hover:text-black font-mono text-[8.5px] uppercase tracking-wider transition-all cursor-pointer font-black"
                                      >
                                        Save Reply Blueprint to Keep Notes
                                      </button>
                                      
                                      <button
                                        type="button"
                                        disabled={sendingDraft}
                                        onClick={() => {
                                          setSendingDraft(true);
                                          sendSlackMessage('lead_form', { 
                                            name: 'SwellRespond Review Pilot Output', 
                                            email: 'reply-sent@otdaisurfer.surf', 
                                            companyName: 'Otd Review Operations', 
                                            websiteScope: 'Sentiment Response Generator', 
                                            interestArea: respondTone, 
                                            message: `Review comment: ${responderComment}\n\nDraft Reply:\n${respondDraft}` 
                                          });
                                          setTimeout(() => {
                                            setSendingDraft(false);
                                            alert('Success! Webhook triggered to transmit draft to partner slack Channel.');
                                          }, 1200);
                                        }}
                                        className="px-4 py-2 bg-editorial-bg border border-white/15 text-white hover:border-white/30 font-mono text-[8.5px] uppercase tracking-wider transition-all cursor-pointer"
                                      >
                                        {sendingDraft ? 'Posting to Slack...' : 'Post to Slack'}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* 5. SURFDRAFT SEO ENGINE PLAYGROUND */}
                            {tool.id === 'tool-seo-generator' && (
                              <div className="space-y-4 font-sans animate-fade-in">
                                <div className="space-y-2">
                                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">Target SEO Keywords</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. low-tide automation, Stripe solutions, vector agents"
                                    value={seoKeywords}
                                    onChange={(e) => setSeoKeywords(e.target.value)}
                                    className="w-full bg-editorial-bg border border-white/10 px-4 py-3 text-xs text-white font-mono rounded-none focus:outline-none focus:border-pink-500/50"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">Niche Category</label>
                                  <select
                                    value={seoCategory}
                                    onChange={(e) => setSeoCategory(e.target.value)}
                                    className="w-full bg-editorial-bg border border-white/10 px-3.5 py-3 text-xs text-white font-mono rounded-none focus:outline-none focus:border-pink-500/50"
                                  >
                                    <option value="E-commerce">E-commerce & Retail Products</option>
                                    <option value="SaaS Venture">SaaS Venture</option>
                                    <option value="Enterprise Logistics">Enterprise Logistics & Planning</option>
                                  </select>
                                </div>

                                <div className="pt-2">
                                  <button
                                    type="button"
                                    disabled={savingSeoNote || !seoKeywords}
                                    onClick={() => {
                                      setSavingSeoNote(true);
                                      setTimeout(() => {
                                        setSeoOutline(`STRUCTURED BLOG POST BLUEPRINT [APPROVED FOR DOMAIN]\n\nPAGE_TITLE: Riding the High-Tide: Why ${seoKeywords.split(',')[0] || 'Tidal Systems'} Wins Operations Budgets\nCATEGORY: SEO Content Hub / ${seoCategory}\n\n1. Display Heading (H1)\n   - "Stop Fighting the High-Tides: Deploying ${seoKeywords.split(',')[0] || 'Automation'}"\n\n2. Key Editorial Paragraphs (H2)\n   - Section 2.1: Operational Friction Audit and Digital Security.\n   - Section 2.2: Mapping Webhooks like Stripe with OpenAI Node parameters (${seoKeywords.split(',')[1] || 'Stripe Nodes'}).\n   - Section 2.3: Integrating deep memory queries using RAG indexes.\n\n3. Structured Keyword Density Checklist\n   - Target keywords: "${seoKeywords}"\n   - Structured schema metadata: otd_coastal_schema_v1 (verified)`);
                                        setSavingSeoNote(false);
                                      }, 1500);
                                    }}
                                    className="px-6 py-3.5 bg-pink-500 text-black hover:bg-white font-mono font-black text-xs uppercase tracking-widest transition-colors rounded-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
                                  >
                                    {savingSeoNote ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Synthesizing Article Outline...
                                      </>
                                    ) : (
                                      <>
                                        <Notebook className="w-4 h-4 shrink-0" />
                                        Structure SEO Blueprint
                                      </>
                                    )}
                                  </button>
                                </div>

                                {seoOutline && (
                                  <div className="space-y-4 animate-fade-in">
                                    <div className="border border-white/10 bg-editorial-bg p-4 space-y-3">
                                      <h5 className="font-mono text-[10px] text-pink-400 uppercase tracking-wider font-bold">SEO Draft Outline Blueprint</h5>
                                      <textarea
                                        rows={10}
                                        value={seoOutline}
                                        onChange={(e) => setSeoOutline(e.target.value)}
                                        className="w-full bg-editorial-dark border border-white/10 p-3.5 text-xs text-zinc-300 leading-relaxed font-mono rounded-none focus:outline-none focus:border-pink-500/50"
                                      />
                                    </div>

                                    <div>
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          try {
                                            await supabaseDb.addNote({
                                              note_id: 'seo-' + Date.now(),
                                              user_id: memberUser.uid,
                                              title: `✍️ SurfDraft SEO: ${seoKeywords}`,
                                              content: seoOutline,
                                              color: '#1e3a8a'
                                            });
                                            alert('Success! SEO Draft Outline has been exported directly to Keep Notes.');
                                          } catch (err: any) {
                                            handleFirestoreError(err, OperationType.WRITE, 'notes');
                                          }
                                        }}
                                        className="px-4 py-2 bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500 hover:text-black font-mono text-[8.5px] uppercase tracking-wider transition-all cursor-pointer font-black"
                                      >
                                        Save Article Outline to Keep Notes
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* 6. BREAKERAUDIO SUMMARIZER PLAYGROUND */}
                            {tool.id === 'tool-auto-transcription' && (
                              <div className="space-y-4 font-sans animate-fade-in">
                                <div className="space-y-2">
                                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">Select Recorded Audio Snippet</label>
                                  <select
                                    value={audioSnippetName}
                                    onChange={(e) => {
                                      const snippet = e.target.value;
                                      setAudioSnippetName(snippet);
                                      if (snippet.includes('Stripe')) {
                                        setAudioTranscript(`Kai: "We got the new Stripe webhook running at cctobgbyxjfabksnokbe.supabase.co/functions/v1/stripe-webhook."\nSarah: "Awesome, does it verify signature whsec_Gd3UlfeFWpYvZxCjLUOwmdKd??"\nKai: "Yes, it verifies the signature and records webhook telemetry directly into our Supabase user subscription table."`);
                                      } else {
                                        setAudioTranscript(`Client: "We have heavy port congestion at WaveWear warehouses during high-tide storms."\nMarina: "We can deploy a custom TideAgent and query our vector index with ReefSense RAG to alert logistics directors of optimal vessel routing timetables."`);
                                      }
                                    }}
                                    className="w-full bg-editorial-bg border border-white/10 px-3.5 py-3 text-xs text-white font-mono rounded-none focus:outline-none focus:border-pink-500/50"
                                  >
                                    <option value="">Select Call Fragment...</option>
                                    <option value="Partner Sync on Stripe Webhook (4m)">Partner Sync on Stripe Webhook (4 mins duration)</option>
                                    <option value="OceanTide Logistics Discovery Call (10m)">OceanTide Logistics Discovery Call (10 mins duration)</option>
                                  </select>
                                </div>

                                <div className="space-y-2">
                                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">Raw Audio Transcript Segment</label>
                                  <textarea
                                    rows={4}
                                    value={audioTranscript || `[No audio snippet currently preloaded. Select a snippet or author one.]`}
                                    onChange={(e) => setAudioTranscript(e.target.value)}
                                    className="w-full bg-editorial-bg border border-white/10 p-3 text-xs leading-relaxed text-zinc-300 font-sans rounded-none focus:outline-none focus:border-pink-500/50"
                                  />
                                </div>

                                <div className="pt-2">
                                  <button
                                    type="button"
                                    disabled={parsingAudio || !audioTranscript}
                                    onClick={() => {
                                      setParsingAudio(true);
                                      setTimeout(() => {
                                        const stripeSummary = `MEETING RESOLUTIONS & CHECKLIST\n\nMeeting segment topic: Stripe Webhook Pipeline\nDuration simulated: 4 minutes\n\n1. Target Serverless endpoint configured at cctobgbyxjfabksnokbe.supabase.co\n2. Stripe secret webhook verification established: whsec_Gd3UlfeFWpYvZxCjLUOwmdKd\n3. Team alerted via DropWave dispatch triggers in client Slack channel.\n4. Database writes locked down inside auth.currentUser scopes in standard Firestore.`;
                                        const generalSummary = `MEETING RESOLUTIONS & CHECKLIST\n\nMeeting segment topic: Coastal Port Congestion\nDuration simulated: 10 minutes\n\n1. Team approved deployment of specialized autonomous staff: TideAgent.\n2. RAG retrieval queries targeting tidal metrics stabilized with daily CRON schedules.\n3. Vessel captains will receive instant routing SMS templates generated via LLMs.`;
                                        
                                        setAudioActions(audioSnippetName.includes('Stripe') ? stripeSummary : generalSummary);
                                        setParsingAudio(false);
                                      }, 1500);
                                    }}
                                    className="px-6 py-3.5 bg-pink-500 text-black hover:bg-white font-mono font-black text-xs uppercase tracking-widest transition-colors rounded-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
                                  >
                                    {parsingAudio ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Transcribing waves...
                                      </>
                                    ) : (
                                      <>
                                        <Play className="w-4 h-4" />
                                        Analyze Meeting Specifications
                                      </>
                                    )}
                                  </button>
                                </div>

                                {audioActions && (
                                  <div className="space-y-4 animate-fade-in">
                                    <div className="border border-white/10 bg-editorial-bg p-4 space-y-3">
                                      <h5 className="font-mono text-[10px] text-pink-400 uppercase tracking-wider font-bold">Action Checklists & Summaries</h5>
                                      <textarea
                                        rows={6}
                                        value={audioActions}
                                        onChange={(e) => setAudioActions(e.target.value)}
                                        className="w-full bg-editorial-dark border border-white/10 p-3 text-xs leading-relaxed text-zinc-300 font-mono rounded-none focus:outline-none focus:border-pink-500/50"
                                      />
                                    </div>

                                    <div>
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          try {
                                            await supabaseDb.addNote({
                                              note_id: 'audio-' + Date.now(),
                                              user_id: memberUser.uid,
                                              title: `🔊 BreakerAudio: ${audioSnippetName || 'Meeting Minutes'}`,
                                              content: audioActions,
                                              color: '#581c87'
                                            });
                                            alert('Success! Meeting specs has been synced as a Google Keep Workspace note.');
                                          } catch (err: any) {
                                            handleFirestoreError(err, OperationType.WRITE, 'notes');
                                          }
                                        }}
                                        className="px-4 py-2 bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500 hover:text-black font-mono text-[8.5px] uppercase tracking-wider transition-all cursor-pointer font-black"
                                      >
                                        Export Minutes to Keep Notes
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                          </div>
                        );
                      })()}

                    </div>

                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </main>

      {/* Flagship footer */}
      <footer className="border-t border-white/10 bg-editorial-dark py-8 text-center text-[9px] font-mono text-slate-500 uppercase tracking-widest">
        <div className="max-w-7xl mx-auto px-8 space-y-2">
          <p>&copy; 2026 OceanTideDrop AI Surfer Group (OTDAISurfer.surf). All rights reserved.</p>
          <div className="flex justify-center gap-4 text-slate-400">
            <span className="hover:text-editorial-accent transition-colors cursor-pointer">Security Ledger</span>
            <span>&bull;</span>
            <span className="hover:text-editorial-accent transition-colors cursor-pointer">Private Weights Policy</span>
            <span>&bull;</span>
            <span className="hover:text-editorial-accent transition-colors cursor-pointer">SLA Specifications</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
