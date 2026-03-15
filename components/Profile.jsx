
import React from 'react';
import { User, Shield, Mail, Calendar, MapPin } from 'lucide-react';

const Profile = ({ userName }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Operator Profile</h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">System Access Credentials</p>
      </header>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600"></div>
        <div className="px-8 pb-8 -mt-12">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="w-32 h-32 rounded-3xl bg-slate-50 dark:bg-slate-950 border-4 border-white dark:border-slate-900 flex items-center justify-center text-indigo-600 dark:text-indigo-500 shadow-xl">
              <User size={64} />
            </div>
            <div className="flex-1 mb-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{userName || 'Admin User'}</h3>
              <p className="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest">Senior Infrastructure Analyst</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{userName.toLowerCase()}@roadsense.ai</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Security Clearance</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Level 4 (Administrator)</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Member Since</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">February 2024</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Primary Station</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Central Monitoring Hub</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
