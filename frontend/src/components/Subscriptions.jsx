import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  CreditCard,
  IndianRupee,
  Clock,
  User,
  Layers,
  RefreshCw,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function Subscriptions({ user }) {
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tabs state
  const [activeSubTab, setActiveSubTab] = useState('plans'); // 'plans' or 'history'

  // Modal states
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [showRenewModal, setShowRenewModal] = useState(false);

  // Plan Form Fields
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [planDuration, setPlanDuration] = useState(1);
  const [planDesc, setPlanDesc] = useState('');

  // Renew / Assign Subscription Form Fields
  const [renewMemberId, setRenewMemberId] = useState('');
  const [renewPlanId, setRenewPlanId] = useState('');
  const [renewDuration, setRenewDuration] = useState(1);

  const loadData = async () => {
    setLoading(true);
    try {
      const pList = await api.plans.getAll();
      const mList = await api.members.getAll();
      const sList = await api.plans.getSubscriptions();

      setPlans(pList || []);
      setMembers(mList || []);
      setSubscriptions(sList || []);

      // Set default form values if data is loaded
      if (mList && mList.length > 0) setRenewMemberId(mList[0].id);
      if (pList && pList.length > 0) {
        setRenewPlanId(pList[0].id);
        setRenewDuration(pList[0].durationMonths);
      }
    } catch (err) {
      console.error('Error loading subscriptions data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update renewDuration when selected plan changes
  const handleRenewPlanChange = (planId) => {
    setRenewPlanId(planId);
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setRenewDuration(plan.durationMonths);
    }
  };

  // --- Plan CRUD Handlers ---
  const handleOpenAddPlan = () => {
    setEditingPlan(null);
    setPlanName('');
    setPlanPrice('');
    setPlanDuration(1);
    setPlanDesc('');
    setShowPlanModal(true);
  };

  const handleOpenEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanName(plan.name);
    setPlanPrice(plan.price);
    setPlanDuration(plan.durationMonths);
    setPlanDesc(plan.description);
    setShowPlanModal(true);
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    const payload = {
      name: planName,
      price: parseFloat(planPrice),
      durationMonths: parseInt(planDuration),
      description: planDesc
    };

    try {
      if (editingPlan) {
        await api.plans.update(editingPlan.id, payload);
      } else {
        await api.plans.create(payload);
      }
      setShowPlanModal(false);
      loadData();
    } catch (err) {
      alert('Error saving plan template.');
    }
  };

  const handleDeletePlan = async (id) => {
    if (confirm('Delete this membership plan template? This will not affect existing active subscriptions.')) {
      try {
        await api.plans.delete(id);
        loadData();
      } catch (err) {
        alert('Error deleting plan template.');
      }
    }
  };

  // --- Renew / Create Subscription Handlers ---
  const handleOpenRenew = () => {
    // Select first expired or pending member, if any
    const firstNonActive = members.find(m => m.status !== 'Active') || members[0];
    if (firstNonActive) {
      setRenewMemberId(firstNonActive.id);
    }
    if (plans.length > 0) {
      setRenewPlanId(plans[0].id);
      setRenewDuration(plans[0].durationMonths);
    }
    setShowRenewModal(true);
  };

  const handleRenewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.plans.renew(renewMemberId, renewPlanId, parseInt(renewDuration));
      setShowRenewModal(false);
      loadData();
      alert('Subscription contract created successfully! Member access active.');
    } catch (err) {
      alert(err.message || 'Error renewing membership.');
    }
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-bronze-500" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-bronze-600">Pricing & Billing</span>
          </div>
          <h2 className="text-3xl font-black text-forest-700 tracking-tight">Membership Plans & Renewals</h2>
          <p className="text-sm text-charcoal/70">Configure Indian Rupee (₹ INR) tier packages and process contract renewals.</p>
        </div>
        <div className="flex gap-3">
          {user?.role === 'ADMIN' && (
            <>
              <button
                onClick={handleOpenRenew}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-forest-900/10"
              >
                <RefreshCw className="h-4 w-4" />
                Process Renewal
              </button>
              <button
                onClick={handleOpenAddPlan}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-cream-100 text-forest-700 text-xs font-bold rounded-2xl transition-colors border border-cream-300"
              >
                <Plus className="h-4 w-4" />
                New Plan Tier
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sub tabs switcher */}
      <div className="flex border-b border-cream-300 space-x-6 text-sm">
        <button
          onClick={() => setActiveSubTab('plans')}
          className={`pb-3 font-bold flex items-center gap-1.5 transition-colors border-b-2 ${activeSubTab === 'plans'
            ? 'border-forest-700 text-forest-800 font-extrabold'
            : 'border-transparent text-charcoal/60 hover:text-forest-700'
            }`}
        >
          <Layers className="h-4 w-4" />
          Plan Packages ({plans.length})
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`pb-3 font-bold flex items-center gap-1.5 transition-colors border-b-2 ${activeSubTab === 'history'
            ? 'border-forest-700 text-forest-800 font-extrabold'
            : 'border-transparent text-charcoal/60 hover:text-forest-700'
            }`}
        >
          <CreditCard className="h-4 w-4" />
          Active Subscriptions ({subscriptions.length})
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-forest-700"></div>
        </div>
      ) : activeSubTab === 'plans' ? (

        // --- PLANS GRID TAB ---
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white/90 backdrop-blur-sm border border-cream-300 hover:border-bronze-400 rounded-3xl p-6 shadow-xl shadow-forest-900/5 flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-200 group"
            >
              <div>
                {/* Header name */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-black text-forest-800 group-hover:text-forest-900 transition-colors">
                      {plan.name}
                    </h3>
                    <span className="text-[10px] text-bronze-600 font-bold tracking-wider">{plan.id}</span>
                  </div>

                  {/* Actions buttons */}
                  {user?.role === 'ADMIN' && (
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEditPlan(plan)}
                        className="p-1.5 bg-cream-100 text-forest-700 hover:bg-cream-200 rounded-lg border border-cream-200"
                        title="Edit plan details"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="p-1.5 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100"
                        title="Delete plan"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Price tag */}
                <div className="my-5 flex items-baseline">
                  <span className="text-3xl font-black text-forest-700">₹{typeof plan.price === 'number' ? plan.price.toLocaleString('en-IN') : plan.price}</span>
                  <span className="text-xs text-charcoal/60 font-semibold ml-1.5">
                    / {plan.durationMonths} {plan.durationMonths === 1 ? 'Month' : 'Months'}
                  </span>
                </div>

                <p className="text-xs text-charcoal/70 font-medium leading-relaxed mb-4">
                  {plan.description}
                </p>

                {/* Member Subscribe Button */}
                {user?.role === 'MEMBER' && (
                  <button
                    onClick={async () => {
                      // Find the member id matching the current user username to assign to them
                      let currentMember = members.find(m => m.username === user.username || m.name === user.name);

                      // Fallback in case member wasn't created in the mock DB yet but exists in JWT
                      if (!currentMember) {
                        currentMember = {
                          id: `usr_${Math.floor(Math.random() * 10000)}`,
                          name: user.name,
                          username: user.username,
                          status: 'Pending'
                        };
                        // Save them to the DB so the renewal process can find them
                        await api.members.create(currentMember);
                        // Update local state so it renders correctly
                        setMembers(prev => [...prev, currentMember]);
                      }

                      setRenewMemberId(currentMember.id);
                      setRenewPlanId(plan.id);
                      setRenewDuration(plan.durationMonths);
                      setShowRenewModal(true);
                    }}
                    className="w-full py-2.5 mb-4 bg-forest-700 hover:bg-forest-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    Pay Subscription
                  </button>
                )}
              </div>

              <div className="pt-4 border-t border-cream-200 flex justify-between items-center text-[10px] text-charcoal/60 font-bold">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-bronze-500" />
                  {plan.durationMonths * 30} Days Term
                </span>
                <span className="flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5 text-bronze-500" />
                  Auto-Renewal Available
                </span>
              </div>
            </div>
          ))}

          {plans.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-cream-300">
              <Layers className="mx-auto h-12 w-12 text-cream-400" />
              <h3 className="mt-2 text-sm font-bold text-forest-700">No plan templates found</h3>
              <p className="mt-1 text-xs text-charcoal/60">Create templates to easily assign subscription tiers to members.</p>
            </div>
          )}
        </div>

      ) : (

        // --- SUBSCRIPTIONS HISTORY TAB ---
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-cream-300 shadow-xl shadow-forest-900/5 overflow-hidden">
          {subscriptions.length === 0 ? (
            <div className="text-center py-20">
              <CreditCard className="mx-auto h-12 w-12 text-cream-400" />
              <h3 className="mt-2 text-sm font-bold text-forest-700">No subscriptions logged</h3>
              <p className="mt-1 text-xs text-charcoal/60">Process renewals or assign memberships to populate list.</p>
            </div>
          ) : (
            <div className="overflow-x-auto text-xs">
              <table className="min-w-full divide-y divide-cream-200">
                <thead className="bg-cream-100">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-charcoal/70 uppercase tracking-widest text-[10px]">Contract ID</th>
                    <th className="px-6 py-4 text-left font-bold text-charcoal/70 uppercase tracking-widest text-[10px]">Member</th>
                    <th className="px-6 py-4 text-left font-bold text-charcoal/70 uppercase tracking-widest text-[10px]">Plan Name</th>
                    <th className="px-6 py-4 text-left font-bold text-charcoal/70 uppercase tracking-widest text-[10px]">Duration Range</th>
                    <th className="px-6 py-4 text-left font-bold text-charcoal/70 uppercase tracking-widest text-[10px]">Price Paid (₹)</th>
                    <th className="px-6 py-4 text-left font-bold text-charcoal/70 uppercase tracking-widest text-[10px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 bg-white">
                  {subscriptions
                    .filter(sub => {
                      if (user?.role === 'ADMIN') return true;
                      const m = members.find(m => m.id === sub.memberId);
                      // The mockDb saves 'name' and 'email' but explicitly excludes 'username' in members.
                      // Compare by name or email. Or just match by the username prop we just started injecting!
                      return m && (m.username === user?.username || m.name === user?.name);
                    })
                    .map((sub) => {
                      const memberObj = members.find(m => m.id === sub.memberId);
                      const planObj = plans.find(p => p.id === sub.planId);
                      return (
                        <tr key={sub.id} className="hover:bg-cream-50">
                          <td className="px-6 py-4 whitespace-nowrap font-bold text-bronze-600 tracking-wider">
                            {sub.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-bold text-forest-800">
                              {memberObj ? memberObj.name : `ID: ${sub.memberId}`}
                            </div>
                            <div className="text-[10px] text-charcoal/60 mt-0.5">
                              {memberObj ? memberObj.email : 'Profile deleted'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-bold text-charcoal/80">
                            {planObj ? planObj.name : 'Unknown Plan'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold text-charcoal/70">
                            {sub.startDate} <span className="text-bronze-500 mx-1">→</span> {sub.endDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-black text-forest-700 text-sm">
                            ₹{typeof sub.paidAmount === 'number' ? sub.paidAmount.toLocaleString('en-IN') : sub.paidAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full font-bold border ${sub.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                              }`}>
                              {sub.status === 'Active' ? (
                                <CheckCircle className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                              ) : (
                                <AlertCircle className="h-3.5 w-3.5 mr-1 text-red-600" />
                              )}
                              {sub.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      )}

      {/* Plan Form Modal (Create / Edit) */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-cream-300 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200 bg-[#FAF8F5]">
              <h3 className="text-base font-black text-forest-700">
                {editingPlan ? `Edit Tier: ${editingPlan.name}` : 'Create Plan Tier'}
              </h3>
              <button
                onClick={() => setShowPlanModal(false)}
                className="p-1.5 text-charcoal/50 hover:text-forest-700 hover:bg-cream-100 rounded-xl"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="p-6 space-y-4">
              <div>
                <label className="block text-charcoal/70 mb-1.5 font-bold uppercase tracking-wider">Plan Tier Name</label>
                <input
                  type="text"
                  required
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="e.g. Gold All-Access"
                  className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 px-3.5 text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-charcoal/70 mb-1.5 font-bold uppercase tracking-wider">Price (₹ INR)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3.5 top-3.5 h-4 w-4 text-bronze-500" />
                    <input
                      type="number"
                      step="1"
                      required
                      value={planPrice}
                      onChange={(e) => setPlanPrice(e.target.value)}
                      placeholder="1499"
                      className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 pl-9 pr-3 text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal/70 mb-1.5 font-bold uppercase tracking-wider">Duration (Months)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={planDuration}
                    onChange={(e) => setPlanDuration(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 px-3.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-charcoal/70 mb-1.5 font-bold uppercase tracking-wider">Access Inclusions</label>
                <textarea
                  required
                  rows="3"
                  value={planDesc}
                  onChange={(e) => setPlanDesc(e.target.value)}
                  placeholder="Summarize locations and facility areas included in this tier..."
                  className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 px-3.5 text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white resize-none"
                />
              </div>

              <div className="pt-4 border-t border-cream-200 flex justify-end gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-5 py-2.5 border border-cream-300 hover:bg-cream-100 text-charcoal/70 hover:text-forest-700 rounded-2xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-2xl font-bold transition-all shadow-md shadow-forest-900/10"
                >
                  Save Tier Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Renew / Assign Plan Modal */}
      {showRenewModal && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-cream-300 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200 bg-[#FAF8F5]">
              <h3 className="text-base font-black text-forest-700 flex items-center gap-1.5">
                <RefreshCw className="h-4 w-4 text-bronze-500" />
                Process Membership Renewal
              </h3>
              <button
                onClick={() => setShowRenewModal(false)}
                className="p-1.5 text-charcoal/50 hover:text-forest-700 hover:bg-cream-100 rounded-xl"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRenewSubmit} className="p-6 space-y-4">

              <div>
                <label className="block text-charcoal/70 mb-1.5 font-bold uppercase tracking-wider">Select Member Profile</label>
                {user?.role === 'MEMBER' ? (
                  <input
                    type="text"
                    readOnly
                    value={`${user.name} (${user.username})`}
                    className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 px-3.5 text-charcoal opacity-70 cursor-not-allowed"
                  />
                ) : (
                  <select
                    required
                    value={renewMemberId}
                    onChange={(e) => setRenewMemberId(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 px-3.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.id}) — Current: {m.status}
                      </option>
                    ))}
                    {members.length === 0 && (
                      <option value="">No member profiles found</option>
                    )}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-charcoal/70 mb-1.5 font-bold uppercase tracking-wider">Choose Membership Tier</label>
                <select
                  required
                  value={renewPlanId}
                  onChange={(e) => handleRenewPlanChange(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 px-3.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                >
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{typeof p.price === 'number' ? p.price.toLocaleString('en-IN') : p.price} for {p.durationMonths}mo)
                    </option>
                  ))}
                  {plans.length === 0 && (
                    <option value="">No plan templates found</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-charcoal/70 mb-1.5 font-bold uppercase tracking-wider">Duration Term (Months)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={renewDuration}
                  onChange={(e) => setRenewDuration(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 px-3.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                />
                <p className="text-[10px] text-charcoal/60 mt-1 pl-1">
                  Leave as plan default or modify terms for custom billing cycles.
                </p>
              </div>

              <div className="pt-4 border-t border-cream-200 flex justify-end gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => setShowRenewModal(false)}
                  className="px-5 py-2.5 border border-cream-300 hover:bg-cream-100 text-charcoal/70 hover:text-forest-700 rounded-2xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={members.length === 0 || plans.length === 0}
                  className="px-6 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-2xl font-bold transition-all shadow-md shadow-forest-900/10 disabled:opacity-50"
                >
                  Activate Membership (₹ Paid)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

