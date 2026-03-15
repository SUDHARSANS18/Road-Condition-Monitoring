
import React from 'react';
import { Activity, History as HistoryIcon, Settings as SettingsIcon, ShieldAlert, LogOut, User, LayoutDashboard } from 'lucide-react';

const Layout = ({ children, activeView, setActiveView, onLogout, userName, theme }) => {
  const navItems = [
    { id: 'MONITOR', label: 'Live Monitor', icon: Activity },
    { id: 'DASHBOARD', label: 'Analytics', icon: LayoutDashboard },
    { id: 'HISTORY', label: 'History', icon: HistoryIcon },
    { id: 'SETTINGS', label: 'Settings', icon: SettingsIcon },
    { id: 'PROFILE', label: 'Profile', icon: User },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-200 transition-colors duration-300">
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <ShieldAlert size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            RoadSense
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 ${
                activeView === item.id 
                  ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-600/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} className={item.id === 'PROFILE' ? 'text-indigo-600 dark:text-indigo-400' : ''} />
              <span className={`font-medium text-sm ${activeView === item.id && item.id === 'PROFILE' ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/5 hover:scale-105 active:scale-95 rounded-xl transition-all">
            <LogOut size={20} />
            <span className="font-bold text-xs uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0a0f1c]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
