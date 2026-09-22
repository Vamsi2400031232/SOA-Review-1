import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  Users,
  CheckCircle,
  TrendingUp,
  Activity,
  AlertCircle,
  Building,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function Dashboard({ user }) {
  const [members, setMembers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mems = await api.members.getAll();
        const subs = await api.plans.getSubscriptions();
        const att = await api.attendance.getLogs();

        setMembers(mems || []);
        setSubscriptions(subs || []);
        setAttendance(att || []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-700"></div>
      </div>
    );
  }

  // --- Calculations for metrics ---
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'Active').length;
  const expiredMembers = members.filter(m => m.status === 'Expired').length;
  const pendingMembers = members.filter(m => m.status === 'Pending').length;

  // Calculate attendance for today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(log => log.checkInTime.startsWith(todayStr));
  const todayAllowed = todayAttendance.filter(log => log.status === 'Allowed').length;
  const todayDenied = todayAttendance.filter(log => log.status === 'Denied').length;

  // Active subscriptions count
  const activeSubs = subscriptions.filter(s => s.status === 'Active').length;

  // Check-ins over past 7 days chart data
  const getPast7DaysData = () => {
    const data = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = weekdays[d.getDay()];

      const dayLogs = attendance.filter(log => log.checkInTime.startsWith(dateStr));
      const allowed = dayLogs.filter(log => log.status === 'Allowed').length;
      const denied = dayLogs.filter(log => log.status === 'Denied').length;

      data.push({
        name: dayName,
        date: dateStr,
        Checkins: allowed,
        Blocked: denied
      });
    }
    return data;
  };

  // Facility Usage stats (Downtown, West End, Northside, etc.)
  const getFacilityData = () => {
    const facilities = {};
    attendance.forEach(log => {
      if (log.status === 'Allowed') {
        facilities[log.center] = (facilities[log.center] || 0) + 1;
      }
    });
    return Object.keys(facilities).map(name => ({
      name: name.replace(' Health Club', '').replace(' Fitness', '').replace(' Wellness', ''),
      Visits: facilities[name]
    }));
  };

  // Workout Area distribution (Gym Floor, Pool, classes)
  const getAreaDistribution = () => {
    const areas = {};
    attendance.forEach(log => {
      if (log.status === 'Allowed') {
        areas[log.area] = (areas[log.area] || 0) + 1;
      }
    });

    const COLORS = ['#1E3A2F', '#8C7758', '#4A7C59', '#BAA382', '#2D5242'];
    return Object.keys(areas).map((name, index) => ({
      name,
      value: areas[name],
      color: COLORS[index % COLORS.length]
    }));
  };

  const chartData7Days = getPast7DaysData();
  const facilityData = getFacilityData();
  const areaData = getAreaDistribution();

  if (user?.role === 'MEMBER') {
    // Filter attendance for the current member
    const memberAttendance = attendance.filter(log => log.memberName === user.name || (log.memberId && members.find(m => m.id === log.memberId)?.username === user.username));
    const allowedVisits = memberAttendance.filter(log => log.status === 'Allowed');
    const totalDaysAttended = new Set(allowedVisits.map(log => log.checkInTime.split('T')[0])).size;

    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-bronze-500" />
              <span className="text-xs uppercase font-extrabold tracking-widest text-bronze-600">Welcome Back</span>
            </div>
            <h2 className="text-3xl font-black text-forest-700 tracking-tight">Your Dashboard</h2>
            <p className="text-sm text-charcoal/70">Hey {user.name}, view your fitness journey and active subscription.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Status Card */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl border border-cream-300 shadow-xl flex flex-col items-center justify-center text-center space-y-4 lg:col-span-2">
            <CheckCircle className="h-16 w-16 text-emerald-600" />
            <h3 className="text-2xl font-black text-forest-800">Your profile is active!</h3>
            <p className="text-charcoal/70 max-w-md">
              Check the "Subscription Plans" tab to browse available membership tiers and manage your gym access.
            </p>
          </div>

          {/* Attendance Stat Card */}
          <div className="bg-[#1E3A2F] p-8 rounded-3xl shadow-xl flex flex-col justify-center text-white space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6">
              <Activity className="h-32 w-32 text-white/5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-bronze-400">Total Visits</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-6xl font-black">{totalDaysAttended}</h3>
              <span className="text-lg font-bold text-cream-200">Days</span>
            </div>
            <p className="text-xs text-cream-100/70 opacity-90 leading-relaxed max-w-[200px]">
              Keep up the momentum! Consistent visits yield the best long-term results.
            </p>
          </div>

        </div>

        {/* Recent Attendance Feed */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-cream-300 shadow-xl shadow-forest-900/5">
          <h3 className="text-base font-bold text-forest-700 mb-4">Your Recent Check-Ins</h3>
          <div className="space-y-3">
            {memberAttendance.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start space-x-3 p-4 bg-[#FAF8F5] rounded-2xl border border-cream-200">
                <div className="mt-0.5">
                  {log.status === 'Allowed' ? (
                    <div className="p-1.5 bg-emerald-100 rounded-xl border border-emerald-300">
                      <CheckCircle className="h-4 w-4 text-emerald-700" />
                    </div>
                  ) : (
                    <div className="p-1.5 bg-red-100 rounded-xl border border-red-300">
                      <AlertCircle className="h-4 w-4 text-red-700" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-charcoal/50 font-semibold flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(log.checkInTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-charcoal/80 font-bold">
                    <span className="flex items-center gap-1">
                      <Building className="h-3.5 w-3.5 text-bronze-500" />
                      {log.center}
                    </span>
                    <span>{log.area}</span>
                  </div>
                  {log.status === 'Denied' && (
                    <p className="text-[10px] text-red-600 font-medium mt-1">
                      {log.message}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {memberAttendance.length === 0 && (
              <div className="text-center py-10">
                <Clock className="mx-auto h-10 w-10 text-cream-400 mb-2" />
                <p className="text-sm font-bold text-forest-700">No visits recorded yet</p>
                <p className="text-xs text-charcoal/60">Subscribe to a plan to unlock the turnstiles!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-bronze-500" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-bronze-600">Overview Analytics</span>
          </div>
          <h2 className="text-3xl font-black text-forest-700 tracking-tight">Executive Dashboard</h2>
          <p className="text-sm text-charcoal/70">Real-time multi-center metrics, subscriber analytics, and entry gate traffic.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-cream-300 shadow-sm text-xs font-bold text-forest-700">
          <Sparkles className="h-4 w-4 text-bronze-500" />
          <span>4 Centers Operational</span>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total Members */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-cream-300 flex items-center justify-between shadow-xl shadow-forest-900/5 hover:border-bronze-300 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Total Members</span>
            <h3 className="text-3xl font-black text-forest-700">{totalMembers}</h3>
            <p className="text-xs text-charcoal/70">
              <span className="text-emerald-700 font-bold">{activeMembers}</span> Active profiles
            </p>
          </div>
          <div className="p-3.5 bg-cream-100 rounded-2xl border border-cream-200 text-forest-700">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-cream-300 flex items-center justify-between shadow-xl shadow-forest-900/5 hover:border-bronze-300 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Active Plans</span>
            <h3 className="text-3xl font-black text-forest-700">{activeSubs}</h3>
            <p className="text-xs text-charcoal/70">
              <span className="text-red-600 font-bold">{expiredMembers}</span> Expired memberships
            </p>
          </div>
          <div className="p-3.5 bg-cream-100 rounded-2xl border border-cream-200 text-bronze-600">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Today's Check-ins */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-cream-300 flex items-center justify-between shadow-xl shadow-forest-900/5 hover:border-bronze-300 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Today's Visits</span>
            <h3 className="text-3xl font-black text-forest-700">{todayAttendance.length}</h3>
            <p className="text-xs text-charcoal/70">
              <span className="text-emerald-700 font-bold">{todayAllowed}</span> Allowed • <span className="text-red-600 font-bold">{todayDenied}</span> Denied
            </p>
          </div>
          <div className="p-3.5 bg-cream-100 rounded-2xl border border-cream-200 text-forest-700">
            <Activity className="h-6 w-6" />
          </div>
        </div>

        {/* Global Access Pass Rate */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-cream-300 flex items-center justify-between shadow-xl shadow-forest-900/5 hover:border-bronze-300 transition-all">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Access Pass Rate</span>
            <h3 className="text-3xl font-black text-forest-700">
              {attendance.length > 0
                ? `${Math.round((attendance.filter(l => l.status === 'Allowed').length / attendance.length) * 100)}%`
                : '0%'}
            </h3>
            <p className="text-xs text-charcoal/70">Of total logged entry scans</p>
          </div>
          <div className="p-3.5 bg-cream-100 rounded-2xl border border-cream-200 text-bronze-600">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Line Chart: Attendance Trend */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-cream-300 shadow-xl shadow-forest-900/5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-forest-700">7-Day Attendance Pattern</h3>
            <span className="text-xs text-bronze-600 font-bold">Past Week</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCheckins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A2F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1E3A2F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECE6DA" />
                <XAxis dataKey="name" stroke="#617067" fontSize={12} tickLine={false} />
                <YAxis stroke="#617067" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FAF8F5', borderColor: '#DDD5C4', color: '#1C2A24', borderRadius: '12px' }}
                  labelClassName="text-forest-700 font-bold"
                />
                <Area type="monotone" dataKey="Checkins" stroke="#1E3A2F" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCheckins)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Workout Area Distribution */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-cream-300 shadow-xl shadow-forest-900/5">
          <h3 className="text-base font-bold text-forest-700 mb-4">Workout Zone Popularity</h3>
          <div className="h-72 flex flex-col justify-between">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={areaData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {areaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#FAF8F5', borderColor: '#DDD5C4', color: '#1C2A24', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-cream-200">
              {areaData.map((entry, idx) => (
                <div key={idx} className="flex items-center space-x-1.5 text-charcoal/70">
                  <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                  <span className="truncate font-medium">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Bar Chart: Checkins by Facility */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-cream-300 shadow-xl shadow-forest-900/5 lg:col-span-2">
          <h3 className="text-base font-bold text-forest-700 mb-4">Usage Traffic by Club Location</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facilityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECE6DA" />
                <XAxis dataKey="name" stroke="#617067" fontSize={11} tickLine={false} />
                <YAxis stroke="#617067" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FAF8F5', borderColor: '#DDD5C4', color: '#1C2A24', borderRadius: '12px' }} />
                <Bar dataKey="Visits" fill="#1E3A2F" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Turnstile Scans Feed */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-cream-300 shadow-xl shadow-forest-900/5 flex flex-col h-[350px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-forest-700">Live Attendance Feed</h3>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-ping" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {attendance.slice(0, 8).map((log) => (
              <div
                key={log.id}
                className="flex items-start space-x-3 p-3 bg-[#FAF8F5] rounded-2xl border border-cream-200 hover:border-bronze-300 transition-colors"
              >
                {/* Status Indicator */}
                <div className="mt-0.5">
                  {log.status === 'Allowed' ? (
                    <div className="p-1 bg-emerald-100 rounded-xl border border-emerald-300">
                      <CheckCircle className="h-4 w-4 text-emerald-700" />
                    </div>
                  ) : (
                    <div className="p-1 bg-red-100 rounded-xl border border-red-300">
                      <AlertCircle className="h-4 w-4 text-red-700" />
                    </div>
                  )}
                </div>

                {/* Scan Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-xs font-bold text-forest-800 truncate">{log.memberName}</h4>
                    <span className="text-[10px] text-charcoal/50 font-semibold flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(log.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-charcoal/70 mt-1">
                    <span className="truncate font-medium flex items-center gap-0.5">
                      <Building className="h-2.5 w-2.5 text-bronze-500" />
                      {log.center}
                    </span>
                    <span className="font-semibold text-charcoal/60">{log.area}</span>
                  </div>
                  {log.status === 'Denied' && (
                    <p className="text-[9px] text-red-600 font-medium mt-1 italic">
                      {log.message}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {attendance.length === 0 && (
              <p className="text-xs text-charcoal/50 text-center py-12">No recent check-in events logged.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

