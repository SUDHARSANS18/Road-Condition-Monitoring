
import React, { useState } from 'react';
import { ShieldAlert, User, Lock, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => onLogin(email), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 font-sans transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-2xl space-y-8 border-t-indigo-500/30">
        <div className="text-center space-y-4">
          <div className="p-4 bg-indigo-600 inline-block rounded-3xl shadow-xl shadow-indigo-600/20">
            <ShieldAlert size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">RoadSense AI</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Intelligence Portal Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Operator ID</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={18} />
              <input 
                type="text" required placeholder="admin@roadsense.ai"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold transition-all"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={18} />
            <input 
              type="password" required placeholder="••••••••"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold transition-all"
            />
          </div>
          <button disabled={loading} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <>Initialize Node <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
