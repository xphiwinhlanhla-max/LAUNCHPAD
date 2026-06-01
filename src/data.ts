import { MembershipTier, ResourceItem, ForumPost, BookingSlot } from "./types";

export const MENTOR_PROFILE = {
  name: "Alex Rivers",
  role: "SaaS Architect & Tech Founder",
  bio: "Former Google Principal AI Architect, 3x SaaS Founder with $40M+ in collective exits. Alex specializes in scaling high-throughput LLM workloads, lean startup operations, and raising venture capital with bulletproof technical demo MVPs.",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
  stats: [
    { label: "Collective Exits", value: "$42M+" },
    { label: "Active Startups Mentored", value: "180+" },
    { label: "Years in AI & Distributed Systems", value: "16" }
  ],
  credentials: [
    "Ex-Google Core Principal Systems & Gemini Engineering Group",
    "Founder of VectorFlow (Acquired by Databricks)",
    "Stanford Computer Science M.S. (Distributed Databases)",
    "Author of 'Optimist Architect: Scaling Startups to Millions'"
  ]
};

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: "basic",
    name: "Basic Dev",
    price: "29",
    period: "month",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700",
    description: "Perfect for builders getting their feet wet with their first product concept.",
    features: [
      "Access to public Community Forum Hub",
      "Access to core guide resources",
      "Access to monthly general Q&As",
      "Read-only access to custom templates"
    ]
  },
  {
    id: "scale",
    name: "Scale Founder",
    price: "99",
    period: "month",
    badgeColor: "bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-200 dark:border-teal-800",
    description: "Designed for active developers and engineers serious about launching and scaling database-backed platforms.",
    features: [
      "Access to all Premium Code Boilerplates",
      "Instant access to full video recorded lectures",
      "Full premium forum discussion & direct posting",
      "20% discount on 1-on-1 customized audits",
      "Searchable templates & pitch-deck packs"
    ],
    popular: true
  },
  {
    id: "masterclass",
    name: "Elite Masterclass",
    price: "299",
    period: "month",
    badgeColor: "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800",
    description: "The ultimate tier for professional builders and venture-backed founders looking for active direct coaching.",
    features: [
      "All Scale benefits included",
      "1-on-1 private monthly consulting call",
      "Prepaid direct priority Q&A reply (within 12h)",
      "Interactive code-level tech-stack audit",
      "Bi-weekly live founder circle masterclasses"
    ]
  }
];

export const RESOURSE_VAULT: ResourceItem[] = [
  {
    id: "res-1",
    title: "Next.js + Gemini API Integration Boilerplate",
    description: "A complete production-level Next.js startup repo with backend proxy routes, Gemini caching helpers, token budgeting, and standard chat layouts.",
    category: "boilerplate",
    requiredTier: "scale",
    downloadFileName: "nextjs-gemini-starter.zip"
  },
  {
    id: "res-2",
    title: "Venture Pitch Deck Template - Seed Round 2026",
    description: "The identical slides used to secure $2.4M seed funding for VectorFlow. Fully customizable Figma/Keynote formats with detailed metrics advice.",
    category: "template",
    requiredTier: "scale",
    downloadFileName: "vectorflow-pitch-deck-2026.figma"
  },
  {
    id: "res-3",
    title: "Masterclass Video: Scaling LLM Operations under Peak Load",
    description: "A comprehensive 1-hour workshop covering prompt engineering latency optimizations, rate limit back-off scripts, and semantic caching databases.",
    category: "video",
    requiredTier: "scale",
    duration: "58 mins",
    url: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    id: "res-4",
    title: "1-on-1 Code Review Checklist & Architecture Audit Sheet",
    description: "Alex's proprietary checklist to assess database indexing bottlenecks, serverless warmuptime, and token pricing efficiency before going live.",
    category: "guide",
    requiredTier: "masterclass",
    downloadFileName: "alex-rivers-architecture-audit.pdf"
  },
  {
    id: "res-5",
    title: "Free Guide: The 14-Day MVP Launch Framework",
    description: "A high-level playbook mapping task prioritizations, standard landing page converters, and basic validation mechanisms for non-technical niches.",
    category: "guide",
    requiredTier: "none",
    downloadFileName: "14-day-mvp-launch-framework.pdf"
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: "post-1",
    title: "Should we migrate from PostgreSQL to Firestore for an AI heavy catalog SaaS?",
    authorName: "Sarah Chen",
    authorRole: "Technical Founder @ RecsAI",
    authorTier: "scale",
    content: "We are building an AI-native product recommendation catalog. Our catalog changes about once a day but reads are intensive. Sarah here. Would Firestore document queries operate faster and cheaper than complex PG vector searches for this? Excited for your architectural input, Alex!",
    category: "tech-stack",
    createdAt: "2026-05-28T14:24:00Z",
    likes: 12,
    replies: [
      {
        id: "rep-1",
        authorName: "Alex Rivers",
        authorRole: "Mentor",
        authorTier: "masterclass",
        content: "Hi Sarah! Excellent question. For a catalog changing only once a day with heavy read volumes, Firestore is a very strong fit because content can be heavily cached. However, if vector search is the core engine, you don't query vectors directly in Firestore. The classic pattern is storing metadata in Firestore and index embeddings in Pinecone/ScaNN. Keep it lean!",
        createdAt: "2026-05-28T15:40:00Z"
      },
      {
        id: "rep-2",
        authorName: "Markus Vance",
        authorRole: "SaaS Dev",
        authorTier: "basic",
        content: "We do this and cache aggressively in the browser's localStorage for return visitors! Saved our database billing.",
        createdAt: "2026-05-28T18:10:00Z"
      }
    ]
  },
  {
    id: "post-2",
    title: "Validation check: $19/mo Micro-SaaS for automated PDF parsing or developer-targeted?",
    authorName: "Danny Devito",
    authorRole: "Solo Developer",
    authorTier: "basic",
    content: "Hey team! I want to build a tool that parses high-complexity tax documents to Markdown using Gemini. Should my audience be general bookkeepers ($19/mo) or custom integration developers ($99/mo API)?",
    category: "idea-validation",
    createdAt: "2026-05-30T09:12:00Z",
    likes: 8,
    replies: []
  }
];

export const BOOKING_SLOTS: BookingSlot[] = [
  { id: "slot-1", date: "2026-06-10", time: "10:00 AM", isAvailable: true },
  { id: "slot-2", date: "2026-06-10", time: "02:00 PM", isAvailable: true },
  { id: "slot-3", date: "2026-06-11", time: "11:00 AM", isAvailable: false },
  { id: "slot-4", date: "2026-06-11", time: "04:00 PM", isAvailable: true },
  { id: "slot-5", date: "2026-06-12", time: "09:00 AM", isAvailable: true },
  { id: "slot-6", date: "2026-06-12", time: "01:00 PM", isAvailable: true }
];
