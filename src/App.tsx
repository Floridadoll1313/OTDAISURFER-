import { useState } from 'react';
import { 
  BarChart3, 
  Activity, 
  Layers, 
  Laptop, 
  Construction, 
  Compass, 
  Sparkles, 
  FileText, 
  HelpCircle,
  TrendingUp,
  Cpu,
  Mail,
  Workflow
} from 'lucide-react';
import BrandControlRoom from './components/BrandControlRoom';
import OtdSurfSite from './components/OtdSurfSite';
import OtdServicesSite from './components/OtdServicesSite';

export default function App() {
  // Navigation: state represents active views
  // 'control'  -> Brand strategy dashboard 
  // 'primary'  -> OTDAISurfer.surf (Main corporate portal)
  // 'secondary' -> OceanTideDropAISurfer.services (Lander and Tool Select tool)
  const [activeModule, setActiveModule] = useState<'control' | 'primary' | 'secondary'>('control');
  
  // Simulated device frame settings
  const [deviceScale, setDeviceScale] = useState<'desktop' | 'mobile'>('desktop');

  // Interactive Theme Selector: cyan vs multicolor
  const [brandTheme, setBrandTheme] = useState<'cyan' | 'multicolor'>('multicolor');

  return (
    <div className="min-h-screen bg-editorial-bg font-sans text-slate-100 flex flex-col selection:bg-editorial-accent/30 selection:text-white" id="main-app-container">
      
      {/* Top Editorial Header Bar */}
      <header className="bg-editorial-bg border-b border-white/10 px-8 py-5 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <img 
              src={brandTheme === 'multicolor' ? "/src/assets/images/otd_ai_logo_multicolor_1780618812326.png" : "/src/assets/images/otd_ai_logo_1780441811431.png"} 
              alt="OTD AI Surfer Brand Logo" 
              className={`w-10 h-10 border bg-editorial-dark object-contain p-0.5 shrink-0 transition-all duration-300 ${brandTheme === 'multicolor' ? 'border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'border-editorial-accent'}`}
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className={`font-display font-black tracking-[0.25em] uppercase text-md sm:text-lg transition-all duration-300 ${brandTheme === 'multicolor' ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 font-extrabold' : 'text-white'}`}>
                  OTD AI Surfer
                </h1>
                <span className="text-[9px] bg-white/5 border border-white/10 text-editorial-accent font-mono py-0.5 px-2 font-bold tracking-widest shrink-0">
                  V1.2.0
                </span>
                {/* Interactive Logo / Brand color palette switcher */}
                <span className="flex bg-editorial-dark border border-white/10 p-0.5 text-[8px] font-mono tracking-widest uppercase items-center shrink-0">
                  <button
                    type="button"
                    onClick={() => setBrandTheme('cyan')}
                    className={`px-1.5 py-0.5 transition-all cursor-pointer ${brandTheme === 'cyan' ? 'bg-editorial-accent text-black font-black' : 'text-slate-500 hover:text-slate-350'}`}
                  >
                    Cyan
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrandTheme('multicolor')}
                    className={`px-1.5 py-0.5 transition-all cursor-pointer ${brandTheme === 'multicolor' ? 'bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-black' : 'text-slate-500 hover:text-slate-350'}`}
                  >
                    Chroma
                  </button>
                </span>
              </div>
              <p className="text-[10px] text-editorial-muted font-mono tracking-widest uppercase">Dual-Asset Digital Blueprint Portal</p>
            </div>
          </div>

          {/* Core Module Selector tabs - Razor-sharp Editorial look */}
          <div className="flex bg-editorial-dark border border-white/10 p-0 self-start md:self-center">
            
            <button 
              type="button"
              onClick={() => setActiveModule('control')}
              className={`flex items-center gap-2 px-5 py-3 text-[10px] font-mono tracking-widest uppercase transition-all cursor-pointer ${
                activeModule === 'control' 
                  ? 'bg-white/10 text-editorial-accent border-r border-white/10 font-bold' 
                  : 'text-slate-400 hover:text-white border-r border-white/10'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-editorial-accent shrink-0" />
              Strategy Hub
            </button>
            
            <button 
              type="button"
              onClick={() => setActiveModule('primary')}
              className={`flex items-center gap-2 px-5 py-3 text-[10px] font-mono tracking-widest uppercase transition-all cursor-pointer ${
                activeModule === 'primary' 
                  ? 'bg-white/10 text-editorial-accent border-r border-white/10 font-bold' 
                  : 'text-slate-400 hover:text-white border-r border-white/10'
              }`}
            >
              <Laptop className="w-3.5 h-3.5 text-editorial-accent shrink-0" />
              Corporate (.surf)
            </button>
            
            <button 
              type="button"
              onClick={() => setActiveModule('secondary')}
              className={`flex items-center gap-2 px-5 py-3 text-[10px] font-mono tracking-widest uppercase transition-all cursor-pointer ${
                activeModule === 'secondary' 
                  ? 'bg-white/10 text-editorial-accent font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-editorial-accent shrink-0" />
              Lead Hub (.services)
            </button>

          </div>

        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">

        {/* 1. CENTRAL STRATEGY HUB */}
        {activeModule === 'control' && (
          <div className="space-y-6">
            <BrandControlRoom onSwitchToWebsite={(webId) => setActiveModule(webId)} />
          </div>
        )}

        {/* 2. PRIMARY WEBSITE CANVAS FRAME (OTDAISurfer.surf) */}
        {activeModule === 'primary' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between bg-editorial-dark p-4 border border-white/10 rounded-none">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-editorial-accent font-bold tracking-widest uppercase block">FLAGSHIP PLATFORM DEPLOYED</span>
                <h3 className="text-xs font-mono tracking-wider uppercase text-white">Simulation Frame: OTDAISurfer.surf</h3>
                <p className="text-[11px] text-zinc-400 font-sans">
                  Corporate trust core, showcasing client engagement matrices and secure enterprise codebases.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setActiveModule('control')}
                className="text-[10px] font-mono tracking-widest uppercase text-editorial-accent hover:underline cursor-pointer"
              >
                &larr; Strategy Board
              </button>
            </div>

            <OtdSurfSite brandTheme={brandTheme} />
          </div>
        )}

        {/* 3. SECONDARY WEBSITES CAMPAIGNS LANDER FRAME (OceanTideDropAISurfer.services) */}
        {activeModule === 'secondary' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between bg-editorial-dark p-4 border border-white/10 rounded-none">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-editorial-accent font-bold tracking-widest uppercase block">LEAD FUNNEL HUB DEPLOYED</span>
                <h3 className="text-xs font-mono tracking-wider uppercase text-white">Simulation Frame: OceanTideDropAISurfer.services</h3>
                <p className="text-[11px] text-zinc-400 font-sans">
                  Conversion landing page containing the live interactive AI Surfboard tool selector and education blog.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setActiveModule('control')}
                className="text-[10px] font-mono tracking-widest uppercase text-editorial-accent hover:underline cursor-pointer"
              >
                &larr; Strategy Board
              </button>
            </div>

            <OtdServicesSite brandTheme={brandTheme} />
          </div>
        )}

      </main>

      {/* Global Architectural Footer Panel */}
      <footer className="bg-editorial-dark border-t border-white/10 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-bold text-slate-400 block tracking-[0.2em] uppercase font-mono text-[9px]">Ocean Tide Drop Digital Blueprint</span>
            <p className="text-[10px] font-mono tracking-wider">Dual DNS system connected securely via Cloudflare proxy routers.</p>
          </div>
          <div className="flex gap-4 font-mono text-[9px] tracking-widest uppercase">
            <span className="text-editorial-accent flex items-center gap-2 font-bold bg-white/5 border border-white/10 px-3 py-1">
              <Activity className="w-3.5 h-3.5 text-editorial-accent animate-pulse" />
              SYSTEMS ACTIVE
            </span>
            <span className="text-slate-450 self-center">|</span>
            <span className="text-slate-450 self-center">PREVIEW PRESETS SECURE</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
