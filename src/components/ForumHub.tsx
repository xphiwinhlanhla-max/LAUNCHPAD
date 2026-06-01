import React, { useState } from "react";
import { ForumPost, ForumReply, TierId } from "../types";
import { INITIAL_FORUM_POSTS } from "../data";
import { MessageSquare, ThumbsUp, PlusCircle, Send, Lock, Users, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ForumHubProps {
  currentTier: TierId;
  userName: string;
}

export default function ForumHub({ currentTier, userName }: ForumHubProps) {
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"board" | "mentor">("board");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // New Thread Form States
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<ForumPost["category"]>("idea-validation");
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  // Reply Form State
  const [replyContent, setReplyContent] = useState("");

  // Q&A Chat States
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      role: "assistant",
      content: "Hey there! I'm Alex Rivers. Ask me anything about your SaaS tech stack, prompt latency optimizations, database indexing patterns, or seed funding models. How's your build going today?"
    }
  ]);
  const [newUserMsg, setNewUserMsg] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const getTierRole = (tier: TierId) => {
    switch (tier) {
      case "none": return "Guest Builder";
      case "basic": return "Dev Member";
      case "scale": return "Scale Founder";
      case "masterclass": return "Elite Masterclass Member";
      default: return "Builder";
    }
  };

  const categories = [
    { id: "all", label: "All Discussions" },
    { id: "tech-stack", label: "Core Tech Stack" },
    { id: "idea-validation", label: "Idea Validation" },
    { id: "marketing", label: "Growth Hack & Launch" },
    { id: "general", label: "General Chat" }
  ];

  // Post Thread
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      title: newTitle,
      authorName: userName || "Anonymous Dev",
      authorRole: getTierRole(currentTier),
      authorTier: currentTier,
      content: newContent,
      category: newCategory,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    setPosts([newPost, ...posts]);
    setNewTitle("");
    setNewContent("");
    setShowNewPostForm(false);
  };

  // Submit Reply
  const handleAddReply = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    const newReply: ForumReply = {
      id: `rep-${Date.now()}`,
      authorName: userName || "Anonymous Dev",
      authorRole: getTierRole(currentTier),
      authorTier: currentTier,
      content: replyContent,
      createdAt: new Date().toISOString()
    };

    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          replies: [...p.replies, newReply]
        };
      }
      return p;
    }));

    setReplyContent("");
  };

  // Like Thread
  const handleLikePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  // Consult with Mentor (Gemini Chat API call)
  const handleSendToMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserMsg.trim() || isChatLoading) return;

    const userMsg = newUserMsg;
    setNewUserMsg("");
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsChatLoading(true);

    try {
      const historyPayload = chatMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await fetch("/api/mentor-qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          tier: currentTier,
          history: historyPayload
        })
      });

      const data = await res.json();
      if (res.ok) {
        setChatMessages(prev => [...prev, { 
          role: "assistant", 
          content: data.text,
          isDemo: !!data.isDemo
        }]);
      } else {
        setChatMessages(prev => [...prev, { 
          role: "assistant", 
          content: "### ⚠️ Mentor Connection Error\n\nI was unable to load your inquiry. Please configure your `GEMINI_API_KEY` of Google AI Studio Secrets."
        }]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { 
        role: "assistant", 
        content: "### ⚠️ Cloud Offline\n\nMomentaneous issue connecting with technical advisory servers. Check startup console."
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const filteredPosts = activeFilter === "all" 
    ? posts 
    : posts.filter(p => p.category === activeFilter);

  const selectedPost = posts.find(p => p.id === selectedPostId);

  return (
    <div id="community-hub" className="my-8 font-sans">
      {/* Tab Navigation header */}
      <div className="flex border-b border-white/10 mb-8">
        <button
          onClick={() => { setActiveTab("board"); setSelectedPostId(null); }}
          className={`px-6 py-4 font-semibold text-xs flex items-center gap-2 border-b-2 font-mono uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "board"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-gray-450 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          Founder Discussion Board
        </button>
        <button
          onClick={() => setActiveTab("mentor")}
          className={`px-6 py-4 font-semibold text-xs flex items-center gap-2 border-b-2 font-mono uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "mentor"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-gray-450 hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0 fill-current" />
          Direct Mentor Q&A (Alex Rivers)
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "board" ? (
          <motion.div
            key="board-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            id="discussion-board"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Thread Navigation & Categories */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#111112] p-6 rounded-2xl border border-white/10 shadow-2xl">
                <h4 className="text-[10px] font-bold text-gray-500 font-mono tracking-widest uppercase mb-4">Topic Rooms</h4>
                <div id="category-filter-list" className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveFilter(cat.id); setSelectedPostId(null); }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide font-mono uppercase transition-all cursor-pointer ${
                        activeFilter === cat.id
                          ? "bg-indigo-500/10 text-indigo-300"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <button
                  id="toggle-new-post"
                  onClick={() => setShowNewPostForm(!showNewPostForm)}
                  className="w-full mt-6 py-3 px-4 bg-indigo-600 hover:bg-indigo-505 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 font-mono uppercase tracking-wider"
                >
                  <PlusCircle className="w-4 h-4" />
                  Publish Topic Post
                </button>
              </div>

              {/* Special Info Callout */}
              <div className="p-5 bg-black/40 border border-white/10 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl rounded-full pointer-events-none" />
                <h5 className="text-[10px] font-bold text-indigo-400 font-mono tracking-wider uppercase flex items-center gap-1.5 mb-2">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Direct Advisory Info
                </h5>
                <p className="text-xs text-gray-450 leading-relaxed font-sans mt-2">
                  Join structural Q&As to have Alex evaluate your logic. Elite members can chat directly using the Q&A panel.
                </p>
              </div>
            </div>

            {/* Discussions / Contents Arena */}
            <div className="lg:col-span-2 space-y-4">
              {showNewPostForm && (
                <motion.form
                  key="new-post-form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleCreatePost}
                  className="bg-[#111112] p-6 rounded-2xl border border-indigo-500/30 shadow-2xl space-y-4"
                >
                  <h4 className="text-md font-medium font-display text-white">Publish New Discussion Room Thread</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 font-mono uppercase mb-1.5 tracking-wider">Room Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Is it possible to scale Pinecone queries securely server-side?"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 font-mono uppercase mb-1.5 tracking-wider">Target Category</label>
                      <select
                        value={newCategory}
                        onChange={(e: any) => setNewCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#111112] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="tech-stack" className="bg-[#111112]">Core Tech Stack</option>
                        <option value="idea-validation" className="bg-[#111112]">Idea Validation</option>
                        <option value="marketing" className="bg-[#111112]">Growth Hack & Launch</option>
                        <option value="general" className="bg-[#111112]">General Chat</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 font-mono uppercase mb-1.5 tracking-wider">My Inquiries or Context</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Specify your technical problems, user metrics, or validation checks..."
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowNewPostForm(false)}
                      className="px-4 py-2 border border-white/10 bg-white/5 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/10 font-mono uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl font-bold font-mono text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Publish Topic
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Selected Post Detail OR Thread list */}
              {selectedPost ? (
                <div id="thread-contents" className="bg-[#111112] border border-white/10 rounded-[2rem] p-6 sm:p-8 space-y-6">
                  {/* Thread Title Back Button */}
                  <button
                    onClick={() => setSelectedPostId(null)}
                    className="text-xs font-semibold text-indigo-455 hover:underline flex items-center gap-1.5 mb-2 cursor-pointer font-mono uppercase"
                  >
                    ← Back to discussion index
                  </button>

                  <div className="border-b border-white/5 pb-6">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="inline-flex px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[9px] font-bold uppercase tracking-wider font-mono border border-indigo-500/20">
                          {selectedPost.category}
                        </span>
                        <h3 className="text-xl font-display font-medium text-white mt-3 leading-snug">
                          {selectedPost.title}
                        </h3>
                      </div>
                      <button
                        onClick={(e) => handleLikePost(selectedPost.id, e)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono font-bold text-gray-400 hover:text-indigo-400 hover:bg-white/5 transition-colors duration-250 cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-indigo-400" />
                        {selectedPost.likes}
                      </button>
                    </div>

                    <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed mt-4 font-sans max-w-2xl">
                      {selectedPost.content}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-6 text-xs text-gray-500">
                      <span className="font-semibold text-gray-300">{selectedPost.authorName}</span>
                      <span>•</span>
                      <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] text-indigo-300 font-mono uppercase tracking-wide border border-white/10">{selectedPost.authorRole}</span>
                      <span>•</span>
                      <span className="font-mono">{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Replies Arena */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-gray-500 font-mono uppercase tracking-widest">Replies ({selectedPost.replies.length})</h4>
                    <div id="nested-replies-list" className="space-y-4">
                      {selectedPost.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className={`p-5 rounded-2xl border ${
                            reply.authorName === "Alex Rivers"
                              ? "bg-indigo-500/5 border-indigo-500/20 pl-6 relative overflow-hidden"
                              : "bg-black/20 border-white/10"
                          }`}
                        >
                          {reply.authorName === "Alex Rivers" && <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />}
                          <div className="flex justify-between items-center text-[11px] text-gray-500">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white text-xs">{reply.authorName}</span>
                              {reply.authorName === "Alex Rivers" && (
                                <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold text-[8px] tracking-widest font-mono uppercase">MENTOR</span>
                              )}
                              <span className="text-[9px] bg-white/5 border border-white/5 text-gray-400 px-1.5 py-0.2 rounded font-mono uppercase tracking-wide">{reply.authorRole}</span>
                            </div>
                            <span className="font-mono">{new Date(reply.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-gray-300 mt-2 whitespace-pre-wrap leading-relaxed font-sans max-w-2xl">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Add Reply */}
                    <form onSubmit={(e) => handleAddReply(e, selectedPost.id)} className="space-y-2.5 mt-4">
                      <textarea
                        required
                        rows={2}
                        placeholder="Offer your feedback or reply to this thread..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs font-sans text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer font-mono uppercase tracking-wider"
                        >
                          <Send className="w-3.5 h-3.5 text-indigo-300" />
                          Reply
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div id="discussions-list" className="space-y-4">
                  {filteredPosts.length === 0 ? (
                    <div className="text-center py-12 bg-[#111112] border border-white/10 rounded-[2rem]">
                      <MessageSquare className="w-8 h-8 text-gray-600 mx-auto opacity-30 shrink-0" />
                      <p className="text-xs text-slate-500 mt-3 font-sans">No topics found in this room yet.</p>
                      <button
                        onClick={() => setShowNewPostForm(true)}
                        className="text-xs text-indigo-400 hover:underline mt-1 cursor-pointer font-mono uppercase tracking-wider"
                      >
                        Be the first to post a question
                      </button>
                    </div>
                  ) : (
                    filteredPosts.map((post) => (
                      <div
                        key={post.id}
                        id={`post-list-item-${post.id}`}
                        onClick={() => setSelectedPostId(post.id)}
                        className="bg-black/40 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/40 cursor-pointer transition-all hover:translate-y-[-1px] group"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[9px] font-mono uppercase font-bold tracking-wider">
                              {post.category}
                            </span>
                            <h4 className="text-md font-medium text-white group-hover:text-indigo-400 mt-2 font-display transition-colors">
                              {post.title}
                            </h4>
                            <p className="text-xs text-[#6B7280] dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                              {post.content}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleLikePost(post.id, e)}
                            className="flex items-center gap-1 border border-white/10 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-xl text-xs font-mono font-bold text-gray-400 hover:text-indigo-400 transition-colors shrink-0"
                          >
                            <ThumbsUp className="w-3 h-3 text-indigo-400" />
                            {post.likes}
                          </button>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4 text-[10px] text-gray-500 font-medium">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-300">{post.authorName}</span>
                            <span>•</span>
                            <span className="bg-white/5 border border-white/5 p-1 py-0.2 rounded font-mono text-[9px] uppercase tracking-wide text-indigo-300">{post.authorRole}</span>
                          </div>

                          <div className="flex items-center gap-3 font-mono">
                            <span className="flex items-center gap-1.5">
                              <MessageSquare className="w-3.5 h-3.5 text-gray-500 font-bold" />
                              {post.replies.length}
                            </span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="mentor-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            id="direct-mentor-chat-section"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Advice panel left column */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-[#111112] border border-white/10 text-white rounded-[2rem] p-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <h4 className="text-[10px] font-bold text-indigo-400 font-mono tracking-widest uppercase mb-4">COACHING PERK EXPLAINER</h4>
                <h3 className="text-lg font-medium font-display leading-normal">1-on-1 AI Mentor Terminal</h3>
                <p className="text-xs text-gray-400 leading-relaxed mt-2 font-sans">
                  This console connects directly to Ex-Google AI expert Alex Rivers. Ask architectural design, deployment roadmap, database queries, and vector catalog setups.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="p-3.5 bg-black/40 border border-white/10 rounded-xl text-xs space-y-1">
                    <span className="font-bold font-mono text-[9px] tracking-wider text-indigo-400 uppercase block">ACTIVE MEMBERSHIP TIER</span>
                    <div className="flex items-center justify-between pt-1 font-mono">
                      <span className="font-bold text-white capitalize text-[11px]">{currentTier} Tier</span>
                      <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono tracking-wider">Verified</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[11px] text-gray-400 leading-relaxed font-sans">
                    💡 <strong>Tip:</strong> Ask "What databases should I combine for AI recommendations and vector search results?" or "How can I prepare a tech pitch deck?"
                  </div>
                </div>
              </div>

              <div className="p-5 border border-white/10 rounded-2xl bg-black/20">
                <h5 className="text-[10px] font-bold text-indigo-400 font-mono uppercase tracking-wider">Premium SLAs</h5>
                <ul className="space-y-2 mt-3 text-[11px] text-gray-400 font-medium font-mono">
                  <li>• Elite (Masterclass) Members: Prioritized details with code snippets.</li>
                  <li>• Scale Tier Founders: Comprehensive structural evaluations.</li>
                  <li>• Basic Members: Clean high-level guidelines.</li>
                </ul>
              </div>
            </div>

            {/* Chat screen right column */}
            <div className="lg:col-span-2 h-[480px] bg-[#111112] rounded-[2rem] border border-white/10 flex flex-col overflow-hidden relative shadow-2xl">
              <div className="px-6 py-4 bg-black/40 border-b border-white/5 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center font-mono font-bold text-indigo-400">
                    AR
                  </div>
                  <div>
                    <h5 className="text-sm font-medium font-display leading-normal">Alex Rivers AI Advisory</h5>
                    <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-wider block font-bold">● DIRECT ADVISER ONLINE</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 bg-black border border-white/10 rounded-full px-2.5 py-0.5 text-[9px] text-gray-400 font-mono uppercase tracking-wide">
                  MODEL: GEMINI-3.5-FLASH
                </div>
              </div>

              {/* Chat history list */}
              <div id="mentor-chat-history" className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-none bg-[#09090a]/40">
                {chatMessages.map((msg, index) => {
                  const isAssistant = msg.role === "assistant";
                  return (
                    <div
                      key={index}
                      className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-4 text-xs tracking-normal leading-relaxed ${
                        isAssistant
                          ? "bg-black/60 text-slate-100 border border-white/5 pr-6"
                          : "bg-indigo-600 text-white rounded-br-none"
                      }`}>
                        {isAssistant && msg.isDemo && (
                          <div className="mb-2.5 p-2.5 bg-[#111112] border border-white/10 text-indigo-300 rounded-xl text-[9px] font-mono leading-normal select-none uppercase tracking-wide">
                            💡 <strong>DEMO PLATFORM TERMINAL</strong>: Live Gemini Q&A will activate once the <code>GEMINI_API_KEY</code> secret is populated in Google AI Studio. Showing pre-set mentoring advice!
                          </div>
                        )}
                        <div className="whitespace-pre-wrap select-text leading-relaxed font-sans text-xs tracking-normal font-medium prose prose-invert">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {isChatLoading && (
                  <div id="ai-chat-typing-bubble" className="flex justify-start">
                    <div className="bg-black/40 border border-white/5 text-slate-400 rounded-2xl p-4 flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendToMentor} className="p-4 bg-black/45 border-t border-white/5 flex gap-3">
                <input
                  type="text"
                  required
                  placeholder="Ask Alex Rivers for technical launch guidance..."
                  value={newUserMsg}
                  onChange={(e) => setNewUserMsg(e.target.value)}
                  disabled={isChatLoading}
                  className="flex-1 px-4 py-3 bg-black border border-white/10 rounded-xl text-xs text-white placeholder-gray-650 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !newUserMsg.trim()}
                  className="px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-505 hover:scale-[1.01] transition-all flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-indigo-300" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
