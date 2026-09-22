import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  ShieldAlert, 
  CheckCircle,
  FileText,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal / Drawer state
  const [selectedMember, setSelectedMember] = useState(null); // Detail view drawer
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null); // Member being edited

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('Pending');

  const loadData = async () => {
    setLoading(true);
    try {
      const mems = await api.members.getAll();
      const subs = await api.plans.getSubscriptions();
      const logs = await api.attendance.getLogs();
      setMembers(mems || []);
      setSubscriptions(subs || []);
      setAttendance(logs || []);
    } catch (err) {
      console.error('Error loading members data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingMember(null);
    setName('');
    setEmail('');
    setPhone('');
    setStatus('Pending');
    setShowFormModal(true);
  };

  const handleOpenEdit = (e, member) => {
    e.stopPropagation(); // Avoid opening drawer
    setEditingMember(member);
    setName(member.name);
    setEmail(member.email);
    setPhone(member.phone);
    setStatus(member.status);
    setShowFormModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, email, phone, status };
    try {
      if (editingMember) {
        await api.members.update(editingMember.id, payload);
      } else {
        await api.members.create(payload);
      }
      setShowFormModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Error saving member details.');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this member? All associated subscriptions and check-in history will be permanently deleted.')) {
      try {
        await api.members.delete(id);
        if (selectedMember && selectedMember.id === id) {
          setSelectedMember(null);
        }
        loadData();
      } catch (err) {
        alert('Error deleting member.');
      }
    }
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to remove all members? This will also clear all member subscriptions and attendance logs.')) {
      try {
        await api.members.clearAll();
        setSelectedMember(null);
        loadData();
      } catch (err) {
        alert('Error clearing all members.');
      }
    }
  };

  // Filter logic
  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-bronze-500" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-bronze-600">Member Directory</span>
          </div>
          <h2 className="text-3xl font-black text-forest-700 tracking-tight">Member Profiles</h2>
          <p className="text-sm text-charcoal/70">Manage club membership directory, contact records, and access status.</p>
        </div>
        <div className="flex items-center gap-3">
          {members.length > 0 && (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-2xl transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Clear Directory
            </button>
          )}
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-forest-900/10"
          >
            <Plus className="h-4 w-4" />
            Register Member
          </button>
        </div>
      </div>

      {/* Search & Tabs Controls */}
      <div className="flex flex-col md:flex-row gap-4 bg-white/90 backdrop-blur-sm p-4 rounded-3xl border border-cream-300 shadow-xl shadow-forest-900/5">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-bronze-500" />
          <input
            type="text"
            placeholder="Search by ID, name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 pl-11 pr-4 text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex p-1.5 bg-cream-100 rounded-2xl border border-cream-200">
          {['All', 'Active', 'Expired', 'Pending'].map((statusOption) => (
            <button
              key={statusOption}
              onClick={() => setStatusFilter(statusOption)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                statusFilter === statusOption
                  ? 'bg-forest-700 text-white shadow-sm'
                  : 'text-charcoal/70 hover:text-forest-700'
              }`}
            >
              {statusOption}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Container (Table + Details Side Drawer) */}
      <div className="flex gap-6 items-start">
        
        {/* Main Table Card */}
        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-3xl border border-cream-300 shadow-xl shadow-forest-900/5 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-forest-700"></div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-20">
              <User className="mx-auto h-12 w-12 text-cream-400" />
              <h3 className="mt-2 text-sm font-bold text-forest-700">No members found</h3>
              <p className="mt-1 text-xs text-charcoal/60">Try modifying your search or filter keywords.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-cream-200">
                <thead className="bg-cream-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-charcoal/70 uppercase tracking-widest">ID / Name</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-charcoal/70 uppercase tracking-widest">Contact Info</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-charcoal/70 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-charcoal/70 uppercase tracking-widest">Joined Date</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-charcoal/70 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 bg-white">
                  {filteredMembers.map((member) => (
                    <tr 
                      key={member.id}
                      onClick={() => setSelectedMember(member)}
                      className={`hover:bg-cream-50 cursor-pointer transition-colors ${
                        selectedMember && selectedMember.id === member.id ? 'bg-cream-100/70 hover:bg-cream-100' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-xl bg-forest-700 text-white flex items-center justify-center font-bold text-xs mr-3 shadow-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-forest-800">{member.name}</div>
                            <div className="text-[10px] text-bronze-600 font-bold tracking-wider">{member.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-charcoal/80 font-medium flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-bronze-500" />
                          {member.email}
                        </div>
                        <div className="text-xs text-charcoal/60 mt-0.5 flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-bronze-500" />
                          {member.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                          member.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : member.status === 'Expired'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-charcoal/70 font-semibold">
                        {member.joinedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={(e) => handleOpenEdit(e, member)}
                            className="p-2 bg-cream-100 hover:bg-cream-200 text-forest-700 rounded-xl border border-cream-200 transition-colors"
                            title="Edit profile"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, member.id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl border border-red-200 transition-colors"
                            title="Delete profile"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Profile Info Side Drawer */}
        {selectedMember && (
          <div className="w-80 bg-white border border-cream-300 rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-right duration-200">
            <button 
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 p-1.5 text-charcoal/50 hover:text-forest-700 hover:bg-cream-100 rounded-xl"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header info */}
            <div className="text-center pb-5 border-b border-cream-200">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-forest-700 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-forest-900/10 mb-3">
                {selectedMember.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="text-base font-bold text-forest-800">{selectedMember.name}</h3>
              <p className="text-xs text-bronze-600 font-bold mt-0.5">{selectedMember.id}</p>
            </div>

            {/* Profile Fields */}
            <div className="py-5 space-y-3.5 border-b border-cream-200 text-xs">
              <div className="flex justify-between items-center text-charcoal/70">
                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-bronze-500" /> Email</span>
                <span className="text-forest-800 font-bold">{selectedMember.email}</span>
              </div>
              <div className="flex justify-between items-center text-charcoal/70">
                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-bronze-500" /> Phone</span>
                <span className="text-forest-800 font-bold">{selectedMember.phone}</span>
              </div>
              <div className="flex justify-between items-center text-charcoal/70">
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-bronze-500" /> Joined</span>
                <span className="text-forest-800 font-bold">{selectedMember.joinedDate}</span>
              </div>
            </div>

            {/* Subscription section */}
            <div className="py-5 border-b border-cream-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-3.5 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-bronze-500" /> Subscription Plan
              </h4>
              
              {subscriptions.find(s => s.memberId === selectedMember.id && s.status === 'Active') ? (
                (() => {
                  const sub = subscriptions.find(s => s.memberId === selectedMember.id && s.status === 'Active');
                  return (
                    <div className="bg-[#FAF8F5] border border-cream-300 p-3.5 rounded-2xl">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-forest-800">Active Plan</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold uppercase">
                          Paid
                        </span>
                      </div>
                      <div className="text-[11px] text-charcoal/70 mt-2 space-y-1">
                        <p>ID: <span className="font-bold text-forest-700">{sub.id}</span></p>
                        <p>Period: <span className="font-semibold text-charcoal">{sub.startDate}</span> to <span className="font-semibold text-charcoal">{sub.endDate}</span></p>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="bg-red-50 border border-red-200 p-3.5 rounded-2xl text-center">
                  <p className="text-xs text-red-700 font-medium">No Active Subscription Plan</p>
                </div>
              )}
            </div>

            {/* Historical logs Section */}
            <div className="pt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-3 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-bronze-500" /> Recent Check-Ins
              </h4>
              <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                {attendance
                  .filter(log => log.memberId === selectedMember.id)
                  .slice(0, 5)
                  .map(log => (
                    <div key={log.id} className="text-[11px] border-b border-cream-200 pb-2.5 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-forest-800 flex items-center gap-0.5">
                          <MapPin className="h-3 w-3 text-bronze-500" />
                          {log.center}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          log.status === 'Allowed' ? 'text-emerald-700 bg-emerald-100' : 'text-red-700 bg-red-100'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-charcoal/60 mt-1">
                        <span>{log.area}</span>
                        <span>{new Date(log.checkInTime).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}

                {attendance.filter(log => log.memberId === selectedMember.id).length === 0 && (
                  <p className="text-xs text-charcoal/50 text-center py-4">No check-in history logged.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Member Form Modal (Add / Edit) */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-cream-300 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200 bg-[#FAF8F5]">
              <h3 className="text-base font-black text-forest-700">
                {editingMember ? `Modify: ${editingMember.name}` : 'Register New Member'}
              </h3>
              <button 
                onClick={() => setShowFormModal(false)}
                className="p-1.5 text-charcoal/50 hover:text-forest-700 hover:bg-cream-100 rounded-xl"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block text-charcoal/70 mb-1.5 font-bold uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 px-3.5 text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-charcoal/70 mb-1.5 font-bold uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@domain.com"
                  className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 px-3.5 text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-charcoal/70 mb-1.5 font-bold uppercase tracking-wider">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 px-3.5 text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-charcoal/70 mb-1.5 font-bold uppercase tracking-wider">Access Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 px-3.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                >
                  <option value="Active">Active (Assigned Plan)</option>
                  <option value="Expired">Expired (Renewal Needed)</option>
                  <option value="Pending">Pending (Awaiting Activation)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-cream-200 flex justify-end gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-5 py-2.5 border border-cream-300 hover:bg-cream-100 text-charcoal/70 hover:text-forest-700 rounded-2xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-2xl font-bold transition-all shadow-md shadow-forest-900/10"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

