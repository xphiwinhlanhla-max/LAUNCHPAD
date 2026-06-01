import React, { useState } from "react";
import { ResourceItem, TierId } from "../types";
import { RESOURSE_VAULT } from "../data";
import { Search, Download, Video, FileCode, Presentation, Lock, Play, Pause, Volume2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ResourceVaultProps {
  currentTier: TierId;
  onUpgradePrompt: () => void;
}

export default function ResourceVault({ currentTier, onUpgradePrompt }: ResourceVaultProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeVideoItem, setActiveVideoItem] = useState<ResourceItem | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const getTierRank = (tier: TierId): number => {
    switch (tier) {
      case "none": return 0;
      case "basic": return 1;
      case "scale": return 2;
      case "masterclass": return 3;
      default: return 0;
    }
  };

  const isTierSufficient = (required: TierId, current: TierId): boolean => {
    return getTierRank(current) >= getTierRank(required);
  };

  const categories = [
    { id: "all", label: "Full Library" },
    { id: "boilerplate", label: "Boilerplate Repos" },
    { id: "template", label: "Interactive Templates" },
    { id: "guide", label: "PDF Guides & Manuals" },
    { id: "video", label: "Recorded Lectures" }
  ];

  const filteredResources = RESOURSE_VAULT.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: ResourceItem["category"]) => {
    switch (category) {
      case "boilerplate": return <FileCode className="w-5 h-5 text-indigo-400" />;
      case "template": return <Presentation className="w-5 h-5 text-purple-400" />;
      case "guide": return <Download className="w-5 h-5 text-amber-400" />;
      case "video": return <Video className="w-5 h-5 text-emerald-400" />;
    }
  };

  const simulateDownload = (fileName: string) => {
    alert(`📥 Simulated secure CDN compilation: "${fileName}" has been bundled to your browser download stack.`);
  };

  return (
    <div id="resource-vault-section" className="my-8 font-sans">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8 bg-[#111112] border border-white/10 p-4 rounded-2xl">
        <div className="relative w-full lg:w-80">
          <input
            type="text"
            placeholder="Search vault (e.g. NextJS)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-600"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3 shrink-0" />
        </div>

        {/* Category Toggles */}
        <div id="category-toggles" className="flex flex-wrap gap-2 w-full lg:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer font-mono uppercase ${
                activeCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video Overlay Dialog */}
      <AnimatePresence>
        {activeVideoItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="video-player-modal"
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-3xl bg-[#111112] text-white rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl"
            >
              <div className="p-5 bg-black/60 border-b border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 font-mono tracking-wider uppercase">
                    MEMBER ONLY VIDEO STREAM
                  </span>
                  <h4 className="text-sm font-bold text-slate-200 mt-1">{activeVideoItem.title}</h4>
                </div>
                <button
                  onClick={() => { setActiveVideoItem(null); setIsVideoPlaying(false); }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  Close Session
                </button>
              </div>

              {/* Secure Player Frame */}
              <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
                {activeVideoItem.url ? (
                  <video
                    src={activeVideoItem.url}
                    className="w-full h-full object-contain"
                    controls={false}
                    autoPlay
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    id="secure-vault-player"
                  />
                ) : (
                  <div className="bg-slate-950 font-mono text-center text-xs space-y-3">
                    <Video className="w-12 h-12 text-slate-500 mx-auto opacity-35 animate-pulse shrink-0" />
                    <p className="text-slate-400">Loading masterclass video matrix...</p>
                  </div>
                )}

                {/* Subtitle / Streaming notice overlay */}
                <div className="absolute top-4 left-4 bg-black/60 px-3 py-1.5 rounded-lg text-[10px] font-mono text-indigo-400 border border-white/10 shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                  CDN PIPELINE SECURED (TIER: {currentTier.toUpperCase()})
                </div>

                {/* Custom Playback Controls Overlay on hover */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 opacity-100 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const vid = document.getElementById("secure-vault-player") as HTMLVideoElement;
                        if (vid) {
                          if (vid.paused) { vid.play(); setIsVideoPlaying(true); }
                          else { vid.pause(); setIsVideoPlaying(false); }
                        }
                      }}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors"
                    >
                      {isVideoPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white fill-current" />}
                    </button>
                    <span className="font-mono text-[11px] text-slate-300">00:34 / {activeVideoItem.duration || "58:00"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-gray-500" />
                    <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-indigo-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-black/20 flex flex-col md:flex-row gap-4 justify-between items-start text-xs text-gray-400 border-t border-white/5">
                <p className="max-w-md leading-relaxed">{activeVideoItem.description}</p>
                <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] uppercase text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  Elite Playbook
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((item) => {
          const unlocked = isTierSufficient(item.requiredTier, currentTier);

          return (
            <div
              key={item.id}
              className={`relative overflow-hidden bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 group ${
                unlocked 
                  ? "hover:border-indigo-500/40" 
                  : ""
              }`}
            >
              {/* Blur Screen Layer for locked features */}
              {!unlocked && (
                <div id="vault-card-paywall" className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-xs">
                    <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                  </div>
                  <h5 className="text-sm font-semibold text-white mt-3 font-mono uppercase tracking-wider">
                    Tier Upgrade Required
                  </h5>
                  <p className="text-[11px] text-gray-400 mt-1 max-w-[220px]">
                    This {item.category} requires <strong className="text-indigo-450 uppercase">{item.requiredTier}</strong> access.
                  </p>
                  <button
                    onClick={onUpgradePrompt}
                    className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider cursor-pointer transition-all active:scale-95"
                  >
                    Upgrade Now
                  </button>
                </div>
              )}

              {/* Resource specifications (only fully interactive if unlocked) */}
              <div className={`${unlocked ? "" : "blur-xs pointer-events-none select-none"}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
                    {getCategoryIcon(item.category)}
                  </div>
                  <span className="text-[9px] font-bold px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono uppercase border border-indigo-500/20">
                    {item.category}
                  </span>
                </div>

                <h4 className="text-md font-medium text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors font-display">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 mt-2.5 leading-relaxed min-h-12 border-b border-white/5 pb-4">
                  {item.description}
                </p>
              </div>

              {/* Action Ribbon */}
              <div className={`mt-4 pt-2 flex items-center justify-between text-xs text-gray-400 ${unlocked ? "" : "blur-xs pointer-events-none select-none"}`}>
                <span className="font-mono text-[9px] text-indigo-400">ACCESS LEVEL: {item.requiredTier.toUpperCase()}</span>
                {item.category === "video" ? (
                  <button
                    onClick={() => setActiveVideoItem(item)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl hover:scale-101 shadow-sm font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-[0.98] font-mono text-[11px] uppercase tracking-wider"
                  >
                    <Play className="w-3.5 h-3.5 text-white fill-current shrink-0" />
                    Play Session
                  </button>
                ) : (
                  <button
                    onClick={() => simulateDownload(item.downloadFileName || "asset.zip")}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl hover:scale-101 font-semibold flex items-center gap-1.5 cursor-pointer font-mono text-[11px] uppercase tracking-wider border border-white/10"
                  >
                    <Download className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                    Download Kit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
