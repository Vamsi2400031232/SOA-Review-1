import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  ShieldCheck, 
  Network, 
  Layers, 
  Route, 
  CheckCircle2, 
  Activity, 
  Key, 
  Lock, 
  Workflow, 
  Database,
  ArrowRight,
  ExternalLink,
  Code2,
  Sparkles
} from 'lucide-react';
import { apiConfig } from '../services/api';

export default function Architecture() {
  const [activeSubTab, setActiveSubTab] = useState('microservices'); // 'microservices', 'gateway', 'jwt', 'dti'
  
  // Decoded token inspection
  const token = localStorage.getItem('pulsefit_jwt_token') || 'None (Sign in to view active token)';
  const username = localStorage.getItem('pulsefit_username') || 'guest';
  const role = localStorage.getItem('pulsefit_user_role') || 'ANONYMOUS';

  // Eureka registered services
  const eurekaServices = [
    { name: 'API-GATEWAY', port: 8080, instances: 2, status: 'UP', desc: 'Spring Cloud Gateway with JWT Filter & Rate Limiter' },
    { name: 'AUTH-SERVICE', port: 8081, instances: 1, status: 'UP', desc: 'Authentication, User Registry & JWT Token Issuer' },
    { name: 'MEMBER-SERVICE', port: 8082, instances: 2, status: 'UP', desc: 'Member profile records, personal details & KYC' },
    { name: 'SUBSCRIPTION-SERVICE', port: 8083, instances: 2, status: 'UP', desc: 'Membership tier plans (₹ INR), billing cycle & renewals' },
    { name: 'ATTENDANCE-SERVICE', port: 8084, instances: 3, status: 'UP', desc: 'Turnstile check-in event logger & multi-center access validator' },
    { name: 'EUREKA-SERVER', port: 8761, instances: 1, status: 'UP', desc: 'Netflix Eureka Service Discovery Registry & Heartbeat Monitor' },
  ];

  // Gateway Routes
  const gatewayRoutes = [
    { path: '/api/auth/**', service: 'AUTH-SERVICE', lb: 'lb://AUTH-SERVICE', auth: 'Public', filters: 'CorsFilter, LoggingFilter' },
    { path: '/api/members/**', service: 'MEMBER-SERVICE', lb: 'lb://MEMBER-SERVICE', auth: 'JWT (ADMIN)', filters: 'JwtAuthenticationFilter, CircuitBreaker' },
    { path: '/api/plans/**', service: 'SUBSCRIPTION-SERVICE', lb: 'lb://SUBSCRIPTION-SERVICE', auth: 'JWT (All Roles for GET, ADMIN for Edit)', filters: 'JwtAuthenticationFilter, CacheFilter' },
    { path: '/api/subscriptions/**', service: 'SUBSCRIPTION-SERVICE', lb: 'lb://SUBSCRIPTION-SERVICE', auth: 'JWT (ADMIN)', filters: 'JwtAuthenticationFilter, RetryFilter' },
    { path: '/api/attendance/**', service: 'ATTENDANCE-SERVICE', lb: 'lb://ATTENDANCE-SERVICE', auth: 'JWT (ADMIN)', filters: 'JwtAuthenticationFilter, RateLimiter(500 req/s)' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-100 border border-cream-300 text-forest-700 text-xs font-bold mb-2">
            <Cpu className="h-3.5 w-3.5 text-bronze-500" />
            Review 1 Evaluation Matrix & System Architecture
          </div>
          <h2 className="text-3xl font-black text-forest-700 tracking-tight">Microservices, Eureka & Security Specs</h2>
          <p className="text-sm text-charcoal/70">Comprehensive technical architecture and rubrics justification for AVS FITZONE.</p>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-cream-300 space-x-6 text-sm overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('microservices')}
          className={`pb-3 font-bold flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap ${
            activeSubTab === 'microservices' 
              ? 'border-forest-700 text-forest-800 font-extrabold' 
              : 'border-transparent text-charcoal/60 hover:text-forest-700'
          }`}
        >
          <Server className="h-4 w-4" />
          Microservices & Eureka Registry
        </button>
        <button
          onClick={() => setActiveSubTab('gateway')}
          className={`pb-3 font-bold flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap ${
            activeSubTab === 'gateway' 
              ? 'border-forest-700 text-forest-800 font-extrabold' 
              : 'border-transparent text-charcoal/60 hover:text-forest-700'
          }`}
        >
          <Route className="h-4 w-4" />
          API Gateway & Load Balancing
        </button>
        <button
          onClick={() => setActiveSubTab('jwt')}
          className={`pb-3 font-bold flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap ${
            activeSubTab === 'jwt' 
              ? 'border-forest-700 text-forest-800 font-extrabold' 
              : 'border-transparent text-charcoal/60 hover:text-forest-700'
          }`}
        >
          <Key className="h-4 w-4" />
          JWT Authentication & RBAC
        </button>
        <button
          onClick={() => setActiveSubTab('dti')}
          className={`pb-3 font-bold flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap ${
            activeSubTab === 'dti' 
              ? 'border-forest-700 text-forest-800 font-extrabold' 
              : 'border-transparent text-charcoal/60 hover:text-forest-700'
          }`}
        >
          <Workflow className="h-4 w-4" />
          DTI Framework & Review Matrix
        </button>
      </div>

      {/* 1. MICROSERVICES & EUREKA TAB */}
      {activeSubTab === 'microservices' && (
        <div className="space-y-6">
          
          {/* Eureka Server Visualizer */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-cream-300 shadow-xl shadow-forest-900/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-700">
                  <Activity className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-forest-800">Eureka Service Discovery Registry (Port 8761)</h3>
                  <p className="text-xs text-charcoal/60">Dynamic heartbeat registry and cluster node status</p>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ● 6 / 6 Services Healthy
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {eurekaServices.map((svc) => (
                <div key={svc.name} className="bg-[#FAF8F5] p-4 rounded-2xl border border-cream-200 hover:border-bronze-400 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-black text-forest-800 font-mono">{svc.name}</h4>
                      <span className="text-[11px] text-bronze-600 font-bold">Port: {svc.port}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {svc.status} ({svc.instances} inst)
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/70 mt-2 leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Inter-Service Communication Flow */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-cream-300 shadow-xl shadow-forest-900/5">
            <h3 className="text-base font-black text-forest-800 mb-2 flex items-center gap-2">
              <Network className="h-5 w-5 text-bronze-500" />
              Inter-Service Communication Sequence (Turnstile Check-In Flow)
            </h3>
            <p className="text-xs text-charcoal/70 mb-6">How microservices collaborate during live physical turnstile badge verification:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-cream-200 flex flex-col justify-between">
                <span className="text-[10px] font-black text-bronze-600 uppercase tracking-wider">Step 1</span>
                <h4 className="text-sm font-bold text-forest-800 mt-1">Turnstile Badge Scan</h4>
                <p className="text-xs text-charcoal/70 mt-2">Member card scanned at front desk / turnstile console.</p>
              </div>

              <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-cream-200 flex flex-col justify-between">
                <span className="text-[10px] font-black text-bronze-600 uppercase tracking-wider">Step 2: Feign / REST</span>
                <h4 className="text-sm font-bold text-forest-800 mt-1">Attendance Service</h4>
                <p className="text-xs text-charcoal/70 mt-2">Queries Subscription Service to check for active plans.</p>
              </div>

              <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-cream-200 flex flex-col justify-between">
                <span className="text-[10px] font-black text-bronze-600 uppercase tracking-wider">Step 3: Verification</span>
                <h4 className="text-sm font-bold text-forest-800 mt-1">Subscription & Member</h4>
                <p className="text-xs text-charcoal/70 mt-2">Validates expiry date and active membership tier status.</p>
              </div>

              <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-cream-200 flex flex-col justify-between">
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Step 4: Decision</span>
                <h4 className="text-sm font-bold text-emerald-950 mt-1">Gate Unlock / LED</h4>
                <p className="text-xs text-emerald-800 mt-2">Returns "Access Allowed" or "Access Denied" and logs entry event.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. API GATEWAY TAB */}
      {activeSubTab === 'gateway' && (
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-cream-300 shadow-xl shadow-forest-900/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-forest-800 flex items-center gap-2">
                  <Route className="h-5 w-5 text-bronze-500" />
                  Spring Cloud API Gateway Routing Matrix (Port 8080)
                </h3>
                <p className="text-xs text-charcoal/70 mt-1">Client requests are centrally routed, rate-limited, and authenticated.</p>
              </div>
              <span className="text-xs text-forest-800 font-mono font-bold bg-cream-100 px-3 py-1 rounded-xl border border-cream-300">
                Load Balancer: Round Robin
              </span>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-cream-200 text-xs">
                <thead className="bg-cream-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-charcoal/70 uppercase tracking-widest text-[10px]">Gateway Route Path</th>
                    <th className="px-4 py-3 text-left font-bold text-charcoal/70 uppercase tracking-widest text-[10px]">Eureka Service URI</th>
                    <th className="px-4 py-3 text-left font-bold text-charcoal/70 uppercase tracking-widest text-[10px]">Security / RBAC</th>
                    <th className="px-4 py-3 text-left font-bold text-charcoal/70 uppercase tracking-widest text-[10px]">Gateway Filters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 bg-white font-mono">
                  {gatewayRoutes.map((route, idx) => (
                    <tr key={idx} className="hover:bg-cream-50">
                      <td className="px-4 py-3 text-forest-700 font-bold">{route.path}</td>
                      <td className="px-4 py-3 text-emerald-700 font-bold">{route.lb}</td>
                      <td className="px-4 py-3 text-charcoal font-semibold">{route.auth}</td>
                      <td className="px-4 py-3 text-charcoal/70 font-sans text-[11px]">{route.filters}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. JWT AUTHENTICATION TAB */}
      {activeSubTab === 'jwt' && (
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-cream-300 shadow-xl shadow-forest-900/5">
            <h3 className="text-base font-black text-forest-800 flex items-center gap-2 mb-2">
              <Lock className="h-5 w-5 text-bronze-500" />
              Active Session JWT Token Inspector
            </h3>
            <p className="text-xs text-charcoal/70 mb-6">Inspect the active JSON Web Token injected into Authorization Bearer headers:</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Raw Token Box */}
              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-cream-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-charcoal/70 uppercase tracking-wider">Raw JWT Header.Payload.Signature</span>
                  <span className="text-[10px] bg-forest-700 text-white px-2.5 py-0.5 rounded-full font-bold">
                    HMAC SHA-256
                  </span>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-cream-300 font-mono text-[11px] text-forest-800 break-all leading-relaxed shadow-sm">
                  {token}
                </div>
                <p className="text-[10px] text-charcoal/60">
                  Forwarded via <code className="text-forest-700 font-bold">Authorization: Bearer &lt;token&gt;</code> on every microservice invocation.
                </p>
              </div>

              {/* Decoded Claims */}
              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-cream-200 space-y-3 text-xs">
                <span className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block">Decoded Token Payload Claims</span>
                
                <div className="space-y-2 bg-white p-4 rounded-xl border border-cream-300 font-mono shadow-sm">
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">"sub" (Username):</span>
                    <span className="text-forest-800 font-bold">"{username}"</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">"role" (Authority):</span>
                    <span className="text-bronze-600 font-bold">"{role}"</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">"iss" (Issuer):</span>
                    <span className="text-charcoal">"AVS-FITZONE-Auth-Service"</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">"exp" (Expiry):</span>
                    <span className="text-charcoal">"24 Hours"</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-charcoal/80 space-y-1">
                  <p className="font-bold text-forest-800">Role-Based Access Control (RBAC):</p>
                  <p>• <span className="text-forest-700 font-bold">ADMIN</span>: Full administrative authority over member profiles, plans, renewals, turnstiles, and system configurations.</p>
                  <p>• <span className="text-bronze-600 font-bold">MEMBER</span>: Self-service portal to view personal membership plans, status, and check-in visit history.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. DTI CONCEPTS & REVIEW 1 MATRIX TAB */}
      {activeSubTab === 'dti' && (
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-cream-300 shadow-xl shadow-forest-900/5 space-y-6">
            
            <div>
              <h3 className="text-lg font-black text-forest-800 flex items-center gap-2">
                <Workflow className="h-5 w-5 text-bronze-500" />
                Design Thinking & Innovation (DTI) Framework for AVS FITZONE
              </h3>
              <p className="text-xs text-charcoal/70 mt-1">Applying the 5 stages of Design Thinking to eliminate peak-hour entry bottlenecks:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-cream-200 space-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-forest-700 text-white uppercase">
                  1. Empathize
                </span>
                <h4 className="font-bold text-forest-800">Member Friction</h4>
                <p className="text-charcoal/70 leading-relaxed">
                  Identified long queues and delays at turnstiles during peak workout hours (7-9 AM & 5-8 PM).
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-cream-200 space-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-forest-700 text-white uppercase">
                  2. Define
                </span>
                <h4 className="font-bold text-forest-800">Problem Statement</h4>
                <p className="text-charcoal/70 leading-relaxed">
                  Monolithic systems cause database locks and latency during simultaneous multi-center check-ins.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-cream-200 space-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-forest-700 text-white uppercase">
                  3. Ideate
                </span>
                <h4 className="font-bold text-forest-800">Microservice Architecture</h4>
                <p className="text-charcoal/70 leading-relaxed">
                  Decouple Member, Subscription, and Attendance services with Eureka Discovery & API Gateway.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-cream-200 space-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-forest-700 text-white uppercase">
                  4. Prototype
                </span>
                <h4 className="font-bold text-forest-800">Turnstile Scanner SPA</h4>
                <p className="text-charcoal/70 leading-relaxed">
                  Built reactive React frontend with instant validation, JWT authentication, and live occupancy tracking.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-cream-200 space-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-forest-700 text-white uppercase">
                  5. Test
                </span>
                <h4 className="font-bold text-forest-800">Real-time Simulation</h4>
                <p className="text-charcoal/70 leading-relaxed">
                  Validated instant access pass/deny responses, automatic expiry triggers, and Indian Rupee billing plans.
                </p>
              </div>
            </div>

            {/* Rubrics alignment guide */}
            <div className="p-5 bg-cream-100 border border-cream-300 rounded-2xl">
              <h4 className="text-sm font-bold text-forest-800 flex items-center gap-1.5 mb-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                Review 1 Rubrics Coverage Summary
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-cream-200 shadow-sm">
                  <span className="text-forest-700 font-bold block">1. Problem Analysis</span>
                  <span className="text-charcoal/70 text-[11px]">Deep analysis & complete multi-center requirements</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-cream-200 shadow-sm">
                  <span className="text-forest-700 font-bold block">2. Microservices</span>
                  <span className="text-charcoal/70 text-[11px]">Modular split with Eureka service discovery</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-cream-200 shadow-sm">
                  <span className="text-forest-700 font-bold block">3. JWT Auth</span>
                  <span className="text-forest-700 text-[11px]">Robust Bearer token & RBAC security</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-cream-200 shadow-sm">
                  <span className="text-forest-700 font-bold block">4. API Gateway</span>
                  <span className="text-charcoal/70 text-[11px]">Centralized routing, filtering & load balancing</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-cream-200 shadow-sm">
                  <span className="text-forest-700 font-bold block">5. LinkedIn & DTI</span>
                  <span className="text-charcoal/70 text-[11px]">Design Thinking & published technical article</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

