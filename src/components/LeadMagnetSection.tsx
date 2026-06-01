import React, { useState } from "react";
import { Sparkles, Download, FileText, ArrowRight, Lock, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function LeadMagnetSection() {
  const [email, setEmail] = useState("");
  const [startupConcept, setStartupConcept] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [blueprint, setBlueprint] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startupConcept.trim()) return;

    setIsLoading(true);
    setBlueprint("");
    setIsDemoMode(false);

    try {
      const response = await fetch("/api/generate-lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concept: startupConcept,
          name: email.split("@")[0] || ""
        })
      });

      const data = await response.json();
      if (response.ok) {
        setBlueprint(data.blueprint);
        setIsDemoMode(!!data.isDemo);
      } else {
        setBlueprint(`### ⚠️ Generation Failed\n\n${data.error || "Please verify your server console logs to check the error details."}`);
      }
    } catch (err) {
      console.error(err);
      setBlueprint("### ⚠️ API Offline\n\nCould not connect to the platform blueprint microservices at this time. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(blueprint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="lead-magnet-container" className="my-12 relative overflow-hidden bg-[#111112] border border-white/10 text-[#F5F5F7] rounded-[2rem] p-8 sm:p-12 shadow-2xl">
      {/* Abstract Background Effect */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Form Left Column */}
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 fill-indigo-400" />
              FREE INSTANT VALUE LEAD MAGNET
            </span>
            <h3 className="text-3xl font-display font-medium tracking-tight leading-snug text-white">
              Get Your Custom Startup AI Architecture Blueprint
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
              Don't guess your infrastructure strategy. Describe your platform concept or product vision, and our compiler will instantly structure a customized tech stack proposal matching your goals.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg font-sans">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase mb-2 tracking-wider">My Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sara@recsai.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase mb-2 tracking-wider">My Startup Concept (Describe in 1-2 sentences)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. A Shopify integration that parses feedback comments and auto-replies with generated custom images tailored to customers' specific complaints."
                  value={startupConcept}
                  onChange={(e) => setStartupConcept(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                id="generate-blueprint-btn"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl font-bold font-mono uppercase text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-600/20"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Synthesizing Custom Blueprint...
                  </>
                ) : (
                  <>
                    Generate My Blueprint
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Result Right Column */}
          <div className="w-full lg:w-[48%] flex flex-col justify-stretch h-[370px]">
            <div className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 overflow-hidden flex flex-col relative">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400">BLUEPRINT GENERATOR OUTPUT</span>
                </div>
                {blueprint && (
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      title="Copy guide markdown"
                      className="p-1.5 hover:bg-white/5 rounded-lg text-gray-450 hover:text-white transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => alert("Value proposition simulated! Blueprint compiled to your account vault.")}
                      title="Download as PDF"
                      className="p-1.5 hover:bg-white/5 rounded-lg text-gray-450 hover:text-white transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto py-4 text-gray-300 font-sans text-sm prose prose-invert max-w-none scrollbar-thin">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-3"
                    >
                      <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                      <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest animate-pulse">Analyzing tech dependencies</div>
                      <p className="text-xs text-gray-500 max-w-[240px]">
                        Alex's AI is cataloging microservices, mapping DB schemas, and planning launch iterations...
                      </p>
                    </motion.div>
                  ) : blueprint ? (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {isDemoMode && (
                        <div id="demo-mode-alert" className="mb-4 p-3.5 bg-indigo-950/40 text-indigo-300 border border-indigo-900/40 rounded-xl text-xs space-y-1">
                          <span className="font-bold font-mono text-[9px] tracking-widest uppercase block text-indigo-400">💡 CONFIGURE SYSTEM SECRETS</span>
                          Running in showcase mode. Add your <code className="font-mono bg-indigo-900/30 px-1 py-0.5 rounded text-white text-[10px]">GEMINI_API_KEY</code> key in AI Studio Secrets to unlock real-time custom designs!
                        </div>
                      )}
                      <div className="whitespace-pre-wrap select-text leading-relaxed font-sans text-xs tracking-normal text-gray-300">
                        {blueprint}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center text-gray-500"
                    >
                      <Lock className="w-8 h-8 opacity-20 mb-3 text-indigo-400 shrink-0" />
                      <p className="text-xs font-sans">Submit your startup concept to compile your technical launch strategy checklist.</p>
                      <span className="text-[9px] font-mono text-gray-650 mt-1 uppercase tracking-wider">Unlocks immediate architectural feedback</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
