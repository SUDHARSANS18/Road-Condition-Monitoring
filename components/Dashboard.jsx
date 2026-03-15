
import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { 
  ShieldAlert, 
  BarChart3, 
  Zap,
  AlertCircle
} from 'lucide-react';

const Dashboard = ({ detections }) => {
  const ALLOWED_TYPES = ['ACCIDENT HAZARD', 'ROADWORK', 'FLOODING RISK', 'TRAFFIC JAM', 'CONSTRUCTION', 'CLEAR'];
  
  const chartData = Object.entries(
    detections.reduce((acc, curr) => {
      const normalizedType = (curr.defectType || 'UNKNOWN')
        .toUpperCase()
        .replace(/_/g, ' ')
        .trim();
      
      if (ALLOWED_TYPES.includes(normalizedType)) {
        acc[normalizedType] = (acc[normalizedType] || 0) + 1;
      }
      return acc;
    }, {})
  ).map(([name, value]) => ({ 
    name, 
    value 
  }));

  const criticalCount = detections.filter(d => d.severity === 'CRITICAL').length;
  const avgSafety = detections.length > 0 
    ? Math.round(detections.reduce((a, b) => a + (b.safetyScore || 0), 0) / detections.length)
    : 0;

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm flex items-center gap-6">
      <div className={`p-4 rounded-2xl ${colorClass} bg-opacity-10`}>
        <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
      </div>
      <div>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-1">{title}</p>
        <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h4>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <header>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Analytics Overview</h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Key Infrastructure Metrics</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          title="Avg Safety Score" 
          value={`${avgSafety}%`} 
          icon={ShieldAlert}
          colorClass="bg-indigo-600"
        />
        <StatCard 
          title="Critical Alerts" 
          value={criticalCount} 
          icon={AlertCircle}
          colorClass="bg-red-600"
        />
        <StatCard 
          title="Total Reports" 
          value={detections.length} 
          icon={Zap}
          colorClass="bg-amber-600"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-xl">
        <h3 className="text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest mb-12 flex items-center gap-2">
          <BarChart3 size={16} className="text-indigo-600" /> Incident Distribution
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={11} 
                axisLine={false} 
                tickLine={false} 
                dy={15}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  backdropFilter: 'blur(8px)',
                  border: 'none', 
                  borderRadius: '16px',
                  padding: '16px'
                }} 
                itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                labelStyle={{ display: 'none' }}
              />
              <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={40}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? '#4f46e5' : '#8b5cf6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
