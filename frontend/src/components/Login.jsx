import React, { useState, useRef } from 'react';
import { api } from '../services/api';
import { 
  Dumbbell, 
  UserPlus, 
  LogIn, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  Shield, 
  Activity, 
  Users, 
  ArrowRight,
  ChevronRight,
  MapPin
} from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  // Intro / Splash Animation State: 'splash' | 'flying' | 'revealing' | 'done'
  const [introState, setIntroState] = useState('splash');
  const [flyingLogoStyle, setFlyingLogoStyle] = useState(null);
  const splashLogoRef = useRef(null);
  const headerLogoRef = useRef(null);

  // Mode: 'signin' or 'signup'
  const [authMode, setAuthMode] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);

  // Sign In Form state
  const [signInUsername, setSignInUsername] = useState('admin');
  const [signInPassword, setSignInPassword] = useState('admin123');

  // Sign Up Form state
  const [fullName, setFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('MEMBER');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Continue button click on splash screen
  const handleContinue = () => {
    if (splashLogoRef.current && headerLogoRef.current) {
      const startRect = splashLogoRef.current.getBoundingClientRect();
      const targetRect = headerLogoRef.current.getBoundingClientRect();

      // Step 1: Initialize flying logo at exact starting position
      setFlyingLogoStyle({
        position: 'fixed',
        top: `${startRect.top}px`,
        left: `${startRect.left}px`,
        width: `${startRect.width}px`,
        height: `${startRect.height}px`,
        zIndex: 100,
        transition: 'none',
        pointerEvents: 'none'
      });

      // Step 2: Set to flying state (text disappears, splash background stays opaque so page remains hidden)
      setIntroState('flying');

      // Step 3: Animate logo smoothly to top-left position
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlyingLogoStyle({
            position: 'fixed',
            top: `${targetRect.top}px`,
            left: `${targetRect.left}px`,
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`,
            zIndex: 100,
            transition: 'all 850ms cubic-bezier(0.22, 1, 0.36, 1)',
            pointerEvents: 'none'
          });
        });
      });

      // Step 4: ONLY after logo has completely finished moving (880ms), start revealing the page
      setTimeout(() => {
        setIntroState('revealing');
        setFlyingLogoStyle(null);
      }, 880);

      // Step 5: Mark animation fully done after page fade-in
      setTimeout(() => {
        setIntroState('done');
      }, 1450);
    } else {
      setIntroState('done');
    }
  };

  // Switch between Sign In and Sign Up tabs
  const switchMode = (mode) => {
    setAuthMode(mode);
    setError('');
    setSuccessMsg('');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const data = await api.auth.login(signInUsername, signInPassword);
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message || 'Sign in failed. Please verify your username and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (signUpPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (signUpPassword.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: fullName,
        email: signUpEmail,
        phone: signUpPhone,
        username: signUpUsername,
        password: signUpPassword,
        role: role
      };

      await api.auth.register(payload);

      // Capture registered credentials and prefill Sign In form
      const registeredUsername = signUpUsername;
      const registeredPassword = signUpPassword;
      setSignInUsername(registeredUsername);
      setSignInPassword(registeredPassword);

      // Clear sign-up form fields
      setFullName('');
      setSignUpEmail('');
      setSignUpPhone('');
      setSignUpUsername('');
      setSignUpPassword('');
      setConfirmPassword('');

      // Immediately transition to Sign In screen
      setAuthMode('signin');
      setSuccessMsg('Account registered successfully! Please sign in with your credentials to enter.');
    } catch (err) {
      setError(err.message || 'Registration failed. Username or email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 0. INTRO / SPLASH SCREEN OVERLAY */}
      {introState !== 'done' && (
        <div 
          className={`fixed inset-0 z-40 bg-[#F5F2EB] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden transition-opacity duration-600 ${
            introState === 'revealing' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Subtle warm ambient background glow accents */}
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-bronze-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-forest-200/30 rounded-full blur-3xl pointer-events-none" />

          {/* Centered Brand Content */}
          <div className="relative z-10 flex flex-col items-center max-w-lg w-full">
            
            {/* Center Logo Reference Box */}
            <div 
              ref={splashLogoRef}
              className={`h-40 w-40 sm:h-52 sm:w-52 p-3.5 bg-white rounded-3xl shadow-2xl border-4 border-amber-400/80 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                introState !== 'splash' ? 'opacity-0' : 'opacity-100 hover:scale-105'
              }`}
            >
              <img src="/logo.png" alt="AVS FITZONE Logo" className="h-full w-full object-contain" />
            </div>

            {/* Brand Title & Taglines (Fades out when Continue is clicked) */}
            <div className={`transition-all duration-300 mt-7 ${introState !== 'splash' ? 'opacity-0 -translate-y-4 scale-95 pointer-events-none' : 'opacity-100 translate-y-0 scale-100'}`}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-forest-700 leading-tight">
                AVS FITZONE
              </h1>
              
              <div className="flex items-center justify-center gap-2.5 mt-3">
                <span className="h-1.5 w-1.5 rounded-full bg-bronze-500" />
                <span className="text-xs sm:text-sm uppercase font-extrabold tracking-[0.25em] text-bronze-600">
                  FITNESS • HEALTH • LIFESTYLE
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-bronze-500" />
              </div>

              <p className="text-xs sm:text-sm text-charcoal/60 font-bold tracking-widest uppercase mt-2">
                Multi-Center Health Clubs
              </p>
            </div>

            {/* Prominent Bright Black Continue Button */}
            <div className={`mt-9 transition-all duration-300 ${introState !== 'splash' ? 'opacity-0 -translate-y-4 scale-95 pointer-events-none' : 'opacity-100 translate-y-0 scale-100'}`}>
              <button
                type="button"
                onClick={handleContinue}
                className="group relative px-10 py-4 bg-black hover:bg-neutral-900 active:scale-95 text-white font-black text-base tracking-wider uppercase rounded-full border-2 border-neutral-700/80 hover:border-neutral-400 shadow-2xl shadow-black/50 hover:shadow-black/70 flex items-center gap-3.5 transition-all duration-300 cursor-pointer overflow-hidden ring-4 ring-black/10"
              >
                {/* Glossy light reflection highlight on top half */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-t-full" />
                
                <span className="relative z-10 font-black tracking-wide text-white drop-shadow-sm">Continue</span>
                
                <div className="relative z-10 h-7 w-7 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 group-hover:translate-x-1 transition-all duration-300">
                  <ArrowRight className="h-4 w-4 text-white" />
                </div>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FLYING LOGO ELEMENT DURING TRANSITION */}
      {flyingLogoStyle && (
        <div
          style={flyingLogoStyle}
          className="p-1.5 bg-white rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center justify-center pointer-events-none"
        >
          <img src="/logo.png" alt="AVS FITZONE" className="h-full w-full object-contain" />
        </div>
      )}

      {/* MAIN WEBSITE PORTAL LAYOUT (Revealed only after logo completely arrives) */}
      <div 
        className={`min-h-screen bg-[#F5F2EB] text-[#1C2A24] flex flex-col justify-between selection:bg-bronze-200 selection:text-forest-900 transition-all duration-700 ${
          introState === 'splash' || introState === 'flying'
            ? 'opacity-0 pointer-events-none' 
            : 'opacity-100'
        }`}
      >
        
        {/* 1. TOP NAVIGATION HEADER */}
        <header className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
          {/* Brand Logo & Name (Target Slot for flying animation) */}
          <div className="flex items-center gap-4">
            <div 
              ref={headerLogoRef}
              className={`h-16 w-16 sm:h-20 sm:w-20 p-1.5 bg-white rounded-2xl shadow-xl border-2 border-amber-400 flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform duration-200 ${
                introState === 'flying' ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <img src="/logo.png" alt="AVS FITZONE Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-forest-700 block leading-tight">AVS FITZONE</span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-bronze-500 block">Multi-Center Health Clubs</span>
            </div>
          </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-bold text-charcoal/80">
          <a href="#home" className="text-forest-700 font-bold hover:text-forest-900 transition-colors">Home</a>
          <a href="#membership" className="hover:text-forest-700 transition-colors">Membership</a>
          <a href="#facilities" className="hover:text-forest-700 transition-colors">Facilities</a>
          <a href="#about" className="hover:text-forest-700 transition-colors">About</a>
        </nav>

        {/* Right Top Action Pill */}
        <div className="flex items-center gap-3">
          {authMode === 'signin' ? (
            <button
              onClick={() => switchMode('signup')}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full bg-[#1E3A2F] text-white hover:bg-[#142820] transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              Sign Up
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={() => switchMode('signin')}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full bg-[#1E3A2F] text-white hover:bg-[#142820] transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              Sign In
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* 2. MAIN TWO-COLUMN HERO SECTION */}
      <main className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* LEFT COLUMN: Typography & Auth Form */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Sub-tagline */}
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-bronze-500" />
            <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-bronze-600">
              FITNESS • HEALTH • LIFESTYLE
            </span>
          </div>

          {/* Bold Reference Headline: Stronger Together. */}
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl lg:text-[4rem] font-black text-forest-700 tracking-tight leading-[1.08]">
              Stronger <span className="text-bronze-500 font-serif italic font-medium">Together.</span>
            </h1>
            <p className="text-base text-charcoal/70 max-w-lg leading-relaxed pt-1">
              Welcome to the AVS FITZONE Multi-Center Portal. Access elite fitness equipment, manage Indian Rupee tier subscriptions, and experience contactless turnstile entry.
            </p>
          </div>

          {/* AUTH FORM CARD */}
          <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-cream-300 shadow-xl shadow-forest-900/5 space-y-5">
            
            {/* Tab Switcher */}
            <div className="grid grid-cols-2 p-1.5 bg-[#ECE6DA] rounded-2xl border border-[#DDD5C4]">
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-[#1E3A2F] text-white shadow-md font-extrabold'
                    : 'text-[#1C2A24] font-bold hover:text-[#1E3A2F] hover:bg-white/60'
                }`}
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-[#1E3A2F] text-white shadow-md font-extrabold'
                    : 'text-[#1C2A24] font-bold hover:text-[#1E3A2F] hover:bg-white/60'
                }`}
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </button>
            </div>

            {/* Alert Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-3 text-xs font-medium">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl p-3 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                {successMsg}
              </div>
            )}

            {/* SIGN IN FORM */}
            {authMode === 'signin' ? (
              <form className="space-y-4" onSubmit={handleSignIn}>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1.5">
                    Username or Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-bronze-500" />
                    <input
                      type="text"
                      required
                      value={signInUsername}
                      onChange={(e) => setSignInUsername(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 pl-10 pr-4 text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white transition-all"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-bronze-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-3 pl-10 pr-11 text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-charcoal/50 hover:text-forest-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-charcoal/70 font-medium">
                    <input type="checkbox" defaultChecked className="rounded border-cream-300 text-forest-700 focus:ring-forest-600" />
                    Remember login
                  </label>
                  <button type="button" onClick={() => switchMode('signup')} className="text-bronze-600 hover:text-forest-700 font-bold">
                    Need new account?
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl shadow-xl text-sm font-black text-white bg-[#1E3A2F] hover:bg-[#142820] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#1E3A2F] disabled:opacity-50 transition-all cursor-pointer border border-[#2D5242]"
                  >
                    <LogIn className="h-4 w-4 text-bronze-300" />
                    <span>{loading ? 'Authenticating...' : 'Sign In to FitZone'}</span>
                  </button>
                </div>

                {/* Quick Hint for demo */}
                <div className="p-3 bg-cream-50 rounded-2xl border border-cream-200 text-[11px] text-charcoal/70 flex items-center justify-between">
                  <span>Demo Admin: <strong>admin</strong> / <strong>admin123</strong></span>
                  <span className="text-bronze-600 font-bold">Admin Portal</span>
                </div>
              </form>
            ) : (
              /* SIGN UP FORM */
              <form className="space-y-3.5" onSubmit={handleSignUp}>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-bronze-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-bronze-500" />
                      <input
                        type="email"
                        required
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                        placeholder="name@domain.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 h-4 w-4 text-bronze-500" />
                      <input
                        type="tel"
                        required
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      value={signUpUsername}
                      onChange={(e) => setSignUpUsername(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-2.5 px-3.5 text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                      placeholder="e.g. rahul_fit"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                      Account Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-2.5 px-3.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-600"
                    >
                      <option value="MEMBER">Club Member</option>
                      <option value="ADMIN">Club Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-bronze-500" />
                      <input
                        type="password"
                        required
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-bronze-500" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-cream-300 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl shadow-xl text-sm font-black text-white bg-[#1E3A2F] hover:bg-[#142820] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#1E3A2F] disabled:opacity-50 transition-all cursor-pointer border border-[#2D5242]"
                  >
                    <UserPlus className="h-4 w-4 text-bronze-300" />
                    <span>{loading ? 'Creating Profile...' : 'Complete Sign Up'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Social Proof / Stats */}
          <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-charcoal/60">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500 text-sm">★★★★★</span>
              <span className="text-forest-700 font-bold">4.9/5</span> Rating
            </div>
            <div className="h-3 w-px bg-cream-300" />
            <div>
              <strong className="text-forest-700">4 Health Centers</strong> in Network
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Visual Showcase Card (Matching Reference Image) */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg h-[560px] lg:h-[620px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/80 group">
            
            {/* Background Image: Fitness Athlete / Mountain Runner */}
            <img 
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80" 
              alt="AVS FITZONE Athlete Training" 
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />

            {/* Gradient Overlays for readability and warm mood */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-forest-950/40 via-transparent to-transparent" />

            {/* Top Left Floating Badge: Achieve your goals */}
            <div className="absolute top-6 left-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-cream-200 shadow-lg text-xs font-bold text-forest-800">
                <Sparkles className="h-4 w-4 text-bronze-500 animate-spin" />
                <span>Achieve your goals</span>
              </div>
            </div>

            {/* Right Side Step Milestones (01 Train, 02 Build, 03 Be Better) */}
            <div className="absolute top-24 right-6 flex flex-col gap-2.5">
              <div className="px-3.5 py-1.5 rounded-xl bg-forest-950/70 backdrop-blur-md border border-forest-600/40 text-[11px] font-bold text-cream-100 flex items-center gap-2">
                <span className="text-bronze-400 font-mono">01</span> Train
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-forest-950/70 backdrop-blur-md border border-forest-600/40 text-[11px] font-bold text-cream-100 flex items-center gap-2">
                <span className="text-bronze-400 font-mono">02</span> Build
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-forest-950/70 backdrop-blur-md border border-forest-600/40 text-[11px] font-bold text-cream-100 flex items-center gap-2">
                <span className="text-bronze-400 font-mono">03</span> Be Better
              </div>
            </div>

            {/* Center / Bottom Title: AVS FITZONE */}
            <div className="absolute bottom-8 left-8 right-8 space-y-4 text-white">
              
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 p-1.5 bg-white rounded-xl shadow-lg flex items-center justify-center flex-shrink-0">
                    <img src="/logo.png" alt="AVS FITZONE" className="h-full w-full object-contain" />
                  </div>
                  <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-bronze-300">
                    GYM • TRAINING • WELLNESS
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  AVS FITZONE
                </h3>
              </div>

              {/* Bottom Member Counter Badge */}
              <div className="flex items-center justify-between pt-2 border-t border-white/20">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-2">
                    <div className="h-7 w-7 rounded-full bg-bronze-500 border-2 border-forest-900 flex items-center justify-center text-[10px] font-bold">AV</div>
                    <div className="h-7 w-7 rounded-full bg-forest-600 border-2 border-forest-900 flex items-center justify-center text-[10px] font-bold">RS</div>
                    <div className="h-7 w-7 rounded-full bg-cream-200 text-forest-900 border-2 border-forest-900 flex items-center justify-center text-[10px] font-bold">+</div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block leading-tight">10,000+ Members</span>
                    <span className="text-[10px] text-cream-200/80">Active across 4 centers</span>
                  </div>
                </div>

                <div className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-colors cursor-pointer">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

            </div>

          </div>
        </div>

      </main>

      {/* 3. FOOTER */}
      <footer className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-5 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal/60 gap-3">
        <p>© 2026 AVS FITZONE Health Clubs. All rights reserved.</p>
        <div className="flex items-center gap-4 font-semibold text-bronze-600">
          <span>Multi-Center Access</span>
          <span>•</span>
          <span>₹ INR Pricing</span>
          <span>•</span>
          <span>API Gateway Microservices</span>
        </div>
      </footer>

    </div>
    </>
  );
}

