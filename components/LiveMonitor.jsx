
import React, { useState } from 'react';
import { scanAreaConditions, scanRouteConditions, parseScanToIncidents } from '../services/geminiService';
import { MapPin, Search, AlertTriangle, ExternalLink, Globe, Loader2, Navigation, Wrench, Info, Gauge, Clock, Thermometer, CloudSun, ShieldCheck } from 'lucide-react';

const LiveMonitor = ({ onDetections }) => {
  const [scanMode, setScanMode] = useState('AREA');
  const [locationInput, setLocationInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [sources, setSources] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [weatherSummary, setWeatherSummary] = useState(null);

  const handleScan = async () => {
    if (!locationInput.trim()) return;
    setIsScanning(true);
    setIncidents([]);
    setWeatherSummary(null);

    try {
      const scanId = Math.random().toString(36).substr(2, 9);
      const result = scanMode === 'AREA' 
        ? await scanAreaConditions(locationInput) 
        : await scanRouteConditions(locationInput, destinationInput);

      setSources(result.sources);

      const { incidents: parsedIncidents, weatherSummary: parsedWeather } = await parseScanToIncidents(result.text);
      setIncidents(parsedIncidents);
      setWeatherSummary(parsedWeather);
      
      const detections = parsedIncidents.map((inc) => ({
        id: Math.random().toString(36).substr(2, 9),
        scanId,
        timestamp: Date.now(),
        locationName: locationInput,
        destinationName: scanMode === 'ROUTE' ? destinationInput : null,
        scanMode,
        specificLocation: inc.specificLocation,
        defectType: inc.type,
        severity: inc.severity,
        confidence: 0.95,
        description: inc.description,
        recommendation: inc.recommendation,
        safetyScore: inc.safetyScore,
        weather: inc.weather,
        flowStatus: inc.flowStatus,
        delayMinutes: inc.delayMinutes,
        sources: result.sources
      }));

      onDetections(detections);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const avgSafety = incidents.length > 0 
    ? Math.round(incidents.reduce((a, b) => a + b.safetyScore, 0) / incidents.length)
    : null;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Intelligence Feed</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Live Infrastructure Monitoring</p>
        </div>
        <div className="flex bg-white dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <button onClick={() => setScanMode('AREA')} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${scanMode === 'AREA' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>Regional</button>
          <button onClick={() => setScanMode('ROUTE')} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${scanMode === 'ROUTE' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>Route Safety</button>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-xl dark:shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 dark:text-indigo-500" size={18} />
            <input 
              type="text" 
              placeholder={scanMode === 'AREA' ? "Enter City Name" : "Start Location"} 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            />
          </div>
          {scanMode === 'ROUTE' && (
            <div className="relative flex-1">
              <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 dark:text-indigo-500" size={18} />
              <input 
                type="text" 
                placeholder="End Location" 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
                value={destinationInput}
                onChange={(e) => setDestinationInput(e.target.value)}
              />
            </div>
          )}
          <button 
            onClick={handleScan}
            disabled={isScanning || !locationInput}
            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
          >
            {isScanning ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
            {isScanning ? 'Scanning...' : 'Run Audit'}
          </button>
        </div>
      </div>

      {isScanning ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-20 flex flex-col items-center justify-center space-y-4 shadow-xl">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Gathering Real-time Intelligence...</p>
        </div>
      ) : (incidents.length > 0 || weatherSummary) ? (
        <div className="space-y-8">
          {/* Top Half-by-Half Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Integrity Index */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck size={24} className="text-indigo-600" />
                <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Integrity Index</h3>
              </div>
              <div className={`text-5xl font-black ${avgSafety < 70 ? 'text-red-600' : 'text-indigo-600'}`}>
                {avgSafety}%
              </div>
              <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Overall Safety Rating</p>
            </div>

            {/* Environmental Status */}
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-3 mb-2">
                <CloudSun size={24} className="text-amber-400" />
                <h3 className="text-white/40 text-[10px] font-black uppercase tracking-widest">Live Weather</h3>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black">{weatherSummary?.temperature || '--'}</span>
                <p className="text-sm font-bold opacity-80 uppercase tracking-widest mt-1">
                  {weatherSummary?.condition || 'Conditions Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Incidents Data Section */}
          <div className="space-y-6">
            <h3 className="text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 px-2">
              <AlertTriangle size={16} className="text-indigo-600" /> Detected Incidents & Conditions
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {incidents.map((inc, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] hover:border-indigo-500/30 transition-all shadow-lg space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${inc.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-600' : 'bg-indigo-500/10 text-indigo-600'}`}>
                        <AlertTriangle size={24} />
                      </div>
                      <div>
                        <h4 className="text-slate-900 dark:text-white font-bold text-lg">{inc.type.replace('_', ' ')}</h4>
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
                </div>
              ))}
            </div>
          </div>

          {/* Remaining Info (Sources) */}
          {sources.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 space-y-6 shadow-lg">
              <h3 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <Info size={14} className="text-indigo-600" /> Intelligence Grounding Sources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sources.map((s, i) => (
                  <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase group">
                    <ExternalLink size={14} className="text-indigo-600 group-hover:scale-110 transition-transform" /> 
                    <span className="truncate">{s.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-20 text-center text-slate-400 dark:text-slate-600 flex flex-col items-center shadow-xl">
          <Globe size={60} className="mb-4 opacity-20" />
          <p className="font-bold text-xs uppercase tracking-widest">
            {locationInput ? "No specific hazards detected in this area." : "Perform a scan to see live reports."}
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveMonitor;
