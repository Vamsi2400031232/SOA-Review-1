import React from 'react';
import {
  Dumbbell,
  LayoutDashboard,
  Users,
  CreditCard,
  Clock,
  LogOut,
  Shield,
  Globe,
  Cpu,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function Layout({ user, onLogout, activeTab, setActiveTab, children }) {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', name: 'Member Profiles', icon: Users, adminOnly: true },
    { id: 'subscriptions', name: 'Subscription Plans', icon: CreditCard },
    { id: 'attendance', name: 'Attendance Turnstile', icon: Clock, adminOnly: true },
  ].filter(item => !(item.adminOnly && user.role !== 'ADMIN'));

  return (
    <div className="flex h-screen bg-[#F5F2EB] text-[#1C2A24] overflow-hidden font-sans selection:bg-bronze-200 selection:text-forest-900">

      {/* Sidebar (Official Executive Warm Cream & Forest Theme) */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-[#DDD5C4] bg-[#FAF8F5] text-[#1C2A24] shadow-sm">

          {/* Logo Brand Header (Official Matching Clean Card) */}
          <div className="flex items-center gap-3.5 px-5 h-24 border-b border-[#DDD5C4] bg-white">
            <div className="p-1.5 bg-[#FAF8F5] rounded-2xl shadow-sm flex items-center justify-center h-16 w-16 flex-shrink-0 border border-[#DDD5C4] hover:scale-105 transition-transform">
              <img src="/logo.png" alt="AVS FITZONE Logo" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-black text-[#1E3A2F] tracking-tight truncate">AVS FITZONE</h1>
              <p className="text-[10px] font-extrabold text-[#8C7758] uppercase tracking-[0.2em]">Health Clubs</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="flex-1 px-3.5 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-200 cursor-pointer ${isActive
                        ? 'bg-[#1E3A2F] text-white shadow-md shadow-[#1E3A2F]/15 font-black translate-x-1'
                        : 'text-[#1C2A24]/75 hover:bg-[#ECE6DA]/70 hover:text-[#1E3A2F]'
                      }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-[#CDBDA0]' : 'text-[#8C7758]'}`} />
                    <span className="flex-1 text-left">{item.name}</span>
                    {isActive && <ChevronRight className="h-4 w-4 text-[#CDBDA0]" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Account / Footer */}
          <div className="p-4 border-t border-[#DDD5C4] bg-[#F5F2EB] flex flex-col gap-3">
            <div className="flex items-center space-x-3 p-3 bg-white rounded-2xl border border-[#DDD5C4] shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-[#FAF8F5] flex items-center justify-center border border-[#DDD5C4] text-[#1E3A2F] flex-shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-[#1C2A24] truncate">{user.name || user.username}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1E3A2F]/10 text-[#1E3A2F] border border-[#1E3A2F]/20 uppercase mt-0.5">
                  {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-200 cursor-pointer shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area (Warm Cream Theme) */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">

        {/* Topbar Header */}
        <header className="relative z-10 flex-shrink-0 flex h-20 bg-white/90 backdrop-blur-md border-b border-cream-300 shadow-sm px-6">
          <div className="flex-1 flex items-center justify-between">

            {/* Mobile Header Logo (Enlarged) */}
            <div className="flex items-center md:hidden gap-3">
              <div className="p-1.5 bg-white rounded-2xl h-14 w-14 border border-cream-300 flex items-center justify-center flex-shrink-0 shadow-sm">
                <img src="/logo.png" alt="AVS FITZONE" className="h-full w-full object-contain" />
              </div>
              <div>
                <span className="text-base font-black text-forest-700 block leading-tight">AVS FITZONE</span>
                <span className="text-[10px] font-bold text-bronze-500 uppercase tracking-widest">Health Clubs</span>
              </div>
            </div>

            {/* Left Topbar Info (Clean Brand Banner - API Gateway text removed) */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#FAF8F5] border border-cream-300 shadow-sm">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-bold text-charcoal">AVS FITZONE Multi-Center Portal</span>
                <span className="h-1.5 w-1.5 rounded-full bg-bronze-400" />
                <span className="text-xs font-black text-forest-700">4 Centers Operational</span>
              </div>
            </div>

            {/* Right Topbar Actions */}
            <div className="ml-4 flex items-center md:ml-6 space-x-3">

              {/* Active User Badge */}
              <div className="hidden sm:flex items-center bg-[#FAF8F5] border border-cream-300 rounded-2xl py-2 px-4 shadow-sm">
                <span className="text-xs font-semibold text-charcoal">
                  Signed in as <strong className="text-forest-700 font-black">{user.name || user.username}</strong>
                </span>
              </div>

              {/* Desktop Quick Sign Out */}
              <button
                onClick={onLogout}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-700 border border-red-200 transition-all cursor-pointer shadow-sm"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>

              {/* Mobile Logout */}
              <button
                onClick={onLogout}
                className="md:hidden p-2 text-charcoal/70 hover:text-red-600 rounded-xl hover:bg-cream-200"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-[#F5F2EB] p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

