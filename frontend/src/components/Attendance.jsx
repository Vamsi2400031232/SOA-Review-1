import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  Scan, 
  MapPin, 
  UserCheck, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle,
  Building,
  Activity,
  Filter,
  RefreshCw,
  Search,
  Sparkles,
  Clock
} from 'lucide-react';

export default function Attendance() {
  const [members, setMembers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form inputs for Turnstile Terminal
  const [memberInput, setMemberInput] = useState('');
  const [selectedCenter, setSelectedCenter] = useState('Downtown Main');
  const [selectedArea, setSelectedArea] = useState('Gym Floor');

  // Scanner feedback state
  const [scanResult, setScanResult] = useState(null); // { status: 'Allowed'|'Denied', message, memberName, logId }

  // Filter logs state
  const [centerFilter, setCenterFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const loadData = async () => {
    try {
      const mList = await api.members.getAll();
      const lList = await api.attendance.getLogs();
      setMembers(mList || []);
      setLogs(lList || []);
      
      if (mList && mList.length > 0 && !memberInput) {
        setMemberInput(mList[0].id); // default to first member for easy testing
      }
    } catch (err) {
      console.error('Error loading attendance logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!memberInput.trim()) return;

    try {
      const result = await api.attendance.checkIn(memberInput, selectedCenter, selectedArea);
      setScanResult(result);
      
      // Auto clear feedback after 7 seconds
      const timer = setTimeout(() => {
        setScanResult(null);
      }, 7000);

      // Refresh log feed
      loadData();
    } catch (err) {
      alert(err.message || 'Error processing check-in.');
    }
  };

  const selectSuggestedMember = (id) => {
    setMemberInput(id);
    setScanResult(null);
  };

  // Filters
  const filteredLogs = logs.filter(log => {
    const matchesCenter = centerFilter === 'All' || log.center === centerFilter;
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
    return matchesCenter && matchesStatus;
  });

  const centers = ['Downtown Main', 'Northside Wellness', 'West End Express', 'Metro Fitness'];
  const areas = ['Gym Floor', 'Group Fitness Room', 'Swimming Pool', 'Sauna/Spa', 'Spin Studio'];

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-bronze-500" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-bronze-600">Gate Verification</span>
          </div>
          <h2 className="text-3xl font-black text-forest-700 tracking-tight">Turnstile Attendance Terminal</h2>
          <p className="text-sm text-charcoal/70">Simulate entry turnstile scanners and audit multi-center check-in records.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-cream-300 shadow-sm text-xs font-bold text-forest-700">
          <Scan className="h-4 w-4 text-bronze-500 animate-pulse" />
          <span>Turnstile Sensor Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Turnstile Console Form */}
        <div className="bg-white/90 backdrop-blur-sm border border-cream-300 p-6 rounded-3xl shadow-xl shadow-forest-900/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scan className="h-5 w-5 text-forest-700" />
              <h3 className="text-base font-black text-forest-800">Scanner Console</h3>
            </div>

            <form onSubmit={handleScanSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-charcoal/70 mb-1.5 font-bold uppercase tracking-wider">Member ID or Email</label>
                <div className="flex gap-2">
                  <select
                    value={memberInput}
                    onChange={(e) => setMemberInput(e.target.value)}
                    className="flex-1 bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 px-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.id}) — {m.status}
                      </option>
                    ))}
                    {members.length === 0 && (
                      <option value="">No members found</option>
                    )}
                  </select>
                  
                  {/* Text search fallback */}
                  <input
                    type="text"
                    value={memberInput}
                    onChange={(e) => setMemberInput(e.target.value)}
                    placeholder="ID..."
                    className="w-24 bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 px-2 text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white text-center font-bold"
                    title="Type ID or Email directly"
                  />
                </div>
              </div>

              <div>
                <label className="block text-charcoal/70 mb-1.5 font-bold uppercase tracking-wider">Club Facility Location</label>
                <select
                  value={selectedCenter}
                  onChange={(e) => setSelectedCenter(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 px-3.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                >
                  {centers.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-charcoal/70 mb-1.5 font-bold uppercase tracking-wider">Workout Area Zone</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 px-3.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                >
                  {areas.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2 bg-forest-700 hover:bg-forest-800 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md shadow-forest-900/10 text-sm hover:translate-y-[-1px]"
              >
                <Scan className="h-4.5 w-4.5 animate-pulse text-bronze-400" />
                Scan Membership Card
              </button>
            </form>
          </div>

          {/* Quick Click shortcuts */}
          <div className="mt-6 border-t border-cream-200 pt-4">
            <h4 className="text-[10px] uppercase font-bold text-charcoal/60 tracking-wider mb-2">Simulate Entry Profiles</h4>
            {members.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {members.slice(0, 4).map(m => (
                  <button
                    key={m.id}
                    onClick={() => selectSuggestedMember(m.id)}
                    className={`p-2 bg-[#FAF8F5] hover:bg-cream-100 rounded-xl border transition-colors flex flex-col text-left ${
                      memberInput === m.id ? 'border-forest-700 ring-1 ring-forest-700' : 'border-cream-200'
                    }`}
                  >
                    <span className="font-bold text-forest-800 truncate">{m.name}</span>
                    <span className={`text-[9px] mt-0.5 font-bold ${
                      m.status === 'Active' ? 'text-emerald-700' : m.status === 'Expired' ? 'text-red-700' : 'text-amber-700'
                    }`}>{m.status}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-charcoal/50 italic">No registered members yet. Add members in the Member Profiles tab to simulate entry scans.</p>
            )}
          </div>
        </div>

        {/* Turnstile Output LED Simulator screen */}
        <div className="bg-white/90 backdrop-blur-sm border border-cream-300 p-6 rounded-3xl shadow-xl shadow-forest-900/5 flex flex-col justify-center min-h-[320px]">
          
          {!scanResult ? (
            <div className="text-center space-y-4 py-8">
              <div className="inline-flex p-5 bg-cream-100 rounded-3xl border border-cream-200 text-forest-700 relative">
                <Scan className="h-10 w-10 text-forest-700" />
                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-bronze-500 animate-pulse" />
              </div>
              <div>
                <h4 className="text-base font-black text-forest-800">Scanner Active & Awaiting Card</h4>
                <p className="text-xs text-charcoal/60 mt-1 max-w-[220px] mx-auto leading-relaxed">
                  Select a member on the left and trigger a scan to simulate gate turnstiles.
                </p>
              </div>
            </div>
          ) : scanResult.status === 'Allowed' ? (
            // ACCESS GRANTED LED PANEL
            <div className="bg-emerald-50 border border-emerald-300 rounded-3xl p-6 text-center space-y-5 animate-in fade-in duration-200">
              <div className="inline-flex p-3.5 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-700 shadow-lg">
                <CheckCircle className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black text-emerald-800 tracking-widest bg-emerald-200/70 px-3 py-1 rounded-full">
                  Access Allowed
                </span>
                <h3 className="text-xl font-black text-emerald-950 pt-2">{scanResult.memberName}</h3>
                <p className="text-xs text-emerald-700 font-medium">Verified active subscription. Turnstile unlocked.</p>
              </div>
              
              <div className="pt-4 border-t border-emerald-200 grid grid-cols-2 gap-2 text-[10px] text-emerald-800 font-semibold">
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-charcoal/60 block mb-0.5 font-bold uppercase tracking-wider">Location</span>
                  <span className="text-forest-800 truncate block font-bold">{scanResult.center}</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-charcoal/60 block mb-0.5 font-bold uppercase tracking-wider">Area Entered</span>
                  <span className="text-forest-800 truncate block font-bold">{scanResult.area}</span>
                </div>
              </div>
            </div>
          ) : (
            // ACCESS DENIED LED PANEL
            <div className="bg-red-50 border border-red-300 rounded-3xl p-6 text-center space-y-5 animate-in fade-in duration-200">
              <div className="inline-flex p-3.5 bg-red-100 border border-red-300 rounded-2xl text-red-700 shadow-lg">
                <ShieldAlert className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black text-red-800 tracking-widest bg-red-200/70 px-3 py-1 rounded-full">
                  Access Denied
                </span>
                <h3 className="text-xl font-black text-red-950 pt-2">{scanResult.memberName}</h3>
                <p className="text-xs text-red-700 font-medium leading-relaxed italic">
                  {scanResult.message}
                </p>
              </div>

              <div className="pt-4 border-t border-red-200 grid grid-cols-2 gap-2 text-[10px] text-red-800 font-semibold">
                <div className="bg-white/80 p-2.5 rounded-xl border border-red-200">
                  <span className="text-charcoal/60 block mb-0.5 font-bold uppercase tracking-wider">Location</span>
                  <span className="text-forest-800 truncate block font-bold">{scanResult.center}</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-red-200">
                  <span className="text-charcoal/60 block mb-0.5 font-bold uppercase tracking-wider">Gate Status</span>
                  <span className="text-red-700 truncate block font-bold">Turnstile Locked</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Traffic Occupancy Counter */}
        <div className="bg-white/90 backdrop-blur-sm border border-cream-300 p-6 rounded-3xl shadow-xl shadow-forest-900/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-forest-800 flex items-center gap-1.5">
              <Activity className="h-5 w-5 text-bronze-500" />
              Center Occupancy
            </h3>
            <span className="text-[10px] bg-cream-100 border border-cream-300 px-2.5 py-0.5 rounded-full text-forest-700 font-bold">
              Live Sensor Counts
            </span>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {centers.map(center => {
              // Count allowed checkins in past 24 hours for each club center
              const oneDayAgo = new Date();
              oneDayAgo.setDate(oneDayAgo.getDate() - 1);
              
              const count = logs.filter(log => 
                log.center === center && 
                log.status === 'Allowed' && 
                new Date(log.checkInTime) > oneDayAgo
              ).length;

              // Fake active count based on the 24h checks
              const activeCount = Math.max(0, Math.floor(count / 4) + (center === 'Downtown Main' ? 3 : 1));

              return (
                <div key={center} className="space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-forest-800">{center}</span>
                    <span className="text-[10px] text-charcoal/60 font-bold">
                      <span className="text-forest-700 font-black">{activeCount}</span> in club
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden border border-cream-300">
                    <div 
                      className="h-full rounded-full transition-all duration-500 bg-forest-700"
                      style={{ width: `${Math.min(100, (activeCount / 15) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Check-in Log History Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-cream-300 shadow-xl shadow-forest-900/5 overflow-hidden">
        
        {/* Filtering Options header */}
        <div className="px-6 py-4 border-b border-cream-200 bg-cream-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-forest-800 flex items-center gap-1.5">
            <Filter className="h-4.5 w-4.5 text-bronze-500" />
            Attendance Audit Logs
          </h3>

          <div className="flex flex-wrap gap-3 text-xs">
            {/* Center filter dropdown */}
            <select
              value={centerFilter}
              onChange={(e) => setCenterFilter(e.target.value)}
              className="bg-white border border-cream-300 rounded-xl py-2 px-3 text-charcoal font-semibold focus:outline-none focus:ring-2 focus:ring-forest-600"
            >
              <option value="All">All Locations</option>
              {centers.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Status filter dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-cream-300 rounded-xl py-2 px-3 text-charcoal font-semibold focus:outline-none focus:ring-2 focus:ring-forest-600"
            >
              <option value="All">All Statuses</option>
              <option value="Allowed">Allowed</option>
              <option value="Denied">Denied</option>
            </select>
          </div>
        </div>

        {/* Logs Table Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-forest-700"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-20 text-xs">
            <Activity className="mx-auto h-12 w-12 text-cream-400" />
            <h3 className="mt-2 text-sm font-bold text-forest-700">No check-in logs match filters</h3>
            <p className="mt-1 text-charcoal/60">Try modifying filter scopes.</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="min-w-full divide-y divide-cream-200">
              <thead className="bg-cream-50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-charcoal/70 uppercase tracking-widest text-[10px]">Timestamp</th>
                  <th className="px-6 py-4 text-left font-bold text-charcoal/70 uppercase tracking-widest text-[10px]">Member Details</th>
                  <th className="px-6 py-4 text-left font-bold text-charcoal/70 uppercase tracking-widest text-[10px]">Club Center</th>
                  <th className="px-6 py-4 text-left font-bold text-charcoal/70 uppercase tracking-widest text-[10px]">Workout Zone</th>
                  <th className="px-6 py-4 text-left font-bold text-charcoal/70 uppercase tracking-widest text-[10px]">Status</th>
                  <th className="px-6 py-4 text-left font-bold text-charcoal/70 uppercase tracking-widest text-[10px]">Message Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200 bg-white">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-cream-50">
                    <td className="px-6 py-4 whitespace-nowrap text-charcoal/60 font-semibold">
                      {new Date(log.checkInTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-forest-800">{log.memberName}</div>
                      <div className="text-[10px] text-bronze-600 font-bold tracking-wider">{log.memberId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-charcoal/80 flex items-center gap-1.5 mt-2">
                      <Building className="h-3.5 w-3.5 text-bronze-500" />
                      {log.center}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-charcoal/70">
                      {log.area}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold border ${
                        log.status === 'Allowed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-charcoal/70 font-medium italic">
                      {log.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

