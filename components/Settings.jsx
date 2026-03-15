
import React, { useState } from 'react';
import { Moon, Sun, Bell, Shield, Globe, Cpu, Database } from 'lucide-react';

const Settings = ({ theme, setTheme }) => {
  const [notifications, setNotifications] = useState(true);
  const [autoScan, setAutoScan] = useState(true);

  const SettingItem = ({ icon: Icon, title, description, children }) => (
    <div className="flex items-center justify-between p-6 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
          <Icon size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{title}</h4>
          <p className="text-xs text-slate-500 font-medium">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );

  const Toggle = ({ enabled, setEnabled }) => (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-12 h-6 rounded-full transition-all relative ${enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'left-7' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Settings</h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Configure monitoring protocols and interface</p>
      </header>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] ml-2">Appearance</h3>
        <SettingItem 
          icon={theme === 'dark' ? Moon : Sun} 
          title="Interface Theme" 
          description="Switch between light and dark visual modes"
        >
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setTheme('light')}
              className={`p-2 rounded-md transition-all ${theme === 'light' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <Sun size={16} />
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={`p-2 rounded-md transition-all ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <Moon size={16} />
            </button>
          </div>
        </SettingItem>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] ml-2">Monitoring Protocols</h3>
        <div className="grid grid-cols-1 gap-4">
          <SettingItem 
            icon={Bell} 
            title="Real-time Alerts" 
            description="Receive push notifications for critical road hazards"
          >
            <Toggle enabled={notifications} setEnabled={setNotifications} />
          </SettingItem>

          <SettingItem 
            icon={Cpu} 
            title="Autonomous Scanning" 
            description="Enable background AI processing for continuous monitoring"
          >
            <Toggle enabled={autoScan} setEnabled={setAutoScan} />
          </SettingItem>

          <SettingItem 
            icon={Shield} 
            title="Confidence Threshold" 
            description="Minimum AI confidence required to trigger an alert"
          >
            <select className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-indigo-500">
              <option>85% (Strict)</option>
              <option>70% (Balanced)</option>
              <option>50% (Sensitive)</option>
            </select>
          </SettingItem>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] ml-2">System & Data</h3>
        <div className="grid grid-cols-1 gap-4">
          <SettingItem 
            icon={Globe} 
            title="Regional Context" 
            description="Adjust AI models for local road signs and weather patterns"
          >
            <select className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-indigo-500">
              <option>North America</option>
              <option>Europe</option>
              <option>Asia Pacific</option>
            </select>
          </SettingItem>

          <SettingItem 
            icon={Database} 
            title="Data Retention" 
            description="How long to store high-resolution scan data"
          >
            <select className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-indigo-500">
              <option>30 Days</option>
              <option>90 Days</option>
              <option>1 Year</option>
            </select>
          </SettingItem>
        </div>
      </div>
    </div>
  );
};

export default Settings;
