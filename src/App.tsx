import React, { useState, useEffect } from "react";
import { MembershipTier, SystemUser, TierId } from "./types";
import { MENTOR_PROFILE } from "./data";
import PricingMatrix from "./components/PricingMatrix";
import CheckoutModal from "./components/CheckoutModal";
import LeadMagnetSection from "./components/LeadMagnetSection";
import ResourceVault from "./components/ResourceVault";
import ForumHub from "./components/ForumHub";
import Scheduler from "./components/Scheduler";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Cpu, 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  User, 
  ChevronRight, 
  Zap, 
  RotateCcw, 
  Award, 
  Trophy, 
  ArrowUpRight,
  Monitor
} from "lucide-react";

export default function App() {
  // Configured default user (using context email if provided)
  const [user, setUser] = useState<SystemUser>({
    name: "Hlanhla Phiwinhlanhla",
    email: "xphiwinhlanhla@gmail.com",
    tier: "none",
    isSubscribed: false
  });

  const [activeTab, setActiveTab] = useState<"dashboard" | "vault" | "community" | "booking">("dashboard");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCheckoutTier, setSelectedCheckoutTier] = useState<MembershipTier | null>(null);
  const [isCheckoutAnnual, setIsCheckoutAnnual] = useState(false);
  
  // Quick profile settings editor state
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [tempEmail, setTempEmail] = useState(user.email);

  // Synchronize dynamic profile change
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ ...user, name: tempName, email: tempEmail });
    setShowProfileEditor(false);
  };

  // Triggers Stripe checkout modal
  const handleOpenCheckout = (tier: MembershipTier, isAnnual: boolean) => {
    setSelectedCheckoutTier(tier);
    setIsCheckoutAnnual(isAnnual);
    setIsCheckoutOpen(true);
  };

  // Payment Authorized State Update
  const handlePaymentSuccess = (tierId: TierId) => {
    setUser({
      ...user,
      tier: tierId,
      isSubscribed: true
    });
    // Smooth navigation to unlock the Member Portal Dashboard
    setActiveTab("dashboard");
    alert(`🎉 Success! Your access has been upgraded to: ${tierId.toUpperCase()}. Welcome to LaunchPad.`);
  };

  // Cheat code quick switcher helper for testing
  const handleCheatTierChange = (tierId: TierId) => {
    setUser({
      ...user,
      tier: tierId,
      isSubscribed: tierId !== "none"
    });
  };

  return (
    <div id="app-bento-root" className="min-h-screen bg-[#0A0A0A] text-[#F5F5F7] font-sans selection:bg-indigo-500 selection:text-white pb-24 relative overflow-hidden">
      
      {/* Background glow graphics mimicking Elevate Mentor custom theme */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[5%] w-[350px] h-[350px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Top Interactive Simulator Toolbar (Developer Showcase Utility) */}
      <div id="sandbox-bar" className="bg-[#111112] border-b border-white/10 text-[#F5F5F7] py-3.5 px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-3 relative z-40">
        <div className="flex items-center gap-2.5">
          <Monitor className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-[11px] font-mono tracking-wider font-semibold text-gray-300">
            STRIPE & PAYWALL BENTO SANDBOX
          </span>
          <span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[9px] px-1.5 py-0.5 rounded-md font-mono">
            Active Testing
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400 font-medium font-sans">Quick Tier Swap:</span>
          {(["none", "basic", "scale", "masterclass"] as TierId[]).map((tId) => (
            <button
              key={tId}
              onClick={() => handleCheatTierChange(tId)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold font-mono uppercase tracking-tight transition-all cursor-pointer ${
                user.tier === tId
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tId === "none" ? "Guest 🔓" : tId}
            </button>
          ))}
          <button
            onClick={() => {
              setUser({ name: "Hlanhla Phiwinhlanhla", email: "xphiwinhlanhla@gmail.com", tier: "none", isSubscribed: false });
              setActiveTab("dashboard");
            }}
            title="Reset platform simulation"
            className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Premium Platform Header */}
      <nav id="header-bar" className="sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-md z-30 border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo Group */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-600/30">
                E
              </div>
              <div>
                <span className="font-display font-light text-2xl tracking-tighter italic uppercase text-white">
                  LAUNCHPAD<span className="text-indigo-400 font-bold">AI</span>
                </span>
                <span className="block text-[8px] text-gray-500 uppercase tracking-[0.25em] font-mono leading-none">AI STARTUP ACADEMY</span>
              </div>
            </div>

            {/* Navigation links styled as bento tabs */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#portal-tabs-section" className="text-gray-400 hover:text-white text-xs uppercase tracking-widest font-mono font-medium transition-colors">Portal</a>
              <a href="#pricing-matrix" className="text-gray-400 hover:text-white text-xs uppercase tracking-widest font-mono font-medium transition-colors">Membership Matrix</a>
              <span className="text-gray-600 font-mono text-xs">|</span>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/15">
                ● LIVE RUNTIME
              </span>
            </div>

            {/* User Profile bar at right side */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-xs font-bold text-[#F5F5F7]">{user.name}</span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                </div>
                <span className="block text-[9px] text-gray-400 uppercase tracking-wider font-mono">
                  {user.tier === 'none' ? 'GUEST PASS' : `${user.tier.toUpperCase()} TIER`}
                </span>
              </div>

              <button
                id="profile-trigger"
                onClick={() => {
                  setTempName(user.name);
                  setTempEmail(user.email);
                  setShowProfileEditor(!showProfileEditor);
                }}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-indigo-400 shrink-0" />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Edit Profile Floating Dialog */}
      <AnimatePresence>
        {showProfileEditor && (
          <div id="profile-editor-modal" className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleUpdateProfile}
              className="w-full max-w-sm bg-[#111112] rounded-3xl p-8 shadow-2xl border border-white/10 space-y-5"
            >
              <div>
                <h4 className="text-lg font-bold text-white font-display">Modify Simulator Persona</h4>
                <p className="text-xs text-gray-400 mt-1">Simulate any custom member details to evaluate the paywall restrictions.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase mb-1 tracking-wider">My Simulated Name</label>
                  <input
                    type="text"
                    required
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase mb-1 tracking-wider">My Simulated Email</label>
                  <input
                    type="email"
                    required
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowProfileEditor(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white font-mono uppercase tracking-wider"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-mono rounded-xl cursor-pointer uppercase tracking-wider transition-all"
                >
                  Save Sync
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* Page Body Wrap */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-10">
        
        {/* HERO SECTION: Mentor Profile bio & credential checklist (Stylized like Bento Masterclass #12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-br from-gray-900 to-black border border-white/10 p-8 sm:p-10 rounded-[2rem] shadow-2xl mb-12 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 p-8">
            <span className="bg-indigo-600/20 text-indigo-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-600/30 font-mono">
              Lead Advisory active
            </span>
          </div>

          <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
          
          {/* Avatar stat board (Left 4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center text-center lg:border-r border-white/5 lg:pr-8">
            <div className="relative group/avatar">
              <img
                src={MENTOR_PROFILE.avatar}
                alt={MENTOR_PROFILE.name}
                className="w-32 h-32 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-xl group-hover/avatar:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1 px-2.5 py-0.5 rounded-md bg-indigo-600 text-white text-[9px] font-bold font-mono uppercase shadow-md tracking-wider">
                LEAD ADVISOR
              </span>
            </div>
            
            <h1 className="text-2xl font-display font-bold text-white tracking-tight mt-6">
              {MENTOR_PROFILE.name}
            </h1>
            <p className="text-xs text-indigo-400 font-mono font-bold tracking-widest mt-1 uppercase">
              {MENTOR_PROFILE.role}
            </p>

            <div className="grid grid-cols-3 gap-3 w-full border-t border-white/10 pt-6 mt-6">
              {MENTOR_PROFILE.stats.map((st, i) => (
                <div key={i} className="text-center">
                  <span className="block text-base font-bold text-white leading-none font-mono">{st.value}</span>
                  <span className="block text-[8px] text-gray-500 font-bold uppercase tracking-wider mt-1.5 font-mono">{st.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description biography & qualifications (Right 8 cols) */}
          <div className="lg:col-span-8 space-y-6 lg:pl-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 font-mono uppercase mb-3 tracking-wider">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                FOUNDER RECONSTRUCT FRAMEWORK
              </span>
              <h2 className="text-3.5xl font-display font-light tracking-tighter leading-tight text-white mb-4">
                Scaling Product Tech Stack, Deep DBs, and <span className="text-indigo-400 italic">API Architectures</span>
              </h2>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed font-sans font-normal">
              {MENTOR_PROFILE.bio}
            </p>

            {/* Bullet Proof credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-6 border-t border-white/5">
              {MENTOR_PROFILE.credentials.map((cred, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5 animate-pulse" />
                  <span className="font-mono text-gray-400 text-[11px] font-medium">{cred}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* FREE VALUE LEAD MAGNET PLACEMENT */}
        <LeadMagnetSection />

        {/* PORTAL NAVIGATION AND SYSTEM INTERACTIVE WORKSPACE */}
        <div id="portal-tabs-section" className="my-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-2xl font-display font-bold tracking-tight text-white">
                Subscribers Member Portal
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Your sandbox verified level is: <span className="ring-1 ring-white/10 bg-white/5 font-bold font-mono px-2 py-0.5 rounded text-indigo-400 capitalize">{user.tier} Member</span>. Navigate premium items below.
              </p>
            </div>

            {/* Portal Tab Triggers */}
            <div id="portal-tab-group" className="flex bg-[#111112] p-1.5 rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider font-mono ${
                  activeTab === "dashboard"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-650/25"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Portal Dashboard
              </button>
              <button
                onClick={() => setActiveTab("vault")}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider font-mono ${
                  activeTab === "vault"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-650/25"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                Resource Vault
              </button>
              <button
                onClick={() => setActiveTab("community")}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider font-mono ${
                  activeTab === "community"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-650/25"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Community Forum
              </button>
              <button
                onClick={() => setActiveTab("booking")}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider font-mono ${
                  activeTab === "booking"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-650/25"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                1-on-1 Booking
              </button>
            </div>
          </div>

          {/* DYNAMIC TAB COMPONENT LOADER */}
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="tab-dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                id="portal-dashboard-home"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Onboarding welcome text */}
                <div className="md:col-span-2 bg-[#111112] border border-white/10 rounded-[2rem] p-8 sm:p-10 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] rounded-full pointer-events-none" />
                  
                  <div className="flex gap-3.5 items-start">
                    <Trophy className="w-8 h-8 text-indigo-400 shrink-0 mt-1" />
                    <div>
                      <h4 className="text-xl font-display font-medium tracking-tight text-white">
                        LaunchPad Onboarding playbooks & guidelines
                      </h4>
                      <p className="text-xs text-gray-500 font-mono mt-0.5 uppercase tracking-widest">LAUNCH FRAMEWORK VERSION v2.4.6</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-300 leading-relaxed space-y-4 font-sans">
                    <p>
                      Welcome to your primary workspace inside the <strong className="text-indigo-400 font-semibold font-display">LaunchPad Startup Platform</strong>. This layout consolidates your resource toolkits, community peer rooms, and advisory calendar schedules into modular bento items.
                    </p>
                    <p>
                      As you scale, reference the <strong className="text-white font-medium">Launch Checklist</strong>:
                    </p>
                    <ul className="list-decimal pl-5 space-y-2.5 text-gray-400 font-normal">
                      <li>Use the <span className="text-indigo-400 font-medium">Free Guide</span> to draft your primary MVP core workflow.</li>
                      <li>Select any subscription tier to unlock premium boilerplates in the <span className="text-white">Resource Vault</span>.</li>
                      <li>Consult <span className="text-indigo-400 font-medium">Alex Rivers AI</span> inside the direct mentor chat panel for direct structural audits.</li>
                      <li>Select times inside the <span className="text-white">1-on-1 scheduler</span> (reserved for active Elite members).</li>
                    </ul>
                  </div>

                  <div className="p-5 bg-white/5 rounded-2xl text-xs space-y-2 block border border-white/5">
                    <span className="font-bold text-indigo-400 font-mono uppercase text-[9px] tracking-wider block">Active Plan Benefits</span>
                    <p className="text-gray-400 leading-relaxed font-sans">
                      Your current account is set to <strong className="text-white uppercase font-mono">{user.tier}</strong>.
                      {user.tier === "none" && " Select any subscription tier below in our secure pricing cycle table to unlock files, masterclasses, and code reviews!"}
                      {user.tier === "basic" && " You have access to user forums and standard manuals. Upgrade to Scale to download full developer boilerplates."}
                      {user.tier === "scale" && " All boilerplate repos, templates, and video courses are UNLOCKED. Upgrade to Elite for monthly consulting calls."}
                      {user.tier === "masterclass" && " Premium VIP UNLOCKED. Private monthly advisory scheduling and priority chat active!"}
                    </p>
                  </div>
                </div>

                {/* Side interactive guide checklist bar */}
                <div className="bg-[#111112] border border-white/10 rounded-[2rem] p-6 space-y-6">
                  <h4 className="text-xs font-bold text-gray-500 font-mono tracking-widest uppercase">Quick Actions</h4>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab("vault")}
                      className="w-full p-4 rounded-2xl border border-white/10 text-left hover:border-indigo-500/50 transition-all cursor-pointer flex justify-between items-center bg-white/5 hover:bg-white/10"
                    >
                      <div>
                        <span className="text-xs font-bold text-white block">Explore Resource Vault</span>
                        <span className="text-[10px] text-gray-400 block mt-1 font-mono">Download repos & slide decks</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-indigo-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab("community")}
                      className="w-full p-4 rounded-2xl border border-white/10 text-left hover:border-indigo-500/50 transition-all cursor-pointer flex justify-between items-center bg-white/5 hover:bg-white/10"
                    >
                      <div>
                        <span className="text-xs font-bold text-white block">Consult Alex Rivers AI</span>
                        <span className="text-[10px] text-gray-400 block mt-1 font-mono">Get direct structural advice</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-indigo-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab("booking")}
                      className="w-full p-4 rounded-2xl border border-white/10 text-left hover:border-indigo-500/50 transition-all cursor-pointer flex justify-between items-center bg-white/5 hover:bg-white/10"
                    >
                      <div>
                        <span className="text-xs font-bold text-white block">Schedule 1-on-1 Call</span>
                        <span className="text-[10px] text-gray-400 block mt-1 font-mono">Masterclass verification calendar</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-indigo-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "vault" && (
              <motion.div
                key="tab-vault"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ResourceVault
                  currentTier={user.tier}
                  onUpgradePrompt={() => {
                    const el = document.getElementById("pricing-matrix");
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              </motion.div>
            )}

            {activeTab === "community" && (
              <motion.div
                key="tab-community"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ForumHub
                  currentTier={user.tier}
                  userName={user.name}
                />
              </motion.div>
            )}

            {activeTab === "booking" && (
              <motion.div
                key="tab-booking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Scheduler
                  currentTier={user.tier}
                  userName={user.name}
                  userEmail={user.email}
                  onUpgradePrompt={() => {
                    const el = document.getElementById("pricing-matrix");
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SUBSCRIPTION MATRIX PANEL (Home -> Pricing matrix page map tier) */}
        <PricingMatrix
          currentTier={user.tier}
          onSelectTier={handleOpenCheckout}
        />

        {/* Footer Area */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-mono tracking-wider">
          <span>© 2026 LAUNCHPAD AI ACADEMY. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-5 items-center flex-wrap justify-center">
            <span className="flex items-center gap-1.5 text-gray-400"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span> Systems Operational</span>
            <span className="text-gray-700">•</span>
            <a href="#pricing-matrix" className="hover:text-white transition-colors">Pricing Matrix</a>
            <span className="text-gray-700">•</span>
            <span className="text-indigo-400 uppercase font-mono font-bold tracking-widest text-[9px]">Secure Stripe Sandbox Active</span>
          </div>
        </div>

      </main>

      {/* Stripe Secure checkout Dialog popup */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedTier={selectedCheckoutTier}
        isAnnual={isCheckoutAnnual}
        onPaymentSuccess={handlePaymentSuccess}
      />

    </div>
  );
}
