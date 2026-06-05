import { useState, useEffect } from 'react';
import { 
  Compass, 
  Layers, 
  ExternalLink, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle, 
  Sparkles, 
  Search, 
  MousePointerClick,
  MailCheck,
  Smartphone,
  Laptop,
  Slack,
  Send,
  Settings,
  Trash2,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { BRAND_ASSETS } from '../data';
import { sendSlackMessage, getSavedSimulations, saveSimulations } from '../slack';
import { SlackNotification } from '../types';

interface BrandControlRoomProps {
  onSwitchToWebsite: (webId: 'primary' | 'secondary') => void;
}

export default function BrandControlRoom({ onSwitchToWebsite }: BrandControlRoomProps) {
  const [selectedAsset, setSelectedAsset] = useState<'primary' | 'secondary'>('primary');
  const [showArchitectureHelp, setShowArchitectureHelp] = useState(false);

  // Slack state indicators (persisted to localStorage)
  const [webhookUrl, setWebhookUrl] = useState<string>(() => localStorage.getItem('otd_slack_webhook') || '');
  const [isEnabled, setIsEnabled] = useState<boolean>(() => localStorage.getItem('otd_slack_enabled') !== 'false');
  const [channelName, setChannelName] = useState<string>(() => localStorage.getItem('otd_slack_channel') || '#otd-leads');
  const [logs, setLogs] = useState<SlackNotification[]>(() => getSavedSimulations());
  
  const [testType, setTestType] = useState<'lead_form' | 'contact_form' | 'newsletter' | 'system'>('lead_form');
  const [isSending, setIsSending] = useState(false);
  const [notificationResult, setNotificationResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [slackTab, setSlackTab] = useState<'console' | 'blueprint'>('console');

  // Auto-sync settings to local storage when changed
  useEffect(() => {
    localStorage.setItem('otd_slack_webhook', webhookUrl);
  }, [webhookUrl]);

  useEffect(() => {
    localStorage.setItem('otd_slack_enabled', String(isEnabled));
  }, [isEnabled]);

  useEffect(() => {
    localStorage.setItem('otd_slack_channel', channelName);
  }, [channelName]);

  const handleSaveSettings = () => {
    setNotificationResult({
      type: 'success',
      text: 'Slack router configuration saved in active session.'
    });
    setTimeout(() => setNotificationResult(null), 3000);
  };

  const handleClearLogs = () => {
    saveSimulations([]);
    setLogs([]);
  };

  const handleSendTestNotification = async () => {
    setIsSending(true);
    setNotificationResult(null);

    // Formulate realistic dummy payload for test event
    let payload: Record<string, any> = {};
    if (testType === 'lead_form') {
      payload = {
        name: 'Samantha Beach',
        email: 'samantha.s@surfinfra.io',
        companyName: 'Surf Infra Ventures',
        websiteScope: 'both_connected',
        interestArea: 'full_setup',
        message: 'Looking to link up Slack webhooks to our telemetry dashboards.'
      };
    } else if (testType === 'contact_form') {
      payload = {
        name: 'Executive Vice President Cruz',
        organization: 'Ocean Shore Capital',
        serviceInterest: 'Deterministic RAG / Guardrails fine-tune',
        budget: '$100k - $250k',
        email: 'cruz@oceanshore.cap',
        proposalRequest: 'Requesting a secure pipeline deployment aligned with OTD guidelines.'
      };
    } else if (testType === 'newsletter') {
      payload = {
        email: 'tide_watcher_99@gmail.com',
        source: 'Footer Subscription Input'
      };
    } else {
      payload = {
        text: 'Telemetry router health-check ping dispatched from flagship portal.',
        domain: 'OTDAISurfer.surf',
        agent: 'OTD Slack Broadcaster'
      };
    }

    const res = await sendSlackMessage(testType, payload);
    setLogs(getSavedSimulations());
    setIsSending(false);

    setNotificationResult({
      type: res.success ? 'success' : 'error',
      text: res.message
    });
    setTimeout(() => setNotificationResult(null), 5000);
  };

  const activeAsset = BRAND_ASSETS.find(a => a.id === selectedAsset)!;

  return (
    <div className="space-y-8 animate-fade-in text-slate-100" id="brand-control-room">
      {/* Top Banner explaining the architecture */}
      <div className="bg-editorial-dark border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-editorial-accent/5 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>
        
        <div className="space-y-4 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 font-mono text-[9px] tracking-[0.2em] bg-editorial-accent/10 text-editorial-accent border border-editorial-accent/20 uppercase">
            <Layers className="w-3.5 h-3.5" />
            SYNCHRONIZED TWO-ASSET BRAND STRATEGY
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-[0.1em] uppercase">
            Surf the Wave of Operational Autonomy
          </h2>
          <p className="text-slate-350 text-xs leading-relaxed md:text-sm font-sans">
            Instead of presenting two competing domains, we established a smart, dual-funnel digital ecosystem. 
            One domain operates as your <strong className="text-white">Flagship Yacht</strong> (Enterprise Trust), while the other is your <strong className="text-white">Lead Jet-Ski</strong> (Agile Acquisition).
          </p>
        </div>

        <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto z-10 shrink-0">
          <button 
            type="button"
            onClick={() => onSwitchToWebsite('primary')}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 font-mono text-[10px] tracking-widest uppercase bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10 rounded-none cursor-pointer"
          >
            OTDAISurfer.surf
            <ExternalLink className="w-3.5 h-3.5 text-editorial-accent" />
          </button>
          
          <button 
            type="button"
            onClick={() => onSwitchToWebsite('secondary')}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 font-mono text-[10px] tracking-widest uppercase bg-editorial-accent text-black font-black transition-all border border-editorial-accent hover:bg-white hover:text-black rounded-none cursor-pointer"
          >
            OceanTideDrop.services
            <ExternalLink className="w-3.5 h-3.5 text-black" />
          </button>
        </div>
      </div>

      {/* Grid of Strategy Information */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Flow & Architecture visual */}
        <div className="lg:col-span-7 bg-editorial-dark border border-white/10 p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-display font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <Compass className="w-4 h-4 text-editorial-accent" />
                Dual-Asset Value Funnel Map
              </h3>
              <button 
                type="button"
                onClick={() => setShowArchitectureHelp(!showArchitectureHelp)}
                className="text-slate-400 hover:text-editorial-accent transition-colors cursor-pointer"
                title="Explain Funnel Strategy"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              Visualizing user transit from campaign endpoints to flagship enterprise agreements.
            </p>
          </div>

          {showArchitectureHelp && (
            <div className="p-4 bg-editorial-bg border border-white/10 text-xs text-slate-300 leading-relaxed animate-fade-in font-sans">
              <strong className="text-editorial-accent block mb-1 font-mono uppercase tracking-wider text-[10px]">Why separate these?</strong>
              Traditional enterprise corporate layouts often feel too heavy and risk-averse to serve as high-conversion landing destinations for tactical SEO or pay-per-click marketing. 
              By running <strong>OceanTideDropAISurfer.services</strong> as an agile lead funnel and tool playground, web engagement spikes, producing pre-qualified RFPs that feed directly into <strong>OTDAISurfer.surf</strong>.
            </div>
          )}

          {/* Flow Diagram Block */}
          <div className="bg-editorial-bg/60 p-5 border border-white/10 space-y-5 relative">
            
            {/* Stage 1 */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border border-white/20 bg-editorial-dark flex items-center justify-center shrink-0 text-[10px] font-mono font-bold text-slate-300">
                1
              </div>
              <div className="flex-1 bg-editorial-dark border border-white/10 p-3 flex items-center justify-between">
                <div>
                  <h4 className="text-[11px] font-mono tracking-wider text-white uppercase">Acquisition Traffic</h4>
                  <p className="text-[11px] text-slate-400 font-sans">SEO Search Keywords, Ad Campaigns, Blog Shares</p>
                </div>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-editorial-accent animate-pulse"></span>
                  <span className="w-1.5 h-1.5 bg-white/20"></span>
                </div>
              </div>
            </div>

            {/* Vertical Flow Dot Line */}
            <div className="absolute left-[31px] top-11 h-8 border-l border-dashed border-white/25 pointer-events-none"></div>

            {/* Stage 2 */}
            <div className="flex items-center gap-4 relative">
              <div className="w-8 h-8 border border-editorial-accent bg-editorial-bg flex items-center justify-center shrink-0 text-[10px] font-mono font-bold text-editorial-accent">
                2
              </div>
              <div className="flex-1 bg-editorial-dark border border-editorial-accent/20 p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 text-[8px] font-mono font-bold bg-editorial-accent/10 text-editorial-accent border border-editorial-accent/20 uppercase">Lead Site</span>
                    <h4 className="text-[11px] font-mono tracking-wider text-white uppercase">OceanTideDrop.services</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">Prospect utilizes <strong>Interactive Tool Finder</strong> & reads compliance guidelines</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => onSwitchToWebsite('secondary')}
                  className="p-1 px-3 bg-editorial-accent/10 hover:bg-editorial-accent/20 text-editorial-accent text-[9px] font-mono uppercase tracking-wider transition-colors border border-editorial-accent/30 cursor-pointer flex items-center gap-1.5"
                >
                  Inspect
                  <MousePointerClick className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Vertical Flow Dot Line */}
            <div className="absolute left-[31px] top-[95px] h-8 border-l border-dashed border-white/25 pointer-events-none"></div>

            {/* Stage 3 */}
            <div className="flex items-center gap-4 relative">
              <div className="w-8 h-8 border border-white/20 bg-editorial-dark flex items-center justify-center shrink-0 text-[10px] font-mono font-bold text-slate-300">
                3
              </div>
              <div className="flex-1 bg-editorial-dark border border-white/10 p-3 flex items-center justify-between">
                <div>
                  <h4 className="text-[11px] font-mono tracking-wider text-white uppercase">Frictionless Transition</h4>
                  <p className="text-[11px] text-slate-400 font-sans">Prospect submits operational goals for dynamic proposal calculations</p>
                </div>
                <div className="p-1 px-2.5 bg-white/5 border border-white/10 text-[9px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MailCheck className="w-3.5 h-3.5 text-editorial-accent" />
                  Lead Saved
                </div>
              </div>
            </div>

            {/* Vertical Flow Dot Line */}
            <div className="absolute left-[31px] top-[148px] h-8 border-l border-dashed border-white/25 pointer-events-none"></div>

            {/* Stage 4 */}
            <div className="flex items-center gap-4 relative">
              <div className="w-8 h-8 border border-editorial-accent bg-editorial-bg flex items-center justify-center shrink-0 text-[10px] font-mono font-bold text-editorial-accent">
                4
              </div>
              <div className="flex-1 bg-editorial-dark border border-editorial-accent/20 p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 text-[8px] font-mono font-bold bg-white/10 text-white border border-white/10 uppercase">Flagship Web</span>
                    <h4 className="text-[11px] font-mono tracking-wider text-white uppercase">OTDAISurfer.surf</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">User validates team case studies, structures enterprise contract RFPs</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => onSwitchToWebsite('primary')}
                  className="p-1 px-3 bg-white/5 hover:bg-white/10 text-white text-[9px] font-mono uppercase tracking-wider transition-colors border border-white/25 cursor-pointer flex items-center gap-1.5"
                >
                  Inspect
                  <MousePointerClick className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

          {/* Strategic Stat Ticker */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-4 bg-editorial-bg border border-white/10 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-display font-black text-white">100%</span>
              <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider">Synchronized</span>
            </div>
            <div className="p-4 bg-editorial-bg border border-white/10 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-display font-black text-editorial-accent">+4.2x</span>
              <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider">Acquisition</span>
            </div>
            <div className="p-4 bg-editorial-bg border border-white/10 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-display font-black text-white">0%</span>
              <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider font-light">Domain Conflict</span>
            </div>
          </div>

        </div>

        {/* Right Column: Comparative Specifications Sheet */}
        <div className="lg:col-span-5 bg-editorial-dark border border-white/10 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-display font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-editorial-accent" />
                Asset Property Focus Inspector
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Review core compliance, conversion metrics, target scopes, and active DNS configurations.
              </p>
            </div>

            {/* Asset Small Toggles */}
            <div className="bg-editorial-bg p-1 border border-white/10 flex items-center gap-1">
              <button 
                type="button"
                onClick={() => setSelectedAsset('primary')}
                className={`flex-1 text-center py-2.5 text-[9px] font-mono tracking-widest uppercase transition-all cursor-pointer ${
                  selectedAsset === 'primary' 
                    ? 'bg-white/10 text-editorial-accent font-bold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                OTDAISurfer.surf
              </button>
              <button 
                type="button"
                onClick={() => setSelectedAsset('secondary')}
                className={`flex-1 text-center py-2.5 text-[9px] font-mono tracking-widest uppercase transition-all cursor-pointer ${
                  selectedAsset === 'secondary' 
                    ? 'bg-white/10 text-editorial-accent font-bold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                OceanTideDrop.services
              </button>
            </div>

            {/* Selected asset specification card */}
            <div className="bg-editorial-bg border border-white/10 p-4 space-y-4 font-sans">
              
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase bg-white/5 text-editorial-accent px-2 py-0.5 border border-white/10 tracking-widest inline-block">
                  {activeAsset.role}
                </span>
                <h4 className="text-xs font-mono tracking-wider text-white uppercase pt-1">{activeAsset.title}</h4>
                <p className="text-[11px] text-zinc-350 leading-relaxed pt-1 font-sans">{activeAsset.description}</p>
              </div>

              <div className="border-t border-white/15 pt-3 space-y-2">
                <div>
                  <span className="text-[9px] font-mono text-editorial-muted block uppercase tracking-wider">Target Audience</span>
                  <span className="text-xs text-slate-200 font-sans">{activeAsset.targetAudience}</span>
                </div>

                <div>
                  <span className="text-[9px] font-mono text-editorial-muted block uppercase tracking-wider">Main Call-To-Action Goal</span>
                  <span className="text-xs text-editorial-accent font-mono font-bold uppercase tracking-wide">{activeAsset.conversionGoal}</span>
                </div>

                <div>
                  <span className="text-[9px] font-mono text-editorial-muted block uppercase tracking-wider">Color Identity Scheme</span>
                  <div className="flex items-center gap-2 pt-1 font-mono text-xs">
                    <span className="w-2.5 h-2.5 bg-editorial-accent"></span>
                    <span className="text-[10px] text-slate-300 tracking-wider uppercase">{activeAsset.colorScheme.primary}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/15 pt-3 space-y-2">
                <span className="text-[9px] font-mono text-editorial-muted block uppercase tracking-wider">Key Pages & Layout Maps:</span>
                <div className="grid grid-cols-2 gap-2">
                  {activeAsset.keyPages.map((page, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-editorial-dark border border-white/5 px-2 py-2 text-[9px] text-slate-300 font-mono tracking-wider uppercase">
                      <Sparkles className="w-3 h-3 text-editorial-accent shrink-0" />
                      <span className="truncate">{page}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2 text-[11px]">
            <h4 className="font-mono text-slate-400 uppercase text-[9px] tracking-wider">Infrastructure Alignment Validation</h4>
            
            <div className="flex items-center justify-between p-3 bg-editorial-bg border border-white/10">
              <span className="text-slate-300 font-mono text-[10px]">OTDAISurfer.surf</span>
              <span className="flex items-center gap-1 text-editorial-accent font-mono text-[9px] font-bold tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                DNS SECURED
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-editorial-bg border border-white/10">
              <span className="text-slate-300 font-mono text-[10px]">OceanTideDrop.services</span>
              <span className="flex items-center gap-1 text-editorial-accent font-mono text-[9px] font-bold tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                DNS SECURED
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Slack Webhook Telemetry Integration Module */}
      <div id="slack-router-system-module" className="bg-editorial-dark border border-white/10 p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 bg-[#4A154B] text-white px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest uppercase border border-white/10">
              <Slack className="w-3.5 h-3.5 text-white" />
              SLACK BROADCAST INSTANT TELEMETRY
            </span>
            <h3 className="text-lg md:text-xl font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
              Enterprise Slack Notification Router
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Connect leads, RFPs, and operational system alerts directly into your Slack workspace channels.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsEnabled(!isEnabled)}
              className={`py-1.5 px-3 border font-mono text-[9px] tracking-widest uppercase transition-all cursor-pointer font-black ${
                isEnabled
                  ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
              }`}
            >
              Broadcast State: {isEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>

        {/* Module Sub-tabs to solve confusion and explain "the why" */}
        <div className="flex border-b border-white/10 gap-2">
          <button
            type="button"
            onClick={() => setSlackTab('console')}
            className={`py-3 px-4 font-mono text-[10px] tracking-widest uppercase transition-all cursor-pointer font-bold border-b-2 -mb-[2px] ${
              slackTab === 'console'
                ? 'border-editorial-accent text-white bg-white/5'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            🕹️ Console Workspace
          </button>
          <button
            type="button"
            onClick={() => setSlackTab('blueprint')}
            className={`py-3 px-4 font-mono text-[10px] tracking-widest uppercase transition-all cursor-pointer font-bold border-b-2 -mb-[2px] ${
              slackTab === 'blueprint'
                ? 'border-editorial-accent text-white bg-white/5'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            📖 Why & Step-By-Step Setup
          </button>
        </div>

        {/* ACTIVE TAB: CONSOLE */}
        {slackTab === 'console' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* SLACK CONFIGURATION FORM (Left Column) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-editorial-bg border border-white/5 p-5 space-y-4">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-editorial-accent" />
                  Active Router Config
                </h4>

                <div className="space-y-4 text-xs font-sans">
                  {/* Webhook URL */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-slate-400 block font-bold uppercase tracking-widest">Slack Webhook URL</span>
                    <input
                      type="password"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://hooks.slack.com/services/T.../B.../..."
                      className="w-full bg-editorial-dark border border-white/10 px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-editorial-accent transition-colors placeholder:text-slate-655 font-mono"
                    />
                    <p className="text-[10px] text-zinc-400 leading-normal font-sans">
                      Fires actual JSON Webhook payloads. Leave blank to log simulated events in the local stream.
                    </p>
                  </div>

                  {/* Target Channel */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-slate-400 block font-bold uppercase tracking-widest">Workspace Channel</span>
                    <input
                      type="text"
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      placeholder="e.g. #otd-leads"
                      className="w-full bg-editorial-dark border border-white/10 px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-editorial-accent transition-colors placeholder:text-slate-650 font-mono"
                    />
                  </div>

                  <div className="pt-2 border-t border-white/10 flex justify-between">
                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      className="px-4 py-2 border border-white/10 hover:border-white/20 bg-white/5 active:bg-white/10 text-[9px] font-mono tracking-widest uppercase transition-all duration-150 cursor-pointer text-white font-bold"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setSlackTab('blueprint')}
                      className="text-[9px] font-mono tracking-wider uppercase text-editorial-accent hover:underline cursor-pointer"
                    >
                      Show Setup Guide &rarr;
                    </button>
                  </div>
                </div>
              </div>

              {/* QUICK TELEMETRY SIMULATOR DISPATCHER */}
              <div className="bg-editorial-bg border border-white/5 p-5 space-y-4">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Send className="w-4 h-4 text-editorial-accent" />
                  Trigger Sandbox Alert
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Dispatch an immediate mock broadcast event to verify active Slack workspace configurations and visual formatting layout.
                </p>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {(['lead_form', 'contact_form', 'newsletter', 'system'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTestType(type)}
                      className={`py-2 px-3 border transition-colors cursor-pointer text-center font-mono uppercase tracking-wider text-[9px] ${
                        testType === type
                          ? 'bg-editorial-accent/20 text-editorial-accent border-editorial-accent/50 font-bold'
                          : 'bg-editorial-dark text-slate-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isSending}
                    onClick={handleSendTestNotification}
                    className="w-full py-3 bg-editorial-accent hover:bg-white text-black font-mono font-black text-[10px] tracking-widest uppercase transition-colors rounded-none cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-45"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Dispatching Header JSON...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Send Telemetry Hook
                      </>
                    )}
                  </button>
                </div>

                {notificationResult && (
                  <div className={`p-3 text-[11px] font-mono uppercase border animate-fade-in ${
                    notificationResult.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/35 text-rose-400'
                  }`}>
                    {notificationResult.text}
                  </div>
                )}
              </div>
            </div>

            {/* REALTIME SLACK CHAT CLIENT PREVIEW (Right Column) */}
            <div className="lg:col-span-7 bg-editorial-bg border border-white/10 p-4 md:p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4 flex-1 flex flex-col">
                
                {/* Slate Header styled exactly like general Slack sidebar/workspace */}
                <div className="bg-[#4A154B] p-3 text-white flex items-center justify-between text-xs font-sans tracking-wide">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    <strong className="font-mono text-[11px] uppercase tracking-wider font-bold">Slack Client Grid (otd-workspace)</strong>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-85 font-mono text-[10px]">
                    <span>Channel:</span>
                    <span className="bg-black/15 font-bold px-1.5 py-0.5 font-mono">{channelName}</span>
                  </div>
                </div>

                {/* Chat Feed */}
                <div className="flex-1 min-h-[290px] max-h-[380px] overflow-y-auto bg-black/25 border border-white/5 p-4 space-y-4 font-sans text-xs">
                  {logs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2 py-10 uppercase tracking-widest font-mono text-[9px]">
                      <Slack className="w-10 h-10 text-slate-700 shrink-0 opacity-40 animate-pulse" />
                      <span>No broadcasts captured. Submit a lead or run a test.</span>
                    </div>
                  ) : (
                    logs.map((log) => {
                      const colorLabel = log.type === 'lead_form' ? '#EC4899' : log.type === 'contact_form' ? '#00F0FF' : log.type === 'newsletter' ? '#A855F7' : '#EAB308';
                      const titleText = log.type === 'lead_form' ? 'Tactical Lead Submission Report' : log.type === 'contact_form' ? 'Enterprise Solution RFP' : log.type === 'newsletter' ? 'Newsletter Subscription Registered' : 'System Operations Alert';

                      return (
                        <div key={log.id} className="border-l-4 pl-3.5 space-y-2 animate-fade-in relative py-1" style={{ borderColor: colorLabel }}>
                          {/* Timestamp tag */}
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[8px] uppercase bg-white/5 text-slate-400 px-1.5 py-0.5 border border-white/10 font-bold">
                              {log.type.replace('_', ' ')}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">
                              {new Date(log.timestamp).toLocaleTimeString() || log.timestamp}
                            </span>
                            {/* Success Indicator */}
                            <span className={`text-[8.5px] font-mono font-bold tracking-widest uppercase px-1.5 rounded-none border ${
                              log.status === 'success' 
                                ? 'text-emerald-450 border-emerald-555/20 bg-emerald-500/5' 
                                : log.status === 'error'
                                ? 'text-rose-455 border-rose-500/20 bg-rose-500/5'
                                : 'text-amber-455 border-amber-500/20 bg-amber-500/5'
                            }`}>
                              {log.status === 'success' ? 'DISPATCHED' : log.status === 'error' ? 'FAILED' : 'SANDBOX MODE'}
                            </span>
                          </div>

                          {/* Title text */}
                          <h5 className="font-bold text-white text-xs flex items-center gap-1.5 font-sans">
                            {titleText}
                          </h5>

                          {/* Payload details */}
                          <div className="grid grid-cols-2 gap-2 bg-black/30 p-2.5 border border-white/5 font-sans text-[11px] text-zinc-300">
                            {Object.entries(log.payload).map(([k, v]) => (
                              <div key={k} className={`${k === 'message' || k === 'proposalRequest' || k === 'serviceInterest' || k === 'text' ? 'col-span-2' : ''}`}>
                                <span className="font-mono text-[8px] block text-slate-500 uppercase tracking-wide">{k.replace(/([A-Z])/g, ' $1')}</span>
                                <span className="text-white font-medium text-[11px] leading-relaxed break-words">{String(v)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Chat action footer buttons */}
                <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-white/5 text-slate-400">
                  <span className="uppercase tracking-wider">Telemetry Stream Logs ({logs.length})</span>
                  <button
                    type="button"
                    onClick={handleClearLogs}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-rose-450 hover:text-white transition-colors cursor-pointer border border-white/5 hover:border-rose-500/30 uppercase tracking-widest text-[9px] font-bold font-mono"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear Stream
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ACTIVE TAB: INTEGRATION BLUEPRINT */}
        {slackTab === 'blueprint' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-editorial-bg border border-white/10 p-6 md:p-8 space-y-6">
              
              {/* SECTION 1: THE BUSINESS REASONING ("THE WHY") */}
              <div className="space-y-3">
                <span className="text-[9px] font-mono tracking-widest text-editorial-accent uppercase bg-editorial-accent/10 px-2 py-0.5 border border-editorial-accent/20 font-black">
                  Strategic Framework
                </span>
                <h4 className="text-md sm:text-lg font-display font-black text-white uppercase tracking-wider">
                  The Corporate Case for Slack Telemetry
                </h4>
                <p className="text-xs md:text-sm text-slate-350 leading-relaxed font-sans">
                  In modern digital architecture, database dashboards are a bottleneck. Forcing sales executives or engineers to regularly refresh databases to catch leads results in massive delays. By routing events directly into context-isolated Slack channels:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="border border-white/5 bg-black/20 p-4 space-y-2">
                    <span className="text-xl">⚡</span>
                    <strong className="text-xs font-mono uppercase tracking-wider text-white block">Sub-5-Min Response</strong>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Sales stats prove responding to leads within 5 minutes yields a <span className="text-editorial-accent font-bold">391% lift</span> in conversions compared to standard hourly or daily batch reports.
                    </p>
                  </div>

                  <div className="border border-white/5 bg-black/20 p-4 space-y-2">
                    <span className="text-xl">🛡️</span>
                    <strong className="text-xs font-mono uppercase tracking-wider text-white block">Zero Database Exposure</strong>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Your team views inbound metrics in isolated workspace channels. Operations staff do not need direct database access keys, drastically shrinking the threat surface.
                    </p>
                  </div>

                  <div className="border border-white/5 bg-black/20 p-4 space-y-2">
                    <span className="text-xl">📊</span>
                    <strong className="text-xs font-mono uppercase tracking-wider text-white block">Unified Telemetry Stream</strong>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Leads from <span className="text-pink-400 font-bold">.services</span>, RFPs from <span className="text-emerald-400 font-bold">.surf</span>, and core domain DNS locks live in one chronological chat feed.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: HOW IT WORKS (ASYNCHRONOUS PROTOCOL) */}
              <div className="space-y-3 border-t border-white/10 pt-6">
                <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 font-black">
                  Technical Architecture
                </span>
                <h4 className="text-md sm:text-lg font-display font-black text-white uppercase tracking-wider">
                  Asymmetric Client Routing Engine
                </h4>
                <p className="text-xs text-slate-350 leading-relaxed font-sans">
                  The client-side telemetry script is built to execute with high tolerance. If a Slack Webhook is saved in the portal config, the form dispatch routine issues an asynchronous HTTP POST payload directly to Slack. If no Webhook target is defined, the system behaves in <span className="text-amber-400 font-mono">Sandbox Simulation Mode</span>—perfect for presentations to clients before real API tokens are purchased.
                </p>
              </div>

              {/* SECTION 3: STEP-BY-STEP DEPLOYMENT PLAYBOOK */}
              <div className="space-y-4 border-t border-white/10 pt-6">
                <span className="text-[9px] font-mono tracking-widest text-purple-400 uppercase bg-purple-500/10 px-2 py-0.5 border border-purple-500/20 font-black">
                  Step-by-Step Walkthrough
                </span>
                <h4 className="text-md sm:text-lg font-display font-black text-white uppercase tracking-wider">
                  Deployment Protocol: Creating the live Slack connection
                </h4>

                <div className="space-y-3 font-sans text-xs">
                  {/* Step 1 */}
                  <div className="flex gap-4 items-start bg-black/10 border border-white/5 p-4">
                    <div className="w-6 h-6 rounded-none bg-[#4A154B] text-white flex items-center justify-center font-mono font-black text-[10px] shrink-0 border border-white/10">1</div>
                    <div className="space-y-1">
                      <strong className="text-white uppercase block tracking-wider font-mono text-[11px]">Deploy Slack Endpoint Target</strong>
                      <p className="text-slate-400 leading-normal">
                        Navigate to the Slack Developer portal at <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="text-editorial-accent underline font-mono">api.slack.com/apps</a> and authorize your business account. Click on the prominent <span className="text-white font-bold bg-white/5 px-1.5 py-0.5 border border-white/10 font-mono text-[10px]">Create New App</span> button.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4 items-start bg-black/10 border border-white/5 p-4">
                    <div className="w-6 h-6 rounded-none bg-[#4A154B] text-white flex items-center justify-center font-mono font-black text-[10px] shrink-0 border border-white/10">2</div>
                    <div className="space-y-1">
                      <strong className="text-white uppercase block tracking-wider font-mono text-[11px]">Select App Configuration Type</strong>
                      <p className="text-slate-400 leading-normal">
                        Choose the <span className="text-white font-bold">"From scratch"</span> config blueprint. Input a name (e.g., <code className="text-editorial-accent font-mono">OTD Telemetry Bot</code>) and select your target development Slack Workspace.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4 items-start bg-black/10 border border-white/5 p-4">
                    <div className="w-6 h-6 rounded-none bg-[#4A154B] text-white flex items-center justify-center font-mono font-black text-[10px] shrink-0 border border-white/10">3</div>
                    <div className="space-y-1">
                      <strong className="text-white uppercase block tracking-wider font-mono text-[11px]">Activate Incoming Webhooks Features</strong>
                      <p className="text-slate-400 leading-normal">
                        In the sidebar navigation, look under <span className="text-white font-bold">Features &bull; Incoming Webhooks</span>. Toggle the state switch to <span className="text-emerald-400 font-bold font-mono">"On"</span>. This unlocks direct URL programmatic ingestion.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-4 items-start bg-black/10 border border-white/5 p-4">
                    <div className="w-6 h-6 rounded-none bg-[#4A154B] text-white flex items-center justify-center font-mono font-black text-[10px] shrink-0 border border-white/10">4</div>
                    <div className="space-y-1">
                      <strong className="text-white uppercase block tracking-wider font-mono text-[11px]">Authorize Channel Target</strong>
                      <p className="text-slate-400 leading-normal">
                        Scroll down to the bottom of the Webhook screen and click <span className="text-white font-bold bg-[#4A154B]/30 px-2 py-0.5 border border-white/10 font-mono text-[10px]">Add New Webhook to Workspace</span>. Select your desired Slack channel (like <code className="text-[#00F0FF] font-mono">#otd-leads</code>) and hit Allow.
                      </p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex gap-4 items-start bg-black/10 border border-white/5 p-4">
                    <div className="w-6 h-6 rounded-none bg-[#4A154B] text-white flex items-center justify-center font-mono font-black text-[10px] shrink-0 border border-white/10">5</div>
                    <div className="space-y-1">
                      <strong className="text-white uppercase block tracking-wider font-mono text-[11px]">Wired Ingress to OTD Control Portal</strong>
                      <p className="text-slate-400 leading-normal">
                        Copy the newly generated Webhook URL string (begins with <code className="text-zinc-300 font-mono bg-editorial-bg px-1 border border-white/10">https://hooks.slack.com/services/...</code>). Head back to the <span className="text-editorial-accent font-bold cursor-pointer underline" onClick={() => setSlackTab('console')}>Console Workspace Tab</span> above and paste it inside the Slack Webhook URL password box. Click Save.
                      </p>
                    </div>
                  </div>

                  {/* Step 6 */}
                  <div className="flex gap-4 items-start bg-black/10 border border-white/5 p-4">
                    <div className="w-6 h-6 rounded-none bg-[#4A154B] text-white flex items-center justify-center font-mono font-black text-[10px] shrink-0 border border-white/10">6</div>
                    <div className="space-y-1">
                      <strong className="text-white uppercase block tracking-wider font-mono text-[11px]">Run Real-time Validation Pings</strong>
                      <p className="text-slate-400 leading-normal">
                        Dispatched messages immediately arrive in Slack with high-contrast colored left border highlights (Pink for .services metrics, Indigo/Teal for .surf corporate RFPs).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggle Back Button */}
              <div className="pt-4 border-t border-white/10 text-center">
                <button
                  type="button"
                  onClick={() => setSlackTab('console')}
                  className="px-6 py-3 bg-editorial-accent hover:bg-white text-black font-mono font-black text-[10px] tracking-widest uppercase transition-colors rounded-none cursor-pointer"
                >
                  &larr; Switch Back to Live Console Workspace
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Domain mapping & SEO guide section */}
      <div className="p-6 bg-editorial-dark border border-white/10 space-y-4">
        <h3 className="text-sm font-display font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-editorial-accent" />
          Content Strategy: Surf the Search Rankings Seamlessly
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2 bg-editorial-bg border border-white/10 p-5">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-editorial-accent"></span>
              The Lead funnels (.services)
            </h4>
            <p className="text-slate-350 text-xs leading-relaxed font-sans">
              Acts as a tactical marketing honey-pot. We publish quick informational posts, run dynamic tool builders, and capture high-interest buyer intents. This protects the primary corporate domain from heavy, messy visual experiments or experimental ad landings.
            </p>
          </div>

          <div className="space-y-2 bg-editorial-bg border border-white/10 p-5">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-editorial-accent"></span>
              The Flagship portal (.surf)
            </h4>
            <p className="text-slate-350 text-xs leading-relaxed font-sans">
              Built like a digital fortress. Visitors coming here get immediate confirmation of professional scale, legal stability, multi-layered data compliance, and deep enterprise knowledge. There is no conversion clutter—only elegant project portfolio timelines and clear contract avenues.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
