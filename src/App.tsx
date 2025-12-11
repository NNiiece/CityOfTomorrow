import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Activity, 
  Wifi, 
  Zap, 
  Map, 
  Cpu, 
  AlertTriangle, 
  Radio, 
  Users, 
  Lock, 
  Eye, 
  Server, 
  Terminal, 
  Crosshair, 
  Globe,
  Moon,
  Droplet,
  CheckCircle,
  Wind,
  Menu
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';

// --- Types & Interfaces ---
interface LogEntry {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'CRIT' | 'SUCCESS';
  message: string;
  source: string;
}

interface SectorStatus {
  id: string;
  name: string;
  status: 'secure' | 'warning' | 'critical';
  activity: number;
  energy: number;
}

// --- Mock Data Generators ---
const generateData = (length: number) => {
  return Array.from({ length }, (_, i) => ({
    name: i.toString(),
    value: Math.floor(Math.random() * 40) + 30,
    value2: Math.floor(Math.random() * 30) + 10,
  }));
};

const SECTORS: SectorStatus[] = [
  { id: 'S1', name: 'Downtown Commercial', status: 'secure', activity: 85, energy: 90 },
  { id: 'S2', name: 'Gov. District (Absher)', status: 'secure', activity: 60, energy: 75 },
  { id: 'S3', name: 'Al-Olaya Residential', status: 'secure', activity: 40, energy: 45 },
  { id: 'S4', name: 'Industrial Zone East', status: 'warning', activity: 92, energy: 98 },
  { id: 'S5', name: 'KAFD Financial', status: 'secure', activity: 70, energy: 80 },
];

export default function CityOSDashboard() {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'overview' | 'nca' | 'security' | 'wc2034' | 'haram' | 'energy' | 'iot'>('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [networkLoad, setNetworkLoad] = useState(generateData(20));
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [sectors, setSectors] = useState<SectorStatus[]>(SECTORS);
  const [threatLevel, setThreatLevel] = useState<number>(0); // 0-100
  const logEndRef = useRef<HTMLDivElement>(null);

  // --- Effects ---

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update Charts
      setNetworkLoad(prev => {
        const newData = [...prev.slice(1), {
          name: '',
          value: Math.floor(Math.random() * 40) + (threatLevel > 50 ? 50 : 20),
          value2: Math.floor(Math.random() * 30) + 10
        }];
        return newData;
      });

      // 2. Random Logs based on context
      if (Math.random() > 0.7) {
        const actions = [
          { msg: "Optimizing traffic flow at King Fahd Rd", type: 'INFO', src: "TRANSPORT" },
          { msg: "IoT Sensor grid reading nominal", type: 'INFO', src: "IOT_GRID" },
          { msg: "Digital ID Verification (Absher) Sync", type: 'SUCCESS', src: "GOV_API" },
          { msg: "Energy diverted to residential sectors", type: 'INFO', src: "ENERGY" },
          { msg: "Drone Patrol Unit 42 reporting status", type: 'INFO', src: "DRONE_OPS" },
          { msg: "Crowd density check at Stadium Gate 3", type: 'INFO', src: "WC_2034" },
          { msg: "Mataf cooling systems operational", type: 'SUCCESS', src: "HARAM_OPS" },
        ];
        if (threatLevel > 30) {
          actions.push(
            { msg: "Firewall blocked unauthorized IP", type: 'WARN', src: "NCA_CYBER" },
            { msg: "Anomaly detected in Sector 4 sensors", type: 'WARN', src: "IOT_GRID" }
          );
        }
        if (threatLevel > 70) {
          actions.push(
            { msg: "CRITICAL: DDOS Attack mitigated", type: 'CRIT', src: "NCA_CYBER" },
            { msg: "Isolating infected subsystems", type: 'CRIT', src: "AI_CORE" },
            { msg: "Deploying rapid response units", type: 'CRIT', src: "PUB_SEC" }
          );
        }

        const action = actions[Math.floor(Math.random() * actions.length)];
        addLog(action.msg, action.type as any, action.src);
      }

      // 3. Decay Threat Level
      setThreatLevel(prev => Math.max(0, prev - 1));

      // 4. Update Sectors randomly
      setSectors(prev => prev.map(s => ({
        ...s,
        energy: Math.min(100, Math.max(0, s.energy + (Math.random() * 10 - 5))),
        status: threatLevel > 80 && Math.random() > 0.7 ? 'critical' : (threatLevel > 40 && Math.random() > 0.6 ? 'warning' : 'secure')
      })));

    }, 2000);

    return () => clearInterval(interval);
  }, [threatLevel]);

  // --- Helpers ---
  const addLog = (msg: string, level: 'INFO' | 'WARN' | 'CRIT' | 'SUCCESS', source: string) => {
    setLogs(prev => [...prev.slice(-20), {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      level,
      message: msg,
      source
    }]);
  };

  const triggerThreat = () => {
    setThreatLevel(100);
    addLog("MANUAL OVERRIDE: SIMULATING MASSIVE CYBER-PHYSICAL ATTACK", "CRIT", "ADMIN");
    addLog("Initiating Lockdown Protocols...", "WARN", "AI_CORE");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'warning': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400';
    }
  };

  // --- Components ---

  const StatCard = ({ title, value, subtext, icon: Icon, trend, variant = 'default' }: any) => {
    // Custom styling based on variant if needed, mostly we use the global theme
    return (
      <div className={`p-4 rounded-lg border bg-slate-800/50 backdrop-blur-md transition-all hover:bg-slate-800/80 ${threatLevel > 80 ? 'border-red-500/50 animate-pulse' : 'border-slate-700'}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest">{title}</h3>
          <Icon className={`w-4 h-4 ${threatLevel > 80 ? 'text-red-400' : 'text-cyan-400'}`} />
        </div>
        <div className="text-2xl font-bold font-mono text-white">{value}</div>
        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          {trend && <span className={trend > 0 ? 'text-emerald-400' : 'text-red-400'}>{trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%</span>}
          {subtext}
        </div>
      </div>
    );
  };

  const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <div className="mb-6 flex items-center gap-4">
       <div className="h-8 w-1 bg-cyan-500 rounded-full"></div>
       <div>
         <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
         <p className="text-xs text-slate-400 font-mono uppercase">{subtitle}</p>
       </div>
    </div>
  );

  const TerminalLog = ({ className = "h-full" }: { className?: string }) => (
    <div className={`flex flex-col font-mono text-xs bg-black/60 border border-slate-700 rounded-lg overflow-hidden ${className}`}>
      <div className="bg-slate-900 p-2 border-b border-slate-700 flex justify-between items-center">
        <span className="text-slate-400 flex items-center gap-2">
          <Terminal size={12} /> SYSTEM_LOGS :: /var/log/city_os
        </span>
        <span className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2">
            <span className="text-slate-500">[{log.timestamp}]</span>
            <span className={`font-bold w-16 ${
              log.level === 'INFO' ? 'text-blue-400' :
              log.level === 'WARN' ? 'text-amber-400' :
              log.level === 'CRIT' ? 'text-red-500' : 'text-emerald-400'
            }`}>
              {log.level}
            </span>
            <span className="text-slate-400 w-20">[{log.source}]</span>
            <span className="text-slate-200">{log.message}</span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );

  const MapView = () => (
    <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg relative overflow-hidden group min-h-[400px]">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <span className="bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] font-mono border border-slate-600">VIEW: INFRASTRUCTURE</span>
        <span className="bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] font-mono border border-slate-600 text-cyan-400">LIVE FEED</span>
      </div>

      {/* Simulated Map */}
      <div className="w-full h-full p-8 flex items-center justify-center relative">
          {/* Radar Circles */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="w-[500px] h-[500px] border border-cyan-500 rounded-full animate-[ping_3s_ease-in-out_infinite]"></div>
            <div className="w-[300px] h-[300px] border border-cyan-500 rounded-full absolute"></div>
            <div className="w-[700px] h-[700px] border border-slate-700 rounded-full absolute border-dashed"></div>
          </div>

          {/* Sectors */}
          <div className="grid grid-cols-2 gap-4 relative z-10 w-full max-w-2xl">
            {sectors.map((sector) => (
              <div key={sector.id} className={`p-4 border bg-slate-900/80 backdrop-blur hover:bg-slate-800 transition-all cursor-pointer ${getStatusColor(sector.status)}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm">{sector.name}</span>
                  <Activity size={16} />
                </div>
                <div className="flex gap-4 text-xs font-mono text-slate-400">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase">Activity</span>
                    <span className="text-white">{sector.activity}%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase">Energy</span>
                    <span className="text-white">{sector.energy}MW</span>
                  </div>
                  <div className="flex flex-col ml-auto text-right">
                    <span className="text-[10px] uppercase">Security</span>
                    <span className={`uppercase font-bold ${sector.status === 'secure' ? 'text-emerald-400' : 'text-red-400'}`}>{sector.status}</span>
                  </div>
                </div>
                {/* Progress bar simulation */}
                <div className="w-full h-1 bg-slate-700 mt-3 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${sector.status === 'critical' ? 'bg-red-500' : 'bg-cyan-500'}`} 
                    style={{ width: `${sector.activity}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );

  const CameraFeed = ({ label = "CAM_04: OLAYA_DISTRICT" }) => (
    <div className="h-48 bg-black border border-slate-700 rounded-lg relative overflow-hidden group">
      <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2613&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-luminosity animate-[pulse_10s_infinite]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      
      {/* HUD Overlay */}
      <div className="absolute inset-0 p-3 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="bg-red-500/20 text-red-500 px-2 py-1 text-[10px] font-bold border border-red-500/50 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> LIVE
          </div>
          <div className="text-right text-[10px] font-mono text-cyan-400">
            {label}<br/>
            ALT: 450ft | SPD: 45kts
          </div>
        </div>
        
        {/* Target Brackets */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-cyan-500/30 rounded-full flex items-center justify-center opacity-50 group-hover:scale-90 transition-transform">
          <div className="w-2 h-2 bg-cyan-400/50"></div>
        </div>

        <div className="font-mono text-[10px] text-slate-400">
          AI OBJECT DETECTION: <span className="text-white">VEHICLE_FLOW_NORMAL</span>
        </div>
      </div>
    </div>
  );

  // --- Content Renderers ---

  const renderContent = () => {
    switch (activeTab) {
      case 'nca': // Mapped from old 'cyber' + new 'nca'
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full animate-fadeIn">
            <div className="lg:col-span-2 flex flex-col gap-6">
               <SectionHeader title="National Cybersecurity Authority (NCA)" subtitle="Cyber Threat Map & Incident Response" />
               
               <div className="flex items-center justify-between p-4 bg-red-950/20 border border-red-500/30 rounded-lg">
                 <div className="flex items-center gap-4">
                   <div className="p-3 bg-red-500/20 rounded-full text-red-500 animate-pulse"><Shield size={24} /></div>
                   <div>
                     <h3 className="text-lg font-bold text-white">Active Cyber Threats</h3>
                     <p className="text-xs text-red-400">Firewall Integrity: 98.4% | Intrusions Blocked: 1,402</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="text-2xl font-mono font-bold text-red-500">{threatLevel > 50 ? 'CRITICAL' : 'MODERATE'}</div>
                   <div className="text-[10px] text-slate-400 uppercase">National Threat Level</div>
                 </div>
               </div>

               <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4 relative overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 relative z-10">Global Attack Vectors</h4>
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                     <Globe size={300} className="text-blue-500 animate-spin-slow" />
                  </div>
                  <div className="h-full w-full flex items-center justify-center text-slate-600 relative z-10">
                     <div className="text-center">
                        <div className="text-sm font-mono text-cyan-400 mb-2">SCANNING GLOBAL NODES...</div>
                        <div className="text-xs text-slate-500">Source: Multiple IPs</div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                           <div className="p-2 border border-slate-700 bg-black/50 rounded text-xs">Riyadh: SECURE</div>
                           <div className="p-2 border border-slate-700 bg-black/50 rounded text-xs">Jeddah: SECURE</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="flex flex-col gap-6">
              <TerminalLog className="flex-1" />
              <div className="h-1/3 bg-slate-900 border border-slate-700 rounded-lg p-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Encrypted Traffic</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={networkLoad}>
                     <Area type="step" dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      
      case 'security': // Public Security & Drones
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full animate-fadeIn">
             <div className="col-span-1 lg:col-span-2">
                 <SectionHeader title="General Directorate of Public Security" subtitle="Patrol Management & Emergency Dispatch" />
             </div>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <CameraFeed label="DRONE_01: AL_MALQA" />
                <CameraFeed label="DRONE_02: DIPLOMATIC_Q" />
              </div>
              <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-auto">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 sticky top-0 bg-slate-900">Active Units</h4>
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 border-b border-slate-800 hover:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="font-mono text-xs text-cyan-300">PATROL-0{i}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">SECTOR: NORTH</div>
                    <div className="text-[10px] text-emerald-400">ACTIVE</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-6">
               <MapView />
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                   <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Emergency Calls</h4>
                   <div className="text-2xl font-bold text-white">3 <span className="text-sm text-slate-500 font-normal">Active</span></div>
                   <div className="w-full bg-slate-700 h-1 mt-2 rounded-full"><div className="bg-amber-500 h-1 rounded-full w-1/3"></div></div>
                 </div>
                 <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                   <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Response Time</h4>
                   <div className="text-2xl font-bold text-white">45s <span className="text-sm text-slate-500 font-normal">Avg</span></div>
                   <div className="w-full bg-slate-700 h-1 mt-2 rounded-full"><div className="bg-emerald-500 h-1 rounded-full w-full"></div></div>
                 </div>
               </div>
            </div>
          </div>
        );

      case 'wc2034': // World Cup Module
        return (
          <div className="flex flex-col gap-6 h-full animate-fadeIn">
            <SectionHeader title="World Cup 2034 Hosting Authority" subtitle="Stadium Logistics & VIP Security Protocols" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard title="Stadium Capacity" value="85%" subtext="King Salman Stadium" icon={Users} trend={12} />
              <StatCard title="Transport Flow" value="SMOOTH" subtext="Metro Lines A, B, C" icon={Activity} />
              <StatCard title="Ticket Validation" value="125k/hr" subtext="Secure Entry Gates" icon={CheckCircle} />
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg relative overflow-hidden flex items-center justify-center p-8">
               {/* Decorative Background */}
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea904ac2294?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
               
               <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="border border-slate-600 bg-black/60 p-6 rounded-lg backdrop-blur">
                    <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2"><Map size={18}/> Venue Heatmap</h3>
                    <div className="h-48 border border-dashed border-slate-700 rounded flex items-center justify-center">
                       <span className="text-xs text-slate-500">Live Crowd Density Visualization</span>
                    </div>
                 </div>
                 <div className="border border-slate-600 bg-black/60 p-6 rounded-lg backdrop-blur">
                    <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2"><Shield size={18}/> VIP Protocols</h3>
                    <ul className="space-y-2 text-xs text-slate-300 font-mono">
                      <li className="flex justify-between"><span>ROYAL_BOX_SEC:</span> <span className="text-emerald-500">SECURE</span></li>
                      <li className="flex justify-between"><span>PERIMETER_SCAN:</span> <span className="text-emerald-500">ACTIVE</span></li>
                      <li className="flex justify-between"><span>DRONE_SHIELD:</span> <span className="text-emerald-500">ONLINE</span></li>
                    </ul>
                 </div>
               </div>
            </div>
          </div>
        );

      case 'haram': // Two Holy Mosques
        return (
          <div className="flex flex-col gap-6 h-full animate-fadeIn">
            <SectionHeader title="Two Holy Mosques Presidency" subtitle="Pilgrim Crowd Management & Environmental Quality" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard title="Mataf Density" value="MODERATE" subtext="Flow: 40k/hr" icon={Users} />
              <StatCard title="Air Quality" value="98 AQI" subtext="PM2.5: Excellent" icon={Wind} />
              <StatCard title="Gate 79 Flow" value="OPEN" subtext="Queue: < 2 min" icon={CheckCircle} />
              <StatCard title="Medical Units" value="READY" subtext="Response: 45s" icon={Activity} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
               <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 relative overflow-hidden">
                  <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2"><Moon size={16} className="text-emerald-500"/> Pilgrim Distribution</h3>
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-emerald-900/20 to-transparent"></div>
                  <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={generateData(10)}>
                       <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
               
               <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2"><Droplet size={16} className="text-blue-500"/> Zamzam Water & Cooling</h3>
                  <div className="space-y-4">
                     <div>
                       <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Distribution Pressure</span><span className="text-blue-400">98 PSI</span></div>
                       <div className="w-full bg-slate-800 h-2 rounded-full"><div className="bg-blue-500 h-2 rounded-full w-[98%]"></div></div>
                     </div>
                     <div>
                       <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Mist Fan Network</span><span className="text-cyan-400">Active</span></div>
                       <div className="w-full bg-slate-800 h-2 rounded-full"><div className="bg-cyan-500 h-2 rounded-full w-[100%]"></div></div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        );

      case 'iot':
        return (
          <div className="h-full flex flex-col gap-6 animate-fadeIn">
             <SectionHeader title="City-Wide IoT Grid" subtitle="4.5M Sensors • Real-time Telemetry" />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Air Quality', 'Traffic Density', 'Water Pressure', 'Waste Levels', 'Noise Pollution', 'Parking'].map((sensor, i) => (
                  <div key={i} className="p-4 bg-slate-900 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                       <h3 className="text-sm font-bold text-slate-300">{sensor}</h3>
                       <Wifi size={14} className="text-cyan-400 group-hover:animate-pulse" />
                    </div>
                    <div className="text-2xl font-mono font-bold text-white">{Math.floor(Math.random() * 30) + 70}<span className="text-sm text-slate-500 font-sans ml-1">Index</span></div>
                    <div className="w-full bg-slate-800 h-1 mt-4 rounded-full">
                       <div className="bg-cyan-500 h-full rounded-full" style={{width: `${Math.random() * 100}%`}}></div>
                    </div>
                  </div>
                ))}
             </div>
             <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Sensor Network Topology</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={networkLoad}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                     <XAxis dataKey="name" hide />
                     <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                     <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        );

      case 'energy':
        return (
          <div className="h-full flex flex-col gap-6 animate-fadeIn">
             <SectionHeader title="Ministry of Energy & Water" subtitle="National Grid Stability & Desalination" />
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Grid Load" value="42 GW" subtext="Peak: 14:00" icon={Zap} />
                <StatCard title="Water Reserves" value="98%" subtext="Strategic Storage" icon={Droplet} />
                <StatCard title="Solar Input" value="12 GW" subtext="Renewable" icon={Activity} />
                <StatCard title="SCADA Security" value="SECURE" subtext="0 Intrusions" icon={Lock} />
             </div>
             
             <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-6">Real-time Load Distribution</h4>
                <ResponsiveContainer width="100%" height="90%">
                  <AreaChart data={networkLoad}>
                    <defs>
                      <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" hide />
                    <YAxis stroke="#475569" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Area type="monotone" dataKey="value" stroke="#f59e0b" fillOpacity={1} fill="url(#colorEnergy)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        );

      case 'overview':
      default:
        return (
          <div className="animate-fadeIn">
            <SectionHeader title="Central City Command System" subtitle="Unified AI Operating System" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatCard 
                title="Threat Index" 
                value={`${threatLevel}/100`} 
                subtext={threatLevel > 50 ? "System Under Load" : "Nominal"} 
                icon={Shield} 
                trend={threatLevel > 50 ? -15 : 5}
              />
              <StatCard 
                title="Active Drones" 
                value="452" 
                subtext="Patrolling Key Sectors" 
                icon={Crosshair} 
              />
              <StatCard 
                title="Grid Load" 
                value="842 MW" 
                subtext="Efficiency: 98.2%" 
                icon={Zap} 
                trend={2.4}
              />
              <StatCard 
                title="Civic Sentiment" 
                value="89%" 
                subtext="Analysis: Positive" 
                icon={Users} 
                trend={0.8}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-340px)]">
              
              {/* LEFT COL: MAP & STATUS */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                <MapView />

                {/* Bottom Charts */}
                <div className="h-48 bg-slate-900 border border-slate-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                      <Zap size={16} className="text-amber-400" /> Real-time Energy & Network Load
                    </h3>
                    <div className="flex gap-2 text-[10px] font-mono">
                      <span className="text-cyan-400">● Network</span>
                      <span className="text-purple-400">● Energy</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={networkLoad}>
                      <defs>
                        <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }} 
                        itemStyle={{ color: '#e2e8f0' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#06b6d4" fillOpacity={1} fill="url(#colorNet)" />
                      <Area type="monotone" dataKey="value2" stroke="#a855f7" fillOpacity={1} fill="url(#colorEng)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* RIGHT COL: AI TERMINAL & DRONE FEED */}
              <div className="flex flex-col gap-6">
                
                <CameraFeed />

                {/* AI Terminal */}
                <div className="flex-1 min-h-[200px]">
                  <TerminalLog />
                </div>

                {/* Quick Actions / Directives */}
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">AI Directives (Vision 2030)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-slate-800 rounded border border-slate-700">
                      <div className="bg-blue-500/20 p-1.5 rounded text-blue-400"><Server size={14} /></div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">Data Sovereignty</div>
                        <div className="text-[10px] text-slate-500">Local hosting secured</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-slate-800 rounded border border-slate-700">
                      <div className="bg-emerald-500/20 p-1.5 rounded text-emerald-400"><Eye size={14} /></div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">Public Safety</div>
                        <div className="text-[10px] text-slate-500">Predictive policing active</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
      
      {/* --- HEADER --- */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Globe className={`w-8 h-8 ${threatLevel > 80 ? 'text-red-500 animate-spin' : 'text-cyan-400'}`} />
            <div className="absolute inset-0 bg-cyan-400/20 blur-lg rounded-full"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">
              City of Tomorrow <span className="text-cyan-400 text-sm font-mono align-top">OS v4.0</span>
            </h1>
            <div className="text-[10px] text-slate-400 tracking-[0.2em] uppercase">
              Integrated AI Security & Operations
            </div>
          </div>
        </div>

        {/* Vision 2030 / Goals ticker */}
        <div className="hidden md:flex flex-col items-center justify-center opacity-70">
           <div className="text-[10px] uppercase tracking-widest text-emerald-500 mb-1">Saudi Vision 2030 Aligned</div>
           <div className="flex gap-4 text-xs font-mono text-slate-400">
             <span>QUALITY_OF_LIFE: OPTIMAL</span>
             <span>DIGITAL_GOV: ONLINE</span>
             <span>NAT_SECURITY: {threatLevel > 50 ? 'ELEVATED' : 'SECURE'}</span>
           </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Riyadh System Time</div>
            <div className="text-lg font-mono font-bold text-white">
              {currentTime.toLocaleTimeString('en-US', { hour12: false })}
            </div>
          </div>
          <button 
            onClick={triggerThreat}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-500 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-2"
          >
            <AlertTriangle size={14} /> Simulate Threat
          </button>
        </div>
      </header>

      {/* --- MAIN LAYOUT --- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR */}
        <nav className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col p-4 gap-2 overflow-y-auto">
          <div className="text-xs font-mono text-slate-500 mb-2 pl-2">MODULES</div>
          {[
            { id: 'overview', icon: Activity, label: 'Master Command' },
            { id: 'wc2034', icon: Globe, label: 'World Cup 2034' },
            { id: 'energy', icon: Zap, label: 'Energy & Water' },
            { id: 'nca', icon: Lock, label: 'NCA Cyber Defense' },
            { id: 'haram', icon: Moon, label: 'Two Holy Mosques' },
            { id: 'security', icon: Shield, label: 'Public Security' },
            { id: 'iot', icon: Wifi, label: 'IoT & Sensors' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all text-left ${
                activeTab === item.id 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}

          <div className="mt-auto pt-6">
             <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
               <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3">System Health</h4>
               <div className="space-y-3">
                 <div>
                   <div className="flex justify-between text-[10px] mb-1">
                     <span className="text-slate-500">AI Compute</span>
                     <span className="text-blue-400">42%</span>
                   </div>
                   <div className="w-full bg-slate-800 rounded-full h-1">
                     <div className="bg-blue-500 h-1 rounded-full" style={{width: '42%'}}></div>
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between text-[10px] mb-1">
                     <span className="text-slate-500">Sensor Bandwidth</span>
                     <span className="text-emerald-400">89%</span>
                   </div>
                   <div className="w-full bg-slate-800 rounded-full h-1">
                     <div className="bg-emerald-500 h-1 rounded-full" style={{width: '89%'}}></div>
                   </div>
                 </div>
               </div>
            </div>
            
            <div className="mt-4 p-4 rounded border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <Lock size={14} />
                <span className="text-xs font-bold uppercase">Absher Integration</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[98%] animate-pulse"></div>
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-slate-400 font-mono">
                <span>Identity</span>
                <span>Verified</span>
              </div>
            </div>
          </div>
        </nav>

        {/* CONTENT AREA */}
        <main className="flex-1 p-6 overflow-y-auto bg-grid-pattern relative">
          {/* Subtle Grid Background Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}