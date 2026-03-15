
import React, { useState } from 'react';
import { Calendar, MapPin, ExternalLink, Download, AlertTriangle, Navigation, Clock, Gauge, ArrowLeft, Info, Wrench, Trash2 } from 'lucide-react';

const History = ({ detections, onDeleteScan }) => {
  const [selectedScanId, setSelectedScanId] = useState(null);

  // Group detections by scanId
  const groupedScans = detections.reduce((acc, d) => {
    const id = d.scanId || 'legacy';
    if (!acc[id]) {
      acc[id] = {
        scanId: id,
        timestamp: d.timestamp,
        locationName: d.locationName,
        destinationName: d.destinationName,
        scanMode: d.scanMode,
        incidents: [],
        avgSafety: 0
      };
    }
    acc[id].incidents.push(d);
    return acc;
  }, {});

  // Convert to array and sort by timestamp
  const scansList = Object.values(groupedScans).sort((a, b) => b.timestamp - a.timestamp);

  // Calculate average safety for each scan
  scansList.forEach(scan => {
    const total = scan.incidents.reduce((sum, inc) => sum + (inc.safetyScore || 0), 0);
    scan.avgSafety = Math.round(total / scan.incidents.length);
  });

  const handleDelete = (e, scanId) => {
    e.stopPropagation();
    if (window.confirm('Delete this scan record?')) {
      onDeleteScan(scanId);
      if (selectedScanId === scanId) setSelectedScanId(null);
    }
  };

  const exportData = () => {
    const csv = detections.map(d => `${new Date(d.timestamp).toISOString()},${d.locationName},${d.defectType},${d.severity},${d.safetyScore}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'RoadSense_History.csv';
    a.click();
  };

  const selectedScan = selectedScanId ? groupedScans[selectedScanId] : null;

  if (selectedScan) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedScanId(null)}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {selectedScan.locationName} {selectedScan.destinationName ? `→ ${selectedScan.destinationName}` : ''}
            </h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              Audit Performed on {new Date(selectedScan.timestamp).toLocaleString()}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={14} className="text-indigo-600" /> Detected Incidents
            </h3>
            {selectedScan.incidents.map((inc, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${inc.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-600' : 'bg-indigo-500/10 text-indigo-600'}`}>
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-bold text-lg">{inc.defectType.replace('_', ' ')}</h4>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{inc.severity} SEVERITY • {inc.specificLocation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-indigo-600 dark:text-indigo-400 font-black text-sm">{inc.safetyScore}% SAFETY</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  {inc.flowStatus && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                      <Gauge size={12} className="text-indigo-600" />
                      {inc.flowStatus}
                    </div>
                  )}
                  {inc.delayMinutes && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-full text-[10px] font-black uppercase tracking-widest text-red-600">
                      <Clock size={12} />
                      +{inc.delayMinutes} MIN DELAY
                    </div>
                  )}
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{inc.description}</p>
                
                {inc.recommendation && (
                  <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex gap-3 items-center">
                    <Wrench size={16} className="text-indigo-600 dark:text-indigo-500" />
                    <p className="text-slate-700 dark:text-slate-300 text-xs font-medium">{inc.recommendation}</p>
                  </div>
                )}

                {inc.sources?.[0] && (
                  <div className="pt-2 flex justify-end">
                    <a href={inc.sources[0].uri} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase hover:underline">
                      View Grounding Source <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center shadow-lg">
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Route Integrity</h3>
              <div className={`text-6xl font-black ${selectedScan.avgSafety < 70 ? 'text-red-600' : 'text-indigo-600'}`}>
                {selectedScan.avgSafety}%
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-60 flex items-center gap-2">
                <Info size={14} /> Audit Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs opacity-60">Total Incidents</span>
                  <span className="text-sm font-bold">{selectedScan.incidents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs opacity-60">Scan Mode</span>
                  <span className="text-sm font-bold uppercase">{selectedScan.scanMode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs opacity-60">Critical Issues</span>
                  <span className="text-sm font-bold text-red-400">
                    {selectedScan.incidents.filter(i => i.severity === 'CRITICAL').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Intelligence Archive</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Historical Infrastructure Log</p>
        </div>
        <button onClick={exportData} className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm">
          <Download size={14} /> Export CSV
        </button>
      </header>

      {scansList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-24 text-center text-slate-400 dark:text-slate-600 font-bold uppercase text-xs tracking-widest shadow-lg">
          No records in database.
        </div>
      ) : (
        <div className="space-y-4">
          {scansList.map((scan) => (
            <div 
              key={scan.scanId} 
              onClick={() => setSelectedScanId(scan.scanId)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] hover:border-indigo-500/30 transition-all flex items-center justify-between shadow-sm hover:shadow-md cursor-pointer group"
            >
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${scan.avgSafety < 70 ? 'bg-red-500/10 text-red-600' : 'bg-indigo-500/10 text-indigo-600'}`}>
                  {scan.scanMode === 'ROUTE' ? <Navigation size={24} /> : <MapPin size={24} />}
                </div>
                <div>
                  <h4 className="text-slate-900 dark:text-white font-black text-lg tracking-tight group-hover:text-indigo-600 transition-colors">
                    {scan.locationName} {scan.destinationName ? `→ ${scan.destinationName}` : ''}
                  </h4>
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">
                    <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(scan.timestamp).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><AlertTriangle size={10} /> {scan.incidents.length} Incidents</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Safety Index</p>
                  <p className={`text-xl font-black ${scan.avgSafety < 70 ? 'text-red-600' : 'text-indigo-600'}`}>{scan.avgSafety}%</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => handleDelete(e, scan.scanId)}
                    className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <ExternalLink size={16} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
